/**
 * Analysis Service
 * Handles structural analysis calculations
 */

const math = require('mathjs');

/**
 * Run structural analysis
 * @param {Object} model - Structural model
 * @param {Object} configuration - Analysis configuration
 * @param {Object} analysisResult - Analysis result document
 * @param {Object} io - Socket.io instance for real-time updates
 */
exports.runAnalysis = async (model, configuration, analysisResult, io) => {
  try {
    // Update status and emit progress
    analysisResult.status = 'running';
    analysisResult.progress = 5;
    await analysisResult.save();
    
    emitProgress(io, analysisResult);
    
    // Validate model
    await validateModel(model, analysisResult, io);
    
    // Prepare data structures
    const { nodeMap, dofMap, restrainedDofs, totalDofs, freeDofs } = await prepareStructure(model, analysisResult, io);
    
    // Process load cases
    const loadCaseResults = [];
    
    // Analyze each load case
    for (const loadCaseId of configuration.loadCasesToAnalyze) {
      const loadCase = model.loadCases.find(lc => lc.id === loadCaseId);
      
      if (!loadCase) {
        throw new Error(`Load case ${loadCaseId} not found`);
      }
      
      // Emit progress update
      analysisResult.progress = 30 + (loadCaseResults.length / configuration.loadCasesToAnalyze.length) * 40;
      await analysisResult.save();
      emitProgress(io, analysisResult);
      
      // Assemble global stiffness matrix and load vector
      const { K, F } = await assembleSystem(model, nodeMap, dofMap, totalDofs, loadCaseId, configuration);
      
      // Apply boundary conditions
      const { reducedK, reducedF } = applyBoundaryConditions(K, F, restrainedDofs, totalDofs, freeDofs);
      
      // Solve the system
      const displacements = await solveSystem(reducedK, reducedF, configuration);
      
      // Calculate reactions and internal forces
      const { nodeResults, beamResults, plateResults } = await calculateResults(
        model, nodeMap, dofMap, displacements, restrainedDofs, totalDofs, freeDofs, loadCaseId, configuration
      );
      
      // Store results for this load case
      loadCaseResults.push({
        loadCaseId,
        nodeResults,
        beamResults,
        plateResults
      });
    }
    
    // Process load combinations
    for (const loadCombinationId of configuration.loadCombinationsToAnalyze) {
      const loadCombination = model.loadCombinations.find(lc => lc.id === loadCombinationId);
      
      if (!loadCombination) {
        throw new Error(`Load combination ${loadCombinationId} not found`);
      }
      
      // Emit progress update
      analysisResult.progress = 70 + (loadCaseResults.length / (configuration.loadCasesToAnalyze.length + configuration.loadCombinationsToAnalyze.length)) * 20;
      await analysisResult.save();
      emitProgress(io, analysisResult);
      
      // Combine results from load cases
      const combinedResults = combineLoadCaseResults(loadCaseResults, loadCombination.factors);
      
      // Store results for this load combination
      loadCaseResults.push({
        loadCaseId: loadCombinationId,
        ...combinedResults
      });
    }
    
    // Calculate summary statistics
    const summary = calculateSummaryStatistics(loadCaseResults);
    
    // Update analysis result with final data
    analysisResult.loadCaseResults = loadCaseResults;
    analysisResult.summary = summary;
    analysisResult.status = 'completed';
    analysisResult.progress = 100;
    analysisResult.endTime = new Date();
    
    await analysisResult.save();
    emitProgress(io, analysisResult);
    
    return analysisResult;
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Update analysis result with error
    analysisResult.status = 'failed';
    analysisResult.errorMessage = error.message || 'Unknown error during analysis';
    analysisResult.endTime = new Date();
    
    await analysisResult.save();
    emitProgress(io, analysisResult);
    
    throw error;
  }
};

/**
 * Validate structural model before analysis
 */
async function validateModel(model, analysisResult, io) {
  // Update progress
  analysisResult.progress = 10;
  await analysisResult.save();
  emitProgress(io, analysisResult);
  
  // Check if model has nodes
  if (!model.nodes || model.nodes.length === 0) {
    throw new Error('Model has no nodes');
  }
  
  // Check if model has elements
  if ((!model.beams || model.beams.length === 0) && (!model.plates || model.plates.length === 0)) {
    throw new Error('Model has no elements (beams or plates)');
  }
  
  // Check if model has materials
  if (!model.materials || model.materials.length === 0) {
    throw new Error('Model has no materials');
  }
  
  // Check if model has sections (for beam elements)
  if (model.beams && model.beams.length > 0 && (!model.sections || model.sections.length === 0)) {
    throw new Error('Model has beam elements but no sections');
  }
  
  // Check if model has load cases
  if (!model.loadCases || model.loadCases.length === 0) {
    throw new Error('Model has no load cases');
  }
  
  // Check beam connectivity
  for (const beam of model.beams) {
    const startNode = model.nodes.find(node => node.id === beam.startNode);
    const endNode = model.nodes.find(node => node.id === beam.endNode);
    
    if (!startNode) {
      throw new Error(`Beam ${beam.id} references non-existent start node ${beam.startNode}`);
    }
    
    if (!endNode) {
      throw new Error(`Beam ${beam.id} references non-existent end node ${beam.endNode}`);
    }
    
    const section = model.sections.find(section => section.id === beam.section);
    
    if (!section) {
      throw new Error(`Beam ${beam.id} references non-existent section ${beam.section}`);
    }
    
    const material = model.materials.find(material => material.id === section.material);
    
    if (!material) {
      throw new Error(`Section ${section.id} references non-existent material ${section.material}`);
    }
  }
  
  // Check plate connectivity
  for (const plate of model.plates) {
    if (plate.nodes.length < 3) {
      throw new Error(`Plate ${plate.id} has less than 3 nodes`);
    }
    
    for (const nodeId of plate.nodes) {
      const node = model.nodes.find(node => node.id === nodeId);
      
      if (!node) {
        throw new Error(`Plate ${plate.id} references non-existent node ${nodeId}`);
      }
    }
    
    const material = model.materials.find(material => material.id === plate.material);
    
    if (!material) {
      throw new Error(`Plate ${plate.id} references non-existent material ${plate.material}`);
    }
  }
  
  // Check if model has at least one support
  const hasSupport = model.nodes.some(node => 
    node.restraints.dx || node.restraints.dy || node.restraints.dz ||
    node.restraints.rx || node.restraints.ry || node.restraints.rz
  );
  
  if (!hasSupport) {
    throw new Error('Model has no supports (restraints)');
  }
  
  // Check if model has at least one load
  const hasNodeLoad = model.nodes.some(node => node.loads && node.loads.length > 0);
  const hasBeamLoad = model.beams.some(beam => beam.loads && beam.loads.length > 0);
  const hasPlateLoad = model.plates.some(plate => plate.loads && plate.loads.length > 0);
  
  if (!hasNodeLoad && !hasBeamLoad && !hasPlateLoad) {
    throw new Error('Model has no loads');
  }
  
  return true;
}

/**
 * Prepare data structures for analysis
 */
async function prepareStructure(model, analysisResult, io) {
  // Update progress
  analysisResult.progress = 20;
  await analysisResult.save();
  emitProgress(io, analysisResult);
  
  // Create node map for quick lookup
  const nodeMap = new Map();
  model.nodes.forEach(node => {
    nodeMap.set(node.id, node);
  });
  
  // Create DOF map (6 DOFs per node: dx, dy, dz, rx, ry, rz)
  const dofMap = new Map();
  const restrainedDofs = [];
  let dofIndex = 0;
  
  model.nodes.forEach(node => {
    const nodeDofs = {
      dx: dofIndex,
      dy: dofIndex + 1,
      dz: dofIndex + 2,
      rx: dofIndex + 3,
      ry: dofIndex + 4,
      rz: dofIndex + 5
    };
    
    dofMap.set(node.id, nodeDofs);
    
    // Track restrained DOFs
    if (node.restraints.dx) restrainedDofs.push(nodeDofs.dx);
    if (node.restraints.dy) restrainedDofs.push(nodeDofs.dy);
    if (node.restraints.dz) restrainedDofs.push(nodeDofs.dz);
    if (node.restraints.rx) restrainedDofs.push(nodeDofs.rx);
    if (node.restraints.ry) restrainedDofs.push(nodeDofs.ry);
    if (node.restraints.rz) restrainedDofs.push(nodeDofs.rz);
    
    dofIndex += 6;
  });
  
  const totalDofs = dofIndex;
  
  // Create list of free DOFs
  const freeDofs = [];
  for (let i = 0; i < totalDofs; i++) {
    if (!restrainedDofs.includes(i)) {
      freeDofs.push(i);
    }
  }
  
  return { nodeMap, dofMap, restrainedDofs, totalDofs, freeDofs };
}

/**
 * Assemble global stiffness matrix and load vector
 */
async function assembleSystem(model, nodeMap, dofMap, totalDofs, loadCaseId, configuration) {
  // Initialize global stiffness matrix and load vector
  const K = math.zeros(totalDofs, totalDofs);
  const F = math.zeros(totalDofs, 1);
  
  // Assemble beam elements
  for (const beam of model.beams) {
    const startNode = nodeMap.get(beam.startNode);
    const endNode = nodeMap.get(beam.endNode);
    const section = model.sections.find(s => s.id === beam.section);
    const material = model.materials.find(m => m.id === section.material);
    
    // Calculate element length and direction cosines
    const dx = endNode.coordinates.x - startNode.coordinates.x;
    const dy = endNode.coordinates.y - startNode.coordinates.y;
    const dz = endNode.coordinates.z - startNode.coordinates.z;
    const L = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    // Get material and section properties
    const E = material.properties.elasticModulus;
    const G = material.properties.shearModulus || E / (2 * (1 + material.properties.poissonRatio || 0.3));
    const A = section.properties.area;
    const Iy = section.properties.momentOfInertiaY;
    const Iz = section.properties.momentOfInertiaZ;
    const J = section.properties.torsionalConstant;
    
    // Calculate element stiffness matrix in local coordinates
    // This is a simplified implementation - a full implementation would include
    // shear deformation, geometric nonlinearity, etc. based on configuration
    
    // For this example, we'll use a simplified 3D beam element stiffness matrix
    // Assemble local stiffness matrix (12x12) for beam element
    // ...
    
    // Transform to global coordinates
    // ...
    
    // Apply element releases if any
    // ...
    
    // Assemble into global stiffness matrix
    // ...
    
    // Apply beam loads for this load case
    const beamLoads = beam.loads.filter(load => load.loadCase === loadCaseId);
    
    for (const load of beamLoads) {
      // Calculate equivalent nodal forces based on load type
      // ...
      
      // Add to global load vector
      // ...
    }
  }
  
  // Assemble plate elements
  for (const plate of model.plates) {
    // Similar process for plate elements
    // ...
  }
  
  // Apply nodal loads for this load case
  for (const node of model.nodes) {
    const nodeLoad = node.loads.find(load => load.loadCase === loadCaseId);
    
    if (nodeLoad) {
      const nodeDofs = dofMap.get(node.id);
      
      // Add loads to global load vector
      F.set([nodeDofs.dx, 0], nodeLoad.fx || 0);
      F.set([nodeDofs.dy, 0], nodeLoad.fy || 0);
      F.set([nodeDofs.dz, 0], nodeLoad.fz || 0);
      F.set([nodeDofs.rx, 0], nodeLoad.mx || 0);
      F.set([nodeDofs.ry, 0], nodeLoad.my || 0);
      F.set([nodeDofs.rz, 0], nodeLoad.mz || 0);
    }
  }
  
  return { K, F };
}

/**
 * Apply boundary conditions to the system
 */
function applyBoundaryConditions(K, F, restrainedDofs, totalDofs, freeDofs) {
  // Extract submatrix for free DOFs
  const reducedK = math.zeros(freeDofs.length, freeDofs.length);
  const reducedF = math.zeros(freeDofs.length, 1);
  
  // Fill reduced matrices
  for (let i = 0; i < freeDofs.length; i++) {
    reducedF.set([i, 0], F.get([freeDofs[i], 0]));
    
    for (let j = 0; j < freeDofs.length; j++) {
      reducedK.set([i, j], K.get([freeDofs[i], freeDofs[j]]));
    }
  }
  
  return { reducedK, reducedF };
}

/**
 * Solve the system of equations
 */
async function solveSystem(K, F, configuration) {
  // Choose solver based on configuration
  if (configuration.solverType === 'direct') {
    // Direct solver (e.g., LU decomposition)
    return math.lusolve(K, F);
  } else {
    // Iterative solver (simplified implementation)
    // In a real implementation, this would use more sophisticated methods
    return math.lusolve(K, F); // Fallback to direct solver
  }
}

/**
 * Calculate results (displacements, reactions, internal forces)
 */
async function calculateResults(model, nodeMap, dofMap, displacements, restrainedDofs, totalDofs, freeDofs, loadCaseId, configuration) {
  // Initialize result arrays
  const nodeResults = [];
  const beamResults = [];
  const plateResults = [];
  
  // Create full displacement vector (including restrained DOFs)
  const fullDisplacements = math.zeros(totalDofs, 1);
  
  // Fill in displacements for free DOFs
  for (let i = 0; i < freeDofs.length; i++) {
    fullDisplacements.set([freeDofs[i], 0], displacements.get([i, 0]));
  }
  
  // Calculate nodal displacements and reactions
  for (const node of model.nodes) {
    const nodeDofs = dofMap.get(node.id);
    
    // Extract displacements
    const nodeDisplacements = {
      dx: fullDisplacements.get([nodeDofs.dx, 0]),
      dy: fullDisplacements.get([nodeDofs.dy, 0]),
      dz: fullDisplacements.get([nodeDofs.dz, 0]),
      rx: fullDisplacements.get([nodeDofs.rx, 0]),
      ry: fullDisplacements.get([nodeDofs.ry, 0]),
      rz: fullDisplacements.get([nodeDofs.rz, 0])
    };
    
    // Calculate reactions (simplified - in a real implementation, this would use the global stiffness matrix)
    const reactions = {
      fx: node.restraints.dx ? 0 : 0, // Placeholder - would be calculated from K * u
      fy: node.restraints.dy ? 0 : 0,
      fz: node.restraints.dz ? 0 : 0,
      mx: node.restraints.rx ? 0 : 0,
      my: node.restraints.ry ? 0 : 0,
      mz: node.restraints.rz ? 0 : 0
    };
    
    nodeResults.push({
      nodeId: node.id,
      displacements: nodeDisplacements,
      reactions: reactions
    });
  }
  
  // Calculate beam internal forces
  for (const beam of model.beams) {
    const startNode = nodeMap.get(beam.startNode);
    const endNode = nodeMap.get(beam.endNode);
    const startDofs = dofMap.get(beam.startNode);
    const endDofs = dofMap.get(beam.endNode);
    
    // Extract displacements for this beam's nodes
    const startDisp = {
      dx: fullDisplacements.get([startDofs.dx, 0]),
      dy: fullDisplacements.get([startDofs.dy, 0]),
      dz: fullDisplacements.get([startDofs.dz, 0]),
      rx: fullDisplacements.get([startDofs.rx, 0]),
      ry: fullDisplacements.get([startDofs.ry, 0]),
      rz: fullDisplacements.get([startDofs.rz, 0])
    };
    
    const endDisp = {
      dx: fullDisplacements.get([endDofs.dx, 0]),
      dy: fullDisplacements.get([endDofs.dy, 0]),
      dz: fullDisplacements.get([endDofs.dz, 0]),
      rx: fullDisplacements.get([endDofs.rx, 0]),
      ry: fullDisplacements.get([endDofs.ry, 0]),
      rz: fullDisplacements.get([endDofs.rz, 0])
    };
    
    // Calculate element length
    const dx = endNode.coordinates.x - startNode.coordinates.x;
    const dy = endNode.coordinates.y - startNode.coordinates.y;
    const dz = endNode.coordinates.z - startNode.coordinates.z;
    const L = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    // Calculate internal forces at multiple stations along the beam
    const stations = [];
    const numStations = 11; // 0, 0.1, 0.2, ..., 1.0
    
    for (let i = 0; i < numStations; i++) {
      const position = i / (numStations - 1);
      
      // Calculate internal forces at this station (simplified)
      // In a real implementation, this would use shape functions and the element stiffness matrix
      const forces = {
        axial: 0,      // Placeholder
        shearY: 0,     // Placeholder
        shearZ: 0,     // Placeholder
        torsion: 0,    // Placeholder
        momentY: 0,    // Placeholder
        momentZ: 0     // Placeholder
      };
      
      // Calculate stresses at this station (simplified)
      const section = model.sections.find(s => s.id === beam.section);
      const stresses = {
        axial: forces.axial / section.properties.area,
        bendingY: forces.momentY / section.properties.sectionModulusY,
        bendingZ: forces.momentZ / section.properties.sectionModulusZ,
        shearY: forces.shearY / section.properties.shearAreaY,
        shearZ: forces.shearZ / section.properties.shearAreaZ,
        torsional: forces.torsion / section.properties.torsionalConstant,
        vonMises: 0 // Would be calculated from other stresses
      };
      
      // Calculate displacements at this station (simplified)
      const stationDisplacements = {
        dx: startDisp.dx + position * (endDisp.dx - startDisp.dx),
        dy: startDisp.dy + position * (endDisp.dy - startDisp.dy),
        dz: startDisp.dz + position * (endDisp.dz - startDisp.dz),
        rx: startDisp.rx + position * (endDisp.rx - startDisp.rx),
        ry: startDisp.ry + position * (endDisp.ry - startDisp.ry),
        rz: startDisp.rz + position * (endDisp.rz - startDisp.rz)
      };
      
      stations.push({
        position,
        forces,
        stresses,
        displacements: stationDisplacements
      });
    }
    
    beamResults.push({
      beamId: beam.id,
      stations
    });
  }
  
  // Calculate plate results (simplified)
  for (const plate of model.plates) {
    const plateNodes = plate.nodes.map(nodeId => nodeMap.get(nodeId));
    const plateDofs = plate.nodes.map(nodeId => dofMap.get(nodeId));
    
    // Extract displacements for this plate's nodes
    const nodeDisplacements = plate.nodes.map((nodeId, index) => {
      const dofs = plateDofs[index];
      
      return {
        nodeId,
        displacements: {
          dx: fullDisplacements.get([dofs.dx, 0]),
          dy: fullDisplacements.get([dofs.dy, 0]),
          dz: fullDisplacements.get([dofs.dz, 0]),
          rx: fullDisplacements.get([dofs.rx, 0]),
          ry: fullDisplacements.get([dofs.ry, 0]),
          rz: fullDisplacements.get([dofs.rz, 0])
        }
      };
    });
    
    // Calculate stresses at nodes (simplified)
    const results = nodeDisplacements.map(nd => {
      // In a real implementation, this would calculate stresses based on displacement gradients
      return {
        nodeId: nd.nodeId,
        displacements: nd.displacements,
        stresses: {
          sxx: 0, // Placeholder
          syy: 0, // Placeholder
          sxy: 0, // Placeholder
          svm: 0, // Placeholder
          s1: 0,  // Placeholder
          s2: 0,  // Placeholder
          angle: 0 // Placeholder
        },
        moments: {
          mxx: 0, // Placeholder
          myy: 0, // Placeholder
          mxy: 0  // Placeholder
        },
        forces: {
          nxx: 0, // Placeholder
          nyy: 0, // Placeholder
          nxy: 0  // Placeholder
        }
      };
    });
    
    plateResults.push({
      plateId: plate.id,
      results
    });
  }
  
  return { nodeResults, beamResults, plateResults };
}

/**
 * Combine results from multiple load cases
 */
function combineLoadCaseResults(loadCaseResults, factors) {
  // Initialize combined results
  const nodeResults = [];
  const beamResults = [];
  const plateResults = [];
  
  // Get first load case result to initialize structure
  const firstResult = loadCaseResults.find(lcr => factors[lcr.loadCaseId]);
  
  if (!firstResult) {
    return { nodeResults, beamResults, plateResults };
  }
  
  // Initialize node results
  for (const nodeResult of firstResult.nodeResults) {
    nodeResults.push({
      nodeId: nodeResult.nodeId,
      displacements: {
        dx: 0, dy: 0, dz: 0, rx: 0, ry: 0, rz: 0
      },
      reactions: {
        fx: 0, fy: 0, fz: 0, mx: 0, my: 0, mz: 0
      }
    });
  }
  
  // Initialize beam results
  for (const beamResult of firstResult.beamResults) {
    const stations = beamResult.stations.map(station => ({
      position: station.position,
      forces: {
        axial: 0, shearY: 0, shearZ: 0, torsion: 0, momentY: 0, momentZ: 0
      },
      stresses: {
        axial: 0, bendingY: 0, bendingZ: 0, shearY: 0, shearZ: 0, torsional: 0, vonMises: 0
      },
      displacements: {
        dx: 0, dy: 0, dz: 0, rx: 0, ry: 0, rz: 0
      }
    }));
    
    beamResults.push({
      beamId: beamResult.beamId,
      stations
    });
  }
  
  // Initialize plate results
  for (const plateResult of firstResult.plateResults) {
    const results = plateResult.results.map(result => ({
      nodeId: result.nodeId,
      displacements: {
        dx: 0, dy: 0, dz: 0, rx: 0, ry: 0, rz: 0
      },
      stresses: {
        sxx: 0, syy: 0, sxy: 0, svm: 0, s1: 0, s2: 0, angle: 0
      },
      moments: {
        mxx: 0, myy: 0, mxy: 0
      },
      forces: {
        nxx: 0, nyy: 0, nxy: 0
      }
    }));
    
    plateResults.push({
      plateId: plateResult.plateId,
      results
    });
  }
  
  // Combine results from each load case
  for (const loadCaseResult of loadCaseResults) {
    const factor = factors[loadCaseResult.loadCaseId] || 0;
    
    if (factor === 0) continue;
    
    // Combine node results
    for (let i = 0; i < nodeResults.length; i++) {
      const lcNodeResult = loadCaseResult.nodeResults.find(nr => nr.nodeId === nodeResults[i].nodeId);
      
      if (lcNodeResult) {
        // Add displacements
        nodeResults[i].displacements.dx += lcNodeResult.displacements.dx * factor;
        nodeResults[i].displacements.dy += lcNodeResult.displacements.dy * factor;
        nodeResults[i].displacements.dz += lcNodeResult.displacements.dz * factor;
        nodeResults[i].displacements.rx += lcNodeResult.displacements.rx * factor;
        nodeResults[i].displacements.ry += lcNodeResult.displacements.ry * factor;
        nodeResults[i].displacements.rz += lcNodeResult.displacements.rz * factor;
        
        // Add reactions
        nodeResults[i].reactions.fx += lcNodeResult.reactions.fx * factor;
        nodeResults[i].reactions.fy += lcNodeResult.reactions.fy * factor;
        nodeResults[i].reactions.fz += lcNodeResult.reactions.fz * factor;
        nodeResults[i].reactions.mx += lcNodeResult.reactions.mx * factor;
        nodeResults[i].reactions.my += lcNodeResult.reactions.my * factor;
        nodeResults[i].reactions.mz += lcNodeResult.reactions.mz * factor;
      }
    }
    
    // Combine beam results
    for (let i = 0; i < beamResults.length; i++) {
      const lcBeamResult = loadCaseResult.beamResults.find(br => br.beamId === beamResults[i].beamId);
      
      if (lcBeamResult) {
        for (let j = 0; j < beamResults[i].stations.length; j++) {
          const lcStation = lcBeamResult.stations.find(s => s.position === beamResults[i].stations[j].position);
          
          if (lcStation) {
            // Add forces
            beamResults[i].stations[j].forces.axial += lcStation.forces.axial * factor;
            beamResults[i].stations[j].forces.shearY += lcStation.forces.shearY * factor;
            beamResults[i].stations[j].forces.shearZ += lcStation.forces.shearZ * factor;
            beamResults[i].stations[j].forces.torsion += lcStation.forces.torsion * factor;
            beamResults[i].stations[j].forces.momentY += lcStation.forces.momentY * factor;
            beamResults[i].stations[j].forces.momentZ += lcStation.forces.momentZ * factor;
            
            // Add stresses
            beamResults[i].stations[j].stresses.axial += lcStation.stresses.axial * factor;
            beamResults[i].stations[j].stresses.bendingY += lcStation.stresses.bendingY * factor;
            beamResults[i].stations[j].stresses.bendingZ += lcStation.stresses.bendingZ * factor;
            beamResults[i].stations[j].stresses.shearY += lcStation.stresses.shearY * factor;
            beamResults[i].stations[j].stresses.shearZ += lcStation.stresses.shearZ * factor;
            beamResults[i].stations[j].stresses.torsional += lcStation.stresses.torsional * factor;
            
            // Von Mises stress needs to be recalculated, not combined
            // This is a simplification - in reality, we'd need to combine the stress components first
            beamResults[i].stations[j].stresses.vonMises += lcStation.stresses.vonMises * factor;
            
            // Add displacements
            beamResults[i].stations[j].displacements.dx += lcStation.displacements.dx * factor;
            beamResults[i].stations[j].displacements.dy += lcStation.displacements.dy * factor;
            beamResults[i].stations[j].displacements.dz += lcStation.displacements.dz * factor;
            beamResults[i].stations[j].displacements.rx += lcStation.displacements.rx * factor;
            beamResults[i].stations[j].displacements.ry += lcStation.displacements.ry * factor;
            beamResults[i].stations[j].displacements.rz += lcStation.displacements.rz * factor;
          }
        }
      }
    }
    
    // Combine plate results
    for (let i = 0; i < plateResults.length; i++) {
      const lcPlateResult = loadCaseResult.plateResults.find(pr => pr.plateId === plateResults[i].plateId);
      
      if (lcPlateResult) {
        for (let j = 0; j < plateResults[i].results.length; j++) {
          const lcResult = lcPlateResult.results.find(r => r.nodeId === plateResults[i].results[j].nodeId);
          
          if (lcResult) {
            // Add displacements
            plateResults[i].results[j].displacements.dx += lcResult.displacements.dx * factor;
            plateResults[i].results[j].displacements.dy += lcResult.displacements.dy * factor;
            plateResults[i].results[j].displacements.dz += lcResult.displacements.dz * factor;
            plateResults[i].results[j].displacements.rx += lcResult.displacements.rx * factor;
            plateResults[i].results[j].displacements.ry += lcResult.displacements.ry * factor;
            plateResults[i].results[j].displacements.rz += lcResult.displacements.rz * factor;
            
            // Add stresses
            plateResults[i].results[j].stresses.sxx += lcResult.stresses.sxx * factor;
            plateResults[i].results[j].stresses.syy += lcResult.stresses.syy * factor;
            plateResults[i].results[j].stresses.sxy += lcResult.stresses.sxy * factor;
            
            // Principal stresses and von Mises need to be recalculated, not combined
            // This is a simplification
            plateResults[i].results[j].stresses.svm += lcResult.stresses.svm * factor;
            plateResults[i].results[j].stresses.s1 += lcResult.stresses.s1 * factor;
            plateResults[i].results[j].stresses.s2 += lcResult.stresses.s2 * factor;
            plateResults[i].results[j].stresses.angle += lcResult.stresses.angle * factor;
            
            // Add moments
            plateResults[i].results[j].moments.mxx += lcResult.moments.mxx * factor;
            plateResults[i].results[j].moments.myy += lcResult.moments.myy * factor;
            plateResults[i].results[j].moments.mxy += lcResult.moments.mxy * factor;
            
            // Add forces
            plateResults[i].results[j].forces.nxx += lcResult.forces.nxx * factor;
            plateResults[i].results[j].forces.nyy += lcResult.forces.nyy * factor;
            plateResults[i].results[j].forces.nxy += lcResult.forces.nxy * factor;
          }
        }
      }
    }
  }
  
  return { nodeResults, beamResults, plateResults };
}

/**
 * Calculate summary statistics for analysis results
 */
function calculateSummaryStatistics(loadCaseResults) {
  let maxDisplacement = { value: 0, nodeId: null, loadCase: null };
  let maxStress = { value: 0, elementId: null, elementType: null, loadCase: null };
  let maxReaction = { value: 0, nodeId: null, loadCase: null };
  
  for (const lcResult of loadCaseResults) {
    // Find maximum displacement
    for (const nodeResult of lcResult.nodeResults) {
      const disp = nodeResult.displacements;
      const resultantDisp = Math.sqrt(disp.dx*disp.dx + disp.dy*disp.dy + disp.dz*disp.dz);
      
      if (resultantDisp > maxDisplacement.value) {
        maxDisplacement = {
          value: resultantDisp,
          nodeId: nodeResult.nodeId,
          loadCase: lcResult.loadCaseId
        };
      }
      
      // Find maximum reaction
      const react = nodeResult.reactions;
      const resultantReact = Math.sqrt(react.fx*react.fx + react.fy*react.fy + react.fz*react.fz);
      
      if (resultantReact > maxReaction.value) {
        maxReaction = {
          value: resultantReact,
          nodeId: nodeResult.nodeId,
          loadCase: lcResult.loadCaseId
        };
      }
    }
    
    // Find maximum stress in beams
    for (const beamResult of lcResult.beamResults) {
      for (const station of beamResult.stations) {
        if (station.stresses.vonMises > maxStress.value) {
          maxStress = {
            value: station.stresses.vonMises,
            elementId: beamResult.beamId,
            elementType: 'beam',
            loadCase: lcResult.loadCaseId
          };
        }
      }
    }
    
    // Find maximum stress in plates
    for (const plateResult of lcResult.plateResults) {
      for (const result of plateResult.results) {
        if (result.stresses.svm > maxStress.value) {
          maxStress = {
            value: result.stresses.svm,
            elementId: plateResult.plateId,
            elementType: 'plate',
            loadCase: lcResult.loadCaseId
          };
        }
      }
    }
  }
  
  return {
    maxDisplacement,
    maxStress,
    maxReaction
  };
}

/**
 * Emit progress update via Socket.io
 */
function emitProgress(io, analysisResult) {
  if (io) {
    io.emit('analysis-progress', {
      analysisId: analysisResult._id,
      projectId: analysisResult.project,
      status: analysisResult.status,
      progress: analysisResult.progress
    });
  }
}
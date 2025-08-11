const StructuralModel = require('../models/structuralModel.model');
const Project = require('../models/project.model');
const { validationResult } = require('express-validator');

/**
 * Get structural model for a project
 * @route GET /api/models/:projectId
 * @access Private
 */
exports.getModel = async (req, res) => {
  try {
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    // Get the structural model
    const model = await StructuralModel.findOne({ project: req.params.projectId });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    res.json(model);
  } catch (error) {
    console.error('Get model error:', error);
    res.status(500).json({ message: 'Server error retrieving model' });
  }
};

/**
 * Update structural model
 * @route PUT /api/models/:projectId
 * @access Private
 */
exports.updateModel = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && 
        ['editor', 'admin'].includes(c.role)
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }
    
    // Get the structural model
    let model = await StructuralModel.findOne({ project: req.params.projectId });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    // Update model with new data
    const { 
      nodes, materials, sections, beams, plates, 
      loadCases, loadCombinations, metadata 
    } = req.body;
    
    if (nodes) model.nodes = nodes;
    if (materials) model.materials = materials;
    if (sections) model.sections = sections;
    if (beams) model.beams = beams;
    if (plates) model.plates = plates;
    if (loadCases) model.loadCases = loadCases;
    if (loadCombinations) model.loadCombinations = loadCombinations;
    if (metadata) {
      model.metadata = {
        ...model.metadata,
        ...metadata,
        lastModifiedBy: req.user.id
      };
    }
    
    // Increment version
    model.version += 1;
    
    await model.save();
    
    // Update project stats
    await project.updateStats(model);
    
    res.json({
      message: 'Model updated successfully',
      model
    });
  } catch (error) {
    console.error('Update model error:', error);
    res.status(500).json({ message: 'Server error updating model' });
  }
};

/**
 * Add node to structural model
 * @route POST /api/models/:projectId/nodes
 * @access Private
 */
exports.addNode = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && 
        ['editor', 'admin'].includes(c.role)
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }
    
    // Get the structural model
    const model = await StructuralModel.findOne({ project: req.params.projectId });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    // Add new node
    const { id, coordinates, restraints } = req.body;
    
    // Check if node ID already exists
    if (model.nodes.some(node => node.id === id)) {
      return res.status(400).json({ message: 'Node ID already exists' });
    }
    
    model.nodes.push({
      id,
      coordinates,
      restraints: restraints || {
        dx: false,
        dy: false,
        dz: false,
        rx: false,
        ry: false,
        rz: false
      },
      loads: []
    });
    
    // Increment version
    model.version += 1;
    
    await model.save();
    
    // Update project stats
    await project.updateStats(model);
    
    res.status(201).json({
      message: 'Node added successfully',
      node: model.nodes[model.nodes.length - 1]
    });
  } catch (error) {
    console.error('Add node error:', error);
    res.status(500).json({ message: 'Server error adding node' });
  }
};

/**
 * Add beam to structural model
 * @route POST /api/models/:projectId/beams
 * @access Private
 */
exports.addBeam = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && 
        ['editor', 'admin'].includes(c.role)
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }
    
    // Get the structural model
    const model = await StructuralModel.findOne({ project: req.params.projectId });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    // Add new beam
    const { id, startNode, endNode, section, orientation, releases } = req.body;
    
    // Check if beam ID already exists
    if (model.beams.some(beam => beam.id === id)) {
      return res.status(400).json({ message: 'Beam ID already exists' });
    }
    
    // Check if nodes exist
    if (!model.nodes.some(node => node.id === startNode)) {
      return res.status(400).json({ message: 'Start node does not exist' });
    }
    
    if (!model.nodes.some(node => node.id === endNode)) {
      return res.status(400).json({ message: 'End node does not exist' });
    }
    
    // Check if section exists
    if (!model.sections.some(s => s.id === section)) {
      return res.status(400).json({ message: 'Section does not exist' });
    }
    
    model.beams.push({
      id,
      startNode,
      endNode,
      section,
      orientation: orientation || { angle: 0 },
      releases: releases || {
        startNode: {
          dx: false, dy: false, dz: false,
          rx: false, ry: false, rz: false
        },
        endNode: {
          dx: false, dy: false, dz: false,
          rx: false, ry: false, rz: false
        }
      },
      loads: [],
      offsets: {
        start: { x: 0, y: 0, z: 0 },
        end: { x: 0, y: 0, z: 0 }
      }
    });
    
    // Increment version
    model.version += 1;
    
    await model.save();
    
    // Update project stats
    await project.updateStats(model);
    
    res.status(201).json({
      message: 'Beam added successfully',
      beam: model.beams[model.beams.length - 1]
    });
  } catch (error) {
    console.error('Add beam error:', error);
    res.status(500).json({ message: 'Server error adding beam' });
  }
};

/**
 * Add plate to structural model
 * @route POST /api/models/:projectId/plates
 * @access Private
 */
exports.addPlate = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && 
        ['editor', 'admin'].includes(c.role)
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }
    
    // Get the structural model
    const model = await StructuralModel.findOne({ project: req.params.projectId });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    // Add new plate
    const { id, nodes, material, thickness, localAxis } = req.body;
    
    // Check if plate ID already exists
    if (model.plates.some(plate => plate.id === id)) {
      return res.status(400).json({ message: 'Plate ID already exists' });
    }
    
    // Check if all nodes exist
    for (const nodeId of nodes) {
      if (!model.nodes.some(node => node.id === nodeId)) {
        return res.status(400).json({ message: `Node ${nodeId} does not exist` });
      }
    }
    
    // Check if material exists
    if (!model.materials.some(m => m.id === material)) {
      return res.status(400).json({ message: 'Material does not exist' });
    }
    
    model.plates.push({
      id,
      nodes,
      material,
      thickness,
      loads: [],
      localAxis: localAxis || { angle: 0 }
    });
    
    // Increment version
    model.version += 1;
    
    await model.save();
    
    // Update project stats
    await project.updateStats(model);
    
    res.status(201).json({
      message: 'Plate added successfully',
      plate: model.plates[model.plates.length - 1]
    });
  } catch (error) {
    console.error('Add plate error:', error);
    res.status(500).json({ message: 'Server error adding plate' });
  }
};

/**
 * Add material to structural model
 * @route POST /api/models/:projectId/materials
 * @access Private
 */
exports.addMaterial = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && 
        ['editor', 'admin'].includes(c.role)
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }
    
    // Get the structural model
    const model = await StructuralModel.findOne({ project: req.params.projectId });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    // Add new material
    const { id, name, type, properties, color } = req.body;
    
    // Check if material ID already exists
    if (model.materials.some(material => material.id === id)) {
      return res.status(400).json({ message: 'Material ID already exists' });
    }
    
    model.materials.push({
      id,
      name,
      type,
      properties,
      color: color || '#808080'
    });
    
    // Increment version
    model.version += 1;
    
    await model.save();
    
    // Update project stats
    await project.updateStats(model);
    
    res.status(201).json({
      message: 'Material added successfully',
      material: model.materials[model.materials.length - 1]
    });
  } catch (error) {
    console.error('Add material error:', error);
    res.status(500).json({ message: 'Server error adding material' });
  }
};

/**
 * Add section to structural model
 * @route POST /api/models/:projectId/sections
 * @access Private
 */
exports.addSection = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && 
        ['editor', 'admin'].includes(c.role)
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }
    
    // Get the structural model
    const model = await StructuralModel.findOne({ project: req.params.projectId });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    // Add new section
    const { id, name, type, material, properties, dimensions } = req.body;
    
    // Check if section ID already exists
    if (model.sections.some(section => section.id === id)) {
      return res.status(400).json({ message: 'Section ID already exists' });
    }
    
    // Check if material exists
    if (!model.materials.some(m => m.id === material)) {
      return res.status(400).json({ message: 'Material does not exist' });
    }
    
    model.sections.push({
      id,
      name,
      type,
      material,
      properties,
      dimensions
    });
    
    // Increment version
    model.version += 1;
    
    await model.save();
    
    // Update project stats
    await project.updateStats(model);
    
    res.status(201).json({
      message: 'Section added successfully',
      section: model.sections[model.sections.length - 1]
    });
  } catch (error) {
    console.error('Add section error:', error);
    res.status(500).json({ message: 'Server error adding section' });
  }
};

/**
 * Add load case to structural model
 * @route POST /api/models/:projectId/loadCases
 * @access Private
 */
exports.addLoadCase = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && 
        ['editor', 'admin'].includes(c.role)
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }
    
    // Get the structural model
    const model = await StructuralModel.findOne({ project: req.params.projectId });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    // Add new load case
    const { id, name, type, factor, description } = req.body;
    
    // Check if load case ID already exists
    if (model.loadCases.some(loadCase => loadCase.id === id)) {
      return res.status(400).json({ message: 'Load case ID already exists' });
    }
    
    model.loadCases.push({
      id,
      name,
      type,
      factor: factor || 1.0,
      description
    });
    
    // Increment version
    model.version += 1;
    
    await model.save();
    
    // Update project stats
    await project.updateStats(model);
    
    res.status(201).json({
      message: 'Load case added successfully',
      loadCase: model.loadCases[model.loadCases.length - 1]
    });
  } catch (error) {
    console.error('Add load case error:', error);
    res.status(500).json({ message: 'Server error adding load case' });
  }
};

/**
 * Add load combination to structural model
 * @route POST /api/models/:projectId/loadCombinations
 * @access Private
 */
exports.addLoadCombination = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && 
        ['editor', 'admin'].includes(c.role)
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }
    
    // Get the structural model
    const model = await StructuralModel.findOne({ project: req.params.projectId });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    // Add new load combination
    const { id, name, type, factors, description } = req.body;
    
    // Check if load combination ID already exists
    if (model.loadCombinations.some(loadCombination => loadCombination.id === id)) {
      return res.status(400).json({ message: 'Load combination ID already exists' });
    }
    
    // Check if all load cases exist
    for (const loadCaseId of Object.keys(factors)) {
      if (!model.loadCases.some(lc => lc.id === loadCaseId)) {
        return res.status(400).json({ message: `Load case ${loadCaseId} does not exist` });
      }
    }
    
    model.loadCombinations.push({
      id,
      name,
      type,
      factors,
      description
    });
    
    // Increment version
    model.version += 1;
    
    await model.save();
    
    res.status(201).json({
      message: 'Load combination added successfully',
      loadCombination: model.loadCombinations[model.loadCombinations.length - 1]
    });
  } catch (error) {
    console.error('Add load combination error:', error);
    res.status(500).json({ message: 'Server error adding load combination' });
  }
};

/**
 * Add load to node
 * @route POST /api/models/:projectId/nodes/:nodeId/loads
 * @access Private
 */
exports.addNodeLoad = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && 
        ['editor', 'admin'].includes(c.role)
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }
    
    // Get the structural model
    const model = await StructuralModel.findOne({ project: req.params.projectId });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    // Find the node
    const nodeIndex = model.nodes.findIndex(node => node.id === req.params.nodeId);
    
    if (nodeIndex === -1) {
      return res.status(404).json({ message: 'Node not found' });
    }
    
    // Add load to node
    const { loadCase, fx, fy, fz, mx, my, mz } = req.body;
    
    // Check if load case exists
    if (!model.loadCases.some(lc => lc.id === loadCase)) {
      return res.status(400).json({ message: 'Load case does not exist' });
    }
    
    // Check if load already exists for this load case
    const loadIndex = model.nodes[nodeIndex].loads.findIndex(load => load.loadCase === loadCase);
    
    if (loadIndex !== -1) {
      // Update existing load
      model.nodes[nodeIndex].loads[loadIndex] = {
        loadCase,
        fx: fx || 0,
        fy: fy || 0,
        fz: fz || 0,
        mx: mx || 0,
        my: my || 0,
        mz: mz || 0
      };
    } else {
      // Add new load
      model.nodes[nodeIndex].loads.push({
        loadCase,
        fx: fx || 0,
        fy: fy || 0,
        fz: fz || 0,
        mx: mx || 0,
        my: my || 0,
        mz: mz || 0
      });
    }
    
    // Increment version
    model.version += 1;
    
    await model.save();
    
    res.json({
      message: 'Node load added successfully',
      node: model.nodes[nodeIndex]
    });
  } catch (error) {
    console.error('Add node load error:', error);
    res.status(500).json({ message: 'Server error adding node load' });
  }
};

/**
 * Delete element from structural model
 * @route DELETE /api/models/:projectId/:elementType/:elementId
 * @access Private
 */
exports.deleteElement = async (req, res) => {
  try {
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && 
        ['editor', 'admin'].includes(c.role)
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }
    
    // Get the structural model
    const model = await StructuralModel.findOne({ project: req.params.projectId });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    const { elementType, elementId } = req.params;
    
    // Delete element based on type
    switch (elementType) {
      case 'nodes':
        // Check if node is used in any beams or plates
        if (
          model.beams.some(beam => beam.startNode === elementId || beam.endNode === elementId) ||
          model.plates.some(plate => plate.nodes.includes(elementId))
        ) {
          return res.status(400).json({ 
            message: 'Cannot delete node that is used in beams or plates' 
          });
        }
        
        // Remove node
        const nodeIndex = model.nodes.findIndex(node => node.id === elementId);
        if (nodeIndex === -1) {
          return res.status(404).json({ message: 'Node not found' });
        }
        model.nodes.splice(nodeIndex, 1);
        break;
        
      case 'beams':
        // Remove beam
        const beamIndex = model.beams.findIndex(beam => beam.id === elementId);
        if (beamIndex === -1) {
          return res.status(404).json({ message: 'Beam not found' });
        }
        model.beams.splice(beamIndex, 1);
        break;
        
      case 'plates':
        // Remove plate
        const plateIndex = model.plates.findIndex(plate => plate.id === elementId);
        if (plateIndex === -1) {
          return res.status(404).json({ message: 'Plate not found' });
        }
        model.plates.splice(plateIndex, 1);
        break;
        
      case 'materials':
        // Check if material is used in any sections or plates
        if (
          model.sections.some(section => section.material === elementId) ||
          model.plates.some(plate => plate.material === elementId)
        ) {
          return res.status(400).json({ 
            message: 'Cannot delete material that is used in sections or plates' 
          });
        }
        
        // Remove material
        const materialIndex = model.materials.findIndex(material => material.id === elementId);
        if (materialIndex === -1) {
          return res.status(404).json({ message: 'Material not found' });
        }
        model.materials.splice(materialIndex, 1);
        break;
        
      case 'sections':
        // Check if section is used in any beams
        if (model.beams.some(beam => beam.section === elementId)) {
          return res.status(400).json({ 
            message: 'Cannot delete section that is used in beams' 
          });
        }
        
        // Remove section
        const sectionIndex = model.sections.findIndex(section => section.id === elementId);
        if (sectionIndex === -1) {
          return res.status(404).json({ message: 'Section not found' });
        }
        model.sections.splice(sectionIndex, 1);
        break;
        
      case 'loadCases':
        // Check if load case is used in any load combinations
        if (
          model.loadCombinations.some(lc => 
            Object.keys(lc.factors).includes(elementId)
          )
        ) {
          return res.status(400).json({ 
            message: 'Cannot delete load case that is used in load combinations' 
          });
        }
        
        // Remove load case
        const loadCaseIndex = model.loadCases.findIndex(lc => lc.id === elementId);
        if (loadCaseIndex === -1) {
          return res.status(404).json({ message: 'Load case not found' });
        }
        model.loadCases.splice(loadCaseIndex, 1);
        
        // Remove loads associated with this load case
        model.nodes.forEach(node => {
          node.loads = node.loads.filter(load => load.loadCase !== elementId);
        });
        
        model.beams.forEach(beam => {
          beam.loads = beam.loads.filter(load => load.loadCase !== elementId);
        });
        
        model.plates.forEach(plate => {
          plate.loads = plate.loads.filter(load => load.loadCase !== elementId);
        });
        break;
        
      case 'loadCombinations':
        // Remove load combination
        const loadCombinationIndex = model.loadCombinations.findIndex(lc => lc.id === elementId);
        if (loadCombinationIndex === -1) {
          return res.status(404).json({ message: 'Load combination not found' });
        }
        model.loadCombinations.splice(loadCombinationIndex, 1);
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid element type' });
    }
    
    // Increment version
    model.version += 1;
    
    await model.save();
    
    // Update project stats
    await project.updateStats(model);
    
    res.json({
      message: `${elementType.slice(0, -1)} deleted successfully`
    });
  } catch (error) {
    console.error('Delete element error:', error);
    res.status(500).json({ message: 'Server error deleting element' });
  }
};
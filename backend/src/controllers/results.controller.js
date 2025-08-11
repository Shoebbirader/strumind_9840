const AnalysisResult = require('../models/analysisResult.model');
const Project = require('../models/project.model');
const { validationResult } = require('express-validator');

/**
 * Get node displacements for a specific analysis result
 * @route GET /api/results/:resultId/displacements
 * @access Private
 */
exports.getDisplacements = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Find result
    const result = await AnalysisResult.findById(req.params.resultId);
    
    if (!result) {
      return res.status(404).json({ message: 'Analysis result not found' });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(result.project);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    // Get load case ID from query or use first load case
    const loadCaseId = req.query.loadCase || 
      (result.loadCaseResults.length > 0 ? result.loadCaseResults[0].loadCaseId : null);
    
    if (!loadCaseId) {
      return res.status(404).json({ message: 'No load case results found' });
    }
    
    // Find load case result
    const loadCaseResult = result.loadCaseResults.find(lcr => lcr.loadCaseId === loadCaseId);
    
    if (!loadCaseResult) {
      return res.status(404).json({ message: `Results for load case ${loadCaseId} not found` });
    }
    
    // Return node displacements
    res.json({
      loadCaseId,
      displacements: loadCaseResult.nodeResults.map(nr => ({
        nodeId: nr.nodeId,
        displacements: nr.displacements
      }))
    });
  } catch (error) {
    console.error('Get displacements error:', error);
    res.status(500).json({ message: 'Server error retrieving displacements' });
  }
};

/**
 * Get node reactions for a specific analysis result
 * @route GET /api/results/:resultId/reactions
 * @access Private
 */
exports.getReactions = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Find result
    const result = await AnalysisResult.findById(req.params.resultId);
    
    if (!result) {
      return res.status(404).json({ message: 'Analysis result not found' });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(result.project);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    // Get load case ID from query or use first load case
    const loadCaseId = req.query.loadCase || 
      (result.loadCaseResults.length > 0 ? result.loadCaseResults[0].loadCaseId : null);
    
    if (!loadCaseId) {
      return res.status(404).json({ message: 'No load case results found' });
    }
    
    // Find load case result
    const loadCaseResult = result.loadCaseResults.find(lcr => lcr.loadCaseId === loadCaseId);
    
    if (!loadCaseResult) {
      return res.status(404).json({ message: `Results for load case ${loadCaseId} not found` });
    }
    
    // Return node reactions
    res.json({
      loadCaseId,
      reactions: loadCaseResult.nodeResults.map(nr => ({
        nodeId: nr.nodeId,
        reactions: nr.reactions
      }))
    });
  } catch (error) {
    console.error('Get reactions error:', error);
    res.status(500).json({ message: 'Server error retrieving reactions' });
  }
};

/**
 * Get beam internal forces for a specific analysis result
 * @route GET /api/results/:resultId/beam-forces
 * @access Private
 */
exports.getBeamForces = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Find result
    const result = await AnalysisResult.findById(req.params.resultId);
    
    if (!result) {
      return res.status(404).json({ message: 'Analysis result not found' });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(result.project);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    // Get load case ID from query or use first load case
    const loadCaseId = req.query.loadCase || 
      (result.loadCaseResults.length > 0 ? result.loadCaseResults[0].loadCaseId : null);
    
    if (!loadCaseId) {
      return res.status(404).json({ message: 'No load case results found' });
    }
    
    // Find load case result
    const loadCaseResult = result.loadCaseResults.find(lcr => lcr.loadCaseId === loadCaseId);
    
    if (!loadCaseResult) {
      return res.status(404).json({ message: `Results for load case ${loadCaseId} not found` });
    }
    
    // Filter by beam ID if provided
    let beamResults = loadCaseResult.beamResults;
    
    if (req.query.beamId) {
      beamResults = beamResults.filter(br => br.beamId === req.query.beamId);
      
      if (beamResults.length === 0) {
        return res.status(404).json({ message: `Results for beam ${req.query.beamId} not found` });
      }
    }
    
    // Return beam forces
    res.json({
      loadCaseId,
      beamForces: beamResults.map(br => ({
        beamId: br.beamId,
        stations: br.stations.map(s => ({
          position: s.position,
          forces: s.forces
        }))
      }))
    });
  } catch (error) {
    console.error('Get beam forces error:', error);
    res.status(500).json({ message: 'Server error retrieving beam forces' });
  }
};

/**
 * Get beam stresses for a specific analysis result
 * @route GET /api/results/:resultId/beam-stresses
 * @access Private
 */
exports.getBeamStresses = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Find result
    const result = await AnalysisResult.findById(req.params.resultId);
    
    if (!result) {
      return res.status(404).json({ message: 'Analysis result not found' });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(result.project);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    // Get load case ID from query or use first load case
    const loadCaseId = req.query.loadCase || 
      (result.loadCaseResults.length > 0 ? result.loadCaseResults[0].loadCaseId : null);
    
    if (!loadCaseId) {
      return res.status(404).json({ message: 'No load case results found' });
    }
    
    // Find load case result
    const loadCaseResult = result.loadCaseResults.find(lcr => lcr.loadCaseId === loadCaseId);
    
    if (!loadCaseResult) {
      return res.status(404).json({ message: `Results for load case ${loadCaseId} not found` });
    }
    
    // Filter by beam ID if provided
    let beamResults = loadCaseResult.beamResults;
    
    if (req.query.beamId) {
      beamResults = beamResults.filter(br => br.beamId === req.query.beamId);
      
      if (beamResults.length === 0) {
        return res.status(404).json({ message: `Results for beam ${req.query.beamId} not found` });
      }
    }
    
    // Return beam stresses
    res.json({
      loadCaseId,
      beamStresses: beamResults.map(br => ({
        beamId: br.beamId,
        stations: br.stations.map(s => ({
          position: s.position,
          stresses: s.stresses
        }))
      }))
    });
  } catch (error) {
    console.error('Get beam stresses error:', error);
    res.status(500).json({ message: 'Server error retrieving beam stresses' });
  }
};

/**
 * Get plate forces for a specific analysis result
 * @route GET /api/results/:resultId/plate-forces
 * @access Private
 */
exports.getPlateForces = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Find result
    const result = await AnalysisResult.findById(req.params.resultId);
    
    if (!result) {
      return res.status(404).json({ message: 'Analysis result not found' });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(result.project);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    // Get load case ID from query or use first load case
    const loadCaseId = req.query.loadCase || 
      (result.loadCaseResults.length > 0 ? result.loadCaseResults[0].loadCaseId : null);
    
    if (!loadCaseId) {
      return res.status(404).json({ message: 'No load case results found' });
    }
    
    // Find load case result
    const loadCaseResult = result.loadCaseResults.find(lcr => lcr.loadCaseId === loadCaseId);
    
    if (!loadCaseResult) {
      return res.status(404).json({ message: `Results for load case ${loadCaseId} not found` });
    }
    
    // Filter by plate ID if provided
    let plateResults = loadCaseResult.plateResults;
    
    if (req.query.plateId) {
      plateResults = plateResults.filter(pr => pr.plateId === req.query.plateId);
      
      if (plateResults.length === 0) {
        return res.status(404).json({ message: `Results for plate ${req.query.plateId} not found` });
      }
    }
    
    // Return plate forces
    res.json({
      loadCaseId,
      plateForces: plateResults.map(pr => ({
        plateId: pr.plateId,
        results: pr.results.map(r => ({
          nodeId: r.nodeId,
          forces: r.forces
        }))
      }))
    });
  } catch (error) {
    console.error('Get plate forces error:', error);
    res.status(500).json({ message: 'Server error retrieving plate forces' });
  }
};

/**
 * Get plate stresses for a specific analysis result
 * @route GET /api/results/:resultId/plate-stresses
 * @access Private
 */
exports.getPlateStresses = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Find result
    const result = await AnalysisResult.findById(req.params.resultId);
    
    if (!result) {
      return res.status(404).json({ message: 'Analysis result not found' });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(result.project);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    // Get load case ID from query or use first load case
    const loadCaseId = req.query.loadCase || 
      (result.loadCaseResults.length > 0 ? result.loadCaseResults[0].loadCaseId : null);
    
    if (!loadCaseId) {
      return res.status(404).json({ message: 'No load case results found' });
    }
    
    // Find load case result
    const loadCaseResult = result.loadCaseResults.find(lcr => lcr.loadCaseId === loadCaseId);
    
    if (!loadCaseResult) {
      return res.status(404).json({ message: `Results for load case ${loadCaseId} not found` });
    }
    
    // Filter by plate ID if provided
    let plateResults = loadCaseResult.plateResults;
    
    if (req.query.plateId) {
      plateResults = plateResults.filter(pr => pr.plateId === req.query.plateId);
      
      if (plateResults.length === 0) {
        return res.status(404).json({ message: `Results for plate ${req.query.plateId} not found` });
      }
    }
    
    // Return plate stresses
    res.json({
      loadCaseId,
      plateStresses: plateResults.map(pr => ({
        plateId: pr.plateId,
        results: pr.results.map(r => ({
          nodeId: r.nodeId,
          stresses: r.stresses
        }))
      }))
    });
  } catch (error) {
    console.error('Get plate stresses error:', error);
    res.status(500).json({ message: 'Server error retrieving plate stresses' });
  }
};

/**
 * Get modal analysis results
 * @route GET /api/results/:resultId/modal
 * @access Private
 */
exports.getModalResults = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Find result
    const result = await AnalysisResult.findById(req.params.resultId);
    
    if (!result) {
      return res.status(404).json({ message: 'Analysis result not found' });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(result.project);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    // Check if modal results exist
    if (!result.modalResults || result.modalResults.length === 0) {
      return res.status(404).json({ message: 'No modal analysis results found' });
    }
    
    // Filter by mode number if provided
    let modalResults = result.modalResults;
    
    if (req.query.modeNumber) {
      const modeNumber = parseInt(req.query.modeNumber);
      modalResults = modalResults.filter(mr => mr.modeNumber === modeNumber);
      
      if (modalResults.length === 0) {
        return res.status(404).json({ message: `Results for mode ${modeNumber} not found` });
      }
    }
    
    // Return modal results
    res.json({
      modalResults: modalResults.map(mr => ({
        modeNumber: mr.modeNumber,
        frequency: mr.frequency,
        period: mr.period,
        massParticipation: mr.massParticipation,
        nodeResults: mr.nodeResults
      }))
    });
  } catch (error) {
    console.error('Get modal results error:', error);
    res.status(500).json({ message: 'Server error retrieving modal results' });
  }
};

/**
 * Get analysis result summary
 * @route GET /api/results/:resultId/summary
 * @access Private
 */
exports.getResultSummary = async (req, res) => {
  try {
    // Find result
    const result = await AnalysisResult.findById(req.params.resultId)
      .populate('configuration');
    
    if (!result) {
      return res.status(404).json({ message: 'Analysis result not found' });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(result.project);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    // Return summary
    res.json({
      id: result._id,
      project: result.project,
      configuration: result.configuration,
      status: result.status,
      startTime: result.startTime,
      endTime: result.endTime,
      summary: result.summary,
      loadCases: result.loadCaseResults.map(lcr => lcr.loadCaseId),
      hasModalResults: result.modalResults && result.modalResults.length > 0
    });
  } catch (error) {
    console.error('Get result summary error:', error);
    res.status(500).json({ message: 'Server error retrieving result summary' });
  }
};

/**
 * Export analysis results to CSV
 * @route GET /api/results/:resultId/export
 * @access Private
 */
exports.exportResults = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Find result
    const result = await AnalysisResult.findById(req.params.resultId);
    
    if (!result) {
      return res.status(404).json({ message: 'Analysis result not found' });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(result.project);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    // Get export format
    const format = req.query.format || 'csv';
    
    // Get result type
    const resultType = req.query.resultType || 'all';
    
    // Get load case ID
    const loadCaseId = req.query.loadCase || 
      (result.loadCaseResults.length > 0 ? result.loadCaseResults[0].loadCaseId : null);
    
    if (!loadCaseId) {
      return res.status(404).json({ message: 'No load case results found' });
    }
    
    // Find load case result
    const loadCaseResult = result.loadCaseResults.find(lcr => lcr.loadCaseId === loadCaseId);
    
    if (!loadCaseResult) {
      return res.status(404).json({ message: `Results for load case ${loadCaseId} not found` });
    }
    
    // Prepare data for export
    let exportData;
    
    switch (resultType) {
      case 'displacements':
        exportData = loadCaseResult.nodeResults.map(nr => ({
          nodeId: nr.nodeId,
          dx: nr.displacements.dx,
          dy: nr.displacements.dy,
          dz: nr.displacements.dz,
          rx: nr.displacements.rx,
          ry: nr.displacements.ry,
          rz: nr.displacements.rz
        }));
        break;
        
      case 'reactions':
        exportData = loadCaseResult.nodeResults.map(nr => ({
          nodeId: nr.nodeId,
          fx: nr.reactions.fx,
          fy: nr.reactions.fy,
          fz: nr.reactions.fz,
          mx: nr.reactions.mx,
          my: nr.reactions.my,
          mz: nr.reactions.mz
        }));
        break;
        
      case 'beam-forces':
        exportData = [];
        loadCaseResult.beamResults.forEach(br => {
          br.stations.forEach(s => {
            exportData.push({
              beamId: br.beamId,
              position: s.position,
              axial: s.forces.axial,
              shearY: s.forces.shearY,
              shearZ: s.forces.shearZ,
              torsion: s.forces.torsion,
              momentY: s.forces.momentY,
              momentZ: s.forces.momentZ
            });
          });
        });
        break;
        
      case 'beam-stresses':
        exportData = [];
        loadCaseResult.beamResults.forEach(br => {
          br.stations.forEach(s => {
            exportData.push({
              beamId: br.beamId,
              position: s.position,
              axial: s.stresses.axial,
              bendingY: s.stresses.bendingY,
              bendingZ: s.stresses.bendingZ,
              shearY: s.stresses.shearY,
              shearZ: s.stresses.shearZ,
              torsional: s.stresses.torsional,
              vonMises: s.stresses.vonMises
            });
          });
        });
        break;
        
      case 'plate-forces':
        exportData = [];
        loadCaseResult.plateResults.forEach(pr => {
          pr.results.forEach(r => {
            exportData.push({
              plateId: pr.plateId,
              nodeId: r.nodeId,
              nxx: r.forces.nxx,
              nyy: r.forces.nyy,
              nxy: r.forces.nxy,
              mxx: r.moments.mxx,
              myy: r.moments.myy,
              mxy: r.moments.mxy
            });
          });
        });
        break;
        
      case 'plate-stresses':
        exportData = [];
        loadCaseResult.plateResults.forEach(pr => {
          pr.results.forEach(r => {
            exportData.push({
              plateId: pr.plateId,
              nodeId: r.nodeId,
              sxx: r.stresses.sxx,
              syy: r.stresses.syy,
              sxy: r.stresses.sxy,
              svm: r.stresses.svm,
              s1: r.stresses.s1,
              s2: r.stresses.s2,
              angle: r.stresses.angle
            });
          });
        });
        break;
        
      case 'modal':
        if (!result.modalResults || result.modalResults.length === 0) {
          return res.status(404).json({ message: 'No modal analysis results found' });
        }
        
        exportData = result.modalResults.map(mr => ({
          modeNumber: mr.modeNumber,
          frequency: mr.frequency,
          period: mr.period,
          massX: mr.massParticipation.x,
          massY: mr.massParticipation.y,
          massZ: mr.massParticipation.z,
          massRX: mr.massParticipation.rx,
          massRY: mr.massParticipation.ry,
          massRZ: mr.massParticipation.rz
        }));
        break;
        
      case 'all':
      default:
        // Return all data in JSON format
        return res.json({
          projectId: result.project,
          resultId: result._id,
          loadCaseId,
          displacements: loadCaseResult.nodeResults.map(nr => ({
            nodeId: nr.nodeId,
            displacements: nr.displacements
          })),
          reactions: loadCaseResult.nodeResults.map(nr => ({
            nodeId: nr.nodeId,
            reactions: nr.reactions
          })),
          beamForces: loadCaseResult.beamResults.map(br => ({
            beamId: br.beamId,
            stations: br.stations.map(s => ({
              position: s.position,
              forces: s.forces
            }))
          })),
          beamStresses: loadCaseResult.beamResults.map(br => ({
            beamId: br.beamId,
            stations: br.stations.map(s => ({
              position: s.position,
              stresses: s.stresses
            }))
          })),
          plateForces: loadCaseResult.plateResults.map(pr => ({
            plateId: pr.plateId,
            results: pr.results.map(r => ({
              nodeId: r.nodeId,
              forces: r.forces,
              moments: r.moments
            }))
          })),
          plateStresses: loadCaseResult.plateResults.map(pr => ({
            plateId: pr.plateId,
            results: pr.results.map(r => ({
              nodeId: r.nodeId,
              stresses: r.stresses
            }))
          })),
          modalResults: result.modalResults
        });
    }
    
    // Format data for export
    if (format === 'csv') {
      if (exportData.length === 0) {
        return res.status(404).json({ message: 'No data to export' });
      }
      
      // Create CSV header
      const headers = Object.keys(exportData[0]).join(',');
      
      // Create CSV rows
      const rows = exportData.map(item => 
        Object.values(item).map(value => 
          typeof value === 'string' ? `"${value}"` : value
        ).join(',')
      ).join('\n');
      
      // Create CSV content
      const csv = `${headers}\n${rows}`;
      
      // Set headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${resultType}_${loadCaseId}.csv`);
      
      // Send CSV data
      return res.send(csv);
    } else {
      // Return JSON data
      return res.json(exportData);
    }
  } catch (error) {
    console.error('Export results error:', error);
    res.status(500).json({ message: 'Server error exporting results' });
  }
};
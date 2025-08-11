const AnalysisConfiguration = require('../models/analysisConfiguration.model');
const AnalysisResult = require('../models/analysisResult.model');
const StructuralModel = require('../models/structuralModel.model');
const Project = require('../models/project.model');
const { validationResult } = require('express-validator');
const analysisService = require('../services/analysis.service');

/**
 * Get all analysis configurations for a project
 * @route GET /api/analysis/configurations/:projectId
 * @access Private
 */
exports.getConfigurations = async (req, res) => {
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
    
    // Get analysis configurations
    const configurations = await AnalysisConfiguration.find({ project: req.params.projectId })
      .sort({ updatedAt: -1 });
    
    res.json(configurations);
  } catch (error) {
    console.error('Get configurations error:', error);
    res.status(500).json({ message: 'Server error retrieving configurations' });
  }
};

/**
 * Create a new analysis configuration
 * @route POST /api/analysis/configurations/:projectId
 * @access Private
 */
exports.createConfiguration = async (req, res) => {
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
    
    // Get the structural model to validate load cases and combinations
    const model = await StructuralModel.findOne({ project: req.params.projectId });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    // Create new configuration
    const {
      name, analysisType, solverType, precision, includePDelta,
      includeShearDeformation, largeDisplacement, modalOptions,
      convergence, performance, output, solverSettings,
      loadCasesToAnalyze, loadCombinationsToAnalyze
    } = req.body;
    
    // Validate load cases and combinations
    if (loadCasesToAnalyze) {
      for (const loadCaseId of loadCasesToAnalyze) {
        if (!model.loadCases.some(lc => lc.id === loadCaseId)) {
          return res.status(400).json({ message: `Load case ${loadCaseId} does not exist` });
        }
      }
    }
    
    if (loadCombinationsToAnalyze) {
      for (const loadCombinationId of loadCombinationsToAnalyze) {
        if (!model.loadCombinations.some(lc => lc.id === loadCombinationId)) {
          return res.status(400).json({ message: `Load combination ${loadCombinationId} does not exist` });
        }
      }
    }
    
    const configuration = new AnalysisConfiguration({
      project: req.params.projectId,
      name,
      analysisType,
      solverType,
      precision,
      includePDelta,
      includeShearDeformation,
      largeDisplacement,
      modalOptions,
      convergence,
      performance,
      output,
      solverSettings,
      loadCasesToAnalyze: loadCasesToAnalyze || [],
      loadCombinationsToAnalyze: loadCombinationsToAnalyze || [],
      createdBy: req.user.id
    });
    
    await configuration.save();
    
    res.status(201).json({
      message: 'Analysis configuration created successfully',
      configuration
    });
  } catch (error) {
    console.error('Create configuration error:', error);
    res.status(500).json({ message: 'Server error creating configuration' });
  }
};

/**
 * Update an analysis configuration
 * @route PUT /api/analysis/configurations/:configId
 * @access Private
 */
exports.updateConfiguration = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Find configuration
    const configuration = await AnalysisConfiguration.findById(req.params.configId);
    
    if (!configuration) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(configuration.project);
    
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
    
    // Get the structural model to validate load cases and combinations
    const model = await StructuralModel.findOne({ project: configuration.project });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    // Update configuration
    const {
      name, analysisType, solverType, precision, includePDelta,
      includeShearDeformation, largeDisplacement, modalOptions,
      convergence, performance, output, solverSettings,
      loadCasesToAnalyze, loadCombinationsToAnalyze
    } = req.body;
    
    // Validate load cases and combinations
    if (loadCasesToAnalyze) {
      for (const loadCaseId of loadCasesToAnalyze) {
        if (!model.loadCases.some(lc => lc.id === loadCaseId)) {
          return res.status(400).json({ message: `Load case ${loadCaseId} does not exist` });
        }
      }
    }
    
    if (loadCombinationsToAnalyze) {
      for (const loadCombinationId of loadCombinationsToAnalyze) {
        if (!model.loadCombinations.some(lc => lc.id === loadCombinationId)) {
          return res.status(400).json({ message: `Load combination ${loadCombinationId} does not exist` });
        }
      }
    }
    
    // Update fields if provided
    if (name) configuration.name = name;
    if (analysisType) configuration.analysisType = analysisType;
    if (solverType) configuration.solverType = solverType;
    if (precision) configuration.precision = precision;
    if (includePDelta !== undefined) configuration.includePDelta = includePDelta;
    if (includeShearDeformation !== undefined) configuration.includeShearDeformation = includeShearDeformation;
    if (largeDisplacement !== undefined) configuration.largeDisplacement = largeDisplacement;
    if (modalOptions) {
      configuration.modalOptions = {
        ...configuration.modalOptions,
        ...modalOptions
      };
    }
    if (convergence) {
      configuration.convergence = {
        ...configuration.convergence,
        ...convergence
      };
    }
    if (performance) {
      configuration.performance = {
        ...configuration.performance,
        ...performance
      };
    }
    if (output) {
      configuration.output = {
        ...configuration.output,
        ...output
      };
    }
    if (solverSettings) {
      configuration.solverSettings = {
        ...configuration.solverSettings,
        ...solverSettings
      };
    }
    if (loadCasesToAnalyze) configuration.loadCasesToAnalyze = loadCasesToAnalyze;
    if (loadCombinationsToAnalyze) configuration.loadCombinationsToAnalyze = loadCombinationsToAnalyze;
    
    await configuration.save();
    
    res.json({
      message: 'Configuration updated successfully',
      configuration
    });
  } catch (error) {
    console.error('Update configuration error:', error);
    res.status(500).json({ message: 'Server error updating configuration' });
  }
};

/**
 * Delete an analysis configuration
 * @route DELETE /api/analysis/configurations/:configId
 * @access Private
 */
exports.deleteConfiguration = async (req, res) => {
  try {
    // Find configuration
    const configuration = await AnalysisConfiguration.findById(req.params.configId);
    
    if (!configuration) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(configuration.project);
    
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
    
    // Delete configuration
    await configuration.remove();
    
    res.json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    console.error('Delete configuration error:', error);
    res.status(500).json({ message: 'Server error deleting configuration' });
  }
};

/**
 * Run analysis with a configuration
 * @route POST /api/analysis/run/:configId
 * @access Private
 */
exports.runAnalysis = async (req, res) => {
  try {
    // Find configuration
    const configuration = await AnalysisConfiguration.findById(req.params.configId);
    
    if (!configuration) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    
    // Check if user has access to the project
    const project = await Project.findById(configuration.project);
    
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
      return res.status(403).json({ message: 'Not authorized to run analysis for this project' });
    }
    
    // Get the structural model
    const model = await StructuralModel.findOne({ project: configuration.project });
    
    if (!model) {
      return res.status(404).json({ message: 'Structural model not found' });
    }
    
    // Create analysis result record
    const analysisResult = new AnalysisResult({
      project: configuration.project,
      configuration: configuration._id,
      status: 'running',
      progress: 0,
      startTime: new Date(),
      createdBy: req.user.id
    });
    
    await analysisResult.save();
    
    // Update project status
    project.status = 'running';
    await project.save();
    
    // Run analysis in background
    analysisService.runAnalysis(model, configuration, analysisResult, req.io)
      .then(async () => {
        // Update project status
        project.status = 'completed';
        await project.save();
      })
      .catch(async (error) => {
        console.error('Analysis error:', error);
        
        // Update analysis result with error
        analysisResult.status = 'failed';
        analysisResult.errorMessage = error.message || 'Unknown error during analysis';
        analysisResult.endTime = new Date();
        await analysisResult.save();
        
        // Update project status
        project.status = 'error';
        await project.save();
      });
    
    res.status(202).json({
      message: 'Analysis started successfully',
      analysisResultId: analysisResult._id
    });
  } catch (error) {
    console.error('Run analysis error:', error);
    res.status(500).json({ message: 'Server error starting analysis' });
  }
};

/**
 * Get analysis results for a project
 * @route GET /api/analysis/results/:projectId
 * @access Private
 */
exports.getResults = async (req, res) => {
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
    
    // Get analysis results
    const results = await AnalysisResult.find({ project: req.params.projectId })
      .populate('configuration')
      .sort({ createdAt: -1 });
    
    res.json(results);
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ message: 'Server error retrieving results' });
  }
};

/**
 * Get a specific analysis result
 * @route GET /api/analysis/results/detail/:resultId
 * @access Private
 */
exports.getResultById = async (req, res) => {
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
    
    res.json(result);
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({ message: 'Server error retrieving result' });
  }
};

/**
 * Delete an analysis result
 * @route DELETE /api/analysis/results/:resultId
 * @access Private
 */
exports.deleteResult = async (req, res) => {
  try {
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
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && 
        ['editor', 'admin'].includes(c.role)
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }
    
    // Delete result
    await result.remove();
    
    res.json({ message: 'Analysis result deleted successfully' });
  } catch (error) {
    console.error('Delete result error:', error);
    res.status(500).json({ message: 'Server error deleting result' });
  }
};
const express = require('express');
const { body, param } = require('express-validator');
const analysisController = require('../controllers/analysis.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * @route GET /api/analysis/configurations/:projectId
 * @desc Get all analysis configurations for a project
 * @access Private
 */
router.get(
  '/configurations/:projectId',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID')
  ],
  analysisController.getConfigurations
);

/**
 * @route POST /api/analysis/configurations/:projectId
 * @desc Create a new analysis configuration
 * @access Private
 */
router.post(
  '/configurations/:projectId',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    body('name').notEmpty().withMessage('Configuration name is required'),
    body('analysisType')
      .isIn(['static', 'modal', 'buckling', 'nonlinear', 'dynamic', 'timeHistory', 'responseSpectrum'])
      .withMessage('Invalid analysis type'),
    body('solverType')
      .isIn(['direct', 'iterative'])
      .withMessage('Invalid solver type'),
    body('precision')
      .isIn(['single', 'double'])
      .withMessage('Invalid precision'),
    body('includePDelta').optional().isBoolean().withMessage('includePDelta must be a boolean'),
    body('includeShearDeformation').optional().isBoolean().withMessage('includeShearDeformation must be a boolean'),
    body('largeDisplacement').optional().isBoolean().withMessage('largeDisplacement must be a boolean'),
    body('modalOptions').optional().isObject().withMessage('modalOptions must be an object'),
    body('convergence').optional().isObject().withMessage('convergence must be an object'),
    body('performance').optional().isObject().withMessage('performance must be an object'),
    body('output').optional().isObject().withMessage('output must be an object'),
    body('solverSettings').optional().isObject().withMessage('solverSettings must be an object'),
    body('loadCasesToAnalyze').optional().isArray().withMessage('loadCasesToAnalyze must be an array'),
    body('loadCombinationsToAnalyze').optional().isArray().withMessage('loadCombinationsToAnalyze must be an array')
  ],
  analysisController.createConfiguration
);

/**
 * @route PUT /api/analysis/configurations/:configId
 * @desc Update an analysis configuration
 * @access Private
 */
router.put(
  '/configurations/:configId',
  [
    param('configId').isMongoId().withMessage('Invalid configuration ID'),
    body('name').optional().notEmpty().withMessage('Configuration name cannot be empty'),
    body('analysisType')
      .optional()
      .isIn(['static', 'modal', 'buckling', 'nonlinear', 'dynamic', 'timeHistory', 'responseSpectrum'])
      .withMessage('Invalid analysis type'),
    body('solverType')
      .optional()
      .isIn(['direct', 'iterative'])
      .withMessage('Invalid solver type'),
    body('precision')
      .optional()
      .isIn(['single', 'double'])
      .withMessage('Invalid precision'),
    body('includePDelta').optional().isBoolean().withMessage('includePDelta must be a boolean'),
    body('includeShearDeformation').optional().isBoolean().withMessage('includeShearDeformation must be a boolean'),
    body('largeDisplacement').optional().isBoolean().withMessage('largeDisplacement must be a boolean'),
    body('modalOptions').optional().isObject().withMessage('modalOptions must be an object'),
    body('convergence').optional().isObject().withMessage('convergence must be an object'),
    body('performance').optional().isObject().withMessage('performance must be an object'),
    body('output').optional().isObject().withMessage('output must be an object'),
    body('solverSettings').optional().isObject().withMessage('solverSettings must be an object'),
    body('loadCasesToAnalyze').optional().isArray().withMessage('loadCasesToAnalyze must be an array'),
    body('loadCombinationsToAnalyze').optional().isArray().withMessage('loadCombinationsToAnalyze must be an array')
  ],
  analysisController.updateConfiguration
);

/**
 * @route DELETE /api/analysis/configurations/:configId
 * @desc Delete an analysis configuration
 * @access Private
 */
router.delete(
  '/configurations/:configId',
  [
    param('configId').isMongoId().withMessage('Invalid configuration ID')
  ],
  analysisController.deleteConfiguration
);

/**
 * @route POST /api/analysis/run/:configId
 * @desc Run analysis with a configuration
 * @access Private
 */
router.post(
  '/run/:configId',
  [
    param('configId').isMongoId().withMessage('Invalid configuration ID')
  ],
  analysisController.runAnalysis
);

/**
 * @route GET /api/analysis/results/:projectId
 * @desc Get analysis results for a project
 * @access Private
 */
router.get(
  '/results/:projectId',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID')
  ],
  analysisController.getResults
);

/**
 * @route GET /api/analysis/results/detail/:resultId
 * @desc Get a specific analysis result
 * @access Private
 */
router.get(
  '/results/detail/:resultId',
  [
    param('resultId').isMongoId().withMessage('Invalid result ID')
  ],
  analysisController.getResultById
);

/**
 * @route DELETE /api/analysis/results/:resultId
 * @desc Delete an analysis result
 * @access Private
 */
router.delete(
  '/results/:resultId',
  [
    param('resultId').isMongoId().withMessage('Invalid result ID')
  ],
  analysisController.deleteResult
);

module.exports = router;
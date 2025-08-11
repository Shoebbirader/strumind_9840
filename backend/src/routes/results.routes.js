const express = require('express');
const { param, query } = require('express-validator');
const resultsController = require('../controllers/results.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * @route GET /api/results/:resultId/displacements
 * @desc Get node displacements for a specific analysis result
 * @access Private
 */
router.get(
  '/:resultId/displacements',
  [
    param('resultId').isMongoId().withMessage('Invalid result ID'),
    query('loadCase').optional().notEmpty().withMessage('Load case ID cannot be empty')
  ],
  resultsController.getDisplacements
);

/**
 * @route GET /api/results/:resultId/reactions
 * @desc Get node reactions for a specific analysis result
 * @access Private
 */
router.get(
  '/:resultId/reactions',
  [
    param('resultId').isMongoId().withMessage('Invalid result ID'),
    query('loadCase').optional().notEmpty().withMessage('Load case ID cannot be empty')
  ],
  resultsController.getReactions
);

/**
 * @route GET /api/results/:resultId/beam-forces
 * @desc Get beam internal forces for a specific analysis result
 * @access Private
 */
router.get(
  '/:resultId/beam-forces',
  [
    param('resultId').isMongoId().withMessage('Invalid result ID'),
    query('loadCase').optional().notEmpty().withMessage('Load case ID cannot be empty'),
    query('beamId').optional().notEmpty().withMessage('Beam ID cannot be empty')
  ],
  resultsController.getBeamForces
);

/**
 * @route GET /api/results/:resultId/beam-stresses
 * @desc Get beam stresses for a specific analysis result
 * @access Private
 */
router.get(
  '/:resultId/beam-stresses',
  [
    param('resultId').isMongoId().withMessage('Invalid result ID'),
    query('loadCase').optional().notEmpty().withMessage('Load case ID cannot be empty'),
    query('beamId').optional().notEmpty().withMessage('Beam ID cannot be empty')
  ],
  resultsController.getBeamStresses
);

/**
 * @route GET /api/results/:resultId/plate-forces
 * @desc Get plate forces for a specific analysis result
 * @access Private
 */
router.get(
  '/:resultId/plate-forces',
  [
    param('resultId').isMongoId().withMessage('Invalid result ID'),
    query('loadCase').optional().notEmpty().withMessage('Load case ID cannot be empty'),
    query('plateId').optional().notEmpty().withMessage('Plate ID cannot be empty')
  ],
  resultsController.getPlateForces
);

/**
 * @route GET /api/results/:resultId/plate-stresses
 * @desc Get plate stresses for a specific analysis result
 * @access Private
 */
router.get(
  '/:resultId/plate-stresses',
  [
    param('resultId').isMongoId().withMessage('Invalid result ID'),
    query('loadCase').optional().notEmpty().withMessage('Load case ID cannot be empty'),
    query('plateId').optional().notEmpty().withMessage('Plate ID cannot be empty')
  ],
  resultsController.getPlateStresses
);

/**
 * @route GET /api/results/:resultId/modal
 * @desc Get modal analysis results
 * @access Private
 */
router.get(
  '/:resultId/modal',
  [
    param('resultId').isMongoId().withMessage('Invalid result ID'),
    query('modeNumber').optional().isInt({ min: 1 }).withMessage('Mode number must be a positive integer')
  ],
  resultsController.getModalResults
);

/**
 * @route GET /api/results/:resultId/summary
 * @desc Get analysis result summary
 * @access Private
 */
router.get(
  '/:resultId/summary',
  [
    param('resultId').isMongoId().withMessage('Invalid result ID')
  ],
  resultsController.getResultSummary
);

/**
 * @route GET /api/results/:resultId/export
 * @desc Export analysis results to CSV
 * @access Private
 */
router.get(
  '/:resultId/export',
  [
    param('resultId').isMongoId().withMessage('Invalid result ID'),
    query('format').optional().isIn(['csv', 'json']).withMessage('Format must be csv or json'),
    query('resultType').optional().isIn(['displacements', 'reactions', 'beam-forces', 'beam-stresses', 'plate-forces', 'plate-stresses', 'modal', 'all']).withMessage('Invalid result type'),
    query('loadCase').optional().notEmpty().withMessage('Load case ID cannot be empty')
  ],
  resultsController.exportResults
);

module.exports = router;
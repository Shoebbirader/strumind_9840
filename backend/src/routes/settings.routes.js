const express = require('express');
const { body } = require('express-validator');
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * @route GET /api/settings/user
 * @desc Get user settings
 * @access Private
 */
router.get('/user', settingsController.getUserSettings);

/**
 * @route PUT /api/settings/user
 * @desc Update user settings
 * @access Private
 */
router.put(
  '/user',
  [
    body('preferences').isObject().withMessage('Preferences must be an object'),
    body('preferences.theme')
      .optional()
      .isIn(['light', 'dark', 'system'])
      .withMessage('Theme must be light, dark, or system'),
    body('preferences.units')
      .optional()
      .isIn(['metric', 'imperial'])
      .withMessage('Units must be metric or imperial'),
    body('preferences.notifications')
      .optional()
      .isBoolean()
      .withMessage('Notifications must be a boolean')
  ],
  settingsController.updateUserSettings
);

/**
 * @route GET /api/settings/project/:projectId
 * @desc Get project settings
 * @access Private
 */
router.get('/project/:projectId', settingsController.getProjectSettings);

/**
 * @route PUT /api/settings/project/:projectId
 * @desc Update project settings
 * @access Private
 */
router.put(
  '/project/:projectId',
  [
    body('settings').isObject().withMessage('Settings must be an object'),
    body('settings.units').optional().isObject().withMessage('Units must be an object'),
    body('settings.units.length')
      .optional()
      .isIn(['m', 'mm', 'ft', 'in'])
      .withMessage('Length unit must be m, mm, ft, or in'),
    body('settings.units.force')
      .optional()
      .isIn(['N', 'kN', 'lbf', 'kip'])
      .withMessage('Force unit must be N, kN, lbf, or kip'),
    body('settings.units.temperature')
      .optional()
      .isIn(['C', 'F', 'K'])
      .withMessage('Temperature unit must be C, F, or K'),
    body('settings.gridSpacing')
      .optional()
      .isNumeric()
      .withMessage('Grid spacing must be a number'),
    body('settings.snapEnabled')
      .optional()
      .isBoolean()
      .withMessage('Snap enabled must be a boolean'),
    body('settings.defaultMaterial')
      .optional()
      .isMongoId()
      .withMessage('Default material must be a valid ID'),
    body('settings.defaultSection')
      .optional()
      .isMongoId()
      .withMessage('Default section must be a valid ID')
  ],
  settingsController.updateProjectSettings
);

/**
 * @route GET /api/settings/design-codes
 * @desc Get available design codes
 * @access Private
 */
router.get('/design-codes', settingsController.getDesignCodes);

module.exports = router;
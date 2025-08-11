const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  [
    body('username')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .trim(),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('firstName').trim(),
    body('lastName').trim(),
    body('organization').trim()
  ],
  authController.register
);

/**
 * @route POST /api/auth/login
 * @desc Login user and get token
 * @access Public
 */
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  authController.login
);

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authMiddleware, authController.getMe);

/**
 * @route PUT /api/auth/me
 * @desc Update user profile
 * @access Private
 */
router.put(
  '/me',
  authMiddleware,
  [
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
    body('organization').optional().trim(),
    body('preferences').optional().isObject()
  ],
  authController.updateProfile
);

/**
 * @route PUT /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.put(
  '/change-password',
  authMiddleware,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
  ],
  authController.changePassword
);

module.exports = router;
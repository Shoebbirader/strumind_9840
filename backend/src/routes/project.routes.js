const express = require('express');
const { body, param } = require('express-validator');
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * @route GET /api/projects
 * @desc Get all projects for the current user
 * @access Private
 */
router.get('/', projectController.getAllProjects);

/**
 * @route GET /api/projects/:id
 * @desc Get a single project by ID
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid project ID')
  ],
  projectController.getProjectById
);

/**
 * @route POST /api/projects
 * @desc Create a new project
 * @access Private
 */
router.post(
  '/',
  [
    body('name')
      .notEmpty()
      .withMessage('Project name is required')
      .trim(),
    body('description')
      .optional()
      .trim(),
    body('type')
      .optional()
      .isIn(['Building Frame', 'Bridge', 'Truss', 'Industrial', 'Other'])
      .withMessage('Invalid project type'),
    body('thumbnail')
      .optional()
      .isURL()
      .withMessage('Thumbnail must be a valid URL'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
  ],
  projectController.createProject
);

/**
 * @route PUT /api/projects/:id
 * @desc Update a project
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid project ID'),
    body('name')
      .optional()
      .notEmpty()
      .withMessage('Project name cannot be empty')
      .trim(),
    body('description')
      .optional()
      .trim(),
    body('type')
      .optional()
      .isIn(['Building Frame', 'Bridge', 'Truss', 'Industrial', 'Other'])
      .withMessage('Invalid project type'),
    body('status')
      .optional()
      .isIn(['draft', 'running', 'completed', 'error'])
      .withMessage('Invalid project status'),
    body('thumbnail')
      .optional()
      .isURL()
      .withMessage('Thumbnail must be a valid URL'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('settings')
      .optional()
      .isObject()
      .withMessage('Settings must be an object')
  ],
  projectController.updateProject
);

/**
 * @route DELETE /api/projects/:id
 * @desc Delete a project
 * @access Private
 */
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid project ID')
  ],
  projectController.deleteProject
);

/**
 * @route POST /api/projects/:id/duplicate
 * @desc Duplicate a project
 * @access Private
 */
router.post(
  '/:id/duplicate',
  [
    param('id').isMongoId().withMessage('Invalid project ID')
  ],
  projectController.duplicateProject
);

/**
 * @route POST /api/projects/:id/collaborators
 * @desc Add a collaborator to a project
 * @access Private
 */
router.post(
  '/:id/collaborators',
  [
    param('id').isMongoId().withMessage('Invalid project ID'),
    body('userId')
      .isMongoId()
      .withMessage('Invalid user ID'),
    body('role')
      .optional()
      .isIn(['viewer', 'editor', 'admin'])
      .withMessage('Invalid role')
  ],
  projectController.addCollaborator
);

/**
 * @route DELETE /api/projects/:id/collaborators/:userId
 * @desc Remove a collaborator from a project
 * @access Private
 */
router.delete(
  '/:id/collaborators/:userId',
  [
    param('id').isMongoId().withMessage('Invalid project ID'),
    param('userId').isMongoId().withMessage('Invalid user ID')
  ],
  projectController.removeCollaborator
);

module.exports = router;
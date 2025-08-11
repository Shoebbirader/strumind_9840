const express = require('express');
const { body, param } = require('express-validator');
const modelController = require('../controllers/model.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * @route GET /api/models/:projectId
 * @desc Get structural model for a project
 * @access Private
 */
router.get(
  '/:projectId',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID')
  ],
  modelController.getModel
);

/**
 * @route PUT /api/models/:projectId
 * @desc Update structural model
 * @access Private
 */
router.put(
  '/:projectId',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    body('nodes').optional().isArray().withMessage('Nodes must be an array'),
    body('materials').optional().isArray().withMessage('Materials must be an array'),
    body('sections').optional().isArray().withMessage('Sections must be an array'),
    body('beams').optional().isArray().withMessage('Beams must be an array'),
    body('plates').optional().isArray().withMessage('Plates must be an array'),
    body('loadCases').optional().isArray().withMessage('Load cases must be an array'),
    body('loadCombinations').optional().isArray().withMessage('Load combinations must be an array'),
    body('metadata').optional().isObject().withMessage('Metadata must be an object')
  ],
  modelController.updateModel
);

/**
 * @route POST /api/models/:projectId/nodes
 * @desc Add node to structural model
 * @access Private
 */
router.post(
  '/:projectId/nodes',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    body('id').notEmpty().withMessage('Node ID is required'),
    body('coordinates')
      .isObject()
      .withMessage('Coordinates must be an object')
      .custom(coords => {
        if (typeof coords.x !== 'number' || 
            typeof coords.y !== 'number' || 
            typeof coords.z !== 'number') {
          throw new Error('Coordinates must contain numeric x, y, and z values');
        }
        return true;
      }),
    body('restraints').optional().isObject().withMessage('Restraints must be an object')
  ],
  modelController.addNode
);

/**
 * @route POST /api/models/:projectId/beams
 * @desc Add beam to structural model
 * @access Private
 */
router.post(
  '/:projectId/beams',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    body('id').notEmpty().withMessage('Beam ID is required'),
    body('startNode').notEmpty().withMessage('Start node is required'),
    body('endNode').notEmpty().withMessage('End node is required'),
    body('section').notEmpty().withMessage('Section is required'),
    body('orientation').optional().isObject().withMessage('Orientation must be an object'),
    body('releases').optional().isObject().withMessage('Releases must be an object')
  ],
  modelController.addBeam
);

/**
 * @route POST /api/models/:projectId/plates
 * @desc Add plate to structural model
 * @access Private
 */
router.post(
  '/:projectId/plates',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    body('id').notEmpty().withMessage('Plate ID is required'),
    body('nodes')
      .isArray({ min: 3 })
      .withMessage('Plate must have at least 3 nodes'),
    body('material').notEmpty().withMessage('Material is required'),
    body('thickness')
      .isNumeric()
      .withMessage('Thickness must be a number'),
    body('localAxis').optional().isObject().withMessage('Local axis must be an object')
  ],
  modelController.addPlate
);

/**
 * @route POST /api/models/:projectId/materials
 * @desc Add material to structural model
 * @access Private
 */
router.post(
  '/:projectId/materials',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    body('id').notEmpty().withMessage('Material ID is required'),
    body('name').notEmpty().withMessage('Material name is required'),
    body('type')
      .isIn(['steel', 'concrete', 'timber', 'aluminum', 'other'])
      .withMessage('Invalid material type'),
    body('properties')
      .isObject()
      .withMessage('Properties must be an object')
      .custom(props => {
        if (typeof props.elasticModulus !== 'number') {
          throw new Error('Elastic modulus is required and must be a number');
        }
        return true;
      }),
    body('color').optional().isString().withMessage('Color must be a string')
  ],
  modelController.addMaterial
);

/**
 * @route POST /api/models/:projectId/sections
 * @desc Add section to structural model
 * @access Private
 */
router.post(
  '/:projectId/sections',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    body('id').notEmpty().withMessage('Section ID is required'),
    body('name').notEmpty().withMessage('Section name is required'),
    body('type')
      .isIn(['I', 'H', 'C', 'L', 'T', 'rectangular', 'circular', 'pipe', 'tube', 'custom'])
      .withMessage('Invalid section type'),
    body('material').notEmpty().withMessage('Material is required'),
    body('properties').isObject().withMessage('Properties must be an object'),
    body('dimensions').isObject().withMessage('Dimensions must be an object')
  ],
  modelController.addSection
);

/**
 * @route POST /api/models/:projectId/loadCases
 * @desc Add load case to structural model
 * @access Private
 */
router.post(
  '/:projectId/loadCases',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    body('id').notEmpty().withMessage('Load case ID is required'),
    body('name').notEmpty().withMessage('Load case name is required'),
    body('type')
      .isIn(['dead', 'live', 'wind', 'snow', 'seismic', 'temperature', 'other'])
      .withMessage('Invalid load case type'),
    body('factor').optional().isNumeric().withMessage('Factor must be a number'),
    body('description').optional().isString().withMessage('Description must be a string')
  ],
  modelController.addLoadCase
);

/**
 * @route POST /api/models/:projectId/loadCombinations
 * @desc Add load combination to structural model
 * @access Private
 */
router.post(
  '/:projectId/loadCombinations',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    body('id').notEmpty().withMessage('Load combination ID is required'),
    body('name').notEmpty().withMessage('Load combination name is required'),
    body('type')
      .isIn(['ultimate', 'serviceability', 'other'])
      .withMessage('Invalid load combination type'),
    body('factors')
      .isObject()
      .withMessage('Factors must be an object with load case IDs as keys and factors as values'),
    body('description').optional().isString().withMessage('Description must be a string')
  ],
  modelController.addLoadCombination
);

/**
 * @route POST /api/models/:projectId/nodes/:nodeId/loads
 * @desc Add load to node
 * @access Private
 */
router.post(
  '/:projectId/nodes/:nodeId/loads',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    param('nodeId').notEmpty().withMessage('Node ID is required'),
    body('loadCase').notEmpty().withMessage('Load case is required'),
    body('fx').optional().isNumeric().withMessage('Fx must be a number'),
    body('fy').optional().isNumeric().withMessage('Fy must be a number'),
    body('fz').optional().isNumeric().withMessage('Fz must be a number'),
    body('mx').optional().isNumeric().withMessage('Mx must be a number'),
    body('my').optional().isNumeric().withMessage('My must be a number'),
    body('mz').optional().isNumeric().withMessage('Mz must be a number')
  ],
  modelController.addNodeLoad
);

/**
 * @route DELETE /api/models/:projectId/:elementType/:elementId
 * @desc Delete element from structural model
 * @access Private
 */
router.delete(
  '/:projectId/:elementType/:elementId',
  [
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    param('elementType')
      .isIn(['nodes', 'beams', 'plates', 'materials', 'sections', 'loadCases', 'loadCombinations'])
      .withMessage('Invalid element type'),
    param('elementId').notEmpty().withMessage('Element ID is required')
  ],
  modelController.deleteElement
);

module.exports = router;
const User = require('../models/user.model');
const Project = require('../models/project.model');
const { validationResult } = require('express-validator');

/**
 * Get user settings
 * @route GET /api/settings/user
 * @access Private
 */
exports.getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Get user settings error:', error);
    res.status(500).json({ message: 'Server error retrieving user settings' });
  }
};

/**
 * Update user settings
 * @route PUT /api/settings/user
 * @access Private
 */
exports.updateUserSettings = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { preferences } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update preferences
    user.preferences = {
      ...user.preferences,
      ...preferences
    };
    
    await user.save();
    
    res.json({
      message: 'User settings updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update user settings error:', error);
    res.status(500).json({ message: 'Server error updating user settings' });
  }
};

/**
 * Get project settings
 * @route GET /api/settings/project/:projectId
 * @access Private
 */
exports.getProjectSettings = async (req, res) => {
  try {
    // Find project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has access to the project
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    res.json({
      settings: project.settings
    });
  } catch (error) {
    console.error('Get project settings error:', error);
    res.status(500).json({ message: 'Server error retrieving project settings' });
  }
};

/**
 * Update project settings
 * @route PUT /api/settings/project/:projectId
 * @access Private
 */
exports.updateProjectSettings = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { settings } = req.body;
    
    // Find project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has access to the project
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && 
        ['editor', 'admin'].includes(c.role)
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }
    
    // Update settings
    project.settings = {
      ...project.settings,
      ...settings
    };
    
    await project.save();
    
    res.json({
      message: 'Project settings updated successfully',
      settings: project.settings
    });
  } catch (error) {
    console.error('Update project settings error:', error);
    res.status(500).json({ message: 'Server error updating project settings' });
  }
};

/**
 * Get available design codes
 * @route GET /api/settings/design-codes
 * @access Private
 */
exports.getDesignCodes = async (req, res) => {
  try {
    // Return list of available design codes
    const designCodes = [
      {
        id: 'aisc-360-16',
        name: 'AISC 360-16',
        description: 'American Institute of Steel Construction - Specification for Structural Steel Buildings (2016)',
        type: 'steel',
        country: 'USA',
        year: 2016
      },
      {
        id: 'aisc-360-10',
        name: 'AISC 360-10',
        description: 'American Institute of Steel Construction - Specification for Structural Steel Buildings (2010)',
        type: 'steel',
        country: 'USA',
        year: 2010
      },
      {
        id: 'eurocode-3',
        name: 'Eurocode 3',
        description: 'European Standard for the Design of Steel Structures (EN 1993)',
        type: 'steel',
        country: 'EU',
        year: 2005
      },
      {
        id: 'is-800-2007',
        name: 'IS 800:2007',
        description: 'Indian Standard - General Construction in Steel - Code of Practice',
        type: 'steel',
        country: 'India',
        year: 2007
      },
      {
        id: 'aci-318-19',
        name: 'ACI 318-19',
        description: 'American Concrete Institute - Building Code Requirements for Structural Concrete',
        type: 'concrete',
        country: 'USA',
        year: 2019
      },
      {
        id: 'eurocode-2',
        name: 'Eurocode 2',
        description: 'European Standard for the Design of Concrete Structures (EN 1992)',
        type: 'concrete',
        country: 'EU',
        year: 2004
      },
      {
        id: 'is-456-2000',
        name: 'IS 456:2000',
        description: 'Indian Standard - Plain and Reinforced Concrete - Code of Practice',
        type: 'concrete',
        country: 'India',
        year: 2000
      },
      {
        id: 'asce-7-16',
        name: 'ASCE 7-16',
        description: 'American Society of Civil Engineers - Minimum Design Loads for Buildings and Other Structures',
        type: 'loads',
        country: 'USA',
        year: 2016
      },
      {
        id: 'eurocode-1',
        name: 'Eurocode 1',
        description: 'European Standard for Actions on Structures (EN 1991)',
        type: 'loads',
        country: 'EU',
        year: 2002
      },
      {
        id: 'is-875-1987',
        name: 'IS 875:1987',
        description: 'Indian Standard - Code of Practice for Design Loads for Buildings and Structures',
        type: 'loads',
        country: 'India',
        year: 1987
      }
    ];
    
    res.json(designCodes);
  } catch (error) {
    console.error('Get design codes error:', error);
    res.status(500).json({ message: 'Server error retrieving design codes' });
  }
};
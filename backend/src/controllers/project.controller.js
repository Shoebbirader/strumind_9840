const Project = require('../models/project.model');
const StructuralModel = require('../models/structuralModel.model');
const { validationResult } = require('express-validator');

/**
 * Get all projects for the current user
 * @route GET /api/projects
 * @access Private
 */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'collaborators.user': req.user.id }
      ]
    }).sort({ updatedAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error retrieving projects' });
  }
};

/**
 * Get a single project by ID
 * @route GET /api/projects/:id
 * @access Private
 */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has access to this project
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error retrieving project' });
  }
};

/**
 * Create a new project
 * @route POST /api/projects
 * @access Private
 */
exports.createProject = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, type, thumbnail, tags } = req.body;
    
    // Create new project
    const project = new Project({
      name,
      description,
      type,
      thumbnail,
      tags,
      owner: req.user.id,
      status: 'draft'
    });
    
    await project.save();
    
    // Create initial empty structural model
    const structuralModel = new StructuralModel({
      project: project._id,
      version: 1,
      nodes: [],
      materials: [
        {
          id: 'M1',
          name: 'Steel',
          type: 'steel',
          properties: {
            elasticModulus: 200000,
            shearModulus: 76923,
            poissonRatio: 0.3,
            density: 7850,
            thermalExpansion: 1.2e-5,
            yieldStrength: 250,
            ultimateStrength: 400
          },
          color: '#808080'
        }
      ],
      sections: [
        {
          id: 'S1',
          name: 'IPE 200',
          type: 'I',
          material: 'M1',
          properties: {
            area: 2850,
            momentOfInertiaY: 19.4e6,
            momentOfInertiaZ: 1.42e6,
            torsionalConstant: 70e3,
            sectionModulusY: 194e3,
            sectionModulusZ: 28.5e3,
            plasticModulusY: 220e3,
            plasticModulusZ: 44.6e3,
            shearAreaY: 1400,
            shearAreaZ: 1400,
            radiusOfGyrationY: 82.6,
            radiusOfGyrationZ: 22.4
          },
          dimensions: {
            height: 200,
            width: 100,
            webThickness: 5.6,
            flangeThickness: 8.5
          }
        }
      ],
      beams: [],
      plates: [],
      loadCases: [
        {
          id: 'LC1',
          name: 'Dead Load',
          type: 'dead',
          factor: 1.0,
          description: 'Self-weight and permanent loads'
        }
      ],
      loadCombinations: [],
      metadata: {
        createdBy: req.user.id,
        lastModifiedBy: req.user.id
      }
    });
    
    await structuralModel.save();
    
    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error creating project' });
  }
};

/**
 * Update a project
 * @route PUT /api/projects/:id
 * @access Private
 */
exports.updateProject = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, description, type, status, thumbnail, tags, settings } = req.body;
    
    // Find project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is owner or admin collaborator
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && c.role === 'admin'
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    // Update fields if provided
    if (name) project.name = name;
    if (description) project.description = description;
    if (type) project.type = type;
    if (status) project.status = status;
    if (thumbnail) project.thumbnail = thumbnail;
    if (tags) project.tags = tags;
    if (settings) {
      project.settings = {
        ...project.settings,
        ...settings
      };
    }
    
    await project.save();
    
    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error updating project' });
  }
};

/**
 * Delete a project
 * @route DELETE /api/projects/:id
 * @access Private
 */
exports.deleteProject = async (req, res) => {
  try {
    // Find project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    // Delete associated structural model
    await StructuralModel.deleteMany({ project: project._id });
    
    // Delete project
    await project.remove();
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error deleting project' });
  }
};

/**
 * Duplicate a project
 * @route POST /api/projects/:id/duplicate
 * @access Private
 */
exports.duplicateProject = async (req, res) => {
  try {
    // Find original project
    const originalProject = await Project.findById(req.params.id);
    
    if (!originalProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has access to this project
    if (
      originalProject.owner.toString() !== req.user.id &&
      !originalProject.collaborators.some(c => c.user.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to duplicate this project' });
    }
    
    // Create new project based on original
    const newProject = new Project({
      name: `${originalProject.name} (Copy)`,
      description: originalProject.description,
      type: originalProject.type,
      thumbnail: originalProject.thumbnail,
      tags: originalProject.tags,
      owner: req.user.id,
      status: 'draft',
      settings: originalProject.settings,
      stats: originalProject.stats
    });
    
    await newProject.save();
    
    // Find original structural model
    const originalModel = await StructuralModel.findOne({ project: originalProject._id });
    
    if (originalModel) {
      // Create new structural model based on original
      const newModel = new StructuralModel({
        project: newProject._id,
        version: 1,
        nodes: originalModel.nodes,
        materials: originalModel.materials,
        sections: originalModel.sections,
        beams: originalModel.beams,
        plates: originalModel.plates,
        loadCases: originalModel.loadCases,
        loadCombinations: originalModel.loadCombinations,
        metadata: {
          createdBy: req.user.id,
          lastModifiedBy: req.user.id,
          modelOrigin: originalModel.metadata.modelOrigin,
          gridSettings: originalModel.metadata.gridSettings
        }
      });
      
      await newModel.save();
    }
    
    res.status(201).json({
      message: 'Project duplicated successfully',
      project: newProject
    });
  } catch (error) {
    console.error('Duplicate project error:', error);
    res.status(500).json({ message: 'Server error duplicating project' });
  }
};

/**
 * Add a collaborator to a project
 * @route POST /api/projects/:id/collaborators
 * @access Private
 */
exports.addCollaborator = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    // Find project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is owner or admin collaborator
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && c.role === 'admin'
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to add collaborators to this project' });
    }
    
    // Check if user is already a collaborator
    if (project.collaborators.some(c => c.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }
    
    // Add collaborator
    project.collaborators.push({
      user: userId,
      role: role || 'viewer'
    });
    
    await project.save();
    
    res.json({
      message: 'Collaborator added successfully',
      project
    });
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({ message: 'Server error adding collaborator' });
  }
};

/**
 * Remove a collaborator from a project
 * @route DELETE /api/projects/:id/collaborators/:userId
 * @access Private
 */
exports.removeCollaborator = async (req, res) => {
  try {
    // Find project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is owner or admin collaborator
    if (
      project.owner.toString() !== req.user.id &&
      !project.collaborators.some(c => 
        c.user.toString() === req.user.id && c.role === 'admin'
      )
    ) {
      return res.status(403).json({ message: 'Not authorized to remove collaborators from this project' });
    }
    
    // Remove collaborator
    project.collaborators = project.collaborators.filter(
      c => c.user.toString() !== req.params.userId
    );
    
    await project.save();
    
    res.json({
      message: 'Collaborator removed successfully',
      project
    });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({ message: 'Server error removing collaborator' });
  }
};
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['Building Frame', 'Bridge', 'Truss', 'Industrial', 'Other'],
    default: 'Building Frame'
  },
  status: {
    type: String,
    enum: ['draft', 'running', 'completed', 'error'],
    default: 'draft'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    }
  }],
  thumbnail: {
    type: String,
    default: ''
  },
  stats: {
    nodes: {
      type: Number,
      default: 0
    },
    elements: {
      type: Number,
      default: 0
    },
    materials: {
      type: Number,
      default: 0
    },
    loadCases: {
      type: Number,
      default: 0
    }
  },
  settings: {
    units: {
      length: {
        type: String,
        enum: ['m', 'mm', 'ft', 'in'],
        default: 'm'
      },
      force: {
        type: String,
        enum: ['N', 'kN', 'lbf', 'kip'],
        default: 'kN'
      },
      temperature: {
        type: String,
        enum: ['C', 'F', 'K'],
        default: 'C'
      }
    },
    gridSpacing: {
      type: Number,
      default: 1.0
    },
    snapEnabled: {
      type: Boolean,
      default: true
    },
    defaultMaterial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material'
    },
    defaultSection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section'
    }
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Virtual for model reference
projectSchema.virtual('model', {
  ref: 'StructuralModel',
  localField: '_id',
  foreignField: 'project',
  justOne: true
});

// Virtual for analysis configurations reference
projectSchema.virtual('analysisConfigurations', {
  ref: 'AnalysisConfiguration',
  localField: '_id',
  foreignField: 'project'
});

// Virtual for analysis results reference
projectSchema.virtual('analysisResults', {
  ref: 'AnalysisResult',
  localField: '_id',
  foreignField: 'project'
});

// Method to update project stats
projectSchema.methods.updateStats = async function(model) {
  if (!model) return;
  
  this.stats = {
    nodes: model.nodes?.length || 0,
    elements: (model.beams?.length || 0) + (model.plates?.length || 0),
    materials: model.materials?.length || 0,
    loadCases: model.loadCases?.length || 0
  };
  
  await this.save();
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
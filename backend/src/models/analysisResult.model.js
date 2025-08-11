const mongoose = require('mongoose');

// Node Result Schema
const nodeResultSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true
  },
  displacements: {
    dx: { type: Number, default: 0 },
    dy: { type: Number, default: 0 },
    dz: { type: Number, default: 0 },
    rx: { type: Number, default: 0 },
    ry: { type: Number, default: 0 },
    rz: { type: Number, default: 0 }
  },
  reactions: {
    fx: { type: Number, default: 0 },
    fy: { type: Number, default: 0 },
    fz: { type: Number, default: 0 },
    mx: { type: Number, default: 0 },
    my: { type: Number, default: 0 },
    mz: { type: Number, default: 0 }
  }
});

// Beam Result Schema
const beamResultSchema = new mongoose.Schema({
  beamId: {
    type: String,
    required: true
  },
  stations: [{
    position: { type: Number, required: true }, // 0 to 1 along beam length
    forces: {
      axial: { type: Number, default: 0 },
      shearY: { type: Number, default: 0 },
      shearZ: { type: Number, default: 0 },
      torsion: { type: Number, default: 0 },
      momentY: { type: Number, default: 0 },
      momentZ: { type: Number, default: 0 }
    },
    stresses: {
      axial: { type: Number, default: 0 },
      bendingY: { type: Number, default: 0 },
      bendingZ: { type: Number, default: 0 },
      shearY: { type: Number, default: 0 },
      shearZ: { type: Number, default: 0 },
      torsional: { type: Number, default: 0 },
      vonMises: { type: Number, default: 0 }
    },
    displacements: {
      dx: { type: Number, default: 0 },
      dy: { type: Number, default: 0 },
      dz: { type: Number, default: 0 },
      rx: { type: Number, default: 0 },
      ry: { type: Number, default: 0 },
      rz: { type: Number, default: 0 }
    }
  }]
});

// Plate Result Schema
const plateResultSchema = new mongoose.Schema({
  plateId: {
    type: String,
    required: true
  },
  results: [{
    nodeId: { type: String, required: true },
    displacements: {
      dx: { type: Number, default: 0 },
      dy: { type: Number, default: 0 },
      dz: { type: Number, default: 0 },
      rx: { type: Number, default: 0 },
      ry: { type: Number, default: 0 },
      rz: { type: Number, default: 0 }
    },
    stresses: {
      sxx: { type: Number, default: 0 }, // Normal stress in x direction
      syy: { type: Number, default: 0 }, // Normal stress in y direction
      sxy: { type: Number, default: 0 }, // Shear stress in xy plane
      svm: { type: Number, default: 0 }, // von Mises stress
      s1: { type: Number, default: 0 },  // Principal stress 1
      s2: { type: Number, default: 0 },  // Principal stress 2
      angle: { type: Number, default: 0 } // Principal stress angle
    },
    moments: {
      mxx: { type: Number, default: 0 }, // Bending moment about x axis
      myy: { type: Number, default: 0 }, // Bending moment about y axis
      mxy: { type: Number, default: 0 }  // Twisting moment
    },
    forces: {
      nxx: { type: Number, default: 0 }, // Normal force in x direction
      nyy: { type: Number, default: 0 }, // Normal force in y direction
      nxy: { type: Number, default: 0 }  // Shear force in xy plane
    }
  }]
});

// Modal Analysis Result Schema
const modalResultSchema = new mongoose.Schema({
  modeNumber: {
    type: Number,
    required: true
  },
  frequency: {
    type: Number,
    required: true
  },
  period: {
    type: Number,
    required: true
  },
  massParticipation: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 },
    rx: { type: Number, default: 0 },
    ry: { type: Number, default: 0 },
    rz: { type: Number, default: 0 }
  },
  nodeResults: [{
    nodeId: { type: String, required: true },
    displacements: {
      dx: { type: Number, default: 0 },
      dy: { type: Number, default: 0 },
      dz: { type: Number, default: 0 },
      rx: { type: Number, default: 0 },
      ry: { type: Number, default: 0 },
      rz: { type: Number, default: 0 }
    }
  }]
});

// Load Case Result Schema
const loadCaseResultSchema = new mongoose.Schema({
  loadCaseId: {
    type: String,
    required: true
  },
  nodeResults: [nodeResultSchema],
  beamResults: [beamResultSchema],
  plateResults: [plateResultSchema]
});

// Main Analysis Result Schema
const analysisResultSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  configuration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalysisConfiguration',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  errorMessage: {
    type: String
  },
  summary: {
    maxDisplacement: {
      value: { type: Number },
      nodeId: { type: String },
      loadCase: { type: String }
    },
    maxStress: {
      value: { type: Number },
      elementId: { type: String },
      elementType: { type: String },
      loadCase: { type: String }
    },
    maxReaction: {
      value: { type: Number },
      nodeId: { type: String },
      loadCase: { type: String }
    }
  },
  loadCaseResults: [loadCaseResultSchema],
  modalResults: [modalResultSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Method to get node displacement for a specific load case
analysisResultSchema.methods.getNodeDisplacements = function(loadCaseId) {
  const loadCaseResult = this.loadCaseResults.find(lcr => lcr.loadCaseId === loadCaseId);
  if (!loadCaseResult) return [];
  
  return loadCaseResult.nodeResults.map(nr => ({
    nodeId: nr.nodeId,
    displacements: nr.displacements
  }));
};

// Method to get beam forces for a specific load case
analysisResultSchema.methods.getBeamForces = function(loadCaseId) {
  const loadCaseResult = this.loadCaseResults.find(lcr => lcr.loadCaseId === loadCaseId);
  if (!loadCaseResult) return [];
  
  return loadCaseResult.beamResults.map(br => ({
    beamId: br.beamId,
    stations: br.stations.map(s => ({
      position: s.position,
      forces: s.forces
    }))
  }));
};

// Method to get modal frequencies
analysisResultSchema.methods.getModalFrequencies = function() {
  return this.modalResults.map(mr => ({
    modeNumber: mr.modeNumber,
    frequency: mr.frequency,
    period: mr.period,
    massParticipation: mr.massParticipation
  }));
};

const AnalysisResult = mongoose.model('AnalysisResult', analysisResultSchema);

module.exports = AnalysisResult;
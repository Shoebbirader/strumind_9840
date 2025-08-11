const mongoose = require('mongoose');

// Node Schema
const nodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true }
  },
  restraints: {
    dx: { type: Boolean, default: false },
    dy: { type: Boolean, default: false },
    dz: { type: Boolean, default: false },
    rx: { type: Boolean, default: false },
    ry: { type: Boolean, default: false },
    rz: { type: Boolean, default: false }
  },
  loads: [{
    loadCase: { type: String, required: true },
    fx: { type: Number, default: 0 },
    fy: { type: Number, default: 0 },
    fz: { type: Number, default: 0 },
    mx: { type: Number, default: 0 },
    my: { type: Number, default: 0 },
    mz: { type: Number, default: 0 }
  }]
});

// Material Schema
const materialSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['steel', 'concrete', 'timber', 'aluminum', 'other'],
    default: 'steel'
  },
  properties: {
    elasticModulus: { type: Number, required: true }, // E
    shearModulus: { type: Number }, // G
    poissonRatio: { type: Number }, // ν
    density: { type: Number }, // ρ
    thermalExpansion: { type: Number }, // α
    yieldStrength: { type: Number }, // fy
    ultimateStrength: { type: Number }, // fu
    compressionStrength: { type: Number } // fc (for concrete)
  },
  color: {
    type: String,
    default: '#808080'
  }
});

// Section Schema
const sectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['I', 'H', 'C', 'L', 'T', 'rectangular', 'circular', 'pipe', 'tube', 'custom'],
    default: 'I'
  },
  material: {
    type: String,
    required: true
  },
  properties: {
    area: { type: Number }, // A
    momentOfInertiaY: { type: Number }, // Iy
    momentOfInertiaZ: { type: Number }, // Iz
    torsionalConstant: { type: Number }, // J
    sectionModulusY: { type: Number }, // Sy
    sectionModulusZ: { type: Number }, // Sz
    plasticModulusY: { type: Number }, // Zy
    plasticModulusZ: { type: Number }, // Zz
    shearAreaY: { type: Number }, // Ay
    shearAreaZ: { type: Number }, // Az
    radiusOfGyrationY: { type: Number }, // ry
    radiusOfGyrationZ: { type: Number } // rz
  },
  dimensions: {
    // For standard sections
    height: { type: Number }, // h
    width: { type: Number }, // b
    webThickness: { type: Number }, // tw
    flangeThickness: { type: Number }, // tf
    // For circular sections
    diameter: { type: Number }, // d
    thickness: { type: Number }, // t (for pipes/tubes)
    // For custom sections
    customProperties: { type: mongoose.Schema.Types.Mixed }
  }
});

// Beam Element Schema
const beamSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  startNode: {
    type: String,
    required: true
  },
  endNode: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  orientation: {
    angle: { type: Number, default: 0 } // Rotation angle in degrees
  },
  releases: {
    startNode: {
      dx: { type: Boolean, default: false },
      dy: { type: Boolean, default: false },
      dz: { type: Boolean, default: false },
      rx: { type: Boolean, default: false },
      ry: { type: Boolean, default: false },
      rz: { type: Boolean, default: false }
    },
    endNode: {
      dx: { type: Boolean, default: false },
      dy: { type: Boolean, default: false },
      dz: { type: Boolean, default: false },
      rx: { type: Boolean, default: false },
      ry: { type: Boolean, default: false },
      rz: { type: Boolean, default: false }
    }
  },
  loads: [{
    loadCase: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['point', 'uniform', 'linear', 'temperature', 'strain'],
      required: true 
    },
    direction: { 
      type: String, 
      enum: ['global-x', 'global-y', 'global-z', 'local-x', 'local-y', 'local-z'],
      default: 'global-y'
    },
    // For point loads
    position: { type: Number }, // Distance from start node (0-1)
    value: { type: Number },
    // For distributed loads
    startValue: { type: Number },
    endValue: { type: Number },
    // For temperature loads
    topTemperature: { type: Number },
    bottomTemperature: { type: Number }
  }],
  offsets: {
    start: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 }
    },
    end: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 }
    }
  }
});

// Plate Element Schema
const plateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  nodes: [{
    type: String,
    required: true
  }],
  material: {
    type: String,
    required: true
  },
  thickness: {
    type: Number,
    required: true
  },
  loads: [{
    loadCase: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['pressure', 'temperature', 'strain'],
      required: true 
    },
    direction: { 
      type: String, 
      enum: ['global-x', 'global-y', 'global-z', 'local-z'],
      default: 'local-z'
    },
    value: { type: Number },
    // For temperature loads
    topTemperature: { type: Number },
    bottomTemperature: { type: Number }
  }],
  localAxis: {
    angle: { type: Number, default: 0 } // Rotation angle in degrees
  }
});

// Load Case Schema
const loadCaseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['dead', 'live', 'wind', 'snow', 'seismic', 'temperature', 'other'],
    default: 'dead'
  },
  factor: {
    type: Number,
    default: 1.0
  },
  description: {
    type: String
  }
});

// Load Combination Schema
const loadCombinationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['ultimate', 'serviceability', 'other'],
    default: 'ultimate'
  },
  factors: {
    type: Map,
    of: Number
  },
  description: {
    type: String
  }
});

// Main Structural Model Schema
const structuralModelSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  nodes: [nodeSchema],
  materials: [materialSchema],
  sections: [sectionSchema],
  beams: [beamSchema],
  plates: [plateSchema],
  loadCases: [loadCaseSchema],
  loadCombinations: [loadCombinationSchema],
  metadata: {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    modelOrigin: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 }
    },
    gridSettings: {
      enabled: { type: Boolean, default: true },
      spacing: { type: Number, default: 1.0 },
      snapToGrid: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

// Method to get element by ID
structuralModelSchema.methods.getElementById = function(id) {
  // Check nodes
  const node = this.nodes.find(n => n.id === id);
  if (node) return { type: 'node', element: node };
  
  // Check beams
  const beam = this.beams.find(b => b.id === id);
  if (beam) return { type: 'beam', element: beam };
  
  // Check plates
  const plate = this.plates.find(p => p.id === id);
  if (plate) return { type: 'plate', element: plate };
  
  // Check materials
  const material = this.materials.find(m => m.id === id);
  if (material) return { type: 'material', element: material };
  
  // Check sections
  const section = this.sections.find(s => s.id === id);
  if (section) return { type: 'section', element: section };
  
  // Check load cases
  const loadCase = this.loadCases.find(lc => lc.id === id);
  if (loadCase) return { type: 'loadCase', element: loadCase };
  
  // Check load combinations
  const loadCombination = this.loadCombinations.find(lc => lc.id === id);
  if (loadCombination) return { type: 'loadCombination', element: loadCombination };
  
  return null;
};

// Method to get node coordinates
structuralModelSchema.methods.getNodeCoordinates = function() {
  return this.nodes.map(node => ({
    id: node.id,
    x: node.coordinates.x,
    y: node.coordinates.y,
    z: node.coordinates.z
  }));
};

// Method to get beam connectivity
structuralModelSchema.methods.getBeamConnectivity = function() {
  return this.beams.map(beam => ({
    id: beam.id,
    startNode: beam.startNode,
    endNode: beam.endNode,
    section: beam.section
  }));
};

const StructuralModel = mongoose.model('StructuralModel', structuralModelSchema);

module.exports = StructuralModel;
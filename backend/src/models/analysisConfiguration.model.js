const mongoose = require('mongoose');

const analysisConfigurationSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  analysisType: {
    type: String,
    enum: ['static', 'modal', 'buckling', 'nonlinear', 'dynamic', 'timeHistory', 'responseSpectrum'],
    default: 'static'
  },
  solverType: {
    type: String,
    enum: ['direct', 'iterative'],
    default: 'direct'
  },
  precision: {
    type: String,
    enum: ['single', 'double'],
    default: 'double'
  },
  includePDelta: {
    type: Boolean,
    default: false
  },
  includeShearDeformation: {
    type: Boolean,
    default: true
  },
  largeDisplacement: {
    type: Boolean,
    default: false
  },
  modalOptions: {
    numberOfModes: {
      type: Number,
      default: 10
    },
    maxFrequency: {
      type: Number,
      default: 100
    },
    massParticipation: {
      type: Number,
      default: 90
    }
  },
  convergence: {
    forceTolerance: {
      type: Number,
      default: 1e-6
    },
    displacementTolerance: {
      type: Number,
      default: 1e-6
    },
    maxIterations: {
      type: Number,
      default: 100
    }
  },
  performance: {
    memoryLimit: {
      type: Number,
      default: 4
    },
    cpuCores: {
      type: Number,
      default: 4
    },
    diskCache: {
      type: Number,
      default: 1024
    },
    parallelProcessing: {
      type: Boolean,
      default: true
    },
    gpuAcceleration: {
      type: Boolean,
      default: false
    },
    optimizeMemory: {
      type: Boolean,
      default: true
    }
  },
  output: {
    detailedReport: {
      type: Boolean,
      default: true
    },
    exportCSV: {
      type: Boolean,
      default: false
    },
    saveAnimationFrames: {
      type: Boolean,
      default: false
    },
    includeReactions: {
      type: Boolean,
      default: true
    }
  },
  solverSettings: {
    matrixStorage: {
      type: String,
      enum: ['sparse', 'dense', 'skyline'],
      default: 'sparse'
    },
    matrixReordering: {
      type: String,
      enum: ['automatic', 'amd', 'rcm', 'metis', 'none'],
      default: 'automatic'
    },
    matrixScaling: {
      type: Boolean,
      default: true
    },
    checkSingularity: {
      type: Boolean,
      default: true
    },
    directSolver: {
      pivoting: {
        type: String,
        enum: ['partial', 'complete', 'none'],
        default: 'partial'
      },
      pivotThreshold: {
        type: Number,
        default: 1e-8
      },
      fillInReduction: {
        type: Number,
        default: 80
      },
      outOfCore: {
        type: Boolean,
        default: false
      },
      iterativeRefinement: {
        type: Boolean,
        default: true
      }
    },
    iterativeSolver: {
      method: {
        type: String,
        enum: ['pcg', 'gmres', 'bicgstab', 'minres'],
        default: 'pcg'
      },
      preconditioner: {
        type: String,
        enum: ['none', 'jacobi', 'ilu', 'ssor', 'amg'],
        default: 'ilu'
      },
      tolerance: {
        type: Number,
        default: 1e-8
      },
      maxIterations: {
        type: Number,
        default: 1000
      },
      restartParameter: {
        type: Number,
        default: 30
      },
      relaxationFactor: {
        type: Number,
        default: 1.0
      }
    },
    eigenSolver: {
      tolerance: {
        type: Number,
        default: 1e-10
      },
      maxIterations: {
        type: Number,
        default: 300
      },
      blockSize: {
        type: Number,
        default: 5
      },
      shiftInvert: {
        type: Boolean,
        default: true
      },
      normalizeEigenvectors: {
        type: Boolean,
        default: true
      }
    },
    advanced: {
      memoryPoolSize: {
        type: Number,
        default: 2048
      },
      threadPoolSize: {
        type: Number,
        default: 4
      },
      enableDiagnostics: {
        type: Boolean,
        default: false
      },
      mixedPrecision: {
        type: Boolean,
        default: false
      },
      progressMonitoring: {
        type: Boolean,
        default: true
      }
    }
  },
  loadCasesToAnalyze: [{
    type: String,
    required: true
  }],
  loadCombinationsToAnalyze: [{
    type: String,
    required: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const AnalysisConfiguration = mongoose.model('AnalysisConfiguration', analysisConfigurationSchema);

module.exports = AnalysisConfiguration;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analysisAPI, resultsAPI } from '../../services/api';

// Async thunks for analysis configurations
export const getConfigurations = createAsyncThunk(
  'analysis/getConfigurations',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await analysisAPI.getConfigurations(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get configurations'
      );
    }
  }
);

export const createConfiguration = createAsyncThunk(
  'analysis/createConfiguration',
  async ({ projectId, configData }, { rejectWithValue }) => {
    try {
      const response = await analysisAPI.createConfiguration(projectId, configData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create configuration'
      );
    }
  }
);

export const updateConfiguration = createAsyncThunk(
  'analysis/updateConfiguration',
  async ({ configId, configData }, { rejectWithValue }) => {
    try {
      const response = await analysisAPI.updateConfiguration(configId, configData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update configuration'
      );
    }
  }
);

export const deleteConfiguration = createAsyncThunk(
  'analysis/deleteConfiguration',
  async (configId, { rejectWithValue }) => {
    try {
      const response = await analysisAPI.deleteConfiguration(configId);
      return { configId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete configuration'
      );
    }
  }
);

export const runAnalysis = createAsyncThunk(
  'analysis/runAnalysis',
  async (configId, { rejectWithValue }) => {
    try {
      const response = await analysisAPI.runAnalysis(configId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to run analysis'
      );
    }
  }
);

// Async thunks for analysis results
export const getResults = createAsyncThunk(
  'analysis/getResults',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await analysisAPI.getResults(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get results'
      );
    }
  }
);

export const getResultById = createAsyncThunk(
  'analysis/getResultById',
  async (resultId, { rejectWithValue }) => {
    try {
      const response = await analysisAPI.getResultById(resultId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get result'
      );
    }
  }
);

export const deleteResult = createAsyncThunk(
  'analysis/deleteResult',
  async (resultId, { rejectWithValue }) => {
    try {
      const response = await analysisAPI.deleteResult(resultId);
      return { resultId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete result'
      );
    }
  }
);

// Async thunks for result details
export const getDisplacements = createAsyncThunk(
  'analysis/getDisplacements',
  async ({ resultId, loadCase }, { rejectWithValue }) => {
    try {
      const response = await resultsAPI.getDisplacements(resultId, loadCase);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get displacements'
      );
    }
  }
);

export const getReactions = createAsyncThunk(
  'analysis/getReactions',
  async ({ resultId, loadCase }, { rejectWithValue }) => {
    try {
      const response = await resultsAPI.getReactions(resultId, loadCase);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get reactions'
      );
    }
  }
);

export const getBeamForces = createAsyncThunk(
  'analysis/getBeamForces',
  async ({ resultId, loadCase, beamId }, { rejectWithValue }) => {
    try {
      const response = await resultsAPI.getBeamForces(resultId, loadCase, beamId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get beam forces'
      );
    }
  }
);

export const getBeamStresses = createAsyncThunk(
  'analysis/getBeamStresses',
  async ({ resultId, loadCase, beamId }, { rejectWithValue }) => {
    try {
      const response = await resultsAPI.getBeamStresses(resultId, loadCase, beamId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get beam stresses'
      );
    }
  }
);

export const getPlateForces = createAsyncThunk(
  'analysis/getPlateForces',
  async ({ resultId, loadCase, plateId }, { rejectWithValue }) => {
    try {
      const response = await resultsAPI.getPlateForces(resultId, loadCase, plateId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get plate forces'
      );
    }
  }
);

export const getPlateStresses = createAsyncThunk(
  'analysis/getPlateStresses',
  async ({ resultId, loadCase, plateId }, { rejectWithValue }) => {
    try {
      const response = await resultsAPI.getPlateStresses(resultId, loadCase, plateId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get plate stresses'
      );
    }
  }
);

export const getModalResults = createAsyncThunk(
  'analysis/getModalResults',
  async ({ resultId, modeNumber }, { rejectWithValue }) => {
    try {
      const response = await resultsAPI.getModalResults(resultId, modeNumber);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get modal results'
      );
    }
  }
);

export const getResultSummary = createAsyncThunk(
  'analysis/getResultSummary',
  async (resultId, { rejectWithValue }) => {
    try {
      const response = await resultsAPI.getResultSummary(resultId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get result summary'
      );
    }
  }
);

// Analysis slice
const analysisSlice = createSlice({
  name: 'analysis',
  initialState: {
    configurations: [],
    currentConfiguration: null,
    results: [],
    currentResult: null,
    resultDetails: {
      displacements: null,
      reactions: null,
      beamForces: null,
      beamStresses: null,
      plateForces: null,
      plateStresses: null,
      modalResults: null,
      summary: null
    },
    selectedLoadCase: null,
    selectedModeNumber: 1,
    loading: false,
    error: null,
    message: null,
    analysisProgress: 0
  },
  reducers: {
    clearAnalysisError: (state) => {
      state.error = null;
    },
    clearAnalysisMessage: (state) => {
      state.message = null;
    },
    setCurrentConfiguration: (state, action) => {
      state.currentConfiguration = action.payload;
    },
    clearCurrentConfiguration: (state) => {
      state.currentConfiguration = null;
    },
    setCurrentResult: (state, action) => {
      state.currentResult = action.payload;
    },
    clearCurrentResult: (state) => {
      state.currentResult = null;
      state.resultDetails = {
        displacements: null,
        reactions: null,
        beamForces: null,
        beamStresses: null,
        plateForces: null,
        plateStresses: null,
        modalResults: null,
        summary: null
      };
    },
    setSelectedLoadCase: (state, action) => {
      state.selectedLoadCase = action.payload;
    },
    setSelectedModeNumber: (state, action) => {
      state.selectedModeNumber = action.payload;
    },
    clearResultDetails: (state) => {
      state.resultDetails = {
        displacements: null,
        reactions: null,
        beamForces: null,
        beamStresses: null,
        plateForces: null,
        plateStresses: null,
        modalResults: null,
        summary: null
      };
    },
    updateAnalysisProgress: (state, action) => {
      state.analysisProgress = action.payload;
    },
    clearAnalysisData: (state) => {
      state.configurations = [];
      state.currentConfiguration = null;
      state.results = [];
      state.currentResult = null;
      state.resultDetails = {
        displacements: null,
        reactions: null,
        beamForces: null,
        beamStresses: null,
        plateForces: null,
        plateStresses: null,
        modalResults: null,
        summary: null
      };
      state.selectedLoadCase = null;
      state.selectedModeNumber = 1;
      state.analysisProgress = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Configurations
      .addCase(getConfigurations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConfigurations.fulfilled, (state, action) => {
        state.loading = false;
        state.configurations = action.payload;
      })
      .addCase(getConfigurations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Configuration
      .addCase(createConfiguration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        state.configurations.unshift(action.payload.configuration);
        state.currentConfiguration = action.payload.configuration;
        state.message = action.payload.message;
      })
      .addCase(createConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Configuration
      .addCase(updateConfiguration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in configurations array
        const index = state.configurations.findIndex(c => c._id === action.payload.configuration._id);
        if (index !== -1) {
          state.configurations[index] = action.payload.configuration;
        }
        
        // Update current configuration if it's the same
        if (state.currentConfiguration && state.currentConfiguration._id === action.payload.configuration._id) {
          state.currentConfiguration = action.payload.configuration;
        }
        
        state.message = action.payload.message;
      })
      .addCase(updateConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Configuration
      .addCase(deleteConfiguration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConfiguration.fulfilled, (state, action) => {
        state.loading = false;
        state.configurations = state.configurations.filter(c => c._id !== action.payload.configId);
        
        // Clear current configuration if it's the deleted one
        if (state.currentConfiguration && state.currentConfiguration._id === action.payload.configId) {
          state.currentConfiguration = null;
        }
        
        state.message = action.payload.message;
      })
      .addCase(deleteConfiguration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Run Analysis
      .addCase(runAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.analysisProgress = 0;
      })
      .addCase(runAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // The analysis is running in the background, so we don't update the results yet
      })
      .addCase(runAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Results
      .addCase(getResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(getResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Result By ID
      .addCase(getResultById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getResultById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResult = action.payload;
        
        // Set selected load case if not already set
        if (!state.selectedLoadCase && action.payload.loadCaseResults && action.payload.loadCaseResults.length > 0) {
          state.selectedLoadCase = action.payload.loadCaseResults[0].loadCaseId;
        }
      })
      .addCase(getResultById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Result
      .addCase(deleteResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResult.fulfilled, (state, action) => {
        state.loading = false;
        state.results = state.results.filter(r => r._id !== action.payload.resultId);
        
        // Clear current result if it's the deleted one
        if (state.currentResult && state.currentResult._id === action.payload.resultId) {
          state.currentResult = null;
          state.resultDetails = {
            displacements: null,
            reactions: null,
            beamForces: null,
            beamStresses: null,
            plateForces: null,
            plateStresses: null,
            modalResults: null,
            summary: null
          };
        }
        
        state.message = action.payload.message;
      })
      .addCase(deleteResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Displacements
      .addCase(getDisplacements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDisplacements.fulfilled, (state, action) => {
        state.loading = false;
        state.resultDetails.displacements = action.payload;
      })
      .addCase(getDisplacements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Reactions
      .addCase(getReactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReactions.fulfilled, (state, action) => {
        state.loading = false;
        state.resultDetails.reactions = action.payload;
      })
      .addCase(getReactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Beam Forces
      .addCase(getBeamForces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBeamForces.fulfilled, (state, action) => {
        state.loading = false;
        state.resultDetails.beamForces = action.payload;
      })
      .addCase(getBeamForces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Beam Stresses
      .addCase(getBeamStresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBeamStresses.fulfilled, (state, action) => {
        state.loading = false;
        state.resultDetails.beamStresses = action.payload;
      })
      .addCase(getBeamStresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Plate Forces
      .addCase(getPlateForces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlateForces.fulfilled, (state, action) => {
        state.loading = false;
        state.resultDetails.plateForces = action.payload;
      })
      .addCase(getPlateForces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Plate Stresses
      .addCase(getPlateStresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlateStresses.fulfilled, (state, action) => {
        state.loading = false;
        state.resultDetails.plateStresses = action.payload;
      })
      .addCase(getPlateStresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Modal Results
      .addCase(getModalResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getModalResults.fulfilled, (state, action) => {
        state.loading = false;
        state.resultDetails.modalResults = action.payload;
      })
      .addCase(getModalResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Result Summary
      .addCase(getResultSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getResultSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.resultDetails.summary = action.payload;
      })
      .addCase(getResultSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearAnalysisError, 
  clearAnalysisMessage, 
  setCurrentConfiguration, 
  clearCurrentConfiguration,
  setCurrentResult,
  clearCurrentResult,
  setSelectedLoadCase,
  setSelectedModeNumber,
  clearResultDetails,
  updateAnalysisProgress,
  clearAnalysisData
} = analysisSlice.actions;

export default analysisSlice.reducer;
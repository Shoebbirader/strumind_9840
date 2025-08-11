import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { modelsAPI } from '../../services/api';

// Async thunks
export const getModel = createAsyncThunk(
  'model/getModel',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await modelsAPI.getModel(projectId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get model'
      );
    }
  }
);

export const updateModel = createAsyncThunk(
  'model/updateModel',
  async ({ projectId, modelData }, { rejectWithValue }) => {
    try {
      const response = await modelsAPI.updateModel(projectId, modelData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update model'
      );
    }
  }
);

export const addNode = createAsyncThunk(
  'model/addNode',
  async ({ projectId, nodeData }, { rejectWithValue }) => {
    try {
      const response = await modelsAPI.addNode(projectId, nodeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add node'
      );
    }
  }
);

export const addBeam = createAsyncThunk(
  'model/addBeam',
  async ({ projectId, beamData }, { rejectWithValue }) => {
    try {
      const response = await modelsAPI.addBeam(projectId, beamData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add beam'
      );
    }
  }
);

export const addPlate = createAsyncThunk(
  'model/addPlate',
  async ({ projectId, plateData }, { rejectWithValue }) => {
    try {
      const response = await modelsAPI.addPlate(projectId, plateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add plate'
      );
    }
  }
);

export const addMaterial = createAsyncThunk(
  'model/addMaterial',
  async ({ projectId, materialData }, { rejectWithValue }) => {
    try {
      const response = await modelsAPI.addMaterial(projectId, materialData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add material'
      );
    }
  }
);

export const addSection = createAsyncThunk(
  'model/addSection',
  async ({ projectId, sectionData }, { rejectWithValue }) => {
    try {
      const response = await modelsAPI.addSection(projectId, sectionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add section'
      );
    }
  }
);

export const addLoadCase = createAsyncThunk(
  'model/addLoadCase',
  async ({ projectId, loadCaseData }, { rejectWithValue }) => {
    try {
      const response = await modelsAPI.addLoadCase(projectId, loadCaseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add load case'
      );
    }
  }
);

export const addLoadCombination = createAsyncThunk(
  'model/addLoadCombination',
  async ({ projectId, loadCombinationData }, { rejectWithValue }) => {
    try {
      const response = await modelsAPI.addLoadCombination(projectId, loadCombinationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add load combination'
      );
    }
  }
);

export const addNodeLoad = createAsyncThunk(
  'model/addNodeLoad',
  async ({ projectId, nodeId, loadData }, { rejectWithValue }) => {
    try {
      const response = await modelsAPI.addNodeLoad(projectId, nodeId, loadData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add node load'
      );
    }
  }
);

export const deleteElement = createAsyncThunk(
  'model/deleteElement',
  async ({ projectId, elementType, elementId }, { rejectWithValue }) => {
    try {
      const response = await modelsAPI.deleteElement(projectId, elementType, elementId);
      return { elementType, elementId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete element'
      );
    }
  }
);

// Model slice
const modelSlice = createSlice({
  name: 'model',
  initialState: {
    model: null,
    selectedElements: [],
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    clearModelError: (state) => {
      state.error = null;
    },
    clearModelMessage: (state) => {
      state.message = null;
    },
    setSelectedElements: (state, action) => {
      state.selectedElements = action.payload;
    },
    clearSelectedElements: (state) => {
      state.selectedElements = [];
    },
    clearModel: (state) => {
      state.model = null;
      state.selectedElements = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Model
      .addCase(getModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getModel.fulfilled, (state, action) => {
        state.loading = false;
        state.model = action.payload;
      })
      .addCase(getModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Model
      .addCase(updateModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateModel.fulfilled, (state, action) => {
        state.loading = false;
        state.model = action.payload.model;
        state.message = action.payload.message;
      })
      .addCase(updateModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Node
      .addCase(addNode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNode.fulfilled, (state, action) => {
        state.loading = false;
        if (state.model) {
          state.model.nodes.push(action.payload.node);
        }
        state.message = action.payload.message;
      })
      .addCase(addNode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Beam
      .addCase(addBeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBeam.fulfilled, (state, action) => {
        state.loading = false;
        if (state.model) {
          state.model.beams.push(action.payload.beam);
        }
        state.message = action.payload.message;
      })
      .addCase(addBeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Plate
      .addCase(addPlate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPlate.fulfilled, (state, action) => {
        state.loading = false;
        if (state.model) {
          state.model.plates.push(action.payload.plate);
        }
        state.message = action.payload.message;
      })
      .addCase(addPlate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Material
      .addCase(addMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.loading = false;
        if (state.model) {
          state.model.materials.push(action.payload.material);
        }
        state.message = action.payload.message;
      })
      .addCase(addMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Section
      .addCase(addSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSection.fulfilled, (state, action) => {
        state.loading = false;
        if (state.model) {
          state.model.sections.push(action.payload.section);
        }
        state.message = action.payload.message;
      })
      .addCase(addSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Load Case
      .addCase(addLoadCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLoadCase.fulfilled, (state, action) => {
        state.loading = false;
        if (state.model) {
          state.model.loadCases.push(action.payload.loadCase);
        }
        state.message = action.payload.message;
      })
      .addCase(addLoadCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Load Combination
      .addCase(addLoadCombination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLoadCombination.fulfilled, (state, action) => {
        state.loading = false;
        if (state.model) {
          state.model.loadCombinations.push(action.payload.loadCombination);
        }
        state.message = action.payload.message;
      })
      .addCase(addLoadCombination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Node Load
      .addCase(addNodeLoad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNodeLoad.fulfilled, (state, action) => {
        state.loading = false;
        if (state.model) {
          // Find and update the node
          const nodeIndex = state.model.nodes.findIndex(n => n.id === action.payload.node.id);
          if (nodeIndex !== -1) {
            state.model.nodes[nodeIndex] = action.payload.node;
          }
        }
        state.message = action.payload.message;
      })
      .addCase(addNodeLoad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Element
      .addCase(deleteElement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteElement.fulfilled, (state, action) => {
        state.loading = false;
        
        if (state.model) {
          // Remove element from the appropriate array
          switch (action.payload.elementType) {
            case 'nodes':
              state.model.nodes = state.model.nodes.filter(n => n.id !== action.payload.elementId);
              break;
            case 'beams':
              state.model.beams = state.model.beams.filter(b => b.id !== action.payload.elementId);
              break;
            case 'plates':
              state.model.plates = state.model.plates.filter(p => p.id !== action.payload.elementId);
              break;
            case 'materials':
              state.model.materials = state.model.materials.filter(m => m.id !== action.payload.elementId);
              break;
            case 'sections':
              state.model.sections = state.model.sections.filter(s => s.id !== action.payload.elementId);
              break;
            case 'loadCases':
              state.model.loadCases = state.model.loadCases.filter(lc => lc.id !== action.payload.elementId);
              break;
            case 'loadCombinations':
              state.model.loadCombinations = state.model.loadCombinations.filter(lc => lc.id !== action.payload.elementId);
              break;
            default:
              break;
          }
          
          // Remove from selected elements if present
          state.selectedElements = state.selectedElements.filter(
            id => id !== `${action.payload.elementType}-${action.payload.elementId}`
          );
        }
        
        state.message = action.payload.message;
      })
      .addCase(deleteElement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearModelError, 
  clearModelMessage, 
  setSelectedElements, 
  clearSelectedElements,
  clearModel
} = modelSlice.actions;

export default modelSlice.reducer;
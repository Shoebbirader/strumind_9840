import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsAPI } from '../../services/api';

// Async thunks
export const getAllProjects = createAsyncThunk(
  'projects/getAllProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getAllProjects();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get projects'
      );
    }
  }
);

export const getProjectById = createAsyncThunk(
  'projects/getProjectById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.getProjectById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get project'
      );
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.createProject(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create project'
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.updateProject(id, projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update project'
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.deleteProject(id);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete project'
      );
    }
  }
);

export const duplicateProject = createAsyncThunk(
  'projects/duplicateProject',
  async (id, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.duplicateProject(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to duplicate project'
      );
    }
  }
);

export const addCollaborator = createAsyncThunk(
  'projects/addCollaborator',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.addCollaborator(id, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add collaborator'
      );
    }
  }
);

export const removeCollaborator = createAsyncThunk(
  'projects/removeCollaborator',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const response = await projectsAPI.removeCollaborator(projectId, userId);
      return { projectId, userId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove collaborator'
      );
    }
  }
);

// Project slice
const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    clearProjectMessage: (state) => {
      state.message = null;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Projects
      .addCase(getAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Project By ID
      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload.project);
        state.currentProject = action.payload.project;
        state.message = action.payload.message;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in projects array
        const index = state.projects.findIndex(p => p._id === action.payload.project._id);
        if (index !== -1) {
          state.projects[index] = action.payload.project;
        }
        
        // Update current project if it's the same
        if (state.currentProject && state.currentProject._id === action.payload.project._id) {
          state.currentProject = action.payload.project;
        }
        
        state.message = action.payload.message;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p._id !== action.payload.id);
        
        // Clear current project if it's the deleted one
        if (state.currentProject && state.currentProject._id === action.payload.id) {
          state.currentProject = null;
        }
        
        state.message = action.payload.message;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Duplicate Project
      .addCase(duplicateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(duplicateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload.project);
        state.message = action.payload.message;
      })
      .addCase(duplicateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Collaborator
      .addCase(addCollaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCollaborator.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in projects array
        const index = state.projects.findIndex(p => p._id === action.payload.project._id);
        if (index !== -1) {
          state.projects[index] = action.payload.project;
        }
        
        // Update current project if it's the same
        if (state.currentProject && state.currentProject._id === action.payload.project._id) {
          state.currentProject = action.payload.project;
        }
        
        state.message = action.payload.message;
      })
      .addCase(addCollaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove Collaborator
      .addCase(removeCollaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCollaborator.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in projects array
        const index = state.projects.findIndex(p => p._id === action.payload.projectId);
        if (index !== -1) {
          state.projects[index] = action.payload.data.project;
        }
        
        // Update current project if it's the same
        if (state.currentProject && state.currentProject._id === action.payload.projectId) {
          state.currentProject = action.payload.data.project;
        }
        
        state.message = action.payload.data.message;
      })
      .addCase(removeCollaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearProjectError, 
  clearProjectMessage, 
  setCurrentProject, 
  clearCurrentProject 
} = projectSlice.actions;

export default projectSlice.reducer;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const NewProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    type: '',
    template: '',
    units: 'metric',
    location: ''
  });

  const [errors, setErrors] = useState({});

  const projectTypes = [
    { value: 'Building Frame', label: 'Building Frame', description: 'Multi-story building structures' },
    { value: 'Bridge', label: 'Bridge', description: 'Bridge and overpass structures' },
    { value: 'Truss', label: 'Truss', description: 'Truss and space frame structures' },
    { value: 'Industrial', label: 'Industrial', description: 'Industrial and warehouse structures' },
    { value: 'Custom', label: 'Custom', description: 'Start with blank project' }
  ];

  const templates = {
    'Building Frame': [
      { value: 'residential-3story', label: '3-Story Residential Building' },
      { value: 'commercial-5story', label: '5-Story Commercial Building' },
      { value: 'highrise-20story', label: '20-Story High-rise Building' },
      { value: 'blank-frame', label: 'Blank Frame Structure' }
    ],
    'Bridge': [
      { value: 'simple-beam', label: 'Simple Beam Bridge' },
      { value: 'continuous-beam', label: 'Continuous Beam Bridge' },
      { value: 'truss-bridge', label: 'Truss Bridge' },
      { value: 'blank-bridge', label: 'Blank Bridge Structure' }
    ],
    'Truss': [
      { value: 'roof-truss', label: 'Roof Truss System' },
      { value: 'space-frame', label: 'Space Frame Structure' },
      { value: 'tower-truss', label: 'Tower Truss Structure' },
      { value: 'blank-truss', label: 'Blank Truss Structure' }
    ],
    'Industrial': [
      { value: 'warehouse', label: 'Warehouse Structure' },
      { value: 'factory-shed', label: 'Factory Shed' },
      { value: 'crane-beam', label: 'Crane Beam Structure' },
      { value: 'blank-industrial', label: 'Blank Industrial Structure' }
    ],
    'Custom': [
      { value: 'blank', label: 'Blank Project' }
    ]
  };

  const unitSystems = [
    { value: 'metric', label: 'Metric (kN, m, MPa)' },
    { value: 'imperial', label: 'Imperial (kip, ft, ksi)' },
    { value: 'si', label: 'SI (N, mm, Pa)' }
  ];

  const handleInputChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!projectData?.name?.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!projectData?.type) {
      newErrors.type = 'Project type is required';
    }
    
    if (!projectData?.template) {
      newErrors.template = 'Template selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const newProject = {
        id: Date.now()?.toString(),
        ...projectData,
        createdDate: new Date()?.toISOString(),
        lastModified: new Date()?.toISOString(),
        status: 'draft',
        author: 'John Engineer',
        stats: {
          nodes: 0,
          elements: 0,
          materials: 0,
          loadCases: 0
        },
        thumbnail: `https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop`
      };
      
      onCreateProject(newProject);
      handleClose();
    }
  };

  const handleClose = () => {
    setProjectData({
      name: '',
      description: '',
      type: '',
      template: '',
      units: 'metric',
      location: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const availableTemplates = projectData?.type ? templates?.[projectData?.type] || [] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-modal w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create New Project</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Set up a new structural analysis project with your preferred template and settings
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Basic Information</h3>
            
            <Input
              label="Project Name"
              type="text"
              placeholder="Enter project name"
              value={projectData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />

            <Input
              label="Description"
              type="text"
              placeholder="Brief description of the project (optional)"
              value={projectData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
            />

            <Input
              label="Location"
              type="text"
              placeholder="Project location (optional)"
              value={projectData?.location}
              onChange={(e) => handleInputChange('location', e?.target?.value)}
            />
          </div>

          {/* Project Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Project Configuration</h3>
            
            <Select
              label="Project Type"
              placeholder="Select project type"
              options={projectTypes}
              value={projectData?.type}
              onChange={(value) => {
                handleInputChange('type', value);
                handleInputChange('template', ''); // Reset template when type changes
              }}
              error={errors?.type}
              required
            />

            {projectData?.type && (
              <Select
                label="Template"
                placeholder="Select a template to start with"
                options={availableTemplates}
                value={projectData?.template}
                onChange={(value) => handleInputChange('template', value)}
                error={errors?.template}
                required
              />
            )}

            <Select
              label="Unit System"
              options={unitSystems}
              value={projectData?.units}
              onChange={(value) => handleInputChange('units', value)}
            />
          </div>

          {/* Template Preview */}
          {projectData?.template && (
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">Template Preview</h4>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-12 bg-primary/20 rounded border border-primary/30 flex items-center justify-center">
                  <Icon 
                    name={
                      projectData?.type === 'Building Frame' ? 'Building' :
                      projectData?.type === 'Bridge' ? 'Bridge' :
                      projectData?.type === 'Truss' ? 'Triangle' :
                      projectData?.type === 'Industrial'? 'Factory' : 'FileText'
                    } 
                    size={20} 
                    className="text-primary" 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {availableTemplates?.find(t => t?.value === projectData?.template)?.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {projectData?.type} • {projectData?.units?.toUpperCase()} units
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Plus"
              iconPosition="left"
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;
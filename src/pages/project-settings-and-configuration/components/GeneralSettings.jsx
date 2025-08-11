import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const GeneralSettings = ({ settings, onSettingsChange }) => {
  const coordinateSystemOptions = [
    { value: 'cartesian', label: 'Cartesian (X, Y, Z)' },
    { value: 'cylindrical', label: 'Cylindrical (R, θ, Z)' },
    { value: 'spherical', label: 'Spherical (R, θ, φ)' }
  ];

  const toleranceOptions = [
    { value: '1e-6', label: '1e-6 (High Precision)' },
    { value: '1e-5', label: '1e-5 (Standard)' },
    { value: '1e-4', label: '1e-4 (Low Precision)' },
    { value: 'custom', label: 'Custom Value' }
  ];

  const handleInputChange = (field, value) => {
    onSettingsChange('general', { ...settings?.general, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Project Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Project Name"
            type="text"
            placeholder="Enter project name"
            value={settings?.general?.projectName || ''}
            onChange={(e) => handleInputChange('projectName', e?.target?.value)}
            required
          />
          
          <Input
            label="Project Number"
            type="text"
            placeholder="e.g., PRJ-2024-001"
            value={settings?.general?.projectNumber || ''}
            onChange={(e) => handleInputChange('projectNumber', e?.target?.value)}
          />
          
          <Input
            label="Engineer Name"
            type="text"
            placeholder="Lead structural engineer"
            value={settings?.general?.engineerName || ''}
            onChange={(e) => handleInputChange('engineerName', e?.target?.value)}
            required
          />
          
          <Input
            label="Creation Date"
            type="date"
            value={settings?.general?.creationDate || ''}
            onChange={(e) => handleInputChange('creationDate', e?.target?.value)}
          />
        </div>
        
        <div className="mt-6">
          <Input
            label="Project Description"
            type="text"
            placeholder="Brief description of the structural project"
            value={settings?.general?.description || ''}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            description="Optional description for project documentation"
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Coordinate System</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Select
            label="Coordinate System Type"
            options={coordinateSystemOptions}
            value={settings?.general?.coordinateSystem || 'cartesian'}
            onChange={(value) => handleInputChange('coordinateSystem', value)}
            description="Choose the coordinate system for model geometry"
          />
          
          <div className="space-y-4">
            <Checkbox
              label="Show Grid Lines"
              checked={settings?.general?.showGrid || true}
              onChange={(e) => handleInputChange('showGrid', e?.target?.checked)}
            />
            <Checkbox
              label="Show Coordinate Axes"
              checked={settings?.general?.showAxes || true}
              onChange={(e) => handleInputChange('showAxes', e?.target?.checked)}
            />
            <Checkbox
              label="Snap to Grid"
              checked={settings?.general?.snapToGrid || false}
              onChange={(e) => handleInputChange('snapToGrid', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Model Tolerance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Select
            label="Geometric Tolerance"
            options={toleranceOptions}
            value={settings?.general?.tolerance || '1e-5'}
            onChange={(value) => handleInputChange('tolerance', value)}
            description="Precision for geometric operations and node merging"
          />
          
          {settings?.general?.tolerance === 'custom' && (
            <Input
              label="Custom Tolerance Value"
              type="number"
              placeholder="e.g., 0.001"
              value={settings?.general?.customTolerance || ''}
              onChange={(e) => handleInputChange('customTolerance', e?.target?.value)}
              description="Enter custom tolerance value"
            />
          )}
        </div>
        
        <div className="mt-4 p-4 bg-muted/20 rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Lower tolerance values provide higher precision but may increase computation time. 
            Standard tolerance (1e-5) is recommended for most structural analysis applications.
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Display Preferences</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Checkbox
              label="Auto-save Project"
              checked={settings?.general?.autoSave || true}
              onChange={(e) => handleInputChange('autoSave', e?.target?.checked)}
              description="Automatically save project every 5 minutes"
            />
            <Checkbox
              label="Show Element Labels"
              checked={settings?.general?.showElementLabels || false}
              onChange={(e) => handleInputChange('showElementLabels', e?.target?.checked)}
            />
            <Checkbox
              label="Show Node Numbers"
              checked={settings?.general?.showNodeNumbers || false}
              onChange={(e) => handleInputChange('showNodeNumbers', e?.target?.checked)}
            />
          </div>
          
          <div className="space-y-4">
            <Input
              label="Grid Spacing"
              type="number"
              placeholder="1.0"
              value={settings?.general?.gridSpacing || '1.0'}
              onChange={(e) => handleInputChange('gridSpacing', e?.target?.value)}
              description="Grid spacing in current length units"
            />
            <Input
              label="Selection Highlight Color"
              type="color"
              value={settings?.general?.selectionColor || '#2563EB'}
              onChange={(e) => handleInputChange('selectionColor', e?.target?.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
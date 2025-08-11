import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PropertiesPanel = ({ selectedItems, onPropertyChange, onAction }) => {
  const [activeTab, setActiveTab] = useState('geometry');

  // Mock data for the selected item
  const getSelectedItemData = () => {
    if (selectedItems?.length === 0) {
      return null;
    }

    const firstItem = selectedItems?.[0];
    const [type, id] = firstItem?.split('-');

    // Mock property data based on selection
    switch (type) {
      case 'nodes':
        return {
          type: 'node',
          id: id,
          name: `Node ${id}`,
          properties: {
            geometry: {
              x: '5.000',
              y: '0.000',
              z: '0.000',
              coordinateSystem: 'global'
            },
            constraints: {
              dx: false,
              dy: false,
              dz: false,
              rx: false,
              ry: false,
              rz: false
            },
            assignments: {
              support: 'none',
              spring: 'none'
            }
          }
        };
      
      case 'elements':
        return {
          type: 'element',
          id: id,
          name: `Beam ${id}`,
          properties: {
            geometry: {
              startNode: 'N1',
              endNode: 'N2',
              length: '5.000',
              orientation: '0.000'
            },
            material: {
              material: 'steel-s355',
              section: 'ipe-300'
            },
            assignments: {
              releases: 'none',
              offsets: 'none',
              localAxes: 'default'
            }
          }
        };
      
      default:
        return null;
    }
  };

  const selectedData = getSelectedItemData();

  const materialOptions = [
    { value: 'steel-s355', label: 'Steel S355' },
    { value: 'concrete-c30', label: 'Concrete C30/37' },
    { value: 'timber-c24', label: 'Timber C24' }
  ];

  const sectionOptions = [
    { value: 'ipe-300', label: 'IPE 300' },
    { value: 'hea-200', label: 'HEA 200' },
    { value: 'rect-300x500', label: '300×500 mm' }
  ];

  const supportOptions = [
    { value: 'none', label: 'None' },
    { value: 'fixed', label: 'Fixed' },
    { value: 'pinned', label: 'Pinned' },
    { value: 'roller', label: 'Roller' }
  ];

  const tabs = [
    { id: 'geometry', label: 'Geometry', icon: 'Ruler' },
    { id: 'material', label: 'Material', icon: 'Layers' },
    { id: 'assignments', label: 'Assignments', icon: 'Link' },
    { id: 'constraints', label: 'Constraints', icon: 'Lock' }
  ];

  const handleInputChange = (category, property, value) => {
    onPropertyChange(selectedItems?.[0], category, property, value);
  };

  const renderGeometryTab = () => {
    if (!selectedData) return null;

    if (selectedData?.type === 'node') {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Coordinates</h4>
            <div className="space-y-3">
              <Input
                label="X Coordinate"
                type="number"
                value={selectedData?.properties?.geometry?.x}
                onChange={(e) => handleInputChange('geometry', 'x', e?.target?.value)}
                className="text-xs"
              />
              <Input
                label="Y Coordinate"
                type="number"
                value={selectedData?.properties?.geometry?.y}
                onChange={(e) => handleInputChange('geometry', 'y', e?.target?.value)}
                className="text-xs"
              />
              <Input
                label="Z Coordinate"
                type="number"
                value={selectedData?.properties?.geometry?.z}
                onChange={(e) => handleInputChange('geometry', 'z', e?.target?.value)}
                className="text-xs"
              />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">System</h4>
            <Select
              label="Coordinate System"
              options={[
                { value: 'global', label: 'Global' },
                { value: 'local', label: 'Local' }
              ]}
              value={selectedData?.properties?.geometry?.coordinateSystem}
              onChange={(value) => handleInputChange('geometry', 'coordinateSystem', value)}
            />
          </div>
        </div>
      );
    }

    if (selectedData?.type === 'element') {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Connectivity</h4>
            <div className="space-y-3">
              <Input
                label="Start Node"
                value={selectedData?.properties?.geometry?.startNode}
                onChange={(e) => handleInputChange('geometry', 'startNode', e?.target?.value)}
                className="text-xs"
              />
              <Input
                label="End Node"
                value={selectedData?.properties?.geometry?.endNode}
                onChange={(e) => handleInputChange('geometry', 'endNode', e?.target?.value)}
                className="text-xs"
              />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Properties</h4>
            <div className="space-y-3">
              <Input
                label="Length (m)"
                type="number"
                value={selectedData?.properties?.geometry?.length}
                disabled
                className="text-xs"
              />
              <Input
                label="Orientation (°)"
                type="number"
                value={selectedData?.properties?.geometry?.orientation}
                onChange={(e) => handleInputChange('geometry', 'orientation', e?.target?.value)}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderMaterialTab = () => {
    if (!selectedData || selectedData?.type !== 'element') return null;

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Material Assignment</h4>
          <Select
            label="Material"
            options={materialOptions}
            value={selectedData?.properties?.material?.material}
            onChange={(value) => handleInputChange('material', 'material', value)}
          />
        </div>
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Section Assignment</h4>
          <Select
            label="Section"
            options={sectionOptions}
            value={selectedData?.properties?.material?.section}
            onChange={(value) => handleInputChange('material', 'section', value)}
          />
        </div>
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Material Properties</h4>
          <div className="bg-muted/30 rounded-md p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Elastic Modulus:</span>
              <span className="text-foreground font-mono">210 GPa</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Density:</span>
              <span className="text-foreground font-mono">7850 kg/m³</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Poisson's Ratio:</span>
              <span className="text-foreground font-mono">0.30</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Section Properties</h4>
          <div className="bg-muted/30 rounded-md p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Area:</span>
              <span className="text-foreground font-mono">53.8 cm²</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Iy:</span>
              <span className="text-foreground font-mono">8356 cm⁴</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Iz:</span>
              <span className="text-foreground font-mono">604 cm⁴</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAssignmentsTab = () => {
    if (!selectedData) return null;

    if (selectedData?.type === 'node') {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Support Assignment</h4>
            <Select
              label="Support Type"
              options={supportOptions}
              value={selectedData?.properties?.assignments?.support}
              onChange={(value) => handleInputChange('assignments', 'support', value)}
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Spring Assignment</h4>
            <Select
              label="Spring Type"
              options={[
                { value: 'none', label: 'None' },
                { value: 'translational', label: 'Translational' },
                { value: 'rotational', label: 'Rotational' },
                { value: 'general', label: 'General' }
              ]}
              value={selectedData?.properties?.assignments?.spring}
              onChange={(value) => handleInputChange('assignments', 'spring', value)}
            />
          </div>
        </div>
      );
    }

    if (selectedData?.type === 'element') {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Member Releases</h4>
            <Select
              label="Release Type"
              options={[
                { value: 'none', label: 'None' },
                { value: 'start-pinned', label: 'Start Pinned' },
                { value: 'end-pinned', label: 'End Pinned' },
                { value: 'both-pinned', label: 'Both Pinned' }
              ]}
              value={selectedData?.properties?.assignments?.releases}
              onChange={(value) => handleInputChange('assignments', 'releases', value)}
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Member Offsets</h4>
            <Select
              label="Offset Type"
              options={[
                { value: 'none', label: 'None' },
                { value: 'rigid', label: 'Rigid' },
                { value: 'flexible', label: 'Flexible' }
              ]}
              value={selectedData?.properties?.assignments?.offsets}
              onChange={(value) => handleInputChange('assignments', 'offsets', value)}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const renderConstraintsTab = () => {
    if (!selectedData || selectedData?.type !== 'node') return null;

    const constraints = selectedData?.properties?.constraints;
    const constraintLabels = {
      dx: 'Translation X',
      dy: 'Translation Y',
      dz: 'Translation Z',
      rx: 'Rotation X',
      ry: 'Rotation Y',
      rz: 'Rotation Z'
    };

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Restraints</h4>
          <div className="space-y-3">
            {Object.entries(constraints)?.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-xs text-foreground">{constraintLabels?.[key]}</label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleInputChange('constraints', key, e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction('apply-fixed-support')}
              className="w-full justify-start text-xs"
            >
              <Icon name="Anchor" size={14} className="mr-2" />
              Apply Fixed Support
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction('apply-pinned-support')}
              className="w-full justify-start text-xs"
            >
              <Icon name="Target" size={14} className="mr-2" />
              Apply Pinned Support
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction('remove-all-constraints')}
              className="w-full justify-start text-xs"
            >
              <Icon name="Unlock" size={14} className="mr-2" />
              Remove All Constraints
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (!selectedData) {
    return (
      <div className="h-full bg-card border-l border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="MousePointer2" size={32} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Select an element to view properties</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Properties</h3>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onAction('clear-selection')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={14} />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          {selectedData?.name} ({selectedItems?.length} selected)
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex-1 px-2 py-2 text-xs font-medium transition-colors border-b-2
                ${activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }
              `}
            >
              <Icon name={tab?.icon} size={12} className="mx-auto mb-1" />
              <div>{tab?.label}</div>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'geometry' && renderGeometryTab()}
        {activeTab === 'material' && renderMaterialTab()}
        {activeTab === 'assignments' && renderAssignmentsTab()}
        {activeTab === 'constraints' && renderConstraintsTab()}
      </div>
      {/* Footer Actions */}
      <div className="p-3 border-t border-border">
        <div className="flex space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onAction('apply-changes')}
            className="flex-1 text-xs"
          >
            <Icon name="Check" size={12} className="mr-1" />
            Apply
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction('reset-properties')}
            className="flex-1 text-xs"
          >
            <Icon name="RotateCcw" size={12} className="mr-1" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
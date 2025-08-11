import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MaterialsLibrarySettings = ({ settings, onSettingsChange }) => {
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    type: 'steel',
    elasticModulus: '',
    density: '',
    poissonRatio: '',
    yieldStrength: '',
    ultimateStrength: '',
    thermalExpansion: ''
  });

  const defaultMaterials = [
    {
      id: 'steel-fe415',
      name: 'Steel Fe 415',
      type: 'steel',
      elasticModulus: '200000',
      density: '7850',
      poissonRatio: '0.3',
      yieldStrength: '415',
      ultimateStrength: '540',
      thermalExpansion: '12e-6',
      isDefault: true
    },
    {
      id: 'steel-fe500',
      name: 'Steel Fe 500',
      type: 'steel',
      elasticModulus: '200000',
      density: '7850',
      poissonRatio: '0.3',
      yieldStrength: '500',
      ultimateStrength: '650',
      thermalExpansion: '12e-6',
      isDefault: true
    },
    {
      id: 'concrete-m25',
      name: 'Concrete M25',
      type: 'concrete',
      elasticModulus: '25000',
      density: '2500',
      poissonRatio: '0.2',
      compressiveStrength: '25',
      tensileStrength: '2.5',
      thermalExpansion: '10e-6',
      isDefault: true
    },
    {
      id: 'concrete-m30',
      name: 'Concrete M30',
      type: 'concrete',
      elasticModulus: '27386',
      density: '2500',
      poissonRatio: '0.2',
      compressiveStrength: '30',
      tensileStrength: '3.0',
      thermalExpansion: '10e-6',
      isDefault: true
    }
  ];

  const materialTypes = [
    { value: 'steel', label: 'Steel' },
    { value: 'concrete', label: 'Concrete' },
    { value: 'aluminum', label: 'Aluminum' },
    { value: 'timber', label: 'Timber' },
    { value: 'composite', label: 'Composite' },
    { value: 'other', label: 'Other' }
  ];

  const customMaterials = settings?.materials?.custom || [];
  const allMaterials = [...defaultMaterials, ...customMaterials];

  const handleAddMaterial = () => {
    if (!newMaterial?.name || !newMaterial?.elasticModulus || !newMaterial?.density) {
      return;
    }

    const material = {
      ...newMaterial,
      id: `custom-${Date.now()}`,
      isDefault: false
    };

    onSettingsChange('materials', {
      ...settings?.materials,
      custom: [...customMaterials, material]
    });

    setNewMaterial({
      name: '',
      type: 'steel',
      elasticModulus: '',
      density: '',
      poissonRatio: '',
      yieldStrength: '',
      ultimateStrength: '',
      thermalExpansion: ''
    });
    setShowAddMaterial(false);
  };

  const handleDeleteMaterial = (materialId) => {
    const updatedCustom = customMaterials?.filter(m => m?.id !== materialId);
    onSettingsChange('materials', {
      ...settings?.materials,
      custom: updatedCustom
    });
  };

  const handleEditMaterial = (materialId, updatedMaterial) => {
    const updatedCustom = customMaterials?.map(m => 
      m?.id === materialId ? { ...m, ...updatedMaterial } : m
    );
    onSettingsChange('materials', {
      ...settings?.materials,
      custom: updatedCustom
    });
  };

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'steel': return 'Wrench';
      case 'concrete': return 'Building';
      case 'aluminum': return 'Zap';
      case 'timber': return 'TreePine';
      case 'composite': return 'Layers';
      default: return 'Box';
    }
  };

  const getMaterialColor = (type) => {
    switch (type) {
      case 'steel': return 'text-blue-500';
      case 'concrete': return 'text-gray-500';
      case 'aluminum': return 'text-purple-500';
      case 'timber': return 'text-amber-500';
      case 'composite': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Materials Library</h3>
          <p className="text-sm text-muted-foreground">
            Manage material properties for structural analysis and design
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => setShowAddMaterial(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Add Material
        </Button>
      </div>
      {/* Add New Material Form */}
      {showAddMaterial && (
        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-foreground">Add New Material</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddMaterial(false)}
              iconName="X"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              label="Material Name"
              type="text"
              placeholder="e.g., Steel Grade 50"
              value={newMaterial?.name}
              onChange={(e) => setNewMaterial({ ...newMaterial, name: e?.target?.value })}
              required
            />

            <Select
              label="Material Type"
              options={materialTypes}
              value={newMaterial?.type}
              onChange={(value) => setNewMaterial({ ...newMaterial, type: value })}
            />

            <Input
              label="Elastic Modulus"
              type="number"
              placeholder="200000"
              value={newMaterial?.elasticModulus}
              onChange={(e) => setNewMaterial({ ...newMaterial, elasticModulus: e?.target?.value })}
              description="MPa"
              required
            />

            <Input
              label="Density"
              type="number"
              placeholder="7850"
              value={newMaterial?.density}
              onChange={(e) => setNewMaterial({ ...newMaterial, density: e?.target?.value })}
              description="kg/m³"
              required
            />

            <Input
              label="Poisson's Ratio"
              type="number"
              placeholder="0.3"
              value={newMaterial?.poissonRatio}
              onChange={(e) => setNewMaterial({ ...newMaterial, poissonRatio: e?.target?.value })}
              description="Dimensionless"
            />

            <Input
              label="Thermal Expansion"
              type="text"
              placeholder="12e-6"
              value={newMaterial?.thermalExpansion}
              onChange={(e) => setNewMaterial({ ...newMaterial, thermalExpansion: e?.target?.value })}
              description="per °C"
            />

            {newMaterial?.type === 'steel' && (
              <>
                <Input
                  label="Yield Strength"
                  type="number"
                  placeholder="415"
                  value={newMaterial?.yieldStrength}
                  onChange={(e) => setNewMaterial({ ...newMaterial, yieldStrength: e?.target?.value })}
                  description="MPa"
                />

                <Input
                  label="Ultimate Strength"
                  type="number"
                  placeholder="540"
                  value={newMaterial?.ultimateStrength}
                  onChange={(e) => setNewMaterial({ ...newMaterial, ultimateStrength: e?.target?.value })}
                  description="MPa"
                />
              </>
            )}

            {newMaterial?.type === 'concrete' && (
              <>
                <Input
                  label="Compressive Strength"
                  type="number"
                  placeholder="25"
                  value={newMaterial?.compressiveStrength}
                  onChange={(e) => setNewMaterial({ ...newMaterial, compressiveStrength: e?.target?.value })}
                  description="MPa"
                />

                <Input
                  label="Tensile Strength"
                  type="number"
                  placeholder="2.5"
                  value={newMaterial?.tensileStrength}
                  onChange={(e) => setNewMaterial({ ...newMaterial, tensileStrength: e?.target?.value })}
                  description="MPa"
                />
              </>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAddMaterial(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAddMaterial}
              disabled={!newMaterial?.name || !newMaterial?.elasticModulus || !newMaterial?.density}
            >
              Add Material
            </Button>
          </div>
        </div>
      )}
      {/* Materials Table */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground">Available Materials</h4>
        
        <div className="overflow-x-auto">
          <div className="min-w-full bg-card border border-border rounded-lg">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/20 text-sm font-medium text-muted-foreground">
              <div className="col-span-3">Material</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">E (MPa)</div>
              <div className="col-span-2">Density (kg/m³)</div>
              <div className="col-span-2">Poisson's Ratio</div>
              <div className="col-span-1">Actions</div>
            </div>

            {allMaterials?.map((material) => (
              <div key={material?.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/10">
                <div className="col-span-3 flex items-center space-x-3">
                  <Icon 
                    name={getMaterialIcon(material?.type)} 
                    size={16} 
                    className={getMaterialColor(material?.type)} 
                  />
                  <div>
                    <p className="font-medium text-foreground">{material?.name}</p>
                    {material?.isDefault && (
                      <span className="text-xs text-success">Default</span>
                    )}
                  </div>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground capitalize">
                  {material?.type}
                </div>
                <div className="col-span-2 text-sm font-mono text-foreground">
                  {parseFloat(material?.elasticModulus)?.toLocaleString()}
                </div>
                <div className="col-span-2 text-sm font-mono text-foreground">
                  {parseFloat(material?.density)?.toLocaleString()}
                </div>
                <div className="col-span-2 text-sm font-mono text-foreground">
                  {material?.poissonRatio}
                </div>
                <div className="col-span-1">
                  {!material?.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMaterial(material?.id)}
                      iconName="Trash2"
                      className="text-error hover:text-error hover:bg-error/10"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Material Library Options */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground">Library Options</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              iconName="Upload"
              iconPosition="left"
            >
              Import Materials from File
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              iconName="Download"
              iconPosition="left"
            >
              Export Materials Library
            </Button>
          </div>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              iconName="RefreshCw"
              iconPosition="left"
            >
              Reset to Default Materials
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              iconName="Database"
              iconPosition="left"
            >
              Load Standard Material Database
            </Button>
          </div>
        </div>
      </div>
      {/* Material Statistics */}
      <div className="p-4 bg-muted/20 rounded-md">
        <h5 className="font-medium text-foreground mb-3">Library Statistics</h5>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Materials:</span>
            <span className="ml-2 font-medium text-foreground">{allMaterials?.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Default:</span>
            <span className="ml-2 font-medium text-foreground">{defaultMaterials?.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Custom:</span>
            <span className="ml-2 font-medium text-foreground">{customMaterials?.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Types:</span>
            <span className="ml-2 font-medium text-foreground">
              {new Set(allMaterials.map(m => m.type))?.size}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsLibrarySettings;
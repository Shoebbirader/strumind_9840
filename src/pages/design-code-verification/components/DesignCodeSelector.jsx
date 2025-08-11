import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DesignCodeSelector = ({ onSettingsChange }) => {
  const [selectedCode, setSelectedCode] = useState('IS800-2007');
  const [selectedMaterial, setSelectedMaterial] = useState('steel');
  const [safetyFactors, setSafetyFactors] = useState({
    gamma_m0: 1.10,
    gamma_m1: 1.25,
    gamma_f: 1.50
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const designCodes = [
    { value: 'IS800-2007', label: 'IS 800:2007 - Steel Structures' },
    { value: 'IS456-2000', label: 'IS 456:2000 - Concrete Structures' },
    { value: 'AISC360-16', label: 'AISC 360-16 - Steel Construction' },
    { value: 'ACI318-19', label: 'ACI 318-19 - Concrete Structures' },
    { value: 'EC3-2005', label: 'Eurocode 3 - Steel Structures' },
    { value: 'EC2-2004', label: 'Eurocode 2 - Concrete Structures' }
  ];

  const materialTypes = [
    { value: 'steel', label: 'Steel', icon: 'Zap' },
    { value: 'concrete', label: 'Concrete', icon: 'Box' },
    { value: 'composite', label: 'Composite', icon: 'Layers' }
  ];

  const loadCombinations = [
    {
      id: 'DL_LL',
      name: '1.5(DL + LL)',
      description: 'Dead Load + Live Load',
      factor: 1.5,
      active: true
    },
    {
      id: 'DL_WL',
      name: '1.2(DL + WL)',
      description: 'Dead Load + Wind Load',
      factor: 1.2,
      active: true
    },
    {
      id: 'DL_EL',
      name: '1.2(DL + EL)',
      description: 'Dead Load + Earthquake Load',
      factor: 1.2,
      active: false
    },
    {
      id: 'DL_LL_WL',
      name: '1.2(DL + LL + WL)',
      description: 'Dead + Live + Wind Load',
      factor: 1.2,
      active: true
    }
  ];

  const handleCodeChange = (value) => {
    setSelectedCode(value);
    
    // Update safety factors based on selected code
    if (value?.startsWith('IS800')) {
      setSafetyFactors({
        gamma_m0: 1.10,
        gamma_m1: 1.25,
        gamma_f: 1.50
      });
    } else if (value?.startsWith('IS456')) {
      setSafetyFactors({
        gamma_m0: 1.50,
        gamma_m1: 1.50,
        gamma_f: 1.50
      });
    }
    
    onSettingsChange?.({ code: value, material: selectedMaterial, safetyFactors });
  };

  const handleSafetyFactorChange = (factor, value) => {
    const newFactors = { ...safetyFactors, [factor]: parseFloat(value) };
    setSafetyFactors(newFactors);
    onSettingsChange?.({ code: selectedCode, material: selectedMaterial, safetyFactors: newFactors });
  };

  const toggleLoadCombination = (id) => {
    // Handle load combination toggle logic
    console.log(`Toggle load combination: ${id}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Book" size={20} className="text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Design Code Configuration</h3>
              <p className="text-sm text-muted-foreground">Configure design standards and parameters</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
          </Button>
        </div>
      </div>
      {/* Quick Settings */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Design Code Selection */}
          <div>
            <Select
              label="Design Code"
              options={designCodes}
              value={selectedCode}
              onChange={handleCodeChange}
              className="w-full"
            />
          </div>

          {/* Material Type */}
          <div>
            <Select
              label="Primary Material"
              options={materialTypes}
              value={selectedMaterial}
              onChange={setSelectedMaterial}
              className="w-full"
            />
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="bg-muted/30 rounded-md p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Active Configuration:</span>
            <span className="font-medium text-foreground">
              {designCodes?.find(c => c?.value === selectedCode)?.label}
            </span>
          </div>
        </div>
      </div>
      {/* Expanded Settings */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Safety Factors */}
          <div className="p-4 border-b border-border">
            <h4 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="Shield" size={16} className="mr-2" />
              Safety Factors
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">γm0 (Material)</label>
                <input
                  type="number"
                  step="0.01"
                  value={safetyFactors?.gamma_m0}
                  onChange={(e) => handleSafetyFactorChange('gamma_m0', e?.target?.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">γm1 (Resistance)</label>
                <input
                  type="number"
                  step="0.01"
                  value={safetyFactors?.gamma_m1}
                  onChange={(e) => handleSafetyFactorChange('gamma_m1', e?.target?.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">γf (Load)</label>
                <input
                  type="number"
                  step="0.01"
                  value={safetyFactors?.gamma_f}
                  onChange={(e) => handleSafetyFactorChange('gamma_f', e?.target?.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Load Combinations */}
          <div className="p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="Layers" size={16} className="mr-2" />
              Load Combinations
            </h4>
            <div className="space-y-2">
              {loadCombinations?.map((combo) => (
                <div
                  key={combo?.id}
                  className={`
                    flex items-center justify-between p-3 rounded-md border transition-colors
                    ${combo?.active 
                      ? 'bg-primary/10 border-primary/30 text-primary' :'bg-muted/30 border-border text-muted-foreground'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleLoadCombination(combo?.id)}
                      className={`
                        w-4 h-4 rounded border-2 flex items-center justify-center transition-colors
                        ${combo?.active 
                          ? 'bg-primary border-primary' :'border-muted-foreground'
                        }
                      `}
                    >
                      {combo?.active && <Icon name="Check" size={10} className="text-primary-foreground" />}
                    </button>
                    <div>
                      <p className="font-medium text-sm">{combo?.name}</p>
                      <p className="text-xs opacity-75">{combo?.description}</p>
                    </div>
                  </div>
                  <div className="text-sm font-mono">
                    Factor: {combo?.factor}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm">
                <Icon name="RotateCcw" size={14} className="mr-2" />
                Reset to Default
              </Button>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Icon name="Upload" size={14} className="mr-2" />
                  Import Config
                </Button>
                <Button variant="default" size="sm">
                  <Icon name="Check" size={14} className="mr-2" />
                  Apply Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignCodeSelector;
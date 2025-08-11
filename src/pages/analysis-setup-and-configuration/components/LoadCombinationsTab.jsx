import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LoadCombinationsTab = ({ loadCases, loadCombinations, onUpdateCombinations }) => {
  const [newCombination, setNewCombination] = useState({
    name: '',
    type: 'ultimate',
    factors: {}
  });
  const [editingCombination, setEditingCombination] = useState(null);

  const combinationTypeOptions = [
    { value: 'ultimate', label: 'Ultimate Limit State (ULS)' },
    { value: 'serviceability', label: 'Serviceability Limit State (SLS)' },
    { value: 'accidental', label: 'Accidental' },
    { value: 'seismic', label: 'Seismic' },
    { value: 'custom', label: 'Custom' }
  ];

  const getDefaultFactors = (type) => {
    const factors = {};
    loadCases?.forEach(loadCase => {
      switch (type) {
        case 'ultimate':
          factors[loadCase.id] = loadCase?.type === 'dead' ? 1.5 : 
                                 loadCase?.type === 'live' ? 1.5 : 
                                 loadCase?.type === 'wind' ? 1.5 : 
                                 loadCase?.type === 'seismic' ? 1.5 : 1.0;
          break;
        case 'serviceability':
          factors[loadCase.id] = 1.0;
          break;
        case 'seismic':
          factors[loadCase.id] = loadCase?.type === 'dead' ? 1.0 : 
                                 loadCase?.type === 'live' ? 0.5 : 
                                 loadCase?.type === 'seismic' ? 1.0 : 0.0;
          break;
        default:
          factors[loadCase.id] = 1.0;
      }
    });
    return factors;
  };

  const handleAddCombination = () => {
    if (!newCombination?.name?.trim()) return;
    
    const combinationToAdd = {
      id: Date.now(),
      name: newCombination?.name,
      type: newCombination?.type,
      factors: Object.keys(newCombination?.factors)?.length > 0 ? 
               newCombination?.factors : 
               getDefaultFactors(newCombination?.type),
      createdAt: new Date()?.toISOString()
    };
    
    onUpdateCombinations([...loadCombinations, combinationToAdd]);
    setNewCombination({ name: '', type: 'ultimate', factors: {} });
  };

  const handleTypeChange = (type) => {
    setNewCombination({
      ...newCombination,
      type,
      factors: getDefaultFactors(type)
    });
  };

  const handleFactorChange = (loadCaseId, factor) => {
    setNewCombination({
      ...newCombination,
      factors: {
        ...newCombination?.factors,
        [loadCaseId]: parseFloat(factor) || 0
      }
    });
  };

  const handleEditCombination = (combinationId) => {
    const combination = loadCombinations?.find(c => c?.id === combinationId);
    setEditingCombination({ ...combination });
  };

  const handleSaveEdit = () => {
    const updatedCombinations = loadCombinations?.map(c => 
      c?.id === editingCombination?.id ? editingCombination : c
    );
    onUpdateCombinations(updatedCombinations);
    setEditingCombination(null);
  };

  const handleDeleteCombination = (combinationId) => {
    onUpdateCombinations(loadCombinations?.filter(c => c?.id !== combinationId));
  };

  const getCombinationEquation = (combination) => {
    const terms = Object.entries(combination?.factors)?.filter(([_, factor]) => factor !== 0)?.map(([loadCaseId, factor]) => {
        const loadCase = loadCases?.find(lc => lc?.id === parseInt(loadCaseId));
        if (!loadCase) return null;
        return `${factor}×${loadCase?.name}`;
      })?.filter(Boolean);
    
    return terms?.join(' + ') || 'No active load cases';
  };

  return (
    <div className="space-y-6">
      {/* Add New Load Combination */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Plus" size={20} className="mr-2 text-primary" />
          Add New Load Combination
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Combination Name"
            type="text"
            placeholder="e.g., ULS1, SLS1"
            value={newCombination?.name}
            onChange={(e) => setNewCombination({ ...newCombination, name: e?.target?.value })}
            required
          />
          
          <Select
            label="Combination Type"
            options={combinationTypeOptions}
            value={newCombination?.type}
            onChange={handleTypeChange}
          />
        </div>

        {/* Load Case Factors Matrix */}
        {loadCases?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Load Case Factors</h4>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {loadCases?.map((loadCase) => (
                  <div key={loadCase?.id} className="flex items-center space-x-3">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 ${
                        loadCase?.type === 'dead' ? 'bg-slate-500' :
                        loadCase?.type === 'live' ? 'bg-blue-500' :
                        loadCase?.type === 'wind' ? 'bg-cyan-500' :
                        loadCase?.type === 'seismic' ? 'bg-red-500' :
                        loadCase?.type === 'temperature'? 'bg-orange-500' : 'bg-purple-500'
                      }`} />
                      <span className="text-sm text-foreground truncate">{loadCase?.name}</span>
                    </div>
                    <Input
                      type="number"
                      value={newCombination?.factors?.[loadCase?.id] || 0}
                      onChange={(e) => handleFactorChange(loadCase?.id, e?.target?.value)}
                      step="0.1"
                      className="w-20"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <Button
          variant="default"
          onClick={handleAddCombination}
          disabled={!newCombination?.name?.trim() || loadCases?.length === 0}
          iconName="Plus"
          iconPosition="left"
        >
          Add Combination
        </Button>
      </div>
      {/* Load Combinations List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Layers" size={20} className="mr-2 text-primary" />
            Defined Load Combinations ({loadCombinations?.length})
          </h3>
        </div>
        
        {loadCombinations?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Layers" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No load combinations defined yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first combination above to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {loadCombinations?.map((combination) => (
              <div key={combination?.id} className="p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-foreground">{combination?.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        combination?.type === 'ultimate' ? 'bg-red-500/20 text-red-400' :
                        combination?.type === 'serviceability' ? 'bg-blue-500/20 text-blue-400' :
                        combination?.type === 'seismic'? 'bg-orange-500/20 text-orange-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {combination?.type?.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-mono text-foreground">
                        {getCombinationEquation(combination)}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {Object.entries(combination?.factors)?.filter(([_, factor]) => factor !== 0)?.map(([loadCaseId, factor]) => {
                          const loadCase = loadCases?.find(lc => lc?.id === parseInt(loadCaseId));
                          if (!loadCase) return null;
                          return (
                            <div key={loadCaseId} className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                loadCase?.type === 'dead' ? 'bg-slate-500' :
                                loadCase?.type === 'live' ? 'bg-blue-500' :
                                loadCase?.type === 'wind' ? 'bg-cyan-500' :
                                loadCase?.type === 'seismic' ? 'bg-red-500' :
                                loadCase?.type === 'temperature'? 'bg-orange-500' : 'bg-purple-500'
                              }`} />
                              <span className="text-xs text-muted-foreground">{loadCase?.name}:</span>
                              <span className="text-xs font-mono text-foreground">{factor}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-4">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleEditCombination(combination?.id)}
                      iconName="Edit"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDeleteCombination(combination?.id)}
                      iconName="Trash2"
                      className="text-error hover:text-error"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadCombinationsTab;
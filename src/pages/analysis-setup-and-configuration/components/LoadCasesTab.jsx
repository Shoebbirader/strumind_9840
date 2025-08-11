import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LoadCasesTab = ({ loadCases, onUpdateLoadCases }) => {
  const [editingCase, setEditingCase] = useState(null);
  const [newCase, setNewCase] = useState({
    name: '',
    type: 'dead',
    factor: 1.0,
    description: ''
  });

  const loadTypeOptions = [
    { value: 'dead', label: 'Dead Load' },
    { value: 'live', label: 'Live Load' },
    { value: 'wind', label: 'Wind Load' },
    { value: 'seismic', label: 'Seismic Load' },
    { value: 'temperature', label: 'Temperature Load' },
    { value: 'settlement', label: 'Settlement Load' }
  ];

  const handleAddCase = () => {
    if (!newCase?.name?.trim()) return;
    
    const caseToAdd = {
      id: Date.now(),
      ...newCase,
      factor: parseFloat(newCase?.factor) || 1.0,
      createdAt: new Date()?.toISOString()
    };
    
    onUpdateLoadCases([...loadCases, caseToAdd]);
    setNewCase({ name: '', type: 'dead', factor: 1.0, description: '' });
  };

  const handleEditCase = (caseId) => {
    const caseToEdit = loadCases?.find(c => c?.id === caseId);
    setEditingCase({ ...caseToEdit });
  };

  const handleSaveEdit = () => {
    const updatedCases = loadCases?.map(c => 
      c?.id === editingCase?.id ? { ...editingCase, factor: parseFloat(editingCase?.factor) || 1.0 } : c
    );
    onUpdateLoadCases(updatedCases);
    setEditingCase(null);
  };

  const handleDeleteCase = (caseId) => {
    onUpdateLoadCases(loadCases?.filter(c => c?.id !== caseId));
  };

  const handleDuplicateCase = (caseId) => {
    const caseToDuplicate = loadCases?.find(c => c?.id === caseId);
    const duplicatedCase = {
      ...caseToDuplicate,
      id: Date.now(),
      name: `${caseToDuplicate?.name} (Copy)`,
      createdAt: new Date()?.toISOString()
    };
    onUpdateLoadCases([...loadCases, duplicatedCase]);
  };

  return (
    <div className="space-y-6">
      {/* Add New Load Case */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Plus" size={20} className="mr-2 text-primary" />
          Add New Load Case
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Case Name"
            type="text"
            placeholder="e.g., DL1, LL1, WL1"
            value={newCase?.name}
            onChange={(e) => setNewCase({ ...newCase, name: e?.target?.value })}
            required
          />
          
          <Select
            label="Load Type"
            options={loadTypeOptions}
            value={newCase?.type}
            onChange={(value) => setNewCase({ ...newCase, type: value })}
          />
          
          <Input
            label="Load Factor"
            type="number"
            placeholder="1.0"
            value={newCase?.factor}
            onChange={(e) => setNewCase({ ...newCase, factor: e?.target?.value })}
            min="0"
            step="0.1"
          />
          
          <div className="flex items-end">
            <Button
              variant="default"
              onClick={handleAddCase}
              disabled={!newCase?.name?.trim()}
              iconName="Plus"
              iconPosition="left"
              className="w-full"
            >
              Add Case
            </Button>
          </div>
        </div>
        
        <Input
          label="Description (Optional)"
          type="text"
          placeholder="Brief description of the load case"
          value={newCase?.description}
          onChange={(e) => setNewCase({ ...newCase, description: e?.target?.value })}
          className="mt-4"
        />
      </div>
      {/* Load Cases Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="List" size={20} className="mr-2 text-primary" />
            Defined Load Cases ({loadCases?.length})
          </h3>
        </div>
        
        {loadCases?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No load cases defined yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first load case above to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Case Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Factor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadCases?.map((loadCase) => (
                  <tr key={loadCase?.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCase?.id === loadCase?.id ? (
                        <Input
                          type="text"
                          value={editingCase?.name}
                          onChange={(e) => setEditingCase({ ...editingCase, name: e?.target?.value })}
                          className="w-24"
                        />
                      ) : (
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            loadCase?.type === 'dead' ? 'bg-slate-500' :
                            loadCase?.type === 'live' ? 'bg-blue-500' :
                            loadCase?.type === 'wind' ? 'bg-cyan-500' :
                            loadCase?.type === 'seismic' ? 'bg-red-500' :
                            loadCase?.type === 'temperature'? 'bg-orange-500' : 'bg-purple-500'
                          }`} />
                          <span className="text-sm font-medium text-foreground">{loadCase?.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCase?.id === loadCase?.id ? (
                        <Select
                          options={loadTypeOptions}
                          value={editingCase?.type}
                          onChange={(value) => setEditingCase({ ...editingCase, type: value })}
                        />
                      ) : (
                        <span className="text-sm text-foreground capitalize">{loadCase?.type?.replace('_', ' ')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCase?.id === loadCase?.id ? (
                        <Input
                          type="number"
                          value={editingCase?.factor}
                          onChange={(e) => setEditingCase({ ...editingCase, factor: e?.target?.value })}
                          className="w-20"
                          step="0.1"
                        />
                      ) : (
                        <span className="text-sm font-mono text-foreground">{loadCase?.factor}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingCase?.id === loadCase?.id ? (
                        <Input
                          type="text"
                          value={editingCase?.description || ''}
                          onChange={(e) => setEditingCase({ ...editingCase, description: e?.target?.value })}
                          className="w-full"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">{loadCase?.description || '-'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCase?.id === loadCase?.id ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="default"
                            size="xs"
                            onClick={handleSaveEdit}
                            iconName="Check"
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setEditingCase(null)}
                            iconName="X"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleEditCase(loadCase?.id)}
                            iconName="Edit"
                          />
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleDuplicateCase(loadCase?.id)}
                            iconName="Copy"
                          />
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => handleDeleteCase(loadCase?.id)}
                            iconName="Trash2"
                            className="text-error hover:text-error"
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadCasesTab;
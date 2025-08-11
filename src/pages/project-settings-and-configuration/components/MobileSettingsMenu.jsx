import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const MobileSettingsMenu = ({ activeSection, onSectionChange, hasUnsavedChanges }) => {
  const settingsSections = [
    {
      id: 'general',
      label: 'General Settings',
      icon: 'Settings',
      description: 'Project information and basic settings'
    },
    {
      id: 'units',
      label: 'Units Configuration',
      icon: 'Ruler',
      description: 'Force, length, stress, and temperature units'
    },
    {
      id: 'design-codes',
      label: 'Design Codes',
      icon: 'Book',
      description: 'Steel and concrete design standards'
    },
    {
      id: 'materials',
      label: 'Materials Library',
      icon: 'Layers',
      description: 'Material properties and custom materials'
    },
    {
      id: 'analysis',
      label: 'Analysis Defaults',
      icon: 'Calculator',
      description: 'Solver preferences and convergence criteria'
    }
  ];

  const sectionOptions = settingsSections?.map(section => ({
    value: section?.id,
    label: section?.label,
    description: section?.description
  }));

  const currentSection = settingsSections?.find(s => s?.id === activeSection);

  return (
    <div className="lg:hidden bg-card border-b border-border p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Settings" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Project Settings</h2>
          </div>
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <span className="text-xs text-warning">Unsaved</span>
            </div>
          )}
        </div>

        <Select
          label="Settings Category"
          options={sectionOptions}
          value={activeSection}
          onChange={onSectionChange}
          description={currentSection?.description}
        />
      </div>
    </div>
  );
};

export default MobileSettingsMenu;
import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SettingsSidebar = ({ activeSection, onSectionChange, hasUnsavedChanges }) => {
  const settingsSections = [
    {
      id: 'general',
      label: 'General',
      icon: 'Settings',
      description: 'Project information and basic settings'
    },
    {
      id: 'units',
      label: 'Units',
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

  return (
    <div className="w-full lg:w-80 bg-card border-r border-border h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">Project Settings</h2>
        <p className="text-sm text-muted-foreground">Configure global project parameters and preferences</p>
      </div>
      <nav className="p-4">
        <div className="space-y-2">
          {settingsSections?.map((section) => (
            <Button
              key={section?.id}
              variant={activeSection === section?.id ? "default" : "ghost"}
              onClick={() => onSectionChange(section?.id)}
              className="w-full justify-start h-auto p-4 text-left"
            >
              <div className="flex items-start space-x-3">
                <Icon 
                  name={section?.icon} 
                  size={20} 
                  className={activeSection === section?.id ? "text-primary-foreground" : "text-muted-foreground"} 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${activeSection === section?.id ? "text-primary-foreground" : "text-foreground"}`}>
                      {section?.label}
                    </span>
                    {hasUnsavedChanges && activeSection === section?.id && (
                      <div className="w-2 h-2 bg-warning rounded-full" />
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${activeSection === section?.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {section?.description}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </nav>
      {hasUnsavedChanges && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-warning/10 border border-warning/20 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm text-warning">Unsaved changes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSidebar;
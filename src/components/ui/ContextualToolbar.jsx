import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ContextualToolbar = () => {
  const location = useLocation();

  const getToolbarConfig = () => {
    switch (location?.pathname) {
      case '/project-dashboard':
        return {
          title: 'Project Dashboard',
          tools: [
            { label: 'New Project', icon: 'Plus', action: 'new-project', variant: 'default' },
            { label: 'Import', icon: 'Upload', action: 'import' },
            { label: 'Export', icon: 'Download', action: 'export' },
            { type: 'separator' },
            { label: 'Grid View', icon: 'Grid3X3', action: 'grid-view', toggle: true },
            { label: 'List View', icon: 'List', action: 'list-view', toggle: true },
            { type: 'separator' },
            { label: 'Filter', icon: 'Filter', action: 'filter' },
            { label: 'Sort', icon: 'ArrowUpDown', action: 'sort' },
          ]
        };

      case '/3d-structural-modeling-workspace':
        return {
          title: '3D Modeling Tools',
          tools: [
            { label: 'Select', icon: 'MousePointer2', action: 'select', toggle: true, active: true },
            { label: 'Node', icon: 'Circle', action: 'add-node' },
            { label: 'Beam', icon: 'Minus', action: 'add-beam' },
            { label: 'Plate', icon: 'Square', action: 'add-plate' },
            { type: 'separator' },
            { label: 'Move', icon: 'Move', action: 'move' },
            { label: 'Rotate', icon: 'RotateCw', action: 'rotate' },
            { label: 'Scale', icon: 'Maximize2', action: 'scale' },
            { type: 'separator' },
            { label: 'Snap', icon: 'Magnet', action: 'snap', toggle: true },
            { label: 'Grid', icon: 'Grid3X3', action: 'grid', toggle: true },
            { type: 'separator' },
            { label: 'Undo', icon: 'Undo2', action: 'undo', shortcut: 'Ctrl+Z' },
            { label: 'Redo', icon: 'Redo2', action: 'redo', shortcut: 'Ctrl+Y' },
          ]
        };

      case '/analysis-setup-and-configuration':
        return {
          title: 'Analysis Setup',
          tools: [
            { label: 'Load Cases', icon: 'Zap', action: 'load-cases' },
            { label: 'Boundary Conditions', icon: 'Anchor', action: 'boundary-conditions' },
            { label: 'Material Properties', icon: 'Layers', action: 'materials' },
            { type: 'separator' },
            { label: 'Mesh Settings', icon: 'Mesh', action: 'mesh-settings' },
            { label: 'Solver Options', icon: 'Settings', action: 'solver-options' },
            { type: 'separator' },
            { label: 'Validate Model', icon: 'CheckCircle', action: 'validate', variant: 'success' },
            { label: 'Run Analysis', icon: 'Play', action: 'run-analysis', variant: 'default' },
          ]
        };

      case '/analysis-results-visualization':
        return {
          title: 'Results Visualization',
          tools: [
            { label: 'Deformation', icon: 'TrendingUp', action: 'deformation', toggle: true },
            { label: 'Stress', icon: 'Thermometer', action: 'stress', toggle: true },
            { label: 'Forces', icon: 'Zap', action: 'forces', toggle: true },
            { type: 'separator' },
            { label: 'Animate', icon: 'Play', action: 'animate' },
            { label: 'Scale Factor', icon: 'Maximize2', action: 'scale-factor' },
            { type: 'separator' },
            { label: 'Export Results', icon: 'Download', action: 'export-results' },
            { label: 'Generate Report', icon: 'FileText', action: 'generate-report' },
          ]
        };

      case '/design-code-verification':
        return {
          title: 'Code Verification',
          tools: [
            { label: 'Design Code', icon: 'Book', action: 'design-code' },
            { label: 'Load Combinations', icon: 'Layers', action: 'load-combinations' },
            { type: 'separator' },
            { label: 'Check Beams', icon: 'Minus', action: 'check-beams' },
            { label: 'Check Columns', icon: 'BarChart3', action: 'check-columns' },
            { label: 'Check Connections', icon: 'Link', action: 'check-connections' },
            { type: 'separator' },
            { label: 'Run Verification', icon: 'Shield', action: 'run-verification', variant: 'default' },
            { label: 'Export Report', icon: 'FileText', action: 'export-report' },
          ]
        };

      case '/project-settings-and-configuration':
        return {
          title: 'Project Settings',
          tools: [
            { label: 'Units', icon: 'Ruler', action: 'units' },
            { label: 'Precision', icon: 'Target', action: 'precision' },
            { label: 'Display Options', icon: 'Eye', action: 'display-options' },
            { type: 'separator' },
            { label: 'Import Settings', icon: 'Upload', action: 'import-settings' },
            { label: 'Export Settings', icon: 'Download', action: 'export-settings' },
            { type: 'separator' },
            { label: 'Reset to Default', icon: 'RotateCcw', action: 'reset-default', variant: 'outline' },
            { label: 'Apply Changes', icon: 'Check', action: 'apply-changes', variant: 'default' },
          ]
        };

      default:
        return null;
    }
  };

  const handleToolAction = (action, tool) => {
    console.log(`Tool action: ${action}`, tool);
  };

  const toolbarConfig = getToolbarConfig();

  if (!toolbarConfig) return null;

  return (
    <div className="sticky top-28 lg:top-24 z-30 bg-surface border-b border-border">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-foreground">{toolbarConfig?.title}</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="xs"
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="MoreHorizontal" size={16} />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {toolbarConfig?.tools?.map((tool, index) => {
            if (tool?.type === 'separator') {
              return (
                <div key={index} className="w-px h-6 bg-border mx-2" />
              );
            }

            return (
              <div key={index} className="relative group">
                <Button
                  variant={tool?.variant || (tool?.active ? "default" : "ghost")}
                  size="sm"
                  onClick={() => handleToolAction(tool?.action, tool)}
                  className={`
                    h-8 px-3 transition-all duration-200
                    ${tool?.toggle && tool?.active 
                      ? 'bg-primary/20 text-primary border-primary/30' :''
                    }
                  `}
                >
                  <Icon name={tool?.icon} size={16} className="mr-1.5" />
                  <span className="hidden sm:inline">{tool?.label}</span>
                </Button>
                {/* Tooltip with shortcut */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-popover border border-border rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  <div className="text-popover-foreground">
                    {tool?.label}
                    {tool?.shortcut && (
                      <span className="ml-2 text-muted-foreground font-mono">
                        {tool?.shortcut}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContextualToolbar;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModelingToolbar = ({ activeMode, onModeChange, onAction }) => {
  const [showMaterialsMenu, setShowMaterialsMenu] = useState(false);
  const [showSectionsMenu, setShowSectionsMenu] = useState(false);

  const toolGroups = [
    {
      name: 'Selection',
      tools: [
        { id: 'select', label: 'Select', icon: 'MousePointer2', shortcut: 'S' },
        { id: 'multi-select', label: 'Multi Select', icon: 'MousePointer', shortcut: 'M' },
      ]
    },
    {
      name: 'Geometry',
      tools: [
        { id: 'node', label: 'Add Node', icon: 'Circle', shortcut: 'N' },
        { id: 'beam', label: 'Add Beam', icon: 'Minus', shortcut: 'B' },
        { id: 'plate', label: 'Add Plate', icon: 'Square', shortcut: 'P' },
        { id: 'shell', label: 'Add Shell', icon: 'Hexagon', shortcut: 'H' },
      ]
    },
    {
      name: 'Transform',
      tools: [
        { id: 'move', label: 'Move', icon: 'Move', shortcut: 'G' },
        { id: 'rotate', label: 'Rotate', icon: 'RotateCw', shortcut: 'R' },
        { id: 'scale', label: 'Scale', icon: 'Maximize2', shortcut: 'T' },
        { id: 'mirror', label: 'Mirror', icon: 'FlipHorizontal', shortcut: 'F' },
      ]
    },
    {
      name: 'Constraints',
      tools: [
        { id: 'fixed', label: 'Fixed Support', icon: 'Anchor', shortcut: 'X' },
        { id: 'pinned', label: 'Pinned Support', icon: 'Target', shortcut: 'Z' },
        { id: 'roller', label: 'Roller Support', icon: 'Circle', shortcut: 'C' },
        { id: 'spring', label: 'Spring Support', icon: 'Waves', shortcut: 'V' },
      ]
    },
    {
      name: 'Loads',
      tools: [
        { id: 'point-load', label: 'Point Load', icon: 'ArrowDown', shortcut: 'L' },
        { id: 'distributed-load', label: 'Distributed Load', icon: 'ArrowDownWideNarrow', shortcut: 'D' },
        { id: 'moment', label: 'Moment', icon: 'RotateCcw', shortcut: 'O' },
        { id: 'temperature', label: 'Temperature', icon: 'Thermometer', shortcut: 'E' },
      ]
    }
  ];

  const materials = [
    { id: 'steel-s355', name: 'Steel S355', E: '210 GPa', density: '7850 kg/m³' },
    { id: 'concrete-c30', name: 'Concrete C30/37', E: '33 GPa', density: '2500 kg/m³' },
    { id: 'timber-c24', name: 'Timber C24', E: '11 GPa', density: '420 kg/m³' },
  ];

  const sections = [
    { id: 'ipe-300', name: 'IPE 300', type: 'I-Beam', A: '53.8 cm²', Iy: '8356 cm⁴' },
    { id: 'hea-200', name: 'HEA 200', type: 'H-Beam', A: '53.8 cm²', Iy: '3692 cm⁴' },
    { id: 'rect-300x500', name: '300×500 mm', type: 'Rectangle', A: '1500 cm²', Iy: '31250 cm⁴' },
  ];

  const handleToolClick = (toolId) => {
    onModeChange(toolId);
    onAction('tool-selected', { tool: toolId });
  };

  return (
    <div className="bg-surface border-b border-border">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Modeling Tools</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onAction('snap-toggle')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Magnet" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onAction('grid-toggle')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Grid3X3" size={14} />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {toolGroups?.map((group) => (
            <div key={group?.name}>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {group?.name}
              </h4>
              <div className="grid grid-cols-2 gap-1">
                {group?.tools?.map((tool) => (
                  <div key={tool?.id} className="relative group">
                    <Button
                      variant={activeMode === tool?.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleToolClick(tool?.id)}
                      className={`
                        w-full justify-start h-8 px-2 text-xs transition-all duration-200
                        ${activeMode === tool?.id 
                          ? 'bg-primary/20 text-primary border-primary/30' :'hover:bg-muted'
                        }
                      `}
                    >
                      <Icon name={tool?.icon} size={14} className="mr-2" />
                      <span className="truncate">{tool?.label}</span>
                    </Button>
                    
                    {/* Tooltip */}
                    <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-popover border border-border rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      <div className="text-popover-foreground">
                        {tool?.label}
                        <span className="ml-2 text-muted-foreground font-mono">
                          {tool?.shortcut}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Materials Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Materials
              </h4>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setShowMaterialsMenu(!showMaterialsMenu)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name={showMaterialsMenu ? "ChevronUp" : "ChevronDown"} size={12} />
              </Button>
            </div>
            
            {showMaterialsMenu && (
              <div className="space-y-1">
                {materials?.map((material) => (
                  <button
                    key={material?.id}
                    onClick={() => onAction('material-selected', material)}
                    className="w-full p-2 text-left bg-muted/30 hover:bg-muted rounded border border-border/50 transition-colors"
                  >
                    <div className="text-xs font-medium text-foreground">{material?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      E: {material?.E} | ρ: {material?.density}
                    </div>
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => onAction('add-material')}
                  className="w-full mt-2"
                >
                  <Icon name="Plus" size={12} className="mr-1" />
                  Add Material
                </Button>
              </div>
            )}
          </div>

          {/* Sections */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Sections
              </h4>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setShowSectionsMenu(!showSectionsMenu)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name={showSectionsMenu ? "ChevronUp" : "ChevronDown"} size={12} />
              </Button>
            </div>
            
            {showSectionsMenu && (
              <div className="space-y-1">
                {sections?.map((section) => (
                  <button
                    key={section?.id}
                    onClick={() => onAction('section-selected', section)}
                    className="w-full p-2 text-left bg-muted/30 hover:bg-muted rounded border border-border/50 transition-colors"
                  >
                    <div className="text-xs font-medium text-foreground">{section?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {section?.type} | A: {section?.A}
                    </div>
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => onAction('add-section')}
                  className="w-full mt-2"
                >
                  <Icon name="Plus" size={12} className="mr-1" />
                  Add Section
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelingToolbar;
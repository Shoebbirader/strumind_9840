import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ModelTree = ({ selectedItems, onSelectionChange, onAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    nodes: true,
    elements: true,
    materials: false,
    sections: false,
    loads: false,
    supports: false
  });

  const modelData = {
    nodes: [
      { id: 'N1', name: 'Node 1', coords: [0, 0, 0], type: 'free' },
      { id: 'N2', name: 'Node 2', coords: [5, 0, 0], type: 'fixed' },
      { id: 'N3', name: 'Node 3', coords: [10, 0, 0], type: 'pinned' },
      { id: 'N4', name: 'Node 4', coords: [0, 5, 0], type: 'free' },
      { id: 'N5', name: 'Node 5', coords: [5, 5, 0], type: 'free' },
      { id: 'N6', name: 'Node 6', coords: [10, 5, 0], type: 'roller' },
    ],
    elements: [
      { id: 'B1', name: 'Beam 1', type: 'beam', nodes: ['N1', 'N2'], material: 'Steel S355', section: 'IPE 300' },
      { id: 'B2', name: 'Beam 2', type: 'beam', nodes: ['N2', 'N3'], material: 'Steel S355', section: 'IPE 300' },
      { id: 'B3', name: 'Beam 3', type: 'beam', nodes: ['N4', 'N5'], material: 'Steel S355', section: 'IPE 300' },
      { id: 'B4', name: 'Beam 4', type: 'beam', nodes: ['N5', 'N6'], material: 'Steel S355', section: 'IPE 300' },
      { id: 'C1', name: 'Column 1', type: 'beam', nodes: ['N1', 'N4'], material: 'Steel S355', section: 'HEA 200' },
      { id: 'C2', name: 'Column 2', type: 'beam', nodes: ['N2', 'N5'], material: 'Steel S355', section: 'HEA 200' },
      { id: 'P1', name: 'Plate 1', type: 'plate', nodes: ['N1', 'N2', 'N5', 'N4'], material: 'Concrete C30', thickness: '200mm' },
    ],
    materials: [
      { id: 'steel-s355', name: 'Steel S355', type: 'Steel', E: '210 GPa', density: '7850 kg/m³' },
      { id: 'concrete-c30', name: 'Concrete C30/37', type: 'Concrete', E: '33 GPa', density: '2500 kg/m³' },
      { id: 'timber-c24', name: 'Timber C24', type: 'Timber', E: '11 GPa', density: '420 kg/m³' },
    ],
    sections: [
      { id: 'ipe-300', name: 'IPE 300', type: 'I-Beam', A: '53.8 cm²', Iy: '8356 cm⁴', Iz: '604 cm⁴' },
      { id: 'hea-200', name: 'HEA 200', type: 'H-Beam', A: '53.8 cm²', Iy: '3692 cm⁴', Iz: '1336 cm⁴' },
      { id: 'rect-300x500', name: '300×500 mm', type: 'Rectangle', A: '1500 cm²', Iy: '31250 cm⁴', Iz: '11250 cm⁴' },
    ],
    loads: [
      { id: 'LC1', name: 'Dead Load', type: 'load-case', loads: 5 },
      { id: 'LC2', name: 'Live Load', type: 'load-case', loads: 8 },
      { id: 'LC3', name: 'Wind Load X', type: 'load-case', loads: 12 },
      { id: 'PL1', name: 'Point Load 1', type: 'point-load', node: 'N3', value: '10 kN', direction: 'Y' },
      { id: 'DL1', name: 'UDL Beam 1', type: 'distributed-load', element: 'B1', value: '5 kN/m', direction: 'Y' },
    ],
    supports: [
      { id: 'S1', name: 'Fixed Support', node: 'N2', type: 'fixed', restraints: ['Dx', 'Dy', 'Dz', 'Rx', 'Ry', 'Rz'] },
      { id: 'S2', name: 'Pinned Support', node: 'N3', type: 'pinned', restraints: ['Dx', 'Dy', 'Dz'] },
      { id: 'S3', name: 'Roller Support', node: 'N6', type: 'roller', restraints: ['Dy'] },
    ]
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleItemClick = (item, type) => {
    const itemId = `${type}-${item?.id}`;
    const isSelected = selectedItems?.includes(itemId);
    
    if (isSelected) {
      onSelectionChange(selectedItems?.filter(id => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
    
    onAction('item-selected', { item, type });
  };

  const getItemIcon = (type, item) => {
    switch (type) {
      case 'nodes':
        return item?.type === 'fixed' ? 'Anchor' : 
               item?.type === 'pinned' ? 'Target' : 
               item?.type === 'roller' ? 'Circle' : 'Dot';
      case 'elements':
        return item?.type === 'beam' ? 'Minus' : 
               item?.type === 'plate' ? 'Square' : 'Box';
      case 'materials':
        return item?.type === 'Steel' ? 'Zap' : 
               item?.type === 'Concrete' ? 'Mountain' : 'TreePine';
      case 'sections':
        return 'Layers';
      case 'loads':
        return item?.type === 'load-case' ? 'Folder' : 
               item?.type === 'point-load' ? 'ArrowDown' : 'ArrowDownWideNarrow';
      case 'supports':
        return item?.type === 'fixed' ? 'Anchor' : 
               item?.type === 'pinned' ? 'Target' : 'Circle';
      default:
        return 'Circle';
    }
  };

  const filterItems = (items) => {
    if (!searchTerm) return items;
    return items?.filter(item => 
      item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      item?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  };

  const renderTreeSection = (title, items, type, icon) => {
    const isExpanded = expandedSections?.[type];
    const filteredItems = filterItems(items);
    
    return (
      <div key={type} className="mb-2">
        <button
          onClick={() => toggleSection(type)}
          className="w-full flex items-center justify-between p-2 text-left hover:bg-muted rounded transition-colors"
        >
          <div className="flex items-center">
            <Icon name={icon} size={14} className="mr-2 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{title}</span>
            <span className="ml-2 text-xs text-muted-foreground">({filteredItems?.length})</span>
          </div>
          <Icon 
            name={isExpanded ? "ChevronDown" : "ChevronRight"} 
            size={14} 
            className="text-muted-foreground" 
          />
        </button>
        {isExpanded && (
          <div className="ml-4 space-y-1">
            {filteredItems?.map((item) => {
              const itemId = `${type}-${item?.id}`;
              const isSelected = selectedItems?.includes(itemId);
              
              return (
                <div
                  key={item?.id}
                  onClick={() => handleItemClick(item, type)}
                  className={`
                    flex items-center p-2 rounded cursor-pointer transition-colors group
                    ${isSelected 
                      ? 'bg-primary/20 text-primary border border-primary/30' :'hover:bg-muted text-foreground'
                    }
                  `}
                >
                  <Icon 
                    name={getItemIcon(type, item)} 
                    size={12} 
                    className={`mr-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{item?.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {type === 'nodes' && `(${item?.coords?.join(', ')})`}
                      {type === 'elements' && `${item?.nodes?.join(' → ')}`}
                      {type === 'materials' && `E: ${item?.E}`}
                      {type === 'sections' && `A: ${item?.A}`}
                      {type === 'loads' && item?.type === 'load-case' && `${item?.loads} loads`}
                      {type === 'loads' && item?.type !== 'load-case' && `${item?.value}`}
                      {type === 'supports' && `${item?.restraints?.length} DOF`}
                    </div>
                  </div>
                  {/* Context menu button */}
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={(e) => {
                      e?.stopPropagation();
                      onAction('context-menu', { item, type, event: e });
                    }}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 p-0"
                  >
                    <Icon name="MoreVertical" size={10} />
                  </Button>
                </div>
              );
            })}
            
            {filteredItems?.length === 0 && searchTerm && (
              <div className="p-2 text-xs text-muted-foreground italic">
                No items match "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Model Tree</h3>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onAction('refresh-tree')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="RefreshCw" size={14} />
          </Button>
        </div>
        
        {/* Search */}
        <Input
          type="search"
          placeholder="Search model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="h-8 text-xs"
        />
      </div>
      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {renderTreeSection('Nodes', modelData?.nodes, 'nodes', 'Circle')}
          {renderTreeSection('Elements', modelData?.elements, 'elements', 'Box')}
          {renderTreeSection('Materials', modelData?.materials, 'materials', 'Layers')}
          {renderTreeSection('Sections', modelData?.sections, 'sections', 'Square')}
          {renderTreeSection('Loads', modelData?.loads, 'loads', 'Zap')}
          {renderTreeSection('Supports', modelData?.supports, 'supports', 'Anchor')}
        </div>
      </div>
      {/* Footer Actions */}
      <div className="p-2 border-t border-border">
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onAction('expand-all')}
            className="flex-1 text-xs"
          >
            <Icon name="ChevronDown" size={12} className="mr-1" />
            Expand
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onAction('collapse-all')}
            className="flex-1 text-xs"
          >
            <Icon name="ChevronRight" size={12} className="mr-1" />
            Collapse
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelTree;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Navigation from '../../components/ui/Navigation';
import ContextualToolbar from '../../components/ui/ContextualToolbar';
import StatusIndicator from '../../components/ui/StatusIndicator';
import ModelingToolbar from './components/ModelingToolbar';
import ModelTree from './components/ModelTree';
import Viewport3D from './components/Viewport3D';
import PropertiesPanel from './components/PropertiesPanel';
import ContextMenu from './components/ContextMenu';
import Icon from '../../components/AppIcon';


const StructuralModelingWorkspace = () => {
  const [activeMode, setActiveMode] = useState('select');
  const [selectedItems, setSelectedItems] = useState([]);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [modelStats, setModelStats] = useState({
    nodes: 6,
    elements: 7,
    materials: 3,
    loadCases: 3
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Tool shortcuts
      if (!e?.ctrlKey && !e?.altKey) {
        switch (e?.key?.toLowerCase()) {
          case 's':
            if (!e?.target?.matches('input, textarea')) {
              setActiveMode('select');
              e?.preventDefault();
            }
            break;
          case 'n':
            if (!e?.target?.matches('input, textarea')) {
              setActiveMode('node');
              e?.preventDefault();
            }
            break;
          case 'b':
            if (!e?.target?.matches('input, textarea')) {
              setActiveMode('beam');
              e?.preventDefault();
            }
            break;
          case 'p':
            if (!e?.target?.matches('input, textarea')) {
              setActiveMode('plate');
              e?.preventDefault();
            }
            break;
          case 'escape': setActiveMode('select');
            setSelectedItems([]);
            setContextMenu(null);
            break;
          case 'delete':
            if (selectedItems?.length > 0) {
              handleAction('delete-selected');
            }
            break;
        }
      }

      // Standard shortcuts
      if (e?.ctrlKey) {
        switch (e?.key?.toLowerCase()) {
          case 'a':
            if (!e?.target?.matches('input, textarea')) {
              handleAction('select-all');
              e?.preventDefault();
            }
            break;
          case 'z': handleAction('undo');
            e?.preventDefault();
            break;
          case 'y': handleAction('redo');
            e?.preventDefault();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItems]);

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    console.log(`Mode changed to: ${mode}`);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedItems(newSelection);
    console.log('Selection changed:', newSelection);
  };

  const handleAction = (action, data = null) => {
    console.log(`Action: ${action}`, data);
    
    switch (action) {
      case 'tool-selected':
        console.log(`Tool selected: ${data?.tool}`);
        break;
      
      case 'material-selected': console.log('Material selected:', data);
        break;
      
      case 'section-selected': console.log('Section selected:', data);
        break;
      
      case 'add-material': console.log('Add new material dialog');
        break;
      
      case 'add-section': console.log('Add new section dialog');
        break;
      
      case 'item-selected': console.log('Tree item selected:', data);
        break;
      
      case 'context-menu':
        setContextMenu({
          position: { x: data?.event?.clientX, y: data?.event?.clientY },
          item: `${data?.type}-${data?.item?.id}`
        });
        break;
      
      case 'element-clicked': console.log('Element clicked in viewport:', data);
        break;
      
      case 'add-node': console.log('Add node at position:', data);
        setModelStats(prev => ({ ...prev, nodes: prev?.nodes + 1 }));
        break;
      
      case 'fit-to-view': console.log('Fit model to view');
        break;
      
      case 'delete-selected':
        if (selectedItems?.length > 0) {
          console.log('Delete selected items:', selectedItems);
          setSelectedItems([]);
        }
        break;
      
      case 'select-all':
        // Mock select all functionality
        const allItems = [
          'nodes-N1', 'nodes-N2', 'nodes-N3', 'nodes-N4', 'nodes-N5', 'nodes-N6',
          'elements-B1', 'elements-B2', 'elements-B3', 'elements-B4', 'elements-C1', 'elements-C2'
        ];
        setSelectedItems(allItems);
        break;
      
      case 'undo':
        console.log('Undo last action');
        break;
      
      case 'redo':
        console.log('Redo last action');
        break;
      
      case 'snap-toggle': console.log('Toggle snap');
        break;
      
      case 'grid-toggle': console.log('Toggle grid');
        break;
      
      case 'refresh-tree': console.log('Refresh model tree');
        break;
      
      case 'expand-all': console.log('Expand all tree sections');
        break;
      
      case 'collapse-all': console.log('Collapse all tree sections');
        break;
      
      case 'clear-selection':
        setSelectedItems([]);
        break;
      
      case 'apply-changes': console.log('Apply property changes');
        break;
      
      case 'reset-properties': console.log('Reset properties to default');
        break;
      
      case 'apply-fixed-support': console.log('Apply fixed support to selected nodes');
        break;
      
      case 'apply-pinned-support': console.log('Apply pinned support to selected nodes');
        break;
      
      case 'remove-all-constraints':
        console.log('Remove all constraints from selected nodes');
        break;
      
      default:
        console.log(`Unhandled action: ${action}`, data);
    }
  };

  const handlePropertyChange = (itemId, category, property, value) => {
    console.log(`Property change: ${itemId} -> ${category}.${property} = ${value}`);
  };

  const handleContextMenuAction = (action, itemId) => {
    console.log(`Context menu action: ${action} on ${itemId}`);
    
    switch (action) {
      case 'show-properties':
        if (!selectedItems?.includes(itemId)) {
          setSelectedItems([itemId]);
        }
        break;
      
      case 'copy': console.log('Copy item:', itemId);
        break;
      
      case 'delete':
        console.log('Delete item:', itemId);
        setSelectedItems(prev => prev?.filter(id => id !== itemId));
        break;
      
      case 'add-support': console.log('Add support to node:', itemId);
        break;
      
      case 'add-load': console.log('Add load to item:', itemId);
        break;
      
      case 'connect-beam': console.log('Connect beam to node:', itemId);
        break;
      
      case 'add-element-load': console.log('Add load to element:', itemId);
        break;
      
      case 'member-releases': console.log('Configure member releases:', itemId);
        break;
      
      case 'local-axes': console.log('Configure local axes:', itemId);
        break;
      
      case 'divide-element': console.log('Divide element:', itemId);
        break;
      
      case 'reverse-direction': console.log('Reverse element direction:', itemId);
        break;
      
      default:
        console.log(`Unhandled context menu action: ${action}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>3D Structural Modeling Workspace - StruMind</title>
        <meta name="description" content="Create, edit, and visualize structural models with precision using advanced 3D modeling tools and real-time visualization." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Fixed Header */}
        <Header />
        
        {/* Navigation */}
        <Navigation />
        
        {/* Contextual Toolbar */}
        <ContextualToolbar />

        {/* Main Workspace */}
        <div className="pt-32 lg:pt-28">
          <div className="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-7rem)]">
            {/* Left Panel - Model Tree & Tools */}
            <div className={`
              ${leftPanelCollapsed ? 'w-12' : 'w-80'} 
              transition-all duration-300 bg-card border-r border-border flex flex-col
              ${leftPanelCollapsed ? 'lg:flex' : 'hidden lg:flex'}
            `}>
              {leftPanelCollapsed ? (
                <div className="p-2">
                  <button
                    onClick={() => setLeftPanelCollapsed(false)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                  >
                    <Icon name="ChevronRight" size={16} />
                  </button>
                </div>
              ) : (
                <>
                  {/* Panel Header */}
                  <div className="flex items-center justify-between p-3 border-b border-border">
                    <h2 className="text-sm font-semibold text-foreground">Model & Tools</h2>
                    <button
                      onClick={() => setLeftPanelCollapsed(true)}
                      className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    >
                      <Icon name="ChevronLeft" size={14} />
                    </button>
                  </div>

                  {/* Modeling Toolbar */}
                  <div className="border-b border-border">
                    <ModelingToolbar
                      activeMode={activeMode}
                      onModeChange={handleModeChange}
                      onAction={handleAction}
                    />
                  </div>

                  {/* Model Tree */}
                  <div className="flex-1">
                    <ModelTree
                      selectedItems={selectedItems}
                      onSelectionChange={handleSelectionChange}
                      onAction={handleAction}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Main Viewport */}
            <div className="flex-1 flex flex-col">
              <Viewport3D
                selectedItems={selectedItems}
                onSelectionChange={handleSelectionChange}
                onAction={handleAction}
                activeMode={activeMode}
              />
            </div>

            {/* Right Panel - Properties */}
            <div className={`
              ${rightPanelCollapsed ? 'w-12' : 'w-80'} 
              transition-all duration-300 bg-card border-l border-border
              ${rightPanelCollapsed ? 'lg:flex' : 'hidden lg:flex'}
            `}>
              {rightPanelCollapsed ? (
                <div className="p-2">
                  <button
                    onClick={() => setRightPanelCollapsed(false)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                  >
                    <Icon name="ChevronLeft" size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <PropertiesPanel
                    selectedItems={selectedItems}
                    onPropertyChange={handlePropertyChange}
                    onAction={handleAction}
                  />
                  
                  {/* Panel Collapse Button */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => setRightPanelCollapsed(true)}
                      className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    >
                      <Icon name="ChevronRight" size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Panel Toggle Buttons */}
        <div className="lg:hidden fixed bottom-20 left-4 flex flex-col space-y-2 z-30">
          <button
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className="w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center"
          >
            <Icon name="Layers" size={20} />
          </button>
          <button
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full shadow-lg flex items-center justify-center"
          >
            <Icon name="Settings" size={20} />
          </button>
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            position={contextMenu?.position}
            selectedItem={contextMenu?.item}
            onAction={handleContextMenuAction}
            onClose={() => setContextMenu(null)}
          />
        )}

        {/* Status Indicator */}
        <StatusIndicator />
      </div>
    </>
  );
};

export default StructuralModelingWorkspace;
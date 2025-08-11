import React from 'react';
import Icon from '../../../components/AppIcon';

const ContextMenu = ({ position, selectedItem, onAction, onClose }) => {
  if (!position || !selectedItem) return null;

  const getMenuItems = () => {
    const [type, id] = selectedItem?.split('-');
    
    const commonItems = [
      { label: 'Properties', icon: 'Settings', action: 'show-properties' },
      { type: 'separator' },
      { label: 'Copy', icon: 'Copy', action: 'copy', shortcut: 'Ctrl+C' },
      { label: 'Delete', icon: 'Trash2', action: 'delete', shortcut: 'Del', danger: true },
    ];

    switch (type) {
      case 'nodes':
        return [
          { label: 'Add Support', icon: 'Anchor', action: 'add-support' },
          { label: 'Add Load', icon: 'Zap', action: 'add-load' },
          { label: 'Connect Beam', icon: 'Minus', action: 'connect-beam' },
          { type: 'separator' },
          ...commonItems
        ];
      
      case 'elements':
        return [
          { label: 'Add Load', icon: 'ArrowDown', action: 'add-element-load' },
          { label: 'Member Releases', icon: 'Unlock', action: 'member-releases' },
          { label: 'Local Axes', icon: 'Compass', action: 'local-axes' },
          { type: 'separator' },
          { label: 'Divide Element', icon: 'Scissors', action: 'divide-element' },
          { label: 'Reverse Direction', icon: 'ArrowLeftRight', action: 'reverse-direction' },
          { type: 'separator' },
          ...commonItems
        ];
      
      default:
        return commonItems;
    }
  };

  const handleItemClick = (action) => {
    onAction(action, selectedItem);
    onClose();
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      {/* Context Menu */}
      <div
        className="fixed z-50 min-w-48 bg-popover border border-border rounded-md shadow-modal py-1"
        style={{
          left: position?.x,
          top: position?.y,
          transform: 'translate(0, 0)'
        }}
      >
        {menuItems?.map((item, index) => {
          if (item?.type === 'separator') {
            return <div key={index} className="h-px bg-border my-1" />;
          }

          return (
            <button
              key={index}
              onClick={() => handleItemClick(item?.action)}
              className={`
                w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors
                ${item?.danger 
                  ? 'text-error hover:bg-error/10' :'text-popover-foreground hover:bg-muted'
                }
              `}
            >
              <div className="flex items-center">
                <Icon name={item?.icon} size={16} className="mr-3" />
                {item?.label}
              </div>
              {item?.shortcut && (
                <span className="text-xs text-muted-foreground font-mono ml-4">
                  {item?.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ContextMenu;
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const fileMenuItems = [
    { label: 'New Project', icon: 'Plus', shortcut: 'Ctrl+N' },
    { label: 'Open Project', icon: 'FolderOpen', shortcut: 'Ctrl+O' },
    { label: 'Save Project', icon: 'Save', shortcut: 'Ctrl+S' },
    { label: 'Save As...', icon: 'SaveAs', shortcut: 'Ctrl+Shift+S' },
    { type: 'separator' },
    { label: 'Import Model', icon: 'Upload' },
    { label: 'Export Model', icon: 'Download' },
    { type: 'separator' },
    { label: 'Recent Projects', icon: 'Clock' },
  ];

  const userMenuItems = [
    { label: 'Profile Settings', icon: 'User' },
    { label: 'Preferences', icon: 'Settings' },
    { label: 'License Info', icon: 'Shield' },
    { type: 'separator' },
    { label: 'Help & Support', icon: 'HelpCircle' },
    { label: 'Documentation', icon: 'Book' },
    { type: 'separator' },
    { label: 'Sign Out', icon: 'LogOut' },
  ];

  const handleFileAction = (action) => {
    console.log(`File action: ${action}`);
    setIsFileMenuOpen(false);
  };

  const handleUserAction = (action) => {
    console.log(`User action: ${action}`);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-foreground"
              >
                <path
                  d="M3 21L12 2L21 21H3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 17H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 13H14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">StruMind</h1>
              <p className="text-xs text-muted-foreground">Structural Engineering</p>
            </div>
          </div>
        </div>

        {/* File Operations */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
              className="text-foreground hover:bg-muted"
            >
              <Icon name="File" size={16} className="mr-2" />
              File
              <Icon name="ChevronDown" size={14} className="ml-1" />
            </Button>

            {isFileMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-popover border border-border rounded-md shadow-modal z-50">
                <div className="py-1">
                  {fileMenuItems?.map((item, index) => (
                    item?.type === 'separator' ? (
                      <div key={index} className="h-px bg-border my-1" />
                    ) : (
                      <button
                        key={index}
                        onClick={() => handleFileAction(item?.label)}
                        className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center">
                          <Icon name={item?.icon} size={16} className="mr-3" />
                          {item?.label}
                        </div>
                        {item?.shortcut && (
                          <span className="text-xs text-muted-foreground font-mono">
                            {item?.shortcut}
                          </span>
                        )}
                      </button>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFileAction('Quick Save')}
            className="text-foreground hover:bg-muted"
          >
            <Icon name="Save" size={16} />
          </Button>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">John Engineer</p>
            <p className="text-xs text-muted-foreground">Professional License</p>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              JE
            </Button>

            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-modal z-50">
                <div className="py-1">
                  {userMenuItems?.map((item, index) => (
                    item?.type === 'separator' ? (
                      <div key={index} className="h-px bg-border my-1" />
                    ) : (
                      <button
                        key={index}
                        onClick={() => handleUserAction(item?.label)}
                        className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted flex items-center transition-colors"
                      >
                        <Icon name={item?.icon} size={16} className="mr-3" />
                        {item?.label}
                      </button>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Click outside handlers */}
      {(isFileMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsFileMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
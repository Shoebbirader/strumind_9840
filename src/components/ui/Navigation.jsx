import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/project-dashboard',
      icon: 'LayoutDashboard',
      description: 'Project management and overview'
    },
    {
      id: 'model',
      label: 'Model',
      path: '/3d-structural-modeling-workspace',
      icon: 'Box',
      description: '3D structural modeling workspace'
    },
    {
      id: 'analysis',
      label: 'Analysis',
      path: '/analysis-setup-and-configuration',
      icon: 'Calculator',
      description: 'Analysis setup and results',
      subItems: [
        {
          label: 'Setup',
          path: '/analysis-setup-and-configuration',
          icon: 'Settings'
        },
        {
          label: 'Results',
          path: '/analysis-results-visualization',
          icon: 'BarChart3'
        }
      ]
    },
    {
      id: 'design',
      label: 'Design',
      path: '/design-code-verification',
      icon: 'Shield',
      description: 'Code verification and compliance'
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/project-settings-and-configuration',
      icon: 'Cog',
      description: 'Project configuration'
    }
  ];

  const getActiveItem = () => {
    const currentPath = location?.pathname;
    return navigationItems?.find(item => {
      if (item?.path === currentPath) return true;
      if (item?.subItems) {
        return item?.subItems?.some(subItem => subItem?.path === currentPath);
      }
      return false;
    });
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const activeItem = getActiveItem();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block sticky top-16 z-40 bg-card border-b border-border">
        <div className="px-6">
          <div className="flex items-center space-x-1">
            {navigationItems?.map((item) => {
              const isActive = activeItem?.id === item?.id;
              
              return (
                <div key={item?.id} className="relative group">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      h-12 px-4 rounded-none border-b-2 transition-all duration-200
                      ${isActive 
                        ? 'border-primary bg-primary/10 text-primary' :'border-transparent hover:border-muted hover:bg-muted/50 text-foreground'
                      }
                    `}
                  >
                    <Icon name={item?.icon} size={18} className="mr-2" />
                    {item?.label}
                  </Button>
                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-popover border border-border rounded-md shadow-modal opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    <p className="text-sm text-popover-foreground">{item?.description}</p>
                  </div>
                  {/* Sub-navigation for Analysis */}
                  {item?.subItems && isActive && (
                    <div className="absolute top-full left-0 mt-0 bg-popover border border-border rounded-md shadow-modal z-50 min-w-48">
                      <div className="py-1">
                        {item?.subItems?.map((subItem) => (
                          <button
                            key={subItem?.path}
                            onClick={() => handleNavigation(subItem?.path)}
                            className={`
                              w-full px-3 py-2 text-left text-sm flex items-center transition-colors
                              ${location?.pathname === subItem?.path
                                ? 'bg-primary/10 text-primary' :'text-popover-foreground hover:bg-muted'
                              }
                            `}
                          >
                            <Icon name={subItem?.icon} size={16} className="mr-3" />
                            {subItem?.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>
      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-card border-b border-border">
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full justify-between text-foreground"
          >
            <div className="flex items-center">
              <Icon name={activeItem?.icon || 'Menu'} size={18} className="mr-2" />
              {activeItem?.label || 'Navigation'}
            </div>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transform transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} 
            />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-popover border-t border-border">
            <div className="py-2">
              {navigationItems?.map((item) => (
                <div key={item?.id}>
                  <button
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      w-full px-4 py-3 text-left flex items-center transition-colors
                      ${activeItem?.id === item?.id
                        ? 'bg-primary/10 text-primary border-r-2 border-primary' :'text-popover-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon name={item?.icon} size={18} className="mr-3" />
                    <div>
                      <p className="font-medium">{item?.label}</p>
                      <p className="text-xs text-muted-foreground">{item?.description}</p>
                    </div>
                  </button>

                  {/* Mobile Sub-items */}
                  {item?.subItems && activeItem?.id === item?.id && (
                    <div className="bg-muted/30">
                      {item?.subItems?.map((subItem) => (
                        <button
                          key={subItem?.path}
                          onClick={() => handleNavigation(subItem?.path)}
                          className={`
                            w-full px-8 py-2 text-left text-sm flex items-center transition-colors
                            ${location?.pathname === subItem?.path
                              ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-muted'
                            }
                          `}
                        >
                          <Icon name={subItem?.icon} size={16} className="mr-3" />
                          {subItem?.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
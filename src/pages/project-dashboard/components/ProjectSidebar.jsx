import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProjectSidebar = ({ projects, onProjectSelect, selectedProject }) => {
  const navigate = useNavigate();
  const [expandedFolders, setExpandedFolders] = useState(['recent', 'projects']);

  const recentProjects = projects?.slice(0, 5);
  
  const projectsByType = projects?.reduce((acc, project) => {
    if (!acc?.[project?.type]) {
      acc[project.type] = [];
    }
    acc?.[project?.type]?.push(project);
    return acc;
  }, {});

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => 
      prev?.includes(folderId) 
        ? prev?.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleProjectClick = (project) => {
    onProjectSelect(project);
    navigate('/3d-structural-modeling-workspace', { state: { projectId: project?.id } });
  };

  const getProjectIcon = (type) => {
    switch (type) {
      case 'Building Frame': return 'Building';
      case 'Bridge': return 'Bridge';
      case 'Truss': return 'Triangle';
      case 'Industrial': return 'Factory';
      default: return 'FileText';
    }
  };

  return (
    <div className="h-full bg-card border-r border-border overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-foreground mb-4">Project Explorer</h2>

        {/* Recent Projects */}
        <div className="mb-6">
          <button
            onClick={() => toggleFolder('recent')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-foreground hover:text-primary transition-colors mb-2"
          >
            <div className="flex items-center space-x-2">
              <Icon 
                name={expandedFolders?.includes('recent') ? 'ChevronDown' : 'ChevronRight'} 
                size={14} 
              />
              <Icon name="Clock" size={14} />
              <span>Recent Projects</span>
            </div>
            <span className="text-xs text-muted-foreground">{recentProjects?.length}</span>
          </button>

          {expandedFolders?.includes('recent') && (
            <div className="ml-6 space-y-1">
              {recentProjects?.map((project) => (
                <button
                  key={`recent-${project?.id}`}
                  onClick={() => handleProjectClick(project)}
                  className={`
                    w-full text-left p-2 rounded-md text-xs transition-colors
                    ${selectedProject?.id === project?.id 
                      ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <Icon name={getProjectIcon(project?.type)} size={12} />
                    <span className="truncate">{project?.name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">{project?.type}</span>
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={project?.status === 'completed' ? 'CheckCircle' : 
                              project?.status === 'running' ? 'Loader2' : 
                              project?.status === 'error' ? 'XCircle' : 'FileText'} 
                        size={10} 
                        className={
                          project?.status === 'completed' ? 'text-success' :
                          project?.status === 'running' ? 'text-warning animate-spin' :
                          project?.status === 'error'? 'text-error' : 'text-muted-foreground'
                        }
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Projects by Type */}
        <div className="mb-6">
          <button
            onClick={() => toggleFolder('projects')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-foreground hover:text-primary transition-colors mb-2"
          >
            <div className="flex items-center space-x-2">
              <Icon 
                name={expandedFolders?.includes('projects') ? 'ChevronDown' : 'ChevronRight'} 
                size={14} 
              />
              <Icon name="Folder" size={14} />
              <span>All Projects</span>
            </div>
            <span className="text-xs text-muted-foreground">{projects?.length}</span>
          </button>

          {expandedFolders?.includes('projects') && (
            <div className="ml-6 space-y-2">
              {Object.entries(projectsByType)?.map(([type, typeProjects]) => (
                <div key={type}>
                  <button
                    onClick={() => toggleFolder(type)}
                    className="flex items-center justify-between w-full text-left text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-1"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={expandedFolders?.includes(type) ? 'ChevronDown' : 'ChevronRight'} 
                        size={12} 
                      />
                      <Icon name={getProjectIcon(type)} size={12} />
                      <span>{type}</span>
                    </div>
                    <span className="text-xs">{typeProjects?.length}</span>
                  </button>

                  {expandedFolders?.includes(type) && (
                    <div className="ml-4 space-y-1">
                      {typeProjects?.map((project) => (
                        <button
                          key={`type-${project?.id}`}
                          onClick={() => handleProjectClick(project)}
                          className={`
                            w-full text-left p-1.5 rounded-md text-xs transition-colors
                            ${selectedProject?.id === project?.id 
                              ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{project?.name}</span>
                            <Icon 
                              name={project?.status === 'completed' ? 'CheckCircle' : 
                                    project?.status === 'running' ? 'Loader2' : 
                                    project?.status === 'error' ? 'XCircle' : 'FileText'} 
                              size={10} 
                              className={
                                project?.status === 'completed' ? 'text-success' :
                                project?.status === 'running' ? 'text-warning animate-spin' :
                                project?.status === 'error'? 'text-error' : 'text-muted-foreground'
                              }
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Actions</h3>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => navigate('/project-settings-and-configuration')}
          >
            <Icon name="Settings" size={14} className="mr-2" />
            Project Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => navigate('/analysis-setup-and-configuration')}
          >
            <Icon name="Calculator" size={14} className="mr-2" />
            Analysis Setup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
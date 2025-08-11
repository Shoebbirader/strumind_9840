import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProjectListView = ({ projects, onDuplicate, onDelete }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'running': return 'text-warning';
      case 'error': return 'text-error';
      case 'draft': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'running': return 'Loader2';
      case 'error': return 'XCircle';
      case 'draft': return 'FileText';
      default: return 'FileText';
    }
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

  const handleOpen = (project) => {
    navigate('/3d-structural-modeling-workspace', { state: { projectId: project?.id } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (projects?.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="FolderOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border px-6 py-3">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <div className="col-span-4">Project</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Modified</div>
          <div className="col-span-1">Stats</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>
      {/* Project List */}
      <div className="divide-y divide-border">
        {projects?.map((project) => (
          <div
            key={project?.id}
            className="px-6 py-4 hover:bg-muted/30 transition-colors group"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Project Info */}
              <div className="col-span-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={getProjectIcon(project?.type)} size={16} className="text-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <button
                      onClick={() => handleOpen(project)}
                      className="text-left"
                    >
                      <h3 className="font-medium text-foreground hover:text-primary transition-colors truncate">
                        {project?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {project?.description || 'No description'}
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Type */}
              <div className="col-span-2">
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
                  {project?.type}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getStatusIcon(project?.status)} 
                    size={14} 
                    className={`${getStatusColor(project?.status)} ${project?.status === 'running' ? 'animate-spin' : ''}`}
                  />
                  <span className={`text-sm capitalize ${getStatusColor(project?.status)}`}>
                    {project?.status}
                  </span>
                </div>
              </div>

              {/* Modified */}
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground">
                  <div>{formatDate(project?.lastModified)?.split(',')?.[0]}</div>
                  <div className="text-xs">{formatDate(project?.lastModified)?.split(',')?.[1]}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="col-span-1">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center space-x-1">
                    <Icon name="Circle" size={8} />
                    <span>{project?.stats?.nodes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Box" size={8} />
                    <span>{project?.stats?.elements}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1">
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleOpen(project)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon name="FolderOpen" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onDuplicate(project)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon name="Copy" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onDelete(project)}
                    className="h-8 w-8 p-0 hover:text-error"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectListView;
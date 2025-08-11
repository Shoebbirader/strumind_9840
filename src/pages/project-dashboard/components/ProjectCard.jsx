import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProjectCard = ({ project, onDuplicate, onDelete }) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);

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

  const handleOpen = () => {
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

  return (
    <div 
      className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-200 hover:shadow-lg"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Thumbnail */}
      <div className="relative h-32 bg-muted overflow-hidden">
        <Image
          src={project?.thumbnail}
          alt={`${project?.name} thumbnail`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Quick Actions Overlay */}
        {showActions && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center space-x-2 transition-opacity duration-200">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpen}
              className="bg-white/90 text-black hover:bg-white"
            >
              <Icon name="FolderOpen" size={16} className="mr-1" />
              Open
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDuplicate(project)}
              className="bg-white/20 text-white hover:bg-white/30"
            >
              <Icon name="Copy" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(project)}
              className="bg-white/20 text-white hover:bg-red-500/80"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        )}

        {/* Project Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs rounded-md font-medium">
            {project?.type}
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {project?.name}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            <Icon 
              name={getStatusIcon(project?.status)} 
              size={14} 
              className={`${getStatusColor(project?.status)} ${project?.status === 'running' ? 'animate-spin' : ''}`}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {project?.description}
        </p>

        {/* Project Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="flex items-center space-x-1">
            <Icon name="Circle" size={10} className="text-muted-foreground" />
            <span className="text-muted-foreground">Nodes:</span>
            <span className="text-foreground font-mono">{project?.stats?.nodes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Box" size={10} className="text-muted-foreground" />
            <span className="text-muted-foreground">Elements:</span>
            <span className="text-foreground font-mono">{project?.stats?.elements}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDate(project?.lastModified)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="User" size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {project?.author}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
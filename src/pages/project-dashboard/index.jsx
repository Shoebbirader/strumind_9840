import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Navigation from '../../components/ui/Navigation';
import ContextualToolbar from '../../components/ui/ContextualToolbar';
import StatusIndicator from '../../components/ui/StatusIndicator';
import ProjectCard from './components/ProjectCard';
import ProjectSidebar from './components/ProjectSidebar';
import NewProjectModal from './components/NewProjectModal';
import ProjectFilters from './components/ProjectFilters';
import ProjectListView from './components/ProjectListView';

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastModified');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock project data
  useEffect(() => {
    const mockProjects = [
      {
        id: '1',
        name: 'Downtown Office Complex',
        description: 'Multi-story commercial building with steel frame structure and composite floors',
        type: 'Building Frame',
        status: 'completed',
        author: 'John Engineer',
        createdDate: '2025-01-15T10:30:00Z',
        lastModified: '2025-01-20T14:45:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
        stats: {
          nodes: 1247,
          elements: 2891,
          materials: 3,
          loadCases: 5
        }
      },
      {
        id: '2',
        name: 'Highway Bridge Overpass',
        description: 'Prestressed concrete bridge with 3 spans over major highway intersection',
        type: 'Bridge',
        status: 'running',
        author: 'John Engineer',
        createdDate: '2025-01-10T09:15:00Z',
        lastModified: '2025-01-18T16:20:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        stats: {
          nodes: 892,
          elements: 1456,
          materials: 2,
          loadCases: 8
        }
      },
      {
        id: '3',
        name: 'Industrial Warehouse Truss',
        description: 'Large span steel truss system for manufacturing facility with crane loads',
        type: 'Truss',
        status: 'draft',
        author: 'John Engineer',
        createdDate: '2025-01-05T11:00:00Z',
        lastModified: '2025-01-16T13:30:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop',
        stats: {
          nodes: 456,
          elements: 789,
          materials: 1,
          loadCases: 3
        }
      },
      {
        id: '4',
        name: 'Residential Tower Foundation',
        description: 'High-rise residential building with deep foundation system and shear walls',
        type: 'Building Frame',
        status: 'error',
        author: 'John Engineer',
        createdDate: '2025-01-12T08:45:00Z',
        lastModified: '2025-01-17T10:15:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
        stats: {
          nodes: 2134,
          elements: 3567,
          materials: 4,
          loadCases: 12
        }
      },
      {
        id: '5',
        name: 'Factory Expansion Project',
        description: 'Steel frame expansion with heavy machinery loads and seismic considerations',
        type: 'Industrial',
        status: 'completed',
        author: 'John Engineer',
        createdDate: '2025-01-08T14:20:00Z',
        lastModified: '2025-01-19T09:40:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
        stats: {
          nodes: 678,
          elements: 1234,
          materials: 2,
          loadCases: 6
        }
      },
      {
        id: '6',
        name: 'Pedestrian Bridge',
        description: 'Lightweight steel and timber pedestrian bridge with cable stays',
        type: 'Bridge',
        status: 'draft',
        author: 'John Engineer',
        createdDate: '2025-01-14T16:10:00Z',
        lastModified: '2025-01-21T11:25:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop',
        stats: {
          nodes: 234,
          elements: 456,
          materials: 3,
          loadCases: 4
        }
      }
    ];
    
    setProjects(mockProjects);
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects?.filter(project => {
      const matchesSearch = project?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           project?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesType = !filterType || project?.type === filterType;
      const matchesStatus = !filterStatus || project?.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });

    // Sort projects
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'nameDesc':
          return b?.name?.localeCompare(a?.name);
        case 'created':
          return new Date(b.createdDate) - new Date(a.createdDate);
        case 'type':
          return a?.type?.localeCompare(b?.type);
        case 'status':
          return a?.status?.localeCompare(b?.status);
        case 'lastModified':
        default:
          return new Date(b.lastModified) - new Date(a.lastModified);
      }
    });

    return filtered;
  }, [projects, searchTerm, sortBy, filterType, filterStatus]);

  const handleCreateProject = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    navigate('/3d-structural-modeling-workspace', { state: { projectId: newProject?.id } });
  };

  const handleDuplicateProject = (project) => {
    const duplicatedProject = {
      ...project,
      id: Date.now()?.toString(),
      name: `${project?.name} (Copy)`,
      createdDate: new Date()?.toISOString(),
      lastModified: new Date()?.toISOString(),
      status: 'draft'
    };
    setProjects(prev => [duplicatedProject, ...prev]);
  };

  const handleDeleteProject = (project) => {
    if (window.confirm(`Are you sure you want to delete "${project?.name}"? This action cannot be undone.`)) {
      setProjects(prev => prev?.filter(p => p?.id !== project?.id));
      if (selectedProject?.id === project?.id) {
        setSelectedProject(null);
      }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
    setSortBy('lastModified');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <ContextualToolbar />
      <div className="pt-32 lg:pt-28">
        <div className="flex h-[calc(100vh-8rem)]">
          {/* Sidebar */}
          <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden lg:block hidden`}>
            <ProjectSidebar
              projects={projects}
              onProjectSelect={setSelectedProject}
              selectedProject={selectedProject}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden"
                  >
                    <Icon name="Menu" size={16} />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Project Dashboard</h1>
                    <p className="text-muted-foreground">
                      Manage your structural analysis projects and access recent work
                    </p>
                  </div>
                </div>

                <Button
                  variant="default"
                  onClick={() => setIsNewProjectModalOpen(true)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  New Project
                </Button>
              </div>

              {/* Filters */}
              <ProjectFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filterType={filterType}
                onFilterTypeChange={setFilterType}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onClearFilters={handleClearFilters}
              />

              {/* Projects Display */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedProjects?.map((project) => (
                    <ProjectCard
                      key={project?.id}
                      project={project}
                      onDuplicate={handleDuplicateProject}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </div>
              ) : (
                <ProjectListView
                  projects={filteredAndSortedProjects}
                  onDuplicate={handleDuplicateProject}
                  onDelete={handleDeleteProject}
                />
              )}

              {/* Empty State */}
              {filteredAndSortedProjects?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="FolderOpen" size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {projects?.length === 0 ? 'No projects yet' : 'No projects found'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {projects?.length === 0 
                      ? 'Create your first structural analysis project to get started' :'Try adjusting your search or filter criteria'
                    }
                  </p>
                  {projects?.length === 0 && (
                    <Button
                      variant="default"
                      onClick={() => setIsNewProjectModalOpen(true)}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Create Your First Project
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
      <StatusIndicator />
    </div>
  );
};

export default ProjectDashboard;
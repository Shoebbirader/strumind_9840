import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ProjectFilters = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  filterType, 
  onFilterTypeChange,
  filterStatus,
  onFilterStatusChange,
  viewMode,
  onViewModeChange,
  onClearFilters 
}) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const sortOptions = [
    { value: 'lastModified', label: 'Last Modified' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'nameDesc', label: 'Name (Z-A)' },
    { value: 'created', label: 'Date Created' },
    { value: 'type', label: 'Project Type' },
    { value: 'status', label: 'Status' }
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Building Frame', label: 'Building Frame' },
    { value: 'Bridge', label: 'Bridge' },
    { value: 'Truss', label: 'Truss' },
    { value: 'Industrial', label: 'Industrial' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'running', label: 'Running' },
    { value: 'completed', label: 'Completed' },
    { value: 'error', label: 'Error' }
  ];

  const hasActiveFilters = searchTerm || filterType || filterStatus || sortBy !== 'lastModified';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Main Filter Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex items-center space-x-2">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            className="w-40"
          />

          <Button
            variant={isFiltersExpanded ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="whitespace-nowrap"
          >
            <Icon name="Filter" size={16} className="mr-1" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant={viewMode === 'grid' ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-r-none border-r border-border"
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-l-none"
            >
              <Icon name="List" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Expanded Filters */}
      {isFiltersExpanded && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Project Type"
              options={typeOptions}
              value={filterType}
              onChange={onFilterTypeChange}
            />

            <Select
              label="Status"
              options={statusOptions}
              value={filterStatus}
              onChange={onFilterStatusChange}
            />

            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
                className="w-full"
              >
                <Icon name="X" size={16} className="mr-1" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
              Search: "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {filterType && (
            <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
              Type: {filterType}
              <button
                onClick={() => onFilterTypeChange('')}
                className="ml-1 hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {filterStatus && (
            <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
              Status: {filterStatus}
              <button
                onClick={() => onFilterStatusChange('')}
                className="ml-1 hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;
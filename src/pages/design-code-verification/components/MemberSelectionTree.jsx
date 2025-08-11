import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MemberSelectionTree = ({ selectedMember, onMemberSelect, filterStatus, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    beams: true,
    columns: true,
    connections: false
  });

  const mockMembers = {
    beams: [
      {
        id: 'B1',
        name: 'Beam B1',
        material: 'Steel',
        section: 'ISMB 300',
        status: 'pass',
        utilization: 0.78,
        location: 'Grid A-B, Level 1'
      },
      {
        id: 'B2',
        name: 'Beam B2',
        material: 'Steel',
        section: 'ISMB 400',
        status: 'fail',
        utilization: 1.12,
        location: 'Grid B-C, Level 1'
      },
      {
        id: 'B3',
        name: 'Beam B3',
        material: 'Concrete',
        section: '300x500',
        status: 'pass',
        utilization: 0.65,
        location: 'Grid C-D, Level 2'
      },
      {
        id: 'B4',
        name: 'Beam B4',
        material: 'Steel',
        section: 'ISMB 350',
        status: 'warning',
        utilization: 0.95,
        location: 'Grid D-E, Level 2'
      }
    ],
    columns: [
      {
        id: 'C1',
        name: 'Column C1',
        material: 'Steel',
        section: 'ISHB 300',
        status: 'pass',
        utilization: 0.72,
        location: 'Grid A1, All Levels'
      },
      {
        id: 'C2',
        name: 'Column C2',
        material: 'Concrete',
        section: '400x400',
        status: 'pass',
        utilization: 0.68,
        location: 'Grid B2, All Levels'
      },
      {
        id: 'C3',
        name: 'Column C3',
        material: 'Steel',
        section: 'ISHB 350',
        status: 'fail',
        utilization: 1.05,
        location: 'Grid C3, All Levels'
      }
    ],
    connections: [
      {
        id: 'CN1',
        name: 'Connection CN1',
        material: 'Steel',
        section: 'Bolted',
        status: 'pass',
        utilization: 0.58,
        location: 'Beam-Column Joint A1-B1'
      },
      {
        id: 'CN2',
        name: 'Connection CN2',
        material: 'Steel',
        section: 'Welded',
        status: 'warning',
        utilization: 0.92,
        location: 'Beam-Column Joint B2-C2'
      }
    ]
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'fail':
        return { icon: 'XCircle', color: 'text-error' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getFilteredMembers = (members) => {
    if (filterStatus === 'all') return members;
    return members?.filter(member => member?.status === filterStatus);
  };

  const renderMemberItem = (member) => {
    const statusConfig = getStatusIcon(member?.status);
    const isSelected = selectedMember?.id === member?.id;

    return (
      <div
        key={member?.id}
        onClick={() => onMemberSelect(member)}
        className={`
          p-3 rounded-md cursor-pointer transition-all duration-200 border
          ${isSelected 
            ? 'bg-primary/10 border-primary/30 text-primary' :'bg-card border-border hover:bg-muted/50'
          }
        `}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name={statusConfig?.icon} size={16} className={statusConfig?.color} />
              <span className="font-medium text-sm truncate">{member?.name}</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center space-x-1">
                <Icon name="Layers" size={12} />
                <span>{member?.material} - {member?.section}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={12} />
                <span className="truncate">{member?.location}</span>
              </div>
            </div>
          </div>
          <div className="text-right ml-2">
            <div className={`text-xs font-mono ${
              member?.utilization > 1.0 ? 'text-error' :
              member?.utilization > 0.9 ? 'text-warning': 'text-success'
            }`}>
              {(member?.utilization * 100)?.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (sectionKey, title, icon, members) => {
    const isExpanded = expandedSections?.[sectionKey];
    const filteredMembers = getFilteredMembers(members);
    const failedCount = members?.filter(m => m?.status === 'fail')?.length;
    const warningCount = members?.filter(m => m?.status === 'warning')?.length;

    return (
      <div key={sectionKey} className="mb-4">
        <Button
          variant="ghost"
          onClick={() => toggleSection(sectionKey)}
          className="w-full justify-between p-2 h-auto text-left hover:bg-muted/50"
        >
          <div className="flex items-center space-x-2">
            <Icon name={icon} size={16} className="text-muted-foreground" />
            <span className="font-medium text-sm">{title}</span>
            <span className="text-xs text-muted-foreground">({filteredMembers?.length})</span>
            {(failedCount > 0 || warningCount > 0) && (
              <div className="flex items-center space-x-1">
                {failedCount > 0 && (
                  <span className="text-xs bg-error/20 text-error px-1.5 py-0.5 rounded">
                    {failedCount}
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="text-xs bg-warning/20 text-warning px-1.5 py-0.5 rounded">
                    {warningCount}
                  </span>
                )}
              </div>
            )}
          </div>
          <Icon 
            name="ChevronDown" 
            size={14} 
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </Button>
        {isExpanded && (
          <div className="mt-2 space-y-2 pl-2">
            {filteredMembers?.length > 0 ? (
              filteredMembers?.map(renderMemberItem)
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Icon name="Search" size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No members match current filter</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-3">Member Selection</h3>
        
        {/* Filter Controls */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {[
              { value: 'all', label: 'All', icon: 'List' },
              { value: 'pass', label: 'Pass', icon: 'CheckCircle' },
              { value: 'warning', label: 'Warning', icon: 'AlertTriangle' },
              { value: 'fail', label: 'Fail', icon: 'XCircle' }
            ]?.map((filter) => (
              <Button
                key={filter?.value}
                variant={filterStatus === filter?.value ? "default" : "ghost"}
                size="xs"
                onClick={() => onFilterChange(filter?.value)}
                className="h-7"
              >
                <Icon name={filter?.icon} size={12} className="mr-1" />
                {filter?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Member Tree */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderSection('beams', 'Beams', 'Minus', mockMembers?.beams)}
        {renderSection('columns', 'Columns', 'BarChart3', mockMembers?.columns)}
        {renderSection('connections', 'Connections', 'Link', mockMembers?.connections)}
      </div>
      {/* Summary Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Total Members:</span>
            <span className="font-mono">
              {mockMembers?.beams?.length + mockMembers?.columns?.length + mockMembers?.connections?.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Failed Checks:</span>
            <span className="font-mono text-error">
              {[...mockMembers?.beams, ...mockMembers?.columns, ...mockMembers?.connections]?.filter(m => m?.status === 'fail')?.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Warnings:</span>
            <span className="font-mono text-warning">
              {[...mockMembers?.beams, ...mockMembers?.columns, ...mockMembers?.connections]?.filter(m => m?.status === 'warning')?.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberSelectionTree;
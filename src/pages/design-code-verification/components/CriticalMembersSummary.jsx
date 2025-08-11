import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CriticalMembersSummary = ({ onMemberSelect }) => {
  const [sortBy, setSortBy] = useState('utilization');
  const [sortOrder, setSortOrder] = useState('desc');

  const mockCriticalMembers = [
    {
      id: 'B2',
      name: 'Beam B2',
      type: 'Beam',
      material: 'Steel',
      section: 'ISMB 400',
      location: 'Grid B-C, Level 1',
      utilization: 1.12,
      status: 'fail',
      governingCheck: 'Flexural Capacity',
      demand: 364.7,
      capacity: 325.6,
      unit: 'kN-m'
    },
    {
      id: 'C3',
      name: 'Column C3',
      type: 'Column',
      material: 'Steel',
      section: 'ISHB 350',
      location: 'Grid C3, All Levels',
      utilization: 1.05,
      status: 'fail',
      governingCheck: 'Axial Capacity',
      demand: 1247.8,
      capacity: 1188.4,
      unit: 'kN'
    },
    {
      id: 'B4',
      name: 'Beam B4',
      type: 'Beam',
      material: 'Steel',
      section: 'ISMB 350',
      location: 'Grid D-E, Level 2',
      utilization: 0.95,
      status: 'warning',
      governingCheck: 'Deflection',
      demand: 23.8,
      capacity: 25.0,
      unit: 'mm'
    },
    {
      id: 'CN2',
      name: 'Connection CN2',
      type: 'Connection',
      material: 'Steel',
      section: 'Welded',
      location: 'Beam-Column Joint B2-C2',
      utilization: 0.92,
      status: 'warning',
      governingCheck: 'Bolt Shear',
      demand: 184.2,
      capacity: 200.0,
      unit: 'kN'
    },
    {
      id: 'B1',
      name: 'Beam B1',
      type: 'Beam',
      material: 'Steel',
      section: 'ISMB 300',
      location: 'Grid A-B, Level 1',
      utilization: 0.78,
      status: 'pass',
      governingCheck: 'Flexural Capacity',
      demand: 191.7,
      capacity: 245.8,
      unit: 'kN-m'
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pass':
        return { icon: 'CheckCircle', color: 'text-success', bgColor: 'bg-success/10' };
      case 'fail':
        return { icon: 'XCircle', color: 'text-error', bgColor: 'bg-error/10' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning', bgColor: 'bg-warning/10' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground', bgColor: 'bg-muted/10' };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Beam':
        return 'Minus';
      case 'Column':
        return 'BarChart3';
      case 'Connection':
        return 'Link';
      default:
        return 'Box';
    }
  };

  const sortMembers = (members) => {
    return [...members]?.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'utilization':
          aValue = a?.utilization;
          bValue = b?.utilization;
          break;
        case 'name':
          aValue = a?.name;
          bValue = b?.name;
          break;
        case 'type':
          aValue = a?.type;
          bValue = b?.type;
          break;
        case 'status':
          const statusOrder = { fail: 3, warning: 2, pass: 1 };
          aValue = statusOrder?.[a?.status];
          bValue = statusOrder?.[b?.status];
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedMembers = sortMembers(mockCriticalMembers);
  const failedMembers = sortedMembers?.filter(m => m?.status === 'fail');
  const warningMembers = sortedMembers?.filter(m => m?.status === 'warning');

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Critical Members Summary</h3>
            <p className="text-sm text-muted-foreground">
              Members requiring attention sorted by utilization ratio
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <span className="text-muted-foreground">Failed: {failedMembers?.length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-muted-foreground">Warning: {warningMembers?.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Table Header */}
      <div className="px-4 py-2 bg-muted/30 border-b border-border">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground">
          <div className="col-span-1">Status</div>
          <div className="col-span-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleSort('name')}
              className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Member
              {sortBy === 'name' && (
                <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} className="ml-1" />
              )}
            </Button>
          </div>
          <div className="col-span-1">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleSort('type')}
              className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Type
              {sortBy === 'type' && (
                <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} className="ml-1" />
              )}
            </Button>
          </div>
          <div className="col-span-2">Section</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-2">Governing Check</div>
          <div className="col-span-1">Demand</div>
          <div className="col-span-1">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleSort('utilization')}
              className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Ratio
              {sortBy === 'utilization' && (
                <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} className="ml-1" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* Table Body */}
      <div className="max-h-96 overflow-y-auto">
        {sortedMembers?.map((member, index) => {
          const statusConfig = getStatusConfig(member?.status);
          
          return (
            <div
              key={member?.id}
              onClick={() => onMemberSelect(member)}
              className={`
                grid grid-cols-12 gap-4 p-3 border-b border-border cursor-pointer transition-colors
                hover:bg-muted/50 ${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}
              `}
            >
              <div className="col-span-1 flex items-center">
                <div className={`p-1 rounded-full ${statusConfig?.bgColor}`}>
                  <Icon name={statusConfig?.icon} size={14} className={statusConfig?.color} />
                </div>
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Icon name={getTypeIcon(member?.type)} size={14} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground truncate">{member?.name}</span>
              </div>
              <div className="col-span-1 flex items-center">
                <span className="text-sm text-muted-foreground">{member?.type}</span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-foreground truncate">{member?.section}</span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-muted-foreground truncate">{member?.location}</span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-foreground">{member?.governingCheck}</span>
              </div>
              <div className="col-span-1 flex items-center">
                <div className="text-right">
                  <div className="text-sm font-mono text-foreground">{member?.demand?.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">{member?.unit}</div>
                </div>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    member?.utilization > 1.0 ? 'text-error' :
                    member?.utilization > 0.9 ? 'text-warning': 'text-success'
                  }`}>
                    {(member?.utilization * 100)?.toFixed(0)}%
                  </div>
                  <div className="w-12 h-1 bg-muted rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full transition-all ${
                        member?.utilization > 1.0 ? 'bg-error' :
                        member?.utilization > 0.9 ? 'bg-warning': 'bg-success'
                      }`}
                      style={{ width: `${Math.min(member?.utilization * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {sortedMembers?.length} members</span>
          <div className="flex items-center space-x-4">
            <span>Max Utilization: {Math.max(...sortedMembers?.map(m => m?.utilization))?.toFixed(2)}</span>
            <Button variant="outline" size="xs">
              <Icon name="FileText" size={12} className="mr-1" />
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalMembersSummary;
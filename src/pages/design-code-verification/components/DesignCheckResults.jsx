import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DesignCheckResults = ({ selectedMember }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [expandedSections, setExpandedSections] = useState({});

  if (!selectedMember) {
    return (
      <div className="h-full flex items-center justify-center bg-card">
        <div className="text-center">
          <Icon name="MousePointer2" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select a Member</h3>
          <p className="text-muted-foreground">
            Choose a structural member from the tree to view design check results
          </p>
        </div>
      </div>
    );
  }

  const mockCheckResults = {
    B1: {
      summary: {
        overallStatus: 'pass',
        criticalRatio: 0.78,
        governingCheck: 'Flexural Capacity',
        designCode: 'IS 800:2007',
        lastUpdated: '2025-08-11 15:30:00'
      },
      checks: {
        axial: {
          status: 'pass',
          ratio: 0.45,
          capacity: 850.5,
          demand: 382.7,
          unit: 'kN',
          equation: 'Pd = Ag × fy / γm0',
          parameters: {
            'Cross-sectional area (Ag)': '56.1 cm²',
            'Yield strength (fy)': '250 MPa',
            'Partial safety factor (γm0)': '1.10'
          }
        },
        flexural: {
          status: 'pass',
          ratio: 0.78,
          capacity: 245.8,
          demand: 191.7,
          unit: 'kN-m',
          equation: 'Md = Ze × fy / γm0',
          parameters: {
            'Elastic section modulus (Ze)': '1083 cm³',
            'Yield strength (fy)': '250 MPa',
            'Partial safety factor (γm0)': '1.10'
          }
        },
        shear: {
          status: 'pass',
          ratio: 0.32,
          capacity: 425.2,
          demand: 136.1,
          unit: 'kN',
          equation: 'Vd = Av × fy / (√3 × γm0)',
          parameters: {
            'Shear area (Av)': '20.4 cm²',
            'Yield strength (fy)': '250 MPa',
            'Partial safety factor (γm0)': '1.10'
          }
        },
        deflection: {
          status: 'pass',
          ratio: 0.65,
          capacity: 25.0,
          demand: 16.3,
          unit: 'mm',
          equation: 'δ = 5wL⁴/(384EI)',
          parameters: {
            'Span length (L)': '6.0 m',
            'Moment of inertia (I)': '8603 cm⁴',
            'Modulus of elasticity (E)': '200 GPa',
            'Allowable deflection': 'L/250'
          }
        }
      }
    },
    B2: {
      summary: {
        overallStatus: 'fail',
        criticalRatio: 1.12,
        governingCheck: 'Flexural Capacity',
        designCode: 'IS 800:2007',
        lastUpdated: '2025-08-11 15:30:00'
      },
      checks: {
        axial: {
          status: 'pass',
          ratio: 0.52,
          capacity: 1125.4,
          demand: 585.2,
          unit: 'kN'
        },
        flexural: {
          status: 'fail',
          ratio: 1.12,
          capacity: 325.6,
          demand: 364.7,
          unit: 'kN-m'
        },
        shear: {
          status: 'pass',
          ratio: 0.41,
          capacity: 562.8,
          demand: 230.7,
          unit: 'kN'
        },
        deflection: {
          status: 'warning',
          ratio: 0.95,
          capacity: 32.0,
          demand: 30.4,
          unit: 'mm'
        }
      }
    }
  };

  const currentResults = mockCheckResults?.[selectedMember?.id] || mockCheckResults?.B1;

  const tabs = [
    { id: 'summary', label: 'Summary', icon: 'BarChart3' },
    { id: 'axial', label: 'Axial', icon: 'ArrowUpDown' },
    { id: 'flexural', label: 'Flexural', icon: 'RotateCw' },
    { id: 'shear', label: 'Shear', icon: 'Scissors' },
    { id: 'deflection', label: 'Deflection', icon: 'TrendingDown' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass':
        return 'text-success bg-success/10 border-success/20';
      case 'fail':
        return 'text-error bg-error/10 border-error/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return 'CheckCircle';
      case 'fail':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      default:
        return 'Circle';
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const renderSummaryTab = () => (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="bg-surface rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground">Overall Status</h4>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentResults?.summary?.overallStatus)}`}>
            <Icon name={getStatusIcon(currentResults?.summary?.overallStatus)} size={14} className="mr-1 inline" />
            {currentResults?.summary?.overallStatus?.toUpperCase()}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Critical Ratio</p>
            <p className={`text-2xl font-bold ${
              currentResults?.summary?.criticalRatio > 1.0 ? 'text-error' :
              currentResults?.summary?.criticalRatio > 0.9 ? 'text-warning': 'text-success'
            }`}>
              {currentResults?.summary?.criticalRatio?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Governing Check</p>
            <p className="text-lg font-semibold text-foreground">{currentResults?.summary?.governingCheck}</p>
          </div>
        </div>
      </div>

      {/* Check Summary */}
      <div className="bg-surface rounded-lg p-4 border border-border">
        <h4 className="font-semibold text-foreground mb-4">Check Summary</h4>
        <div className="space-y-3">
          {Object.entries(currentResults?.checks)?.map(([checkType, check]) => (
            <div key={checkType} className="flex items-center justify-between p-3 bg-card rounded-md border border-border">
              <div className="flex items-center space-x-3">
                <Icon name={getStatusIcon(check?.status)} size={16} className={getStatusColor(check?.status)?.split(' ')?.[0]} />
                <div>
                  <p className="font-medium text-foreground capitalize">{checkType} Check</p>
                  <p className="text-sm text-muted-foreground">
                    {check?.demand?.toFixed(1)} / {check?.capacity?.toFixed(1)} {check?.unit}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  check?.ratio > 1.0 ? 'text-error' :
                  check?.ratio > 0.9 ? 'text-warning': 'text-success'
                }`}>
                  {(check?.ratio * 100)?.toFixed(0)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Design Information */}
      <div className="bg-surface rounded-lg p-4 border border-border">
        <h4 className="font-semibold text-foreground mb-4">Design Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Design Code</p>
            <p className="text-foreground font-medium">{currentResults?.summary?.designCode}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Last Updated</p>
            <p className="text-foreground font-medium">{currentResults?.summary?.lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCheckTab = (checkType) => {
    const check = currentResults?.checks?.[checkType];
    if (!check) return null;

    return (
      <div className="space-y-6">
        {/* Check Status */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground capitalize">{checkType} Check</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(check?.status)}`}>
              <Icon name={getStatusIcon(check?.status)} size={14} className="mr-1 inline" />
              {check?.status?.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Demand</p>
              <p className="text-xl font-bold text-foreground">{check?.demand?.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">{check?.unit}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Capacity</p>
              <p className="text-xl font-bold text-foreground">{check?.capacity?.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">{check?.unit}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Utilization</p>
              <p className={`text-xl font-bold ${
                check?.ratio > 1.0 ? 'text-error' :
                check?.ratio > 0.9 ? 'text-warning': 'text-success'
              }`}>
                {(check?.ratio * 100)?.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
        {/* Governing Equation */}
        {check?.equation && (
          <div className="bg-surface rounded-lg p-4 border border-border">
            <Button
              variant="ghost"
              onClick={() => toggleSection(`equation-${checkType}`)}
              className="w-full justify-between p-0 h-auto text-left"
            >
              <h4 className="font-semibold text-foreground">Governing Equation</h4>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transform transition-transform ${expandedSections?.[`equation-${checkType}`] ? 'rotate-180' : ''}`}
              />
            </Button>
            
            {expandedSections?.[`equation-${checkType}`] && (
              <div className="mt-4 p-4 bg-muted/30 rounded-md">
                <p className="font-mono text-lg text-center text-foreground mb-4 bg-card p-3 rounded border">
                  {check?.equation}
                </p>
              </div>
            )}
          </div>
        )}
        {/* Parameters */}
        {check?.parameters && (
          <div className="bg-surface rounded-lg p-4 border border-border">
            <Button
              variant="ghost"
              onClick={() => toggleSection(`params-${checkType}`)}
              className="w-full justify-between p-0 h-auto text-left"
            >
              <h4 className="font-semibold text-foreground">Design Parameters</h4>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transform transition-transform ${expandedSections?.[`params-${checkType}`] ? 'rotate-180' : ''}`}
              />
            </Button>
            
            {expandedSections?.[`params-${checkType}`] && (
              <div className="mt-4 space-y-2">
                {Object.entries(check?.parameters)?.map(([param, value]) => (
                  <div key={param} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-sm text-muted-foreground">{param}</span>
                    <span className="text-sm font-mono text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">{selectedMember?.name} - Design Checks</h3>
            <p className="text-sm text-muted-foreground">{selectedMember?.material} | {selectedMember?.section}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Download" size={16} className="mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Settings" size={16} className="mr-2" />
              Override
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg">
          {tabs?.map((tab) => (
            <Button
              key={tab?.id}
              variant={activeTab === tab?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab?.id)}
              className="flex-1"
            >
              <Icon name={tab?.icon} size={14} className="mr-2" />
              {tab?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'summary' ? renderSummaryTab() : renderCheckTab(activeTab)}
      </div>
    </div>
  );
};

export default DesignCheckResults;
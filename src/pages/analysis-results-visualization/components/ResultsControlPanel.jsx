import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ResultsControlPanel = ({ 
  selectedResultType, 
  onResultTypeChange,
  selectedLoadCase,
  onLoadCaseChange,
  visualizationOptions,
  onVisualizationChange,
  onExportResults,
  onGenerateReport
}) => {
  const [activeSection, setActiveSection] = useState('results');

  const resultTypes = [
    { value: 'Model', label: 'Model View', icon: 'Box' },
    { value: 'Displacement', label: 'Displacement', icon: 'Move' },
    { value: 'Forces', label: 'Forces & Moments', icon: 'Zap' },
    { value: 'Stress', label: 'Stress Analysis', icon: 'Thermometer' },
    { value: 'Reactions', label: 'Support Reactions', icon: 'Anchor' },
    { value: 'Modal', label: 'Modal Analysis', icon: 'Waves' }
  ];

  const loadCases = [
    { value: 'DL', label: 'Dead Load (DL)', description: 'Self weight and permanent loads' },
    { value: 'LL', label: 'Live Load (LL)', description: 'Variable occupancy loads' },
    { value: 'WL', label: 'Wind Load (WL)', description: 'Lateral wind forces' },
    { value: 'EL', label: 'Earthquake Load (EL)', description: 'Seismic forces' },
    { value: 'COMB1', label: '1.5DL + 1.5LL', description: 'Ultimate load combination' },
    { value: 'COMB2', label: '1.2DL + 1.2LL + 1.2WL', description: 'Wind load combination' },
    { value: 'COMB3', label: '1.2DL + 1.0LL + 1.0EL', description: 'Seismic load combination' }
  ];

  const diagramTypes = [
    { value: 'axial', label: 'Axial Force', icon: 'ArrowRight' },
    { value: 'shear', label: 'Shear Force', icon: 'ArrowUp' },
    { value: 'moment', label: 'Bending Moment', icon: 'RotateCw' },
    { value: 'torsion', label: 'Torsion', icon: 'Rotate3D' }
  ];

  const contourOptions = [
    { value: 'vonMises', label: 'Von Mises Stress' },
    { value: 'principal1', label: 'Principal Stress 1' },
    { value: 'principal2', label: 'Principal Stress 2' },
    { value: 'shearMax', label: 'Maximum Shear' }
  ];

  const handleSliderChange = (key, value) => {
    onVisualizationChange({
      ...visualizationOptions,
      [key]: parseFloat(value)
    });
  };

  const handleToggleChange = (key) => {
    onVisualizationChange({
      ...visualizationOptions,
      [key]: !visualizationOptions?.[key]
    });
  };

  const sections = [
    { id: 'results', label: 'Results', icon: 'BarChart3' },
    { id: 'display', label: 'Display', icon: 'Eye' },
    { id: 'export', label: 'Export', icon: 'Download' }
  ];

  return (
    <div className="h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">Results Control</h2>
        
        {/* Section Tabs */}
        <div className="flex space-x-1 bg-muted rounded-md p-1">
          {sections?.map((section) => (
            <Button
              key={section?.id}
              variant={activeSection === section?.id ? "default" : "ghost"}
              size="xs"
              onClick={() => setActiveSection(section?.id)}
              className="flex-1 h-8"
            >
              <Icon name={section?.icon} size={14} className="mr-1" />
              {section?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === 'results' && (
          <div className="p-4 space-y-6">
            {/* Result Type Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Result Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {resultTypes?.map((type) => (
                  <Button
                    key={type?.value}
                    variant={selectedResultType === type?.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onResultTypeChange(type?.value)}
                    className="justify-start h-10"
                  >
                    <Icon name={type?.icon} size={16} className="mr-2" />
                    {type?.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Load Case Selection */}
            <div>
              <Select
                label="Load Case"
                options={loadCases}
                value={selectedLoadCase}
                onChange={onLoadCaseChange}
                searchable
              />
            </div>

            {/* Force Diagram Types */}
            {selectedResultType === 'Forces' && (
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Diagram Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {diagramTypes?.map((diagram) => (
                    <Button
                      key={diagram?.value}
                      variant={visualizationOptions?.diagramType === diagram?.value ? "default" : "outline"}
                      size="xs"
                      onClick={() => onVisualizationChange({
                        ...visualizationOptions,
                        diagramType: diagram?.value
                      })}
                      className="h-8"
                    >
                      <Icon name={diagram?.icon} size={14} className="mr-1" />
                      {diagram?.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Stress Contour Options */}
            {selectedResultType === 'Stress' && (
              <div>
                <Select
                  label="Contour Type"
                  options={contourOptions}
                  value={visualizationOptions?.contourType || 'vonMises'}
                  onChange={(value) => onVisualizationChange({
                    ...visualizationOptions,
                    contourType: value
                  })}
                />
              </div>
            )}

            {/* Modal Analysis Options */}
            {selectedResultType === 'Modal' && (
              <div>
                <Input
                  label="Mode Number"
                  type="number"
                  min="1"
                  max="10"
                  value={visualizationOptions?.modeNumber || 1}
                  onChange={(e) => onVisualizationChange({
                    ...visualizationOptions,
                    modeNumber: parseInt(e?.target?.value)
                  })}
                />
                <div className="mt-3 p-3 bg-muted/50 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Mode 1 Properties:</div>
                  <div className="text-sm text-foreground">Frequency: 2.45 Hz</div>
                  <div className="text-sm text-foreground">Period: 0.408 sec</div>
                  <div className="text-sm text-foreground">Mass Participation: 65.2%</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'display' && (
          <div className="p-4 space-y-6">
            {/* Deformation Scale */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Deformation Scale: {visualizationOptions?.deformationScale}x
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={visualizationOptions?.deformationScale}
                onChange={(e) => handleSliderChange('deformationScale', e?.target?.value)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0x</span>
                <span>50x</span>
                <span>100x</span>
              </div>
            </div>

            {/* Transparency */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Transparency: {Math.round(visualizationOptions?.transparency * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={visualizationOptions?.transparency}
                onChange={(e) => handleSliderChange('transparency', e?.target?.value)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Color Scale Range */}
            {(selectedResultType === 'Stress' || selectedResultType === 'Displacement') && (
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Color Scale Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Min Value"
                    type="number"
                    step="0.1"
                    value={visualizationOptions?.colorScaleMin || 0}
                    onChange={(e) => onVisualizationChange({
                      ...visualizationOptions,
                      colorScaleMin: parseFloat(e?.target?.value)
                    })}
                  />
                  <Input
                    label="Max Value"
                    type="number"
                    step="0.1"
                    value={visualizationOptions?.colorScaleMax || 100}
                    onChange={(e) => onVisualizationChange({
                      ...visualizationOptions,
                      colorScaleMax: parseFloat(e?.target?.value)
                    })}
                  />
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => onVisualizationChange({
                    ...visualizationOptions,
                    colorScaleMin: 0,
                    colorScaleMax: 100
                  })}
                  className="mt-2 w-full"
                >
                  Auto Range
                </Button>
              </div>
            )}

            {/* Display Options */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Display Options
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Show Diagrams</span>
                  <Button
                    variant={visualizationOptions?.showDiagrams ? "default" : "outline"}
                    size="xs"
                    onClick={() => handleToggleChange('showDiagrams')}
                    className="w-12 h-6"
                  >
                    {visualizationOptions?.showDiagrams ? 'ON' : 'OFF'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Show Values</span>
                  <Button
                    variant={visualizationOptions?.showValues ? "default" : "outline"}
                    size="xs"
                    onClick={() => handleToggleChange('showValues')}
                    className="w-12 h-6"
                  >
                    {visualizationOptions?.showValues ? 'ON' : 'OFF'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Show Undeformed</span>
                  <Button
                    variant={visualizationOptions?.showUndeformed ? "default" : "outline"}
                    size="xs"
                    onClick={() => handleToggleChange('showUndeformed')}
                    className="w-12 h-6"
                  >
                    {visualizationOptions?.showUndeformed ? 'ON' : 'OFF'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Smooth Contours</span>
                  <Button
                    variant={visualizationOptions?.smoothContours ? "default" : "outline"}
                    size="xs"
                    onClick={() => handleToggleChange('smoothContours')}
                    className="w-12 h-6"
                  >
                    {visualizationOptions?.smoothContours ? 'ON' : 'OFF'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'export' && (
          <div className="p-4 space-y-6">
            {/* Quick Export Actions */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Quick Export
              </label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportResults}
                  className="w-full justify-start"
                >
                  <Icon name="FileSpreadsheet" size={16} className="mr-2" />
                  Export to CSV
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log('Export to Excel')}
                  className="w-full justify-start"
                >
                  <Icon name="FileText" size={16} className="mr-2" />
                  Export to Excel
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log('Export Image')}
                  className="w-full justify-start"
                >
                  <Icon name="Image" size={16} className="mr-2" />
                  Export Image (PNG)
                </Button>
              </div>
            </div>

            {/* Report Generation */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Report Generation
              </label>
              <div className="space-y-3">
                <Select
                  label="Report Type"
                  options={[
                    { value: 'summary', label: 'Analysis Summary' },
                    { value: 'detailed', label: 'Detailed Results' },
                    { value: 'design', label: 'Design Check Report' },
                    { value: 'custom', label: 'Custom Report' }
                  ]}
                  value="summary"
                  onChange={() => {}}
                />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeImages"
                      defaultChecked
                      className="rounded border-border"
                    />
                    <label htmlFor="includeImages" className="text-sm text-foreground">
                      Include Images
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeTables"
                      defaultChecked
                      className="rounded border-border"
                    />
                    <label htmlFor="includeTables" className="text-sm text-foreground">
                      Include Data Tables
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeCalculations"
                      className="rounded border-border"
                    />
                    <label htmlFor="includeCalculations" className="text-sm text-foreground">
                      Include Calculations
                    </label>
                  </div>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  onClick={onGenerateReport}
                  className="w-full"
                >
                  <Icon name="FileText" size={16} className="mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            {/* Export History */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Recent Exports
              </label>
              <div className="space-y-2">
                {[
                  { name: 'Analysis_Results_2025-01-11.csv', time: '2 hours ago', size: '245 KB' },
                  { name: 'Stress_Report_2025-01-11.pdf', time: '1 day ago', size: '1.2 MB' },
                  { name: 'Modal_Analysis_2025-01-10.xlsx', time: '2 days ago', size: '890 KB' }
                ]?.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {file?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file?.time} • {file?.size}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="ml-2"
                    >
                      <Icon name="Download" size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsControlPanel;
import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfigurationSummary = ({ 
  loadCases, 
  loadCombinations, 
  analysisOptions, 
  solverSettings,
  onRunAnalysis,
  onSaveConfiguration,
  onLoadTemplate 
}) => {
  const getValidationStatus = () => {
    const warnings = [];
    const errors = [];

    // Check load cases
    if (loadCases?.length === 0) {
      errors?.push("No load cases defined");
    }

    // Check load combinations
    if (loadCombinations?.length === 0) {
      warnings?.push("No load combinations defined");
    }

    // Check analysis type compatibility
    if (analysisOptions?.analysisType === 'modal' && loadCombinations?.length > 0) {
      warnings?.push("Load combinations not used in modal analysis");
    }

    // Check solver settings
    if (analysisOptions?.solverType === 'iterative' && solverSettings?.iterativeSolver?.maxIterations < 100) {
      warnings?.push("Low iteration limit for iterative solver");
    }

    return { warnings, errors };
  };

  const getEstimatedSolveTime = () => {
    // Mock calculation based on analysis type and model complexity
    const baseTime = analysisOptions?.analysisType === 'modal' ? 30 : 
                     analysisOptions?.analysisType === 'static' ? 15 : 60;
    
    const complexityFactor = loadCases?.length * 0.5 + loadCombinations?.length * 0.3;
    const solverFactor = analysisOptions?.solverType === 'direct' ? 1.0 : 1.5;
    
    return Math.round(baseTime * (1 + complexityFactor) * solverFactor);
  };

  const getMemoryEstimate = () => {
    // Mock memory estimation
    const baseMemory = 512; // MB
    const loadFactor = (loadCases?.length + loadCombinations?.length) * 50;
    const precisionFactor = analysisOptions?.precision === 'double' ? 2 : 1;
    
    return Math.round((baseMemory + loadFactor) * precisionFactor);
  };

  const validation = getValidationStatus();
  const estimatedTime = getEstimatedSolveTime();
  const memoryEstimate = getMemoryEstimate();
  const canRunAnalysis = validation?.errors?.length === 0;

  return (
    <div className="space-y-6">
      {/* Configuration Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="CheckCircle" size={20} className="mr-2 text-primary" />
          Configuration Status
        </h3>
        
        <div className="space-y-4">
          {/* Model Summary */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Model Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nodes:</span>
                <span className="font-mono text-foreground">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Elements:</span>
                <span className="font-mono text-foreground">2,891</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DOF:</span>
                <span className="font-mono text-foreground">7,482</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Materials:</span>
                <span className="font-mono text-foreground">3</span>
              </div>
            </div>
          </div>

          {/* Load Configuration */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Load Configuration</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Load Cases:</span>
                <span className="font-mono text-foreground">{loadCases?.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Load Combinations:</span>
                <span className="font-mono text-foreground">{loadCombinations?.length}</span>
              </div>
              {loadCases?.length > 0 && (
                <div className="mt-2">
                  <span className="text-muted-foreground text-xs">Active Cases:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {loadCases?.slice(0, 4)?.map((lc) => (
                      <span key={lc?.id} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                        {lc?.name}
                      </span>
                    ))}
                    {loadCases?.length > 4 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        +{loadCases?.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Configuration */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Analysis Configuration</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Analysis Type:</span>
                <span className="font-mono text-foreground capitalize">
                  {analysisOptions?.analysisType?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Solver:</span>
                <span className="font-mono text-foreground capitalize">
                  {analysisOptions?.solverType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precision:</span>
                <span className="font-mono text-foreground capitalize">
                  {analysisOptions?.precision}
                </span>
              </div>
              {analysisOptions?.analysisType === 'modal' && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modes:</span>
                  <span className="font-mono text-foreground">
                    {analysisOptions?.modalOptions?.numberOfModes}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Validation Results */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon 
            name={validation?.errors?.length > 0 ? "AlertCircle" : validation?.warnings?.length > 0 ? "AlertTriangle" : "CheckCircle"} 
            size={20} 
            className={`mr-2 ${
              validation?.errors?.length > 0 ? 'text-error' : 
              validation?.warnings?.length > 0 ? 'text-warning': 'text-success'
            }`} 
          />
          Validation Results
        </h3>
        
        {validation?.errors?.length === 0 && validation?.warnings?.length === 0 ? (
          <div className="flex items-center space-x-2 text-success">
            <Icon name="CheckCircle" size={16} />
            <span className="text-sm">Configuration is valid and ready for analysis</span>
          </div>
        ) : (
          <div className="space-y-3">
            {validation?.errors?.map((error, index) => (
              <div key={index} className="flex items-start space-x-2 text-error">
                <Icon name="XCircle" size={16} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            ))}
            {validation?.warnings?.map((warning, index) => (
              <div key={index} className="flex items-start space-x-2 text-warning">
                <Icon name="AlertTriangle" size={16} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{warning}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Performance Estimates */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Gauge" size={20} className="mr-2 text-primary" />
          Performance Estimates
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <Icon name="Clock" size={24} className="mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">{estimatedTime}s</p>
            <p className="text-xs text-muted-foreground">Estimated Solve Time</p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <Icon name="HardDrive" size={24} className="mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">{memoryEstimate}MB</p>
            <p className="text-xs text-muted-foreground">Memory Required</p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <Icon name="Cpu" size={24} className="mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">{analysisOptions?.performance?.cpuCores}</p>
            <p className="text-xs text-muted-foreground">CPU Cores</p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Play" size={20} className="mr-2 text-primary" />
          Actions
        </h3>
        
        <div className="space-y-3">
          <Button
            variant="default"
            onClick={onRunAnalysis}
            disabled={!canRunAnalysis}
            iconName="Play"
            iconPosition="left"
            className="w-full"
          >
            {canRunAnalysis ? 'Run Analysis' : 'Fix Configuration Errors First'}
          </Button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onSaveConfiguration}
              iconName="Save"
              iconPosition="left"
            >
              Save Configuration
            </Button>
            
            <Button
              variant="outline"
              onClick={onLoadTemplate}
              iconName="Upload"
              iconPosition="left"
            >
              Load Template
            </Button>
          </div>
        </div>
      </div>
      {/* Quick Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Zap" size={20} className="mr-2 text-primary" />
          Quick Settings
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="ghost"
            onClick={() => {/* Apply default settings */}}
            iconName="RotateCcw"
            iconPosition="left"
            className="justify-start"
          >
            Reset to Defaults
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => {/* Apply recommended settings */}}
            iconName="Lightbulb"
            iconPosition="left"
            className="justify-start"
          >
            Apply Recommended
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => {/* Optimize for speed */}}
            iconName="Zap"
            iconPosition="left"
            className="justify-start"
          >
            Optimize for Speed
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => {/* Optimize for accuracy */}}
            iconName="Target"
            iconPosition="left"
            className="justify-start"
          >
            Optimize for Accuracy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationSummary;
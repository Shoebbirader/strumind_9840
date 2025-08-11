import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AnalysisDefaultsSettings = ({ settings, onSettingsChange }) => {
  const solverTypes = [
    { 
      value: 'direct-sparse', 
      label: 'Direct Sparse Solver', 
      description: 'Fast and accurate for small to medium models' 
    },
    { 
      value: 'iterative-cg', 
      label: 'Conjugate Gradient', 
      description: 'Memory efficient for large models' 
    },
    { 
      value: 'iterative-gmres', 
      label: 'GMRES', 
      description: 'Robust for ill-conditioned systems' 
    },
    { 
      value: 'multifrontal', 
      label: 'Multifrontal', 
      description: 'Parallel processing for large models' 
    }
  ];

  const convergenceCriteria = [
    { value: 'displacement', label: 'Displacement Based' },
    { value: 'force', label: 'Force Based' },
    { value: 'energy', label: 'Energy Based' },
    { value: 'mixed', label: 'Mixed Criteria' }
  ];

  const outputFormats = [
    { value: 'json', label: 'JSON Format' },
    { value: 'csv', label: 'CSV Format' },
    { value: 'xml', label: 'XML Format' },
    { value: 'excel', label: 'Excel Format' }
  ];

  const handleSettingChange = (field, value) => {
    onSettingsChange('analysis', { 
      ...settings?.analysis, 
      [field]: value 
    });
  };

  const handleOptionChange = (option, value) => {
    onSettingsChange('analysis', { 
      ...settings?.analysis, 
      options: {
        ...settings?.analysis?.options,
        [option]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Analysis Defaults</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Configure default solver settings, convergence criteria, and output preferences for structural analysis.
        </p>
      </div>
      {/* Solver Configuration */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground flex items-center">
          <Icon name="Cpu" size={18} className="mr-2 text-muted-foreground" />
          Solver Configuration
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Select
            label="Default Solver Type"
            options={solverTypes}
            value={settings?.analysis?.solverType || 'direct-sparse'}
            onChange={(value) => handleSettingChange('solverType', value)}
            description="Primary solver for linear static analysis"
          />

          <Input
            label="Maximum Iterations"
            type="number"
            placeholder="1000"
            value={settings?.analysis?.maxIterations || '1000'}
            onChange={(e) => handleSettingChange('maxIterations', e?.target?.value)}
            description="Maximum solver iterations"
          />

          <Input
            label="Memory Allocation (GB)"
            type="number"
            placeholder="4"
            value={settings?.analysis?.memoryLimit || '4'}
            onChange={(e) => handleSettingChange('memoryLimit', e?.target?.value)}
            description="Maximum memory usage for solver"
          />

          <Input
            label="Parallel Threads"
            type="number"
            placeholder="4"
            value={settings?.analysis?.parallelThreads || '4'}
            onChange={(e) => handleSettingChange('parallelThreads', e?.target?.value)}
            description="Number of CPU threads to use"
          />
        </div>
      </div>
      {/* Convergence Settings */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground flex items-center">
          <Icon name="Target" size={18} className="mr-2 text-muted-foreground" />
          Convergence Criteria
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Select
            label="Convergence Type"
            options={convergenceCriteria}
            value={settings?.analysis?.convergenceType || 'displacement'}
            onChange={(value) => handleSettingChange('convergenceType', value)}
            description="Primary convergence criterion"
          />

          <Input
            label="Convergence Tolerance"
            type="text"
            placeholder="1e-6"
            value={settings?.analysis?.convergenceTolerance || '1e-6'}
            onChange={(e) => handleSettingChange('convergenceTolerance', e?.target?.value)}
            description="Numerical tolerance for convergence"
          />

          <Input
            label="Force Tolerance"
            type="text"
            placeholder="1e-3"
            value={settings?.analysis?.forceTolerance || '1e-3'}
            onChange={(e) => handleSettingChange('forceTolerance', e?.target?.value)}
            description="Force equilibrium tolerance (N)"
          />

          <Input
            label="Displacement Tolerance"
            type="text"
            placeholder="1e-6"
            value={settings?.analysis?.displacementTolerance || '1e-6'}
            onChange={(e) => handleSettingChange('displacementTolerance', e?.target?.value)}
            description="Displacement convergence tolerance (m)"
          />
        </div>
      </div>
      {/* Analysis Options */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground flex items-center">
          <Icon name="Settings" size={18} className="mr-2 text-muted-foreground" />
          Analysis Options
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Checkbox
              label="Include geometric nonlinearity (P-Delta)"
              checked={settings?.analysis?.options?.geometricNonlinearity || false}
              onChange={(e) => handleOptionChange('geometricNonlinearity', e?.target?.checked)}
              description="Consider large displacement effects"
            />
            <Checkbox
              label="Include material nonlinearity"
              checked={settings?.analysis?.options?.materialNonlinearity || false}
              onChange={(e) => handleOptionChange('materialNonlinearity', e?.target?.checked)}
              description="Consider plastic behavior"
            />
            <Checkbox
              label="Automatic load stepping"
              checked={settings?.analysis?.options?.autoLoadStepping !== false}
              onChange={(e) => handleOptionChange('autoLoadStepping', e?.target?.checked)}
              description="Automatically adjust load increments"
            />
            <Checkbox
              label="Check model stability"
              checked={settings?.analysis?.options?.stabilityCheck !== false}
              onChange={(e) => handleOptionChange('stabilityCheck', e?.target?.checked)}
              description="Perform stability analysis"
            />
          </div>
          
          <div className="space-y-4">
            <Checkbox
              label="Generate detailed output"
              checked={settings?.analysis?.options?.detailedOutput !== false}
              onChange={(e) => handleOptionChange('detailedOutput', e?.target?.checked)}
              description="Include comprehensive result data"
            />
            <Checkbox
              label="Save intermediate results"
              checked={settings?.analysis?.options?.saveIntermediate || false}
              onChange={(e) => handleOptionChange('saveIntermediate', e?.target?.checked)}
              description="Store results at each iteration"
            />
            <Checkbox
              label="Automatic mesh refinement"
              checked={settings?.analysis?.options?.autoMeshRefinement || false}
              onChange={(e) => handleOptionChange('autoMeshRefinement', e?.target?.checked)}
              description="Refine mesh in high stress areas"
            />
            <Checkbox
              label="Real-time progress updates"
              checked={settings?.analysis?.options?.realTimeProgress !== false}
              onChange={(e) => handleOptionChange('realTimeProgress', e?.target?.checked)}
              description="Show analysis progress in real-time"
            />
          </div>
        </div>
      </div>
      {/* Output Settings */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground flex items-center">
          <Icon name="FileText" size={18} className="mr-2 text-muted-foreground" />
          Output Settings
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Select
            label="Default Output Format"
            options={outputFormats}
            value={settings?.analysis?.outputFormat || 'json'}
            onChange={(value) => handleSettingChange('outputFormat', value)}
            description="Primary format for result exports"
          />

          <Input
            label="Significant Digits"
            type="number"
            placeholder="6"
            value={settings?.analysis?.significantDigits || '6'}
            onChange={(e) => handleSettingChange('significantDigits', e?.target?.value)}
            description="Decimal precision in results"
          />

          <Input
            label="Result File Prefix"
            type="text"
            placeholder="analysis_"
            value={settings?.analysis?.filePrefix || 'analysis_'}
            onChange={(e) => handleSettingChange('filePrefix', e?.target?.value)}
            description="Prefix for output file names"
          />

          <div className="space-y-4">
            <Checkbox
              label="Include analysis summary"
              checked={settings?.analysis?.options?.includeSummary !== false}
              onChange={(e) => handleOptionChange('includeSummary', e?.target?.checked)}
            />
            <Checkbox
              label="Export reaction forces"
              checked={settings?.analysis?.options?.exportReactions !== false}
              onChange={(e) => handleOptionChange('exportReactions', e?.target?.checked)}
            />
            <Checkbox
              label="Export element forces"
              checked={settings?.analysis?.options?.exportElementForces !== false}
              onChange={(e) => handleOptionChange('exportElementForces', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Modal Analysis Settings */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground flex items-center">
          <Icon name="Waves" size={18} className="mr-2 text-muted-foreground" />
          Modal Analysis Settings
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Number of Modes"
            type="number"
            placeholder="10"
            value={settings?.analysis?.modalModes || '10'}
            onChange={(e) => handleSettingChange('modalModes', e?.target?.value)}
            description="Number of natural frequencies to calculate"
          />

          <Input
            label="Frequency Range (Hz)"
            type="text"
            placeholder="0-50"
            value={settings?.analysis?.frequencyRange || '0-50'}
            onChange={(e) => handleSettingChange('frequencyRange', e?.target?.value)}
            description="Frequency range for modal analysis"
          />

          <div className="space-y-4">
            <Checkbox
              label="Include mass participation factors"
              checked={settings?.analysis?.options?.massParticipation !== false}
              onChange={(e) => handleOptionChange('massParticipation', e?.target?.checked)}
            />
            <Checkbox
              label="Normalize mode shapes"
              checked={settings?.analysis?.options?.normalizeModes !== false}
              onChange={(e) => handleOptionChange('normalizeModes', e?.target?.checked)}
            />
          </div>

          <div className="space-y-4">
            <Checkbox
              label="Calculate effective modal mass"
              checked={settings?.analysis?.options?.effectiveModalMass || false}
              onChange={(e) => handleOptionChange('effectiveModalMass', e?.target?.checked)}
            />
            <Checkbox
              label="Export mode shape animations"
              checked={settings?.analysis?.options?.exportAnimations || false}
              onChange={(e) => handleOptionChange('exportAnimations', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Performance Settings */}
      <div className="p-4 bg-warning/10 border border-warning/20 rounded-md">
        <h5 className="font-medium text-warning mb-3 flex items-center">
          <Icon name="Zap" size={18} className="mr-2" />
          Performance Recommendations
        </h5>
        <div className="space-y-2 text-sm text-warning">
          <p>• Use Direct Sparse solver for models with &lt; 50,000 DOF</p>
          <p>• Enable parallel processing for models with &gt; 10,000 elements</p>
          <p>• Increase memory allocation for large models to avoid disk swapping</p>
          <p>• Disable detailed output for preliminary analysis to improve speed</p>
        </div>
      </div>
      {/* Current Settings Summary */}
      <div className="p-4 bg-muted/20 rounded-md">
        <h5 className="font-medium text-foreground mb-3">Current Analysis Configuration</h5>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Solver:</span>
            <span className="ml-2 font-medium text-foreground">
              {solverTypes?.find(s => s?.value === (settings?.analysis?.solverType || 'direct-sparse'))?.label}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Convergence:</span>
            <span className="ml-2 font-medium text-foreground">
              {settings?.analysis?.convergenceTolerance || '1e-6'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Max Iterations:</span>
            <span className="ml-2 font-medium text-foreground">
              {settings?.analysis?.maxIterations || '1000'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Output Format:</span>
            <span className="ml-2 font-medium text-foreground">
              {outputFormats?.find(f => f?.value === (settings?.analysis?.outputFormat || 'json'))?.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDefaultsSettings;
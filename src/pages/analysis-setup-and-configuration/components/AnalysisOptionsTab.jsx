import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AnalysisOptionsTab = ({ analysisOptions, onUpdateOptions }) => {
  const analysisTypeOptions = [
    { value: 'static', label: 'Linear Static Analysis' },
    { value: 'modal', label: 'Modal Analysis' },
    { value: 'buckling', label: 'Linear Buckling Analysis' },
    { value: 'nonlinear', label: 'Nonlinear Static Analysis' },
    { value: 'dynamic', label: 'Dynamic Analysis' }
  ];

  const solverTypeOptions = [
    { value: 'direct', label: 'Direct Solver (Sparse)' },
    { value: 'iterative', label: 'Iterative Solver (PCG)' },
    { value: 'multifrontal', label: 'Multifrontal Solver' }
  ];

  const precisionOptions = [
    { value: 'single', label: 'Single Precision' },
    { value: 'double', label: 'Double Precision' }
  ];

  const handleOptionChange = (key, value) => {
    onUpdateOptions({
      ...analysisOptions,
      [key]: value
    });
  };

  const handleNestedOptionChange = (category, key, value) => {
    onUpdateOptions({
      ...analysisOptions,
      [category]: {
        ...analysisOptions?.[category],
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Analysis Type Selection */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Calculator" size={20} className="mr-2 text-primary" />
          Analysis Type
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Primary Analysis Type"
            options={analysisTypeOptions}
            value={analysisOptions?.analysisType}
            onChange={(value) => handleOptionChange('analysisType', value)}
            description="Select the main type of structural analysis to perform"
          />
          
          <Select
            label="Solver Type"
            options={solverTypeOptions}
            value={analysisOptions?.solverType}
            onChange={(value) => handleOptionChange('solverType', value)}
            description="Choose the numerical solver method"
          />
        </div>

        <div className="mt-4 space-y-3">
          <Checkbox
            label="Include P-Delta Effects"
            checked={analysisOptions?.includePDelta}
            onChange={(e) => handleOptionChange('includePDelta', e?.target?.checked)}
            description="Account for geometric nonlinearity due to axial loads"
          />
          
          <Checkbox
            label="Include Shear Deformation"
            checked={analysisOptions?.includeShearDeformation}
            onChange={(e) => handleOptionChange('includeShearDeformation', e?.target?.checked)}
            description="Consider shear deformation in beam elements"
          />
          
          <Checkbox
            label="Large Displacement Analysis"
            checked={analysisOptions?.largeDisplacement}
            onChange={(e) => handleOptionChange('largeDisplacement', e?.target?.checked)}
            description="Enable geometric nonlinear analysis"
            disabled={analysisOptions?.analysisType === 'modal'}
          />
        </div>
      </div>
      {/* Modal Analysis Options */}
      {analysisOptions?.analysisType === 'modal' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Waves" size={20} className="mr-2 text-primary" />
            Modal Analysis Parameters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Number of Modes"
              type="number"
              value={analysisOptions?.modalOptions?.numberOfModes}
              onChange={(e) => handleNestedOptionChange('modalOptions', 'numberOfModes', parseInt(e?.target?.value) || 10)}
              min="1"
              max="100"
              description="Number of natural frequencies to calculate"
            />
            
            <Input
              label="Frequency Range (Hz)"
              type="number"
              value={analysisOptions?.modalOptions?.maxFrequency}
              onChange={(e) => handleNestedOptionChange('modalOptions', 'maxFrequency', parseFloat(e?.target?.value) || 100)}
              min="0"
              step="0.1"
              description="Maximum frequency of interest"
            />
            
            <Input
              label="Mass Participation (%)"
              type="number"
              value={analysisOptions?.modalOptions?.massParticipation}
              onChange={(e) => handleNestedOptionChange('modalOptions', 'massParticipation', parseFloat(e?.target?.value) || 90)}
              min="50"
              max="100"
              step="1"
              description="Minimum cumulative mass participation"
            />
          </div>
        </div>
      )}
      {/* Convergence Criteria */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Target" size={20} className="mr-2 text-primary" />
          Convergence Criteria
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Force Tolerance"
            type="number"
            value={analysisOptions?.convergence?.forceTolerance}
            onChange={(e) => handleNestedOptionChange('convergence', 'forceTolerance', parseFloat(e?.target?.value) || 1e-6)}
            step="1e-8"
            description="Force convergence tolerance"
          />
          
          <Input
            label="Displacement Tolerance"
            type="number"
            value={analysisOptions?.convergence?.displacementTolerance}
            onChange={(e) => handleNestedOptionChange('convergence', 'displacementTolerance', parseFloat(e?.target?.value) || 1e-6)}
            step="1e-8"
            description="Displacement convergence tolerance"
          />
          
          <Input
            label="Maximum Iterations"
            type="number"
            value={analysisOptions?.convergence?.maxIterations}
            onChange={(e) => handleNestedOptionChange('convergence', 'maxIterations', parseInt(e?.target?.value) || 100)}
            min="10"
            max="1000"
            description="Maximum number of iterations"
          />
          
          <Select
            label="Precision"
            options={precisionOptions}
            value={analysisOptions?.precision}
            onChange={(value) => handleOptionChange('precision', value)}
            description="Numerical precision for calculations"
          />
        </div>
      </div>
      {/* Memory and Performance */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Cpu" size={20} className="mr-2 text-primary" />
          Performance Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Memory Limit (GB)"
            type="number"
            value={analysisOptions?.performance?.memoryLimit}
            onChange={(e) => handleNestedOptionChange('performance', 'memoryLimit', parseFloat(e?.target?.value) || 4)}
            min="1"
            max="64"
            step="0.5"
            description="Maximum memory usage for analysis"
          />
          
          <Input
            label="CPU Cores"
            type="number"
            value={analysisOptions?.performance?.cpuCores}
            onChange={(e) => handleNestedOptionChange('performance', 'cpuCores', parseInt(e?.target?.value) || 4)}
            min="1"
            max="32"
            description="Number of CPU cores to use"
          />
          
          <Input
            label="Disk Cache (MB)"
            type="number"
            value={analysisOptions?.performance?.diskCache}
            onChange={(e) => handleNestedOptionChange('performance', 'diskCache', parseInt(e?.target?.value) || 1024)}
            min="256"
            max="8192"
            step="256"
            description="Disk cache size for large models"
          />
        </div>

        <div className="mt-4 space-y-3">
          <Checkbox
            label="Enable Parallel Processing"
            checked={analysisOptions?.performance?.parallelProcessing}
            onChange={(e) => handleNestedOptionChange('performance', 'parallelProcessing', e?.target?.checked)}
            description="Use multiple CPU cores for faster analysis"
          />
          
          <Checkbox
            label="Use GPU Acceleration"
            checked={analysisOptions?.performance?.gpuAcceleration}
            onChange={(e) => handleNestedOptionChange('performance', 'gpuAcceleration', e?.target?.checked)}
            description="Enable GPU acceleration if available"
          />
          
          <Checkbox
            label="Optimize Memory Usage"
            checked={analysisOptions?.performance?.optimizeMemory}
            onChange={(e) => handleNestedOptionChange('performance', 'optimizeMemory', e?.target?.checked)}
            description="Use memory optimization techniques for large models"
          />
        </div>
      </div>
      {/* Output Options */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="FileOutput" size={20} className="mr-2 text-primary" />
          Output Options
        </h3>
        
        <div className="space-y-3">
          <Checkbox
            label="Generate Detailed Report"
            checked={analysisOptions?.output?.detailedReport}
            onChange={(e) => handleNestedOptionChange('output', 'detailedReport', e?.target?.checked)}
            description="Create comprehensive analysis report with all results"
          />
          
          <Checkbox
            label="Export Results to CSV"
            checked={analysisOptions?.output?.exportCSV}
            onChange={(e) => handleNestedOptionChange('output', 'exportCSV', e?.target?.checked)}
            description="Export numerical results in CSV format"
          />
          
          <Checkbox
            label="Save Animation Frames"
            checked={analysisOptions?.output?.saveAnimationFrames}
            onChange={(e) => handleNestedOptionChange('output', 'saveAnimationFrames', e?.target?.checked)}
            description="Save individual frames for result animations"
          />
          
          <Checkbox
            label="Include Reaction Forces"
            checked={analysisOptions?.output?.includeReactions}
            onChange={(e) => handleNestedOptionChange('output', 'includeReactions', e?.target?.checked)}
            description="Include support reaction forces in results"
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisOptionsTab;
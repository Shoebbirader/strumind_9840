import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SolverSettingsTab = ({ solverSettings, onUpdateSettings }) => {
  const matrixStorageOptions = [
    { value: 'sparse', label: 'Sparse Matrix Storage' },
    { value: 'banded', label: 'Banded Matrix Storage' },
    { value: 'skyline', label: 'Skyline Matrix Storage' },
    { value: 'full', label: 'Full Matrix Storage' }
  ];

  const reorderingOptions = [
    { value: 'automatic', label: 'Automatic (Recommended)' },
    { value: 'rcm', label: 'Reverse Cuthill-McKee' },
    { value: 'amd', label: 'Approximate Minimum Degree' },
    { value: 'nested_dissection', label: 'Nested Dissection' },
    { value: 'none', label: 'No Reordering' }
  ];

  const pivotingOptions = [
    { value: 'partial', label: 'Partial Pivoting' },
    { value: 'complete', label: 'Complete Pivoting' },
    { value: 'rook', label: 'Rook Pivoting' },
    { value: 'none', label: 'No Pivoting' }
  ];

  const iterativeMethodOptions = [
    { value: 'pcg', label: 'Preconditioned Conjugate Gradient' },
    { value: 'gmres', label: 'Generalized Minimal Residual' },
    { value: 'bicgstab', label: 'BiConjugate Gradient Stabilized' },
    { value: 'minres', label: 'Minimal Residual Method' }
  ];

  const preconditionerOptions = [
    { value: 'jacobi', label: 'Jacobi Preconditioner' },
    { value: 'ilu', label: 'Incomplete LU Factorization' },
    { value: 'ssor', label: 'Symmetric SOR' },
    { value: 'multigrid', label: 'Multigrid Preconditioner' },
    { value: 'none', label: 'No Preconditioner' }
  ];

  const handleSettingChange = (key, value) => {
    onUpdateSettings({
      ...solverSettings,
      [key]: value
    });
  };

  const handleNestedSettingChange = (category, key, value) => {
    onUpdateSettings({
      ...solverSettings,
      [category]: {
        ...solverSettings?.[category],
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Matrix Storage and Ordering */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Grid3X3" size={20} className="mr-2 text-primary" />
          Matrix Storage and Ordering
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Matrix Storage Format"
            options={matrixStorageOptions}
            value={solverSettings?.matrixStorage}
            onChange={(value) => handleSettingChange('matrixStorage', value)}
            description="How the stiffness matrix is stored in memory"
          />
          
          <Select
            label="Matrix Reordering"
            options={reorderingOptions}
            value={solverSettings?.matrixReordering}
            onChange={(value) => handleSettingChange('matrixReordering', value)}
            description="Algorithm to minimize fill-in during factorization"
          />
        </div>

        <div className="mt-4 space-y-3">
          <Checkbox
            label="Enable Matrix Scaling"
            checked={solverSettings?.matrixScaling}
            onChange={(e) => handleSettingChange('matrixScaling', e?.target?.checked)}
            description="Scale matrix rows and columns for better numerical stability"
          />
          
          <Checkbox
            label="Check Matrix Singularity"
            checked={solverSettings?.checkSingularity}
            onChange={(e) => handleSettingChange('checkSingularity', e?.target?.checked)}
            description="Detect and report singular or near-singular matrices"
          />
        </div>
      </div>
      {/* Direct Solver Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Zap" size={20} className="mr-2 text-primary" />
          Direct Solver Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Pivoting Strategy"
            options={pivotingOptions}
            value={solverSettings?.directSolver?.pivoting}
            onChange={(value) => handleNestedSettingChange('directSolver', 'pivoting', value)}
            description="Pivoting method for numerical stability"
          />
          
          <Input
            label="Pivot Threshold"
            type="number"
            value={solverSettings?.directSolver?.pivotThreshold}
            onChange={(e) => handleNestedSettingChange('directSolver', 'pivotThreshold', parseFloat(e?.target?.value) || 1e-8)}
            step="1e-10"
            min="1e-16"
            max="1e-2"
            description="Minimum pivot value threshold"
          />
          
          <Input
            label="Fill-in Reduction (%)"
            type="number"
            value={solverSettings?.directSolver?.fillInReduction}
            onChange={(e) => handleNestedSettingChange('directSolver', 'fillInReduction', parseInt(e?.target?.value) || 80)}
            min="0"
            max="100"
            description="Target fill-in reduction percentage"
          />
        </div>

        <div className="mt-4 space-y-3">
          <Checkbox
            label="Use Out-of-Core Solver"
            checked={solverSettings?.directSolver?.outOfCore}
            onChange={(e) => handleNestedSettingChange('directSolver', 'outOfCore', e?.target?.checked)}
            description="Use disk storage for very large matrices"
          />
          
          <Checkbox
            label="Iterative Refinement"
            checked={solverSettings?.directSolver?.iterativeRefinement}
            onChange={(e) => handleNestedSettingChange('directSolver', 'iterativeRefinement', e?.target?.checked)}
            description="Improve solution accuracy through iterative refinement"
          />
        </div>
      </div>
      {/* Iterative Solver Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="RotateCw" size={20} className="mr-2 text-primary" />
          Iterative Solver Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Select
            label="Iterative Method"
            options={iterativeMethodOptions}
            value={solverSettings?.iterativeSolver?.method}
            onChange={(value) => handleNestedSettingChange('iterativeSolver', 'method', value)}
            description="Iterative solution algorithm"
          />
          
          <Select
            label="Preconditioner"
            options={preconditionerOptions}
            value={solverSettings?.iterativeSolver?.preconditioner}
            onChange={(value) => handleNestedSettingChange('iterativeSolver', 'preconditioner', value)}
            description="Preconditioning method to accelerate convergence"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Convergence Tolerance"
            type="number"
            value={solverSettings?.iterativeSolver?.tolerance}
            onChange={(e) => handleNestedSettingChange('iterativeSolver', 'tolerance', parseFloat(e?.target?.value) || 1e-8)}
            step="1e-10"
            min="1e-16"
            max="1e-4"
            description="Relative convergence tolerance"
          />
          
          <Input
            label="Maximum Iterations"
            type="number"
            value={solverSettings?.iterativeSolver?.maxIterations}
            onChange={(e) => handleNestedSettingChange('iterativeSolver', 'maxIterations', parseInt(e?.target?.value) || 1000)}
            min="10"
            max="10000"
            description="Maximum number of iterations"
          />
          
          <Input
            label="Restart Parameter"
            type="number"
            value={solverSettings?.iterativeSolver?.restartParameter}
            onChange={(e) => handleNestedSettingChange('iterativeSolver', 'restartParameter', parseInt(e?.target?.value) || 30)}
            min="5"
            max="100"
            description="Restart parameter for GMRES method"
          />
          
          <Input
            label="Relaxation Factor"
            type="number"
            value={solverSettings?.iterativeSolver?.relaxationFactor}
            onChange={(e) => handleNestedSettingChange('iterativeSolver', 'relaxationFactor', parseFloat(e?.target?.value) || 1.0)}
            min="0.1"
            max="2.0"
            step="0.1"
            description="Under/over-relaxation factor"
          />
        </div>
      </div>
      {/* Eigenvalue Solver Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Waves" size={20} className="mr-2 text-primary" />
          Eigenvalue Solver Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Eigenvalue Tolerance"
            type="number"
            value={solverSettings?.eigenSolver?.tolerance}
            onChange={(e) => handleNestedSettingChange('eigenSolver', 'tolerance', parseFloat(e?.target?.value) || 1e-10)}
            step="1e-12"
            min="1e-16"
            max="1e-6"
            description="Convergence tolerance for eigenvalues"
          />
          
          <Input
            label="Maximum Iterations"
            type="number"
            value={solverSettings?.eigenSolver?.maxIterations}
            onChange={(e) => handleNestedSettingChange('eigenSolver', 'maxIterations', parseInt(e?.target?.value) || 300)}
            min="50"
            max="1000"
            description="Maximum iterations for eigenvalue extraction"
          />
          
          <Input
            label="Block Size"
            type="number"
            value={solverSettings?.eigenSolver?.blockSize}
            onChange={(e) => handleNestedSettingChange('eigenSolver', 'blockSize', parseInt(e?.target?.value) || 5)}
            min="1"
            max="20"
            description="Block size for block Lanczos method"
          />
        </div>

        <div className="mt-4 space-y-3">
          <Checkbox
            label="Use Shift-Invert Mode"
            checked={solverSettings?.eigenSolver?.shiftInvert}
            onChange={(e) => handleNestedSettingChange('eigenSolver', 'shiftInvert', e?.target?.checked)}
            description="Use shift-invert transformation for better convergence"
          />
          
          <Checkbox
            label="Normalize Eigenvectors"
            checked={solverSettings?.eigenSolver?.normalizeEigenvectors}
            onChange={(e) => handleNestedSettingChange('eigenSolver', 'normalizeEigenvectors', e?.target?.checked)}
            description="Normalize eigenvectors to unit length"
          />
        </div>
      </div>
      {/* Advanced Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Settings2" size={20} className="mr-2 text-primary" />
          Advanced Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Memory Pool Size (MB)"
            type="number"
            value={solverSettings?.advanced?.memoryPoolSize}
            onChange={(e) => handleNestedSettingChange('advanced', 'memoryPoolSize', parseInt(e?.target?.value) || 2048)}
            min="512"
            max="16384"
            step="512"
            description="Pre-allocated memory pool size"
          />
          
          <Input
            label="Thread Pool Size"
            type="number"
            value={solverSettings?.advanced?.threadPoolSize}
            onChange={(e) => handleNestedSettingChange('advanced', 'threadPoolSize', parseInt(e?.target?.value) || 4)}
            min="1"
            max="32"
            description="Number of threads in the thread pool"
          />
        </div>

        <div className="mt-4 space-y-3">
          <Checkbox
            label="Enable Solver Diagnostics"
            checked={solverSettings?.advanced?.enableDiagnostics}
            onChange={(e) => handleNestedSettingChange('advanced', 'enableDiagnostics', e?.target?.checked)}
            description="Generate detailed solver diagnostic information"
          />
          
          <Checkbox
            label="Use Mixed Precision"
            checked={solverSettings?.advanced?.mixedPrecision}
            onChange={(e) => handleNestedSettingChange('advanced', 'mixedPrecision', e?.target?.checked)}
            description="Use mixed precision arithmetic for better performance"
          />
          
          <Checkbox
            label="Enable Progress Monitoring"
            checked={solverSettings?.advanced?.progressMonitoring}
            onChange={(e) => handleNestedSettingChange('advanced', 'progressMonitoring', e?.target?.checked)}
            description="Monitor and report solver progress in real-time"
          />
        </div>
      </div>
    </div>
  );
};

export default SolverSettingsTab;
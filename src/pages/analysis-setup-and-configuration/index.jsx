import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Navigation from '../../components/ui/Navigation';
import ContextualToolbar from '../../components/ui/ContextualToolbar';
import StatusIndicator from '../../components/ui/StatusIndicator';
import LoadCasesTab from './components/LoadCasesTab';
import LoadCombinationsTab from './components/LoadCombinationsTab';
import AnalysisOptionsTab from './components/AnalysisOptionsTab';
import SolverSettingsTab from './components/SolverSettingsTab';
import ConfigurationSummary from './components/ConfigurationSummary';
import Icon from '../../components/AppIcon';


const AnalysisSetupAndConfiguration = () => {
  const [activeTab, setActiveTab] = useState('load-cases');
  const [isMobileAccordion, setIsMobileAccordion] = useState(false);

  // Mock data for load cases
  const [loadCases, setLoadCases] = useState([
    {
      id: 1,
      name: "DL1",
      type: "dead",
      factor: 1.0,
      description: "Dead load from structural elements",
      createdAt: "2025-01-10T10:30:00Z"
    },
    {
      id: 2,
      name: "LL1",
      type: "live",
      factor: 1.0,
      description: "Live load from occupancy",
      createdAt: "2025-01-10T10:35:00Z"
    },
    {
      id: 3,
      name: "WL1",
      type: "wind",
      factor: 1.0,
      description: "Wind load from east direction",
      createdAt: "2025-01-10T10:40:00Z"
    }
  ]);

  // Mock data for load combinations
  const [loadCombinations, setLoadCombinations] = useState([
    {
      id: 1,
      name: "ULS1",
      type: "ultimate",
      factors: { 1: 1.5, 2: 1.5, 3: 0.0 },
      createdAt: "2025-01-10T11:00:00Z"
    },
    {
      id: 2,
      name: "ULS2",
      type: "ultimate",
      factors: { 1: 1.2, 2: 1.2, 3: 1.5 },
      createdAt: "2025-01-10T11:05:00Z"
    }
  ]);

  // Mock data for analysis options
  const [analysisOptions, setAnalysisOptions] = useState({
    analysisType: 'static',
    solverType: 'direct',
    precision: 'double',
    includePDelta: false,
    includeShearDeformation: true,
    largeDisplacement: false,
    modalOptions: {
      numberOfModes: 10,
      maxFrequency: 100,
      massParticipation: 90
    },
    convergence: {
      forceTolerance: 1e-6,
      displacementTolerance: 1e-6,
      maxIterations: 100
    },
    performance: {
      memoryLimit: 4,
      cpuCores: 4,
      diskCache: 1024,
      parallelProcessing: true,
      gpuAcceleration: false,
      optimizeMemory: true
    },
    output: {
      detailedReport: true,
      exportCSV: false,
      saveAnimationFrames: false,
      includeReactions: true
    }
  });

  // Mock data for solver settings
  const [solverSettings, setSolverSettings] = useState({
    matrixStorage: 'sparse',
    matrixReordering: 'automatic',
    matrixScaling: true,
    checkSingularity: true,
    directSolver: {
      pivoting: 'partial',
      pivotThreshold: 1e-8,
      fillInReduction: 80,
      outOfCore: false,
      iterativeRefinement: true
    },
    iterativeSolver: {
      method: 'pcg',
      preconditioner: 'ilu',
      tolerance: 1e-8,
      maxIterations: 1000,
      restartParameter: 30,
      relaxationFactor: 1.0
    },
    eigenSolver: {
      tolerance: 1e-10,
      maxIterations: 300,
      blockSize: 5,
      shiftInvert: true,
      normalizeEigenvectors: true
    },
    advanced: {
      memoryPoolSize: 2048,
      threadPoolSize: 4,
      enableDiagnostics: false,
      mixedPrecision: false,
      progressMonitoring: true
    }
  });

  const tabs = [
    {
      id: 'load-cases',
      label: 'Load Cases',
      icon: 'Zap',
      description: 'Define and manage structural load cases'
    },
    {
      id: 'load-combinations',
      label: 'Load Combinations',
      icon: 'Layers',
      description: 'Create load combinations for analysis'
    },
    {
      id: 'analysis-options',
      label: 'Analysis Options',
      icon: 'Calculator',
      description: 'Configure analysis parameters and settings'
    },
    {
      id: 'solver-settings',
      label: 'Solver Settings',
      icon: 'Settings',
      description: 'Advanced solver configuration options'
    }
  ];

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileAccordion(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRunAnalysis = () => {
    console.log('Starting analysis with configuration:', {
      loadCases,
      loadCombinations,
      analysisOptions,
      solverSettings
    });
    // In a real app, this would trigger the analysis process
  };

  const handleSaveConfiguration = () => {
    const config = {
      loadCases,
      loadCombinations,
      analysisOptions,
      solverSettings,
      savedAt: new Date()?.toISOString()
    };
    console.log('Saving configuration:', config);
    // In a real app, this would save to local storage or backend
  };

  const handleLoadTemplate = () => {
    console.log('Loading configuration template');
    // In a real app, this would load a predefined template
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'load-cases':
        return (
          <LoadCasesTab
            loadCases={loadCases}
            onUpdateLoadCases={setLoadCases}
          />
        );
      case 'load-combinations':
        return (
          <LoadCombinationsTab
            loadCases={loadCases}
            loadCombinations={loadCombinations}
            onUpdateCombinations={setLoadCombinations}
          />
        );
      case 'analysis-options':
        return (
          <AnalysisOptionsTab
            analysisOptions={analysisOptions}
            onUpdateOptions={setAnalysisOptions}
          />
        );
      case 'solver-settings':
        return (
          <SolverSettingsTab
            solverSettings={solverSettings}
            onUpdateSettings={setSolverSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Analysis Setup and Configuration - StruMind</title>
        <meta name="description" content="Configure analysis parameters, load combinations, and solver settings for structural analysis in StruMind" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <ContextualToolbar />

        <main className="pt-32 lg:pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Icon name="Calculator" size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Analysis Setup and Configuration</h1>
                  <p className="text-muted-foreground">Configure analysis parameters, load combinations, and solver settings</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Main Content Area */}
              <div className="xl:col-span-8">
                {/* Desktop Tabs */}
                {!isMobileAccordion && (
                  <div className="bg-card border border-border rounded-lg mb-6">
                    <div className="border-b border-border">
                      <nav className="flex space-x-1 p-1">
                        {tabs?.map((tab) => (
                          <button
                            key={tab?.id}
                            onClick={() => setActiveTab(tab?.id)}
                            className={`
                              flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200
                              ${activeTab === tab?.id
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }
                            `}
                          >
                            <Icon name={tab?.icon} size={16} />
                            <span className="hidden sm:inline">{tab?.label}</span>
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                )}

                {/* Mobile Accordion */}
                {isMobileAccordion ? (
                  <div className="space-y-4">
                    {tabs?.map((tab) => (
                      <div key={tab?.id} className="bg-card border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setActiveTab(activeTab === tab?.id ? '' : tab?.id)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Icon name={tab?.icon} size={20} className="text-primary" />
                            <div>
                              <h3 className="font-medium text-foreground">{tab?.label}</h3>
                              <p className="text-sm text-muted-foreground">{tab?.description}</p>
                            </div>
                          </div>
                          <Icon 
                            name="ChevronDown" 
                            size={20} 
                            className={`text-muted-foreground transform transition-transform ${
                              activeTab === tab?.id ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        
                        {activeTab === tab?.id && (
                          <div className="px-6 pb-6 border-t border-border">
                            <div className="pt-6">
                              {renderTabContent()}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Desktop Tab Content */
                  (<div className="bg-card border border-border rounded-lg p-6">
                    {renderTabContent()}
                  </div>)
                )}
              </div>

              {/* Configuration Summary Panel */}
              <div className="xl:col-span-4">
                <div className="sticky top-32 lg:top-28">
                  <ConfigurationSummary
                    loadCases={loadCases}
                    loadCombinations={loadCombinations}
                    analysisOptions={analysisOptions}
                    solverSettings={solverSettings}
                    onRunAnalysis={handleRunAnalysis}
                    onSaveConfiguration={handleSaveConfiguration}
                    onLoadTemplate={handleLoadTemplate}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        <StatusIndicator />
      </div>
    </>
  );
};

export default AnalysisSetupAndConfiguration;
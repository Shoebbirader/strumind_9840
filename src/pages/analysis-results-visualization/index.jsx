import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Navigation from '../../components/ui/Navigation';
import ContextualToolbar from '../../components/ui/ContextualToolbar';
import StatusIndicator from '../../components/ui/StatusIndicator';
import ResultsViewport from './components/ResultsViewport';
import ResultsControlPanel from './components/ResultsControlPanel';
import ResultsDataPanel from './components/ResultsDataPanel';

const AnalysisResultsVisualization = () => {
  const [selectedResultType, setSelectedResultType] = useState('Displacement');
  const [selectedLoadCase, setSelectedLoadCase] = useState('COMB1');
  const [isRecording, setIsRecording] = useState(false);
  const [visualizationOptions, setVisualizationOptions] = useState({
    deformationScale: 10,
    transparency: 0.0,
    showDiagrams: true,
    showValues: false,
    showUndeformed: true,
    smoothContours: true,
    diagramType: 'moment',
    contourType: 'vonMises',
    modeNumber: 1,
    colorScaleMin: 0,
    colorScaleMax: 100
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event?.ctrlKey) {
        switch (event?.key) {
          case 's':
            event?.preventDefault();
            handleScreenshot();
            break;
          case 'e':
            event?.preventDefault();
            handleExportResults();
            break;
          case 'r':
            event?.preventDefault();
            handleGenerateReport();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleResultTypeChange = (resultType) => {
    setSelectedResultType(resultType);
    
    // Reset visualization options based on result type
    if (resultType === 'Modal') {
      setVisualizationOptions(prev => ({
        ...prev,
        deformationScale: 50,
        showDiagrams: false
      }));
    } else if (resultType === 'Forces') {
      setVisualizationOptions(prev => ({
        ...prev,
        showDiagrams: true,
        diagramType: 'moment'
      }));
    }
  };

  const handleLoadCaseChange = (loadCase) => {
    setSelectedLoadCase(loadCase);
  };

  const handleVisualizationChange = (options) => {
    setVisualizationOptions(options);
  };

  const handleScreenshot = () => {
    console.log('Taking screenshot...');
    // Mock screenshot functionality
    const timestamp = new Date()?.toISOString()?.replace(/[:.]/g, '-');
    const filename = `analysis_screenshot_${timestamp}.png`;
    
    // In a real application, this would capture the 3D viewport
    // For now, we'll just show a notification
    alert(`Screenshot saved as ${filename}`);
  };

  const handleStartRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      console.log('Starting screen recording...');
    } else {
      console.log('Stopping screen recording...');
      const timestamp = new Date()?.toISOString()?.replace(/[:.]/g, '-');
      const filename = `analysis_recording_${timestamp}.mp4`;
      alert(`Recording saved as ${filename}`);
    }
  };

  const handleExportResults = () => {
    console.log('Exporting results...');
    const timestamp = new Date()?.toISOString()?.split('T')?.[0];
    const filename = `${selectedResultType}_Results_${selectedLoadCase}_${timestamp}.csv`;
    
    // Mock CSV export
    const csvContent = `Load Case,${selectedLoadCase}\nResult Type,${selectedResultType}\nExported,${new Date()?.toLocaleString()}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    console.log('Generating analysis report...');
    const timestamp = new Date()?.toISOString()?.split('T')?.[0];
    const filename = `Analysis_Report_${timestamp}.pdf`;
    
    // Mock report generation
    setTimeout(() => {
      alert(`Report generated successfully: ${filename}`);
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Analysis Results Visualization - StruMind</title>
        <meta name="description" content="Visualize and analyze structural analysis results with interactive 3D displays, force diagrams, and comprehensive data tables." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <ContextualToolbar />

        {/* Main Content */}
        <div className="pt-32 lg:pt-28 pb-12">
          <div className="px-6">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Analysis Results Visualization
                  </h1>
                  <p className="text-muted-foreground">
                    Interactive visualization and analysis of structural computation results
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      Current Analysis: Project_2025_v1.2
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Completed: {new Date()?.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-success rounded-full" />
                </div>
              </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
              {/* Control Panel - Left Sidebar */}
              <div className="xl:col-span-1 order-2 xl:order-1">
                <ResultsControlPanel
                  selectedResultType={selectedResultType}
                  onResultTypeChange={handleResultTypeChange}
                  selectedLoadCase={selectedLoadCase}
                  onLoadCaseChange={handleLoadCaseChange}
                  visualizationOptions={visualizationOptions}
                  onVisualizationChange={handleVisualizationChange}
                  onExportResults={handleExportResults}
                  onGenerateReport={handleGenerateReport}
                />
              </div>

              {/* Main Viewport - Center */}
              <div className="xl:col-span-3 order-1 xl:order-2">
                <div className="grid grid-rows-2 gap-4 h-full">
                  {/* 3D Viewport */}
                  <div className="row-span-1">
                    <ResultsViewport
                      selectedResultType={selectedResultType}
                      selectedLoadCase={selectedLoadCase}
                      visualizationOptions={visualizationOptions}
                      onScreenshot={handleScreenshot}
                      onStartRecording={handleStartRecording}
                      isRecording={isRecording}
                    />
                  </div>

                  {/* Data Panel */}
                  <div className="row-span-1">
                    <ResultsDataPanel
                      selectedResultType={selectedResultType}
                      selectedLoadCase={selectedLoadCase}
                      onExportData={handleExportResults}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout Adjustments */}
            <div className="xl:hidden mt-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={handleScreenshot}
                    className="flex flex-col items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mb-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </div>
                    <span className="text-xs text-foreground">Screenshot</span>
                  </button>

                  <button
                    onClick={handleExportResults}
                    className="flex flex-col items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center mb-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </div>
                    <span className="text-xs text-foreground">Export</span>
                  </button>

                  <button
                    onClick={handleGenerateReport}
                    className="flex flex-col items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center mb-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                      </svg>
                    </div>
                    <span className="text-xs text-foreground">Report</span>
                  </button>

                  <button
                    onClick={handleStartRecording}
                    className="flex flex-col items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                      isRecording ? 'bg-error/20' : 'bg-primary/20'
                    }`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
                           className={isRecording ? 'text-error' : 'text-primary'}>
                        {isRecording ? (
                          <rect x="6" y="6" width="12" height="12" rx="2"/>
                        ) : (
                          <>
                            <polygon points="23 7 16 12 23 17 23 7"/>
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                          </>
                        )}
                      </svg>
                    </div>
                    <span className="text-xs text-foreground">
                      {isRecording ? 'Stop' : 'Record'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <StatusIndicator />
      </div>
    </>
  );
};

export default AnalysisResultsVisualization;
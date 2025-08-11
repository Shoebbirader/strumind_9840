import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Navigation from '../../components/ui/Navigation';
import ContextualToolbar from '../../components/ui/ContextualToolbar';
import StatusIndicator from '../../components/ui/StatusIndicator';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Import all setting components
import SettingsSidebar from './components/SettingsSidebar';
import GeneralSettings from './components/GeneralSettings';
import UnitsSettings from './components/UnitsSettings';
import DesignCodesSettings from './components/DesignCodesSettings';
import MaterialsLibrarySettings from './components/MaterialsLibrarySettings';
import AnalysisDefaultsSettings from './components/AnalysisDefaultsSettings';
import MobileSettingsMenu from './components/MobileSettingsMenu';

const ProjectSettingsAndConfiguration = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingSection, setPendingSection] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Mock settings data structure
  const [settings, setSettings] = useState({
    general: {
      projectName: "High-Rise Commercial Building",
      projectNumber: "PRJ-2024-001",
      engineerName: "John Engineer",
      creationDate: "2024-08-11",
      description: "15-story commercial building with basement parking",
      coordinateSystem: "cartesian",
      tolerance: "1e-5",
      showGrid: true,
      showAxes: true,
      snapToGrid: false,
      autoSave: true,
      showElementLabels: false,
      showNodeNumbers: false,
      gridSpacing: "1.0",
      selectionColor: "#2563EB"
    },
    units: {
      force: "kN",
      length: "m",
      stress: "MPa",
      temperature: "C",
      showSymbols: true,
      scientificNotation: false,
      autoScale: true
    },
    designCodes: {
      steel: "IS800-2007",
      concrete: "IS456-2000",
      seismic: "IS1893-2016",
      wind: "IS875-3-2015",
      options: {
        steelLTB: true,
        steelShearLag: false,
        steelEffectiveLength: true,
        steelConnections: false,
        concreteDeflection: true,
        concreteCreep: true,
        concreteMinReinf: true,
        concretePunching: false,
        seismicResponse: true,
        seismicPDelta: false,
        seismicSSI: false,
        seismicDuctility: true,
        windDynamic: false,
        windTerrain: true,
        windGust: true,
        windVortex: false,
        autoLoadCombos: true,
        accidentalLoads: false,
        partialFactors: true,
        constructionStage: false
      }
    },
    materials: {
      custom: []
    },
    analysis: {
      solverType: "direct-sparse",
      maxIterations: "1000",
      memoryLimit: "4",
      parallelThreads: "4",
      convergenceType: "displacement",
      convergenceTolerance: "1e-6",
      forceTolerance: "1e-3",
      displacementTolerance: "1e-6",
      outputFormat: "json",
      significantDigits: "6",
      filePrefix: "analysis_",
      modalModes: "10",
      frequencyRange: "0-50",
      options: {
        geometricNonlinearity: false,
        materialNonlinearity: false,
        autoLoadStepping: true,
        stabilityCheck: true,
        detailedOutput: true,
        saveIntermediate: false,
        autoMeshRefinement: false,
        realTimeProgress: true,
        includeSummary: true,
        exportReactions: true,
        exportElementForces: true,
        massParticipation: true,
        normalizeModes: true,
        effectiveModalMass: false,
        exportAnimations: false
      }
    }
  });

  const [originalSettings, setOriginalSettings] = useState(settings);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasUnsavedChanges(hasChanges);
  }, [settings, originalSettings]);

  const handleSettingsChange = (section, newSectionSettings) => {
    setSettings(prev => ({
      ...prev,
      [section]: newSectionSettings
    }));
  };

  const handleSectionChange = (newSection) => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
      setPendingSection(newSection);
    } else {
      setActiveSection(newSection);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setOriginalSettings(settings);
    setHasUnsavedChanges(false);
    setIsSaving(false);
    
    // Show success notification
    console.log('Settings saved successfully');
  };

  const handleDiscardChanges = () => {
    setSettings(originalSettings);
    setHasUnsavedChanges(false);
    setShowUnsavedWarning(false);
    
    if (pendingSection) {
      setActiveSection(pendingSection);
      setPendingSection(null);
    }
  };

  const handleContinueWithoutSaving = () => {
    setShowUnsavedWarning(false);
    if (pendingSection) {
      setActiveSection(pendingSection);
      setPendingSection(null);
    }
  };

  const handleResetToDefaults = () => {
    const defaultSettings = {
      general: {
        projectName: "",
        projectNumber: "",
        engineerName: "",
        creationDate: new Date()?.toISOString()?.split('T')?.[0],
        description: "",
        coordinateSystem: "cartesian",
        tolerance: "1e-5",
        showGrid: true,
        showAxes: true,
        snapToGrid: false,
        autoSave: true,
        showElementLabels: false,
        showNodeNumbers: false,
        gridSpacing: "1.0",
        selectionColor: "#2563EB"
      },
      units: {
        force: "kN",
        length: "m",
        stress: "MPa",
        temperature: "C",
        showSymbols: true,
        scientificNotation: false,
        autoScale: true
      },
      designCodes: {
        steel: "IS800-2007",
        concrete: "IS456-2000",
        seismic: "IS1893-2016",
        wind: "IS875-3-2015",
        options: {
          steelLTB: true,
          steelShearLag: false,
          steelEffectiveLength: true,
          steelConnections: false,
          concreteDeflection: true,
          concreteCreep: true,
          concreteMinReinf: true,
          concretePunching: false,
          seismicResponse: true,
          seismicPDelta: false,
          seismicSSI: false,
          seismicDuctility: true,
          windDynamic: false,
          windTerrain: true,
          windGust: true,
          windVortex: false,
          autoLoadCombos: true,
          accidentalLoads: false,
          partialFactors: true,
          constructionStage: false
        }
      },
      materials: {
        custom: []
      },
      analysis: {
        solverType: "direct-sparse",
        maxIterations: "1000",
        memoryLimit: "4",
        parallelThreads: "4",
        convergenceType: "displacement",
        convergenceTolerance: "1e-6",
        forceTolerance: "1e-3",
        displacementTolerance: "1e-6",
        outputFormat: "json",
        significantDigits: "6",
        filePrefix: "analysis_",
        modalModes: "10",
        frequencyRange: "0-50",
        options: {
          geometricNonlinearity: false,
          materialNonlinearity: false,
          autoLoadStepping: true,
          stabilityCheck: true,
          detailedOutput: true,
          saveIntermediate: false,
          autoMeshRefinement: false,
          realTimeProgress: true,
          includeSummary: true,
          exportReactions: true,
          exportElementForces: true,
          massParticipation: true,
          normalizeModes: true,
          effectiveModalMass: false,
          exportAnimations: false
        }
      }
    };
    
    setSettings(defaultSettings);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <GeneralSettings 
            settings={settings} 
            onSettingsChange={handleSettingsChange} 
          />
        );
      case 'units':
        return (
          <UnitsSettings 
            settings={settings} 
            onSettingsChange={handleSettingsChange} 
          />
        );
      case 'design-codes':
        return (
          <DesignCodesSettings 
            settings={settings} 
            onSettingsChange={handleSettingsChange} 
          />
        );
      case 'materials':
        return (
          <MaterialsLibrarySettings 
            settings={settings} 
            onSettingsChange={handleSettingsChange} 
          />
        );
      case 'analysis':
        return (
          <AnalysisDefaultsSettings 
            settings={settings} 
            onSettingsChange={handleSettingsChange} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <ContextualToolbar />
      
      <div className="pt-32 lg:pt-28 pb-16">
        <div className="flex h-[calc(100vh-8rem)]">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>

          {/* Mobile Menu */}
          <MobileSettingsMenu
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            hasUnsavedChanges={hasUnsavedChanges}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 lg:p-8 max-w-6xl">
                {renderActiveSection()}
              </div>
            </div>

            {/* Action Bar */}
            <div className="border-t border-border bg-card p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4">
                  {hasUnsavedChanges && (
                    <div className="flex items-center space-x-2 text-warning">
                      <Icon name="AlertTriangle" size={16} />
                      <span className="text-sm">You have unsaved changes</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleResetToDefaults}
                    iconName="RotateCcw"
                    iconPosition="left"
                    disabled={isSaving}
                  >
                    Reset to Defaults
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleDiscardChanges}
                    disabled={!hasUnsavedChanges || isSaving}
                  >
                    Discard Changes
                  </Button>
                  
                  <Button
                    variant="default"
                    onClick={handleSaveSettings}
                    loading={isSaving}
                    disabled={!hasUnsavedChanges}
                    iconName="Save"
                    iconPosition="left"
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="AlertTriangle" size={24} className="text-warning" />
              <h3 className="text-lg font-semibold text-foreground">Unsaved Changes</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              You have unsaved changes that will be lost if you continue. What would you like to do?
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button
                variant="default"
                onClick={handleSaveSettings}
                loading={isSaving}
                iconName="Save"
                iconPosition="left"
                className="flex-1"
              >
                Save Changes
              </Button>
              
              <Button
                variant="outline"
                onClick={handleContinueWithoutSaving}
                disabled={isSaving}
                className="flex-1"
              >
                Continue Without Saving
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => {
                  setShowUnsavedWarning(false);
                  setPendingSection(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <StatusIndicator />
    </div>
  );
};

export default ProjectSettingsAndConfiguration;
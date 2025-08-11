import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Navigation from '../../components/ui/Navigation';
import ContextualToolbar from '../../components/ui/ContextualToolbar';
import StatusIndicator from '../../components/ui/StatusIndicator';
import MemberSelectionTree from './components/MemberSelectionTree';
import DesignCheckResults from './components/DesignCheckResults';
import CriticalMembersSummary from './components/CriticalMembersSummary';
import DesignCodeSelector from './components/DesignCodeSelector';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const DesignCodeVerification = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('split'); // 'split', 'summary', 'details'
  const [isRunningVerification, setIsRunningVerification] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [isMobileTreeOpen, setIsMobileTreeOpen] = useState(false);

  // Simulate verification progress
  useEffect(() => {
    if (isRunningVerification) {
      const interval = setInterval(() => {
        setVerificationProgress(prev => {
          if (prev >= 100) {
            setIsRunningVerification(false);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isRunningVerification]);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setIsMobileTreeOpen(false);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleRunVerification = () => {
    setIsRunningVerification(true);
    setVerificationProgress(0);
  };

  const handleDesignCodeChange = (settings) => {
    console.log('Design code settings changed:', settings);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Design Code Verification - StruMind</title>
        <meta name="description" content="Automated design checks and code compliance verification for structural members per IS 800 and IS 456 standards" />
      </Helmet>
      <Header />
      <Navigation />
      <ContextualToolbar />
      <main className="pt-32 lg:pt-28 pb-12">
        <div className="px-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Design Code Verification</h1>
                <p className="text-muted-foreground">
                  Automated design checks and code compliance verification for structural members
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* View Mode Toggle */}
                <div className="hidden lg:flex items-center space-x-1 bg-muted/30 p-1 rounded-lg">
                  <Button
                    variant={viewMode === 'summary' ? "default" : "ghost"}
                    size="xs"
                    onClick={() => setViewMode('summary')}
                  >
                    <Icon name="BarChart3" size={14} className="mr-1" />
                    Summary
                  </Button>
                  <Button
                    variant={viewMode === 'split' ? "default" : "ghost"}
                    size="xs"
                    onClick={() => setViewMode('split')}
                  >
                    <Icon name="Columns" size={14} className="mr-1" />
                    Split
                  </Button>
                  <Button
                    variant={viewMode === 'details' ? "default" : "ghost"}
                    size="xs"
                    onClick={() => setViewMode('details')}
                  >
                    <Icon name="FileText" size={14} className="mr-1" />
                    Details
                  </Button>
                </div>

                {/* Run Verification Button */}
                <Button
                  variant="default"
                  onClick={handleRunVerification}
                  disabled={isRunningVerification}
                  className="relative"
                >
                  {isRunningVerification ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Verifying... {Math.round(verificationProgress)}%
                    </>
                  ) : (
                    <>
                      <Icon name="Shield" size={16} className="mr-2" />
                      Run Verification
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            {isRunningVerification && (
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Design Code Configuration */}
          <div className="mb-6">
            <DesignCodeSelector onSettingsChange={handleDesignCodeChange} />
          </div>

          {/* Critical Members Summary - Always visible on desktop */}
          {(viewMode === 'summary' || viewMode === 'split') && (
            <div className="mb-6">
              <CriticalMembersSummary onMemberSelect={handleMemberSelect} />
            </div>
          )}

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
            {/* Mobile Member Selection Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setIsMobileTreeOpen(!isMobileTreeOpen)}
                className="w-full justify-between mb-4"
              >
                <div className="flex items-center">
                  <Icon name="List" size={16} className="mr-2" />
                  {selectedMember ? selectedMember?.name : 'Select Member'}
                </div>
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className={`transform transition-transform ${isMobileTreeOpen ? 'rotate-180' : ''}`}
                />
              </Button>

              {/* Mobile Member Tree Dropdown */}
              {isMobileTreeOpen && (
                <div className="mb-4 border border-border rounded-lg bg-card">
                  <MemberSelectionTree
                    selectedMember={selectedMember}
                    onMemberSelect={handleMemberSelect}
                    filterStatus={filterStatus}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              )}
            </div>

            {/* Desktop Member Selection Tree */}
            {(viewMode === 'split' || viewMode === 'details') && (
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-32 h-[calc(100vh-200px)]">
                  <MemberSelectionTree
                    selectedMember={selectedMember}
                    onMemberSelect={handleMemberSelect}
                    filterStatus={filterStatus}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            )}

            {/* Design Check Results */}
            {(viewMode === 'split' || viewMode === 'details') && (
              <div className={`${viewMode === 'split' ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
                <div className="sticky top-32 h-[calc(100vh-200px)]">
                  <DesignCheckResults selectedMember={selectedMember} />
                </div>
              </div>
            )}

            {/* Summary Only View */}
            {viewMode === 'summary' && (
              <div className="lg:col-span-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="text-center">
                    <Icon name="BarChart3" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Summary View Active</h3>
                    <p className="text-muted-foreground mb-4">
                      Critical members summary is displayed above. Switch to Split or Details view for member-specific analysis.
                    </p>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setViewMode('split')}
                      >
                        <Icon name="Columns" size={16} className="mr-2" />
                        Switch to Split View
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => setViewMode('details')}
                      >
                        <Icon name="FileText" size={16} className="mr-2" />
                        Switch to Details View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-success mb-1">78%</div>
              <div className="text-sm text-muted-foreground">Members Passing</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-error mb-1">2</div>
              <div className="text-sm text-muted-foreground">Critical Failures</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-warning mb-1">3</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">1.12</div>
              <div className="text-sm text-muted-foreground">Max Utilization</div>
            </div>
          </div>
        </div>
      </main>
      <StatusIndicator />
    </div>
  );
};

export default DesignCodeVerification;
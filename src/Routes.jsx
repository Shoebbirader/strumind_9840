import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import DesignCodeVerification from './pages/design-code-verification';
import AnalysisResultsVisualization from './pages/analysis-results-visualization';
import ProjectDashboard from './pages/project-dashboard';
import StructuralModelingWorkspace from './pages/3d-structural-modeling-workspace';
import AnalysisSetupAndConfiguration from './pages/analysis-setup-and-configuration';
import ProjectSettingsAndConfiguration from './pages/project-settings-and-configuration';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<StructuralModelingWorkspace />} />
        <Route path="/design-code-verification" element={<DesignCodeVerification />} />
        <Route path="/analysis-results-visualization" element={<AnalysisResultsVisualization />} />
        <Route path="/project-dashboard" element={<ProjectDashboard />} />
        <Route path="/3d-structural-modeling-workspace" element={<StructuralModelingWorkspace />} />
        <Route path="/analysis-setup-and-configuration" element={<AnalysisSetupAndConfiguration />} />
        <Route path="/project-settings-and-configuration" element={<ProjectSettingsAndConfiguration />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

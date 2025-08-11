import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const StatusIndicator = () => {
  const location = useLocation();
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);
  const [modelStatus, setModelStatus] = useState('valid');
  const [notifications, setNotifications] = useState([]);

  // Simulate analysis progress
  useEffect(() => {
    if (isAnalysisRunning) {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            setIsAnalysisRunning(false);
            setNotifications(prev => [...prev, {
              id: Date.now(),
              type: 'success',
              message: 'Analysis completed successfully',
              timestamp: new Date()
            }]);
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isAnalysisRunning]);

  const getStatusConfig = () => {
    switch (location?.pathname) {
      case '/3d-structural-modeling-workspace':
        return {
          showModelStatus: true,
          showProgress: false,
          statusItems: [
            { label: 'Nodes', value: '1,247', icon: 'Circle' },
            { label: 'Elements', value: '2,891', icon: 'Box' },
            { label: 'Materials', value: '3', icon: 'Layers' },
            { label: 'Load Cases', value: '5', icon: 'Zap' },
          ]
        };

      case '/analysis-setup-and-configuration': case'/analysis-results-visualization':
        return {
          showModelStatus: true,
          showProgress: isAnalysisRunning,
          statusItems: [
            { label: 'Model Status', value: modelStatus === 'valid' ? 'Valid' : 'Invalid', 
              icon: modelStatus === 'valid' ? 'CheckCircle' : 'AlertCircle',
              color: modelStatus === 'valid' ? 'success' : 'error' },
            { label: 'Solver', value: 'Direct Sparse', icon: 'Cpu' },
            { label: 'DOF', value: '7,482', icon: 'Hash' },
            { label: 'Memory', value: '2.1 GB', icon: 'HardDrive' },
          ]
        };

      default:
        return {
          showModelStatus: false,
          showProgress: false,
          statusItems: []
        };
    }
  };

  const startAnalysis = () => {
    setIsAnalysisRunning(true);
    setAnalysisProgress(0);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev?.filter(n => n?.id !== id));
  };

  const statusConfig = getStatusConfig();

  if (!statusConfig?.showModelStatus && !statusConfig?.showProgress && statusConfig?.statusItems?.length === 0) {
    return null;
  }

  return (
    <>
      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Left Status Items */}
            <div className="flex items-center space-x-6">
              {statusConfig?.statusItems?.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon 
                    name={item?.icon} 
                    size={14} 
                    className={`
                      ${item?.color === 'success' ? 'text-success' : 
                        item?.color === 'error'? 'text-error' : 'text-muted-foreground'}
                    `}
                  />
                  <span className="text-xs text-muted-foreground">{item?.label}:</span>
                  <span className={`text-xs font-mono ${
                    item?.color === 'success' ? 'text-success' : 
                    item?.color === 'error'? 'text-error' : 'text-foreground'
                  }`}>
                    {item?.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Analysis Progress */}
              {statusConfig?.showProgress && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="Loader2" size={14} className="animate-spin text-primary" />
                    <span className="text-xs text-foreground">
                      Analysis Running: {Math.round(analysisProgress)}%
                    </span>
                  </div>
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {location?.pathname === '/analysis-setup-and-configuration' && !isAnalysisRunning && (
                <Button
                  variant="default"
                  size="xs"
                  onClick={startAnalysis}
                  className="h-6"
                >
                  <Icon name="Play" size={12} className="mr-1" />
                  Run Analysis
                </Button>
              )}

              {/* System Status */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-xs text-muted-foreground">System Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Notifications */}
      {notifications?.length > 0 && (
        <div className="fixed bottom-12 right-6 z-50 space-y-2">
          {notifications?.slice(-3)?.map((notification) => (
            <div
              key={notification?.id}
              className={`
                flex items-center justify-between p-3 rounded-md shadow-modal border max-w-sm
                ${notification?.type === 'success' ? 'bg-success/10 border-success/20 text-success' :
                  notification?.type === 'error' ? 'bg-error/10 border-error/20 text-error' :
                  notification?.type === 'warning'? 'bg-warning/10 border-warning/20 text-warning' : 'bg-card border-border text-foreground'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <Icon 
                  name={
                    notification?.type === 'success' ? 'CheckCircle' :
                    notification?.type === 'error' ? 'XCircle' :
                    notification?.type === 'warning'? 'AlertTriangle' : 'Info'
                  } 
                  size={16} 
                />
                <span className="text-sm">{notification?.message}</span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => dismissNotification(notification?.id)}
                className="ml-2 h-6 w-6 p-0 hover:bg-current/10"
              >
                <Icon name="X" size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default StatusIndicator;
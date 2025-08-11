import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResultsViewport = ({ 
  selectedResultType, 
  selectedLoadCase, 
  visualizationOptions,
  onScreenshot,
  onStartRecording,
  isRecording 
}) => {
  const viewportRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [viewMode, setViewMode] = useState('3d'); // '3d', 'front', 'side', 'top'
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);

  // Mock 3D model data with analysis results
  const modelData = {
    nodes: [
      { id: 1, x: 0, y: 0, z: 0, displacement: { x: 0, y: -2.5, z: 0 }, stress: 45.2 },
      { id: 2, x: 5000, y: 0, z: 0, displacement: { x: 1.2, y: -3.1, z: 0 }, stress: 52.8 },
      { id: 3, x: 10000, y: 0, z: 0, displacement: { x: 0, y: -2.8, z: 0 }, stress: 38.7 },
      { id: 4, x: 0, y: 3000, z: 0, displacement: { x: 0.5, y: -1.8, z: 0 }, stress: 41.3 },
      { id: 5, x: 5000, y: 3000, z: 0, displacement: { x: 2.1, y: -4.2, z: 0.3 }, stress: 67.9 },
      { id: 6, x: 10000, y: 3000, z: 0, displacement: { x: 0.8, y: -2.1, z: 0 }, stress: 43.6 }
    ],
    elements: [
      { id: 1, nodeStart: 1, nodeEnd: 2, type: 'beam', axialForce: 125.5, shearForce: 45.2, moment: 89.7 },
      { id: 2, nodeStart: 2, nodeEnd: 3, type: 'beam', axialForce: 98.3, shearForce: 38.9, moment: 76.4 },
      { id: 3, nodeStart: 4, nodeEnd: 5, type: 'beam', axialForce: 156.8, shearForce: 52.1, moment: 102.3 },
      { id: 4, nodeStart: 5, nodeEnd: 6, type: 'beam', axialForce: 134.2, shearForce: 41.7, moment: 87.9 },
      { id: 5, nodeStart: 1, nodeEnd: 4, type: 'column', axialForce: 245.6, shearForce: 12.3, moment: 34.8 },
      { id: 6, nodeStart: 2, nodeEnd: 5, type: 'column', axialForce: 289.4, shearForce: 18.7, moment: 45.2 },
      { id: 7, nodeStart: 3, nodeEnd: 6, type: 'column', axialForce: 198.7, shearForce: 9.8, moment: 28.6 }
    ]
  };

  const getResultColor = (value, type) => {
    const colorMaps = {
      displacement: [
        { min: 0, max: 1, color: '#10B981' },
        { min: 1, max: 2, color: '#F59E0B' },
        { min: 2, max: 3, color: '#EF4444' },
        { min: 3, max: 5, color: '#DC2626' }
      ],
      stress: [
        { min: 0, max: 30, color: '#3B82F6' },
        { min: 30, max: 50, color: '#10B981' },
        { min: 50, max: 70, color: '#F59E0B' },
        { min: 70, max: 100, color: '#EF4444' }
      ],
      force: [
        { min: 0, max: 100, color: '#10B981' },
        { min: 100, max: 200, color: '#F59E0B' },
        { min: 200, max: 300, color: '#EF4444' }
      ]
    };

    const map = colorMaps?.[type] || colorMaps?.displacement;
    for (const range of map) {
      if (value >= range?.min && value <= range?.max) {
        return range?.color;
      }
    }
    return '#6B7280';
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const resetView = () => {
    setViewMode('3d');
    setIsAnimating(false);
    setAnimationSpeed(1.0);
  };

  return (
    <div className="h-full bg-surface border border-border rounded-lg overflow-hidden">
      {/* Viewport Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            {selectedResultType} Results - {selectedLoadCase}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-sm text-muted-foreground">Analysis Complete</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Controls */}
          <div className="flex items-center space-x-1 bg-muted rounded-md p-1">
            {[
              { mode: '3d', icon: 'Box', label: '3D' },
              { mode: 'front', icon: 'Square', label: 'Front' },
              { mode: 'side', icon: 'Rectangle', label: 'Side' },
              { mode: 'top', icon: 'Circle', label: 'Top' }
            ]?.map((view) => (
              <Button
                key={view?.mode}
                variant={viewMode === view?.mode ? "default" : "ghost"}
                size="xs"
                onClick={() => handleViewModeChange(view?.mode)}
                className="h-7 px-2"
              >
                <Icon name={view?.icon} size={14} className="mr-1" />
                {view?.label}
              </Button>
            ))}
          </div>

          {/* Animation Controls */}
          <Button
            variant={isAnimating ? "default" : "outline"}
            size="sm"
            onClick={toggleAnimation}
            className="h-8"
          >
            <Icon name={isAnimating ? "Pause" : "Play"} size={16} className="mr-1" />
            {isAnimating ? "Pause" : "Animate"}
          </Button>

          {/* Capture Controls */}
          <Button
            variant="outline"
            size="sm"
            onClick={onScreenshot}
            className="h-8"
          >
            <Icon name="Camera" size={16} />
          </Button>

          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={onStartRecording}
            className="h-8"
          >
            <Icon name={isRecording ? "Square" : "Video"} size={16} />
          </Button>
        </div>
      </div>
      {/* 3D Viewport */}
      <div ref={viewportRef} className="relative flex-1 bg-background">
        {/* Mock 3D Canvas */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
            className="border border-border/20"
          >
            {/* Grid */}
            {showGrid && (
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
                </pattern>
              </defs>
            )}
            {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

            {/* Coordinate Axes */}
            {showAxes && (
              <g>
                <line x1="50" y1="550" x2="150" y2="550" stroke="#EF4444" strokeWidth="3" markerEnd="url(#arrowX)" />
                <line x1="50" y1="550" x2="50" y2="450" stroke="#10B981" strokeWidth="3" markerEnd="url(#arrowY)" />
                <line x1="50" y1="550" x2="100" y2="500" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrowZ)" />
                <text x="160" y="555" fill="#EF4444" fontSize="12" fontWeight="bold">X</text>
                <text x="45" y="440" fill="#10B981" fontSize="12" fontWeight="bold">Y</text>
                <text x="105" y="495" fill="#3B82F6" fontSize="12" fontWeight="bold">Z</text>
                
                <defs>
                  <marker id="arrowX" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0,0 0,6 9,3" fill="#EF4444" />
                  </marker>
                  <marker id="arrowY" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0,0 0,6 9,3" fill="#10B981" />
                  </marker>
                  <marker id="arrowZ" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0,0 0,6 9,3" fill="#3B82F6" />
                  </marker>
                </defs>
              </g>
            )}

            {/* Structural Model */}
            <g transform="translate(200, 100)">
              {/* Nodes */}
              {modelData?.nodes?.map((node) => {
                const x = node?.x / 50 + (isAnimating ? node?.displacement?.x * visualizationOptions?.deformationScale : 0);
                const y = 400 - node?.y / 15 + (isAnimating ? node?.displacement?.y * visualizationOptions?.deformationScale : 0);
                const color = selectedResultType === 'Displacement' ? getResultColor(Math.abs(node?.displacement?.y),'displacement') :
                  getResultColor(node?.stress, 'stress');

                return (
                  <g key={node?.id}>
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill={color}
                      stroke="#F8FAFC"
                      strokeWidth="2"
                      className={isAnimating ? 'animate-pulse' : ''}
                    />
                    <text
                      x={x + 10}
                      y={y - 10}
                      fill="currentColor"
                      fontSize="10"
                      className="text-muted-foreground"
                    >
                      N{node?.id}
                    </text>
                  </g>
                );
              })}

              {/* Elements */}
              {modelData?.elements?.map((element) => {
                const startNode = modelData?.nodes?.find(n => n?.id === element?.nodeStart);
                const endNode = modelData?.nodes?.find(n => n?.id === element?.nodeEnd);
                
                if (!startNode || !endNode) return null;

                const x1 = startNode?.x / 50 + (isAnimating ? startNode?.displacement?.x * visualizationOptions?.deformationScale : 0);
                const y1 = 400 - startNode?.y / 15 + (isAnimating ? startNode?.displacement?.y * visualizationOptions?.deformationScale : 0);
                const x2 = endNode?.x / 50 + (isAnimating ? endNode?.displacement?.x * visualizationOptions?.deformationScale : 0);
                const y2 = 400 - endNode?.y / 15 + (isAnimating ? endNode?.displacement?.y * visualizationOptions?.deformationScale : 0);

                const color = selectedResultType === 'Forces' ? getResultColor(element?.axialForce,'force') : '#64748B';

                return (
                  <g key={element?.id}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={color}
                      strokeWidth={element?.type === 'column' ? '6' : '4'}
                      className={isAnimating ? 'animate-pulse' : ''}
                    />
                    {/* Force Diagram Overlay */}
                    {selectedResultType === 'Forces' && visualizationOptions?.showDiagrams && (
                      <g>
                        {/* Moment Diagram */}
                        <path
                          d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - element?.moment / 2} ${x2} ${y2}`}
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="2"
                          strokeDasharray="3,3"
                        />
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Support Symbols */}
              <g>
                {/* Fixed Support at Node 1 */}
                <g transform="translate(0, 400)">
                  <polygon points="0,0 -10,15 10,15" fill="#64748B" />
                  <line x1="-15" y1="15" x2="15" y2="15" stroke="#64748B" strokeWidth="3" />
                  <g strokeWidth="2" stroke="#64748B">
                    <line x1="-12" y1="15" x2="-8" y2="20" />
                    <line x1="-6" y1="15" x2="-2" y2="20" />
                    <line x1="2" y1="15" x2="6" y2="20" />
                    <line x1="8" y1="15" x2="12" y2="20" />
                  </g>
                </g>

                {/* Roller Support at Node 3 */}
                <g transform="translate(200, 400)">
                  <polygon points="0,0 -10,15 10,15" fill="#64748B" />
                  <circle cx="0" cy="20" r="5" fill="#64748B" />
                  <line x1="-15" y1="25" x2="15" y2="25" stroke="#64748B" strokeWidth="3" />
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* Viewport Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            className="bg-card/90 backdrop-blur-sm"
          >
            <Icon name="RotateCcw" size={16} />
          </Button>
          
          <div className="flex flex-col space-y-1">
            <Button
              variant="outline"
              size="xs"
              className="bg-card/90 backdrop-blur-sm"
            >
              <Icon name="ZoomIn" size={14} />
            </Button>
            <Button
              variant="outline"
              size="xs"
              className="bg-card/90 backdrop-blur-sm"
            >
              <Icon name="ZoomOut" size={14} />
            </Button>
          </div>
        </div>

        {/* Animation Speed Control */}
        {isAnimating && (
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <Icon name="Gauge" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Speed:</span>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e?.target?.value))}
                className="w-20 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-muted-foreground font-mono">
                {animationSpeed?.toFixed(1)}x
              </span>
            </div>
          </div>
        )}

        {/* Legend */}
        {selectedResultType !== 'Model' && (
          <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 min-w-48">
            <h4 className="text-sm font-medium text-foreground mb-2">
              {selectedResultType} Legend
            </h4>
            <div className="space-y-1">
              {selectedResultType === 'Displacement' && [
                { color: '#10B981', label: '0-1 mm', range: 'Low' },
                { color: '#F59E0B', label: '1-2 mm', range: 'Medium' },
                { color: '#EF4444', label: '2-3 mm', range: 'High' },
                { color: '#DC2626', label: '3+ mm', range: 'Critical' }
              ]?.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-3 rounded"
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item?.label}</span>
                </div>
              ))}

              {selectedResultType === 'Stress' && [
                { color: '#3B82F6', label: '0-30 MPa', range: 'Safe' },
                { color: '#10B981', label: '30-50 MPa', range: 'Normal' },
                { color: '#F59E0B', label: '50-70 MPa', range: 'Caution' },
                { color: '#EF4444', label: '70+ MPa', range: 'Critical' }
              ]?.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-3 rounded"
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item?.label}</span>
                </div>
              ))}

              {selectedResultType === 'Forces' && [
                { color: '#10B981', label: '0-100 kN', range: 'Low' },
                { color: '#F59E0B', label: '100-200 kN', range: 'Medium' },
                { color: '#EF4444', label: '200+ kN', range: 'High' }
              ]?.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-3 rounded"
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item?.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Viewport Footer */}
      <div className="flex items-center justify-between p-2 border-t border-border bg-muted/30">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>View: {viewMode?.toUpperCase()}</span>
          <span>Scale: {visualizationOptions?.deformationScale}x</span>
          <span>Elements: {modelData?.elements?.length}</span>
          <span>Nodes: {modelData?.nodes?.length}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setShowGrid(!showGrid)}
            className={showGrid ? 'text-primary' : 'text-muted-foreground'}
          >
            <Icon name="Grid3X3" size={14} className="mr-1" />
            Grid
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setShowAxes(!showAxes)}
            className={showAxes ? 'text-primary' : 'text-muted-foreground'}
          >
            <Icon name="Compass" size={14} className="mr-1" />
            Axes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsViewport;
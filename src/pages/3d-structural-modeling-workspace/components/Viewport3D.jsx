import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Viewport3D = ({ selectedItems, onSelectionChange, onAction, activeMode }) => {
  const canvasRef = useRef(null);
  const [viewMode, setViewMode] = useState('perspective');
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [viewControls, setViewControls] = useState({
    zoom: 1,
    rotation: { x: 0, y: 0, z: 0 },
    pan: { x: 0, y: 0 }
  });
  const [mouseState, setMouseState] = useState({
    isDown: false,
    lastX: 0,
    lastY: 0,
    button: null
  });

  // Mock 3D model data for visualization
  const modelElements = {
    nodes: [
      { id: 'N1', position: [0, 0, 0], type: 'free', selected: selectedItems?.includes('nodes-N1') },
      { id: 'N2', position: [100, 0, 0], type: 'fixed', selected: selectedItems?.includes('nodes-N2') },
      { id: 'N3', position: [200, 0, 0], type: 'pinned', selected: selectedItems?.includes('nodes-N3') },
      { id: 'N4', position: [0, 100, 0], type: 'free', selected: selectedItems?.includes('nodes-N4') },
      { id: 'N5', position: [100, 100, 0], type: 'free', selected: selectedItems?.includes('nodes-N5') },
      { id: 'N6', position: [200, 100, 0], type: 'roller', selected: selectedItems?.includes('nodes-N6') },
    ],
    beams: [
      { id: 'B1', nodes: ['N1', 'N2'], selected: selectedItems?.includes('elements-B1') },
      { id: 'B2', nodes: ['N2', 'N3'], selected: selectedItems?.includes('elements-B2') },
      { id: 'B3', nodes: ['N4', 'N5'], selected: selectedItems?.includes('elements-B3') },
      { id: 'B4', nodes: ['N5', 'N6'], selected: selectedItems?.includes('elements-B4') },
      { id: 'C1', nodes: ['N1', 'N4'], selected: selectedItems?.includes('elements-C1') },
      { id: 'C2', nodes: ['N2', 'N5'], selected: selectedItems?.includes('elements-C2') },
    ]
  };

  const viewPresets = [
    { name: 'Isometric', icon: 'Box', rotation: { x: -30, y: 45, z: 0 } },
    { name: 'Front', icon: 'Square', rotation: { x: 0, y: 0, z: 0 } },
    { name: 'Side', icon: 'Rectangle', rotation: { x: 0, y: 90, z: 0 } },
    { name: 'Top', icon: 'Circle', rotation: { x: -90, y: 0, z: 0 } },
  ];

  // Mouse event handlers for 3D navigation
  const handleMouseDown = (e) => {
    setMouseState({
      isDown: true,
      lastX: e?.clientX,
      lastY: e?.clientY,
      button: e?.button
    });
  };

  const handleMouseMove = (e) => {
    if (!mouseState?.isDown) return;

    const deltaX = e?.clientX - mouseState?.lastX;
    const deltaY = e?.clientY - mouseState?.lastY;

    if (mouseState?.button === 0) { // Left button - rotate
      setViewControls(prev => ({
        ...prev,
        rotation: {
          x: prev?.rotation?.x + deltaY * 0.5,
          y: prev?.rotation?.y + deltaX * 0.5,
          z: prev?.rotation?.z
        }
      }));
    } else if (mouseState?.button === 1) { // Middle button - pan
      setViewControls(prev => ({
        ...prev,
        pan: {
          x: prev?.pan?.x + deltaX,
          y: prev?.pan?.y - deltaY
        }
      }));
    }

    setMouseState(prev => ({
      ...prev,
      lastX: e?.clientX,
      lastY: e?.clientY
    }));
  };

  const handleMouseUp = () => {
    setMouseState(prev => ({ ...prev, isDown: false }));
  };

  const handleWheel = (e) => {
    e?.preventDefault();
    const zoomFactor = e?.deltaY > 0 ? 0.9 : 1.1;
    setViewControls(prev => ({
      ...prev,
      zoom: Math.max(0.1, Math.min(5, prev?.zoom * zoomFactor))
    }));
  };

  const handleCanvasClick = (e) => {
    if (activeMode === 'select') {
      // Mock element selection based on click position
      const rect = canvasRef?.current?.getBoundingClientRect();
      let x = e?.clientX - rect?.left;
      let y = e?.clientY - rect?.top;
      
      // Simple hit detection simulation
      const clickedElement = mockHitTest(x, y);
      if (clickedElement) {
        onAction('element-clicked', clickedElement);
      }
    } else if (activeMode === 'node') {
      // Add node at clicked position
      const rect = canvasRef?.current?.getBoundingClientRect();
      let x = e?.clientX - rect?.left;
      let y = e?.clientY - rect?.top;
      onAction('add-node', { x, y });
    }
  };

  const mockHitTest = (x, y) => {
    // Simple mock hit testing - in real implementation this would use 3D math
    if (x > 100 && x < 200 && y > 100 && y < 200) {
      return { type: 'node', id: 'N1' };
    }
    return null;
  };

  const setViewPreset = (preset) => {
    setViewControls(prev => ({
      ...prev,
      rotation: preset?.rotation
    }));
  };

  const resetView = () => {
    setViewControls({
      zoom: 1,
      rotation: { x: -30, y: 45, z: 0 },
      pan: { x: 0, y: 0 }
    });
  };

  const fitToView = () => {
    // Calculate bounding box and adjust view
    setViewControls(prev => ({
      ...prev,
      zoom: 0.8,
      pan: { x: 0, y: 0 }
    }));
    onAction('fit-to-view');
  };

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    const { width, height } = canvas?.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#0F172A'; // background color
    ctx?.fillRect(0, 0, width, height);

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = '#334155'; // border color
      ctx.lineWidth = 1;
      const gridSize = 20 * viewControls?.zoom;
      
      for (let x = viewControls?.pan?.x % gridSize; x < width; x += gridSize) {
        ctx?.beginPath();
        ctx?.moveTo(x, 0);
        ctx?.lineTo(x, height);
        ctx?.stroke();
      }
      
      for (let y = viewControls?.pan?.y % gridSize; y < height; y += gridSize) {
        ctx?.beginPath();
        ctx?.moveTo(0, y);
        ctx?.lineTo(width, y);
        ctx?.stroke();
      }
    }

    // Draw coordinate axes if enabled
    if (showAxes) {
      const centerX = width / 2 + viewControls?.pan?.x;
      const centerY = height / 2 + viewControls?.pan?.y;
      const axisLength = 50 * viewControls?.zoom;

      // X-axis (red)
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx?.beginPath();
      ctx?.moveTo(centerX, centerY);
      ctx?.lineTo(centerX + axisLength, centerY);
      ctx?.stroke();

      // Y-axis (green)
      ctx.strokeStyle = '#10B981';
      ctx?.beginPath();
      ctx?.moveTo(centerX, centerY);
      ctx?.lineTo(centerX, centerY - axisLength);
      ctx?.stroke();

      // Z-axis (blue) - simulated as diagonal
      ctx.strokeStyle = '#2563EB';
      ctx?.beginPath();
      ctx?.moveTo(centerX, centerY);
      ctx?.lineTo(centerX - axisLength * 0.7, centerY + axisLength * 0.7);
      ctx?.stroke();
    }

    // Draw nodes
    modelElements?.nodes?.forEach(node => {
      const screenX = width / 2 + node?.position?.[0] * viewControls?.zoom + viewControls?.pan?.x;
      const screenY = height / 2 - node?.position?.[1] * viewControls?.zoom + viewControls?.pan?.y;

      // Node circle
      ctx?.beginPath();
      ctx?.arc(screenX, screenY, node?.selected ? 8 : 5, 0, 2 * Math.PI);
      ctx.fillStyle = node?.selected ? '#2563EB' : 
                     node?.type === 'fixed' ? '#EF4444' :
                     node?.type === 'pinned' ? '#F59E0B' :
                     node?.type === 'roller' ? '#10B981' : '#F8FAFC';
      ctx?.fill();
      
      if (node?.selected) {
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 2;
        ctx?.stroke();
      }

      // Node label
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '10px Inter';
      ctx?.fillText(node?.id, screenX + 10, screenY - 10);
    });

    // Draw beams
    modelElements?.beams?.forEach(beam => {
      const startNode = modelElements?.nodes?.find(n => n?.id === beam?.nodes?.[0]);
      const endNode = modelElements?.nodes?.find(n => n?.id === beam?.nodes?.[1]);
      
      if (startNode && endNode) {
        const startX = width / 2 + startNode?.position?.[0] * viewControls?.zoom + viewControls?.pan?.x;
        const startY = height / 2 - startNode?.position?.[1] * viewControls?.zoom + viewControls?.pan?.y;
        const endX = width / 2 + endNode?.position?.[0] * viewControls?.zoom + viewControls?.pan?.x;
        const endY = height / 2 - endNode?.position?.[1] * viewControls?.zoom + viewControls?.pan?.y;

        ctx?.beginPath();
        ctx?.moveTo(startX, startY);
        ctx?.lineTo(endX, endY);
        ctx.strokeStyle = beam?.selected ? '#2563EB' : '#94A3B8';
        ctx.lineWidth = beam?.selected ? 3 : 2;
        ctx?.stroke();
      }
    });

    // Draw cursor indicator for active tool
    if (activeMode !== 'select') {
      ctx.fillStyle = '#2563EB';
      ctx.font = '12px Inter';
      ctx?.fillText(`Mode: ${activeMode}`, 10, 25);
    }

  }, [viewControls, showGrid, showAxes, selectedItems, activeMode, modelElements]);

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Viewport Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-surface">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-semibold text-foreground">3D Viewport</h3>
          <div className="flex items-center space-x-1">
            {viewPresets?.map((preset) => (
              <Button
                key={preset?.name}
                variant="ghost"
                size="xs"
                onClick={() => setViewPreset(preset)}
                className="text-muted-foreground hover:text-foreground"
                title={preset?.name}
              >
                <Icon name={preset?.icon} size={14} />
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setShowGrid(!showGrid)}
            className={`${showGrid ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`}
            title="Toggle Grid"
          >
            <Icon name="Grid3X3" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setShowAxes(!showAxes)}
            className={`${showAxes ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`}
            title="Toggle Axes"
          >
            <Icon name="Compass" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={fitToView}
            className="text-muted-foreground hover:text-foreground"
            title="Fit to View"
          >
            <Icon name="Maximize2" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={resetView}
            className="text-muted-foreground hover:text-foreground"
            title="Reset View"
          >
            <Icon name="RotateCcw" size={14} />
          </Button>
        </div>
      </div>
      {/* 3D Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onClick={handleCanvasClick}
          onContextMenu={(e) => e?.preventDefault()}
        />

        {/* Viewport Overlay Info */}
        <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm border border-border rounded-md p-2">
          <div className="text-xs space-y-1">
            <div className="text-muted-foreground">
              Zoom: {(viewControls?.zoom * 100)?.toFixed(0)}%
            </div>
            <div className="text-muted-foreground">
              Mode: <span className="text-foreground font-medium">{activeMode}</span>
            </div>
            {selectedItems?.length > 0 && (
              <div className="text-muted-foreground">
                Selected: <span className="text-primary font-medium">{selectedItems?.length}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Help */}
        <div className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-sm border border-border rounded-md p-2">
          <div className="text-xs space-y-1 text-muted-foreground">
            <div>Left: Rotate</div>
            <div>Middle: Pan</div>
            <div>Wheel: Zoom</div>
          </div>
        </div>

        {/* Coordinate System Indicator */}
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-surface/90 backdrop-blur-sm border border-border rounded-md flex items-center justify-center">
          <div className="relative w-12 h-12">
            {/* X-axis */}
            <div className="absolute top-6 left-6 w-4 h-0.5 bg-error transform rotate-0 origin-left"></div>
            <div className="absolute top-5 right-1 text-xs text-error font-bold">X</div>
            
            {/* Y-axis */}
            <div className="absolute top-2 left-6 w-0.5 h-4 bg-success transform origin-bottom"></div>
            <div className="absolute top-1 left-7 text-xs text-success font-bold">Y</div>
            
            {/* Z-axis */}
            <div className="absolute top-6 left-6 w-3 h-0.5 bg-primary transform -rotate-45 origin-left"></div>
            <div className="absolute top-7 left-8 text-xs text-primary font-bold">Z</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewport3D;
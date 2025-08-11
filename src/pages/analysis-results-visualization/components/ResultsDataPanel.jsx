import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ResultsDataPanel = ({ selectedResultType, selectedLoadCase, onExportData }) => {
  const [activeTab, setActiveTab] = useState('nodes');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterText, setFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Mock data for different result types
  const mockData = {
    nodes: [
      { id: 1, x: 0, y: 0, z: 0, dispX: 0.00, dispY: -2.50, dispZ: 0.00, rotX: 0.001, rotY: 0.000, rotZ: 0.002 },
      { id: 2, x: 5000, y: 0, z: 0, dispX: 1.20, dispY: -3.10, dispZ: 0.00, rotX: 0.002, rotY: 0.001, rotZ: 0.003 },
      { id: 3, x: 10000, y: 0, z: 0, dispX: 0.00, dispY: -2.80, dispZ: 0.00, rotX: 0.001, rotY: 0.000, rotZ: 0.001 },
      { id: 4, x: 0, y: 3000, z: 0, dispX: 0.50, dispY: -1.80, dispZ: 0.00, rotX: 0.003, rotY: 0.001, rotZ: 0.002 },
      { id: 5, x: 5000, y: 3000, z: 0, dispX: 2.10, dispY: -4.20, dispZ: 0.30, rotX: 0.004, rotY: 0.002, rotZ: 0.005 },
      { id: 6, x: 10000, y: 3000, z: 0, dispX: 0.80, dispY: -2.10, dispZ: 0.00, rotX: 0.002, rotY: 0.001, rotZ: 0.002 }
    ],
    elements: [
      { id: 1, type: 'Beam', nodeI: 1, nodeJ: 2, length: 5000, axial: 125.5, shearY: 45.2, shearZ: 0.0, torsion: 12.3, momentY: 0.0, momentZ: 89.7 },
      { id: 2, type: 'Beam', nodeI: 2, nodeJ: 3, length: 5000, axial: 98.3, shearY: 38.9, shearZ: 0.0, torsion: 8.7, momentY: 0.0, momentZ: 76.4 },
      { id: 3, type: 'Beam', nodeI: 4, nodeJ: 5, length: 5000, axial: 156.8, shearY: 52.1, shearZ: 0.0, torsion: 15.2, momentY: 0.0, momentZ: 102.3 },
      { id: 4, type: 'Beam', nodeI: 5, nodeJ: 6, length: 5000, axial: 134.2, shearY: 41.7, shearZ: 0.0, torsion: 11.8, momentY: 0.0, momentZ: 87.9 },
      { id: 5, type: 'Column', nodeI: 1, nodeJ: 4, length: 3000, axial: 245.6, shearY: 12.3, shearZ: 0.0, torsion: 3.4, momentY: 0.0, momentZ: 34.8 },
      { id: 6, type: 'Column', nodeI: 2, nodeJ: 5, length: 3000, axial: 289.4, shearY: 18.7, shearZ: 0.0, torsion: 5.1, momentY: 0.0, momentZ: 45.2 },
      { id: 7, type: 'Column', nodeI: 3, nodeJ: 6, length: 3000, axial: 198.7, shearY: 9.8, shearZ: 0.0, torsion: 2.7, momentY: 0.0, momentZ: 28.6 }
    ],
    reactions: [
      { node: 1, fx: -125.5, fy: 245.6, fz: 0.0, mx: 0.0, my: 0.0, mz: -34.8, support: 'Fixed' },
      { node: 3, fx: -98.3, fy: 198.7, fz: 0.0, mx: 0.0, my: 0.0, mz: 0.0, support: 'Roller' },
      { node: 4, fx: 0.0, fy: 156.8, fz: 0.0, mx: 0.0, my: 0.0, mz: 0.0, support: 'Pinned' }
    ],
    stresses: [
      { element: 1, location: 'I-End', vonMises: 45.2, sigmaX: 42.1, sigmaY: -12.3, tauXY: 8.7, principal1: 48.5, principal2: -15.8 },
      { element: 1, location: 'J-End', vonMises: 52.8, sigmaX: 49.6, sigmaY: -18.2, tauXY: 11.4, principal1: 56.2, principal2: -22.1 },
      { element: 2, location: 'I-End', vonMises: 38.7, sigmaX: 35.4, sigmaY: -9.8, tauXY: 6.2, principal1: 41.3, principal2: -12.7 },
      { element: 2, location: 'J-End', vonMises: 41.3, sigmaX: 38.9, sigmaY: -11.5, tauXY: 7.8, principal1: 44.1, principal2: -14.2 },
      { element: 5, location: 'I-End', vonMises: 67.9, sigmaX: 63.2, sigmaY: -25.4, tauXY: 15.6, principal1: 72.8, principal2: -31.2 },
      { element: 5, location: 'J-End', vonMises: 43.6, sigmaX: 40.8, sigmaY: -13.7, tauXY: 9.1, principal1: 46.9, principal2: -17.4 }
    ]
  };

  const tabs = [
    { id: 'nodes', label: 'Node Results', icon: 'Circle', count: mockData?.nodes?.length },
    { id: 'elements', label: 'Element Forces', icon: 'Minus', count: mockData?.elements?.length },
    { id: 'reactions', label: 'Reactions', icon: 'Anchor', count: mockData?.reactions?.length },
    { id: 'stresses', label: 'Stresses', icon: 'Thermometer', count: mockData?.stresses?.length }
  ];

  const getColumns = () => {
    switch (activeTab) {
      case 'nodes':
        return [
          { key: 'id', label: 'Node', width: '60px', sortable: true },
          { key: 'x', label: 'X (mm)', width: '80px', sortable: true, format: 'number' },
          { key: 'y', label: 'Y (mm)', width: '80px', sortable: true, format: 'number' },
          { key: 'z', label: 'Z (mm)', width: '80px', sortable: true, format: 'number' },
          { key: 'dispX', label: 'UX (mm)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'dispY', label: 'UY (mm)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'dispZ', label: 'UZ (mm)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'rotX', label: 'RX (rad)', width: '80px', sortable: true, format: 'scientific' },
          { key: 'rotY', label: 'RY (rad)', width: '80px', sortable: true, format: 'scientific' },
          { key: 'rotZ', label: 'RZ (rad)', width: '80px', sortable: true, format: 'scientific' }
        ];
      case 'elements':
        return [
          { key: 'id', label: 'Element', width: '70px', sortable: true },
          { key: 'type', label: 'Type', width: '80px', sortable: true },
          { key: 'nodeI', label: 'Node I', width: '60px', sortable: true },
          { key: 'nodeJ', label: 'Node J', width: '60px', sortable: true },
          { key: 'length', label: 'Length (mm)', width: '90px', sortable: true, format: 'number' },
          { key: 'axial', label: 'Axial (kN)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'shearY', label: 'Shear Y (kN)', width: '90px', sortable: true, format: 'decimal' },
          { key: 'momentZ', label: 'Moment Z (kNm)', width: '100px', sortable: true, format: 'decimal' }
        ];
      case 'reactions':
        return [
          { key: 'node', label: 'Node', width: '60px', sortable: true },
          { key: 'support', label: 'Support', width: '80px', sortable: true },
          { key: 'fx', label: 'FX (kN)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'fy', label: 'FY (kN)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'fz', label: 'FZ (kN)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'mx', label: 'MX (kNm)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'my', label: 'MY (kNm)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'mz', label: 'MZ (kNm)', width: '80px', sortable: true, format: 'decimal' }
        ];
      case 'stresses':
        return [
          { key: 'element', label: 'Element', width: '70px', sortable: true },
          { key: 'location', label: 'Location', width: '80px', sortable: true },
          { key: 'vonMises', label: 'Von Mises (MPa)', width: '110px', sortable: true, format: 'decimal' },
          { key: 'sigmaX', label: 'σX (MPa)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'sigmaY', label: 'σY (MPa)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'tauXY', label: 'τXY (MPa)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'principal1', label: 'σ1 (MPa)', width: '80px', sortable: true, format: 'decimal' },
          { key: 'principal2', label: 'σ2 (MPa)', width: '80px', sortable: true, format: 'decimal' }
        ];
      default:
        return [];
    }
  };

  const getCurrentData = () => {
    return mockData?.[activeTab] || [];
  };

  const filteredData = useMemo(() => {
    let data = getCurrentData();
    
    if (filterText) {
      data = data?.filter(row =>
        Object.values(row)?.some(value =>
          value?.toString()?.toLowerCase()?.includes(filterText?.toLowerCase())
        )
      );
    }

    if (sortConfig?.key) {
      data = [...data]?.sort((a, b) => {
        const aVal = a?.[sortConfig?.key];
        const bVal = b?.[sortConfig?.key];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig?.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = aVal?.toString()?.toLowerCase();
        const bStr = bVal?.toString()?.toLowerCase();
        
        if (sortConfig?.direction === 'asc') {
          return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
        } else {
          return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
        }
      });
    }

    return data;
  }, [activeTab, filterText, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowSelect = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected?.has(id)) {
      newSelected?.delete(id);
    } else {
      newSelected?.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows?.size === filteredData?.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map(row => row.id || row.node || row.element)));
    }
  };

  const formatValue = (value, format) => {
    if (value === null || value === undefined) return '-';
    
    switch (format) {
      case 'number':
        return Number(value)?.toLocaleString();
      case 'decimal':
        return Number(value)?.toFixed(2);
      case 'scientific':
        return Number(value)?.toExponential(3);
      default:
        return value?.toString();
    }
  };

  const exportToCSV = () => {
    const columns = getColumns();
    const headers = columns?.map(col => col?.label)?.join(',');
    const rows = filteredData?.map(row => 
      columns?.map(col => formatValue(row?.[col?.key], col?.format))?.join(',')
    )?.join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}_results_${selectedLoadCase}_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Analysis Data</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Load Case: {selectedLoadCase}
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={exportToCSV}
            >
              <Icon name="Download" size={14} className="mr-1" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-md p-1 mb-4">
          {tabs?.map((tab) => (
            <Button
              key={tab?.id}
              variant={activeTab === tab?.id ? "default" : "ghost"}
              size="xs"
              onClick={() => setActiveTab(tab?.id)}
              className="flex-1 h-8"
            >
              <Icon name={tab?.icon} size={14} className="mr-1" />
              {tab?.label}
              <span className="ml-1 text-xs opacity-70">({tab?.count})</span>
            </Button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Input
              placeholder="Search data..."
              value={filterText}
              onChange={(e) => setFilterText(e?.target?.value)}
              className="h-8"
            />
          </div>
          
          <Select
            options={[
              { value: 'all', label: 'All Rows' },
              { value: 'selected', label: 'Selected Only' },
              { value: 'critical', label: 'Critical Values' }
            ]}
            value="all"
            onChange={() => {}}
            className="w-32"
          />

          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              setFilterText('');
              setSortConfig({ key: null, direction: 'asc' });
              setSelectedRows(new Set());
            }}
          >
            <Icon name="RotateCcw" size={14} />
          </Button>
        </div>
      </div>
      {/* Data Table */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/50 border-b border-border">
              <tr>
                <th className="w-10 p-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows?.size === filteredData?.length && filteredData?.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                {getColumns()?.map((column) => (
                  <th
                    key={column?.key}
                    className="p-2 text-left font-medium text-foreground cursor-pointer hover:bg-muted/70"
                    style={{ width: column?.width }}
                    onClick={() => column?.sortable && handleSort(column?.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column?.label}</span>
                      {column?.sortable && (
                        <Icon
                          name={
                            sortConfig?.key === column?.key
                              ? sortConfig?.direction === 'asc' ?'ChevronUp' :'ChevronDown' :'ChevronsUpDown'
                          }
                          size={14}
                          className="text-muted-foreground"
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((row, index) => {
                const rowId = row?.id || row?.node || row?.element;
                const isSelected = selectedRows?.has(rowId);
                
                return (
                  <tr
                    key={rowId}
                    className={`
                      border-b border-border hover:bg-muted/30 transition-colors
                      ${isSelected ? 'bg-primary/10' : ''}
                      ${index % 2 === 0 ? 'bg-muted/10' : ''}
                    `}
                  >
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleRowSelect(rowId)}
                        className="rounded border-border"
                      />
                    </td>
                    {getColumns()?.map((column) => (
                      <td key={column?.key} className="p-2 text-foreground font-mono text-xs">
                        {formatValue(row?.[column?.key], column?.format)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredData?.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No data found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Table Footer */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>
              Showing {filteredData?.length} of {getCurrentData()?.length} rows
            </span>
            {selectedRows?.size > 0 && (
              <span>
                {selectedRows?.size} selected
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="xs" disabled>
              <Icon name="ChevronLeft" size={14} />
            </Button>
            <span className="px-2">Page 1 of 1</span>
            <Button variant="outline" size="xs" disabled>
              <Icon name="ChevronRight" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDataPanel;
import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';

const UnitsSettings = ({ settings, onSettingsChange }) => {
  const unitCategories = [
    {
      category: 'force',
      label: 'Force Units',
      options: [
        { value: 'N', label: 'Newton (N)', description: 'SI base unit' },
        { value: 'kN', label: 'Kilonewton (kN)', description: 'Common for structural loads' },
        { value: 'MN', label: 'Meganewton (MN)', description: 'Large structural forces' },
        { value: 'lbf', label: 'Pound-force (lbf)', description: 'Imperial unit' },
        { value: 'kip', label: 'Kip (kip)', description: '1000 lbf' }
      ]
    },
    {
      category: 'length',
      label: 'Length Units',
      options: [
        { value: 'm', label: 'Meter (m)', description: 'SI base unit' },
        { value: 'mm', label: 'Millimeter (mm)', description: 'Detailed dimensions' },
        { value: 'cm', label: 'Centimeter (cm)', description: 'Small dimensions' },
        { value: 'ft', label: 'Foot (ft)', description: 'Imperial unit' },
        { value: 'in', label: 'Inch (in)', description: 'Detailed imperial' }
      ]
    },
    {
      category: 'stress',
      label: 'Stress/Pressure Units',
      options: [
        { value: 'Pa', label: 'Pascal (Pa)', description: 'SI base unit' },
        { value: 'kPa', label: 'Kilopascal (kPa)', description: 'Common for soil pressure' },
        { value: 'MPa', label: 'Megapascal (MPa)', description: 'Material properties' },
        { value: 'GPa', label: 'Gigapascal (GPa)', description: 'Elastic modulus' },
        { value: 'psi', label: 'Pounds per square inch (psi)', description: 'Imperial stress' },
        { value: 'ksi', label: 'Kips per square inch (ksi)', description: '1000 psi' }
      ]
    },
    {
      category: 'temperature',
      label: 'Temperature Units',
      options: [
        { value: 'C', label: 'Celsius (°C)', description: 'Metric temperature' },
        { value: 'K', label: 'Kelvin (K)', description: 'SI base unit' },
        { value: 'F', label: 'Fahrenheit (°F)', description: 'Imperial temperature' }
      ]
    }
  ];

  const conversionFactors = {
    force: {
      N: 1,
      kN: 1000,
      MN: 1000000,
      lbf: 4.44822,
      kip: 4448.22
    },
    length: {
      m: 1,
      mm: 0.001,
      cm: 0.01,
      ft: 0.3048,
      in: 0.0254
    },
    stress: {
      Pa: 1,
      kPa: 1000,
      MPa: 1000000,
      GPa: 1000000000,
      psi: 6894.76,
      ksi: 6894760
    }
  };

  const handleUnitChange = (category, value) => {
    onSettingsChange('units', { 
      ...settings?.units, 
      [category]: value 
    });
  };

  const getConversionPreview = (category, fromUnit, toUnit) => {
    if (!conversionFactors?.[category] || fromUnit === toUnit) return null;
    
    const fromFactor = conversionFactors?.[category]?.[fromUnit];
    const toFactor = conversionFactors?.[category]?.[toUnit];
    
    if (!fromFactor || !toFactor) return null;
    
    const conversionRatio = fromFactor / toFactor;
    return `1 ${fromUnit} = ${conversionRatio?.toFixed(6)} ${toUnit}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Unit System Configuration</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select the units for different physical quantities. All calculations and results will be displayed in these units.
        </p>
      </div>
      {unitCategories?.map((unitCategory) => (
        <div key={unitCategory?.category} className="space-y-4">
          <h4 className="text-md font-medium text-foreground">{unitCategory?.label}</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {unitCategory?.options?.map((option) => (
              <div
                key={option?.value}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all duration-200
                  ${settings?.units?.[unitCategory?.category] === option?.value
                    ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground hover:bg-muted/20'
                  }
                `}
                onClick={() => handleUnitChange(unitCategory?.category, option?.value)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    w-4 h-4 rounded-full border-2 mt-0.5 transition-colors
                    ${settings?.units?.[unitCategory?.category] === option?.value
                      ? 'border-primary bg-primary' :'border-muted-foreground'
                    }
                  `}>
                    {settings?.units?.[unitCategory?.category] === option?.value && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full m-0.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{option?.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{option?.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conversion Preview */}
          {settings?.units?.[unitCategory?.category] && conversionFactors?.[unitCategory?.category] && (
            <div className="mt-4 p-3 bg-muted/20 rounded-md">
              <p className="text-sm font-medium text-foreground mb-2">Conversion Reference:</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-xs text-muted-foreground font-mono">
                {unitCategory?.options?.filter(opt => opt?.value !== settings?.units?.[unitCategory?.category])?.slice(0, 4)?.map((option) => {
                    const conversion = getConversionPreview(
                      unitCategory?.category, 
                      settings?.units?.[unitCategory?.category], 
                      option?.value
                    );
                    return conversion && (
                      <div key={option?.value}>{conversion}</div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground">Unit Display Options</h4>
        <div className="space-y-3">
          <Checkbox
            label="Show unit symbols in results"
            checked={settings?.units?.showSymbols !== false}
            onChange={(e) => onSettingsChange('units', { 
              ...settings?.units, 
              showSymbols: e?.target?.checked 
            })}
            description="Display unit symbols alongside numerical values"
          />
          <Checkbox
            label="Use scientific notation for large values"
            checked={settings?.units?.scientificNotation || false}
            onChange={(e) => onSettingsChange('units', { 
              ...settings?.units, 
              scientificNotation: e?.target?.checked 
            })}
            description="Display values like 1.23e+06 instead of 1,230,000"
          />
          <Checkbox
            label="Auto-scale units in results"
            checked={settings?.units?.autoScale || true}
            onChange={(e) => onSettingsChange('units', { 
              ...settings?.units, 
              autoScale: e?.target?.checked 
            })}
            description="Automatically use appropriate unit prefixes (e.g., kN instead of 1000 N)"
          />
        </div>
      </div>
      <div className="p-4 bg-accent/10 border border-accent/20 rounded-md">
        <h5 className="font-medium text-accent mb-2">Current Unit System Summary</h5>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Force:</span>
            <span className="ml-2 font-mono text-foreground">
              {settings?.units?.force || 'kN'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Length:</span>
            <span className="ml-2 font-mono text-foreground">
              {settings?.units?.length || 'm'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Stress:</span>
            <span className="ml-2 font-mono text-foreground">
              {settings?.units?.stress || 'MPa'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Temperature:</span>
            <span className="ml-2 font-mono text-foreground">
              {settings?.units?.temperature || 'C'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitsSettings;
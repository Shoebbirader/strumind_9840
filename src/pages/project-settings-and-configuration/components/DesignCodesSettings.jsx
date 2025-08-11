import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const DesignCodesSettings = ({ settings, onSettingsChange }) => {
  const steelCodes = [
    { 
      value: 'IS800-2007', 
      label: 'IS 800:2007', 
      description: 'Indian Standard - General Construction in Steel' 
    },
    { 
      value: 'AISC360-16', 
      label: 'AISC 360-16', 
      description: 'American Institute of Steel Construction' 
    },
    { 
      value: 'EN1993-1-1', 
      label: 'EN 1993-1-1', 
      description: 'Eurocode 3: Design of steel structures' 
    },
    { 
      value: 'BS5950-1', 
      label: 'BS 5950-1:2000', 
      description: 'British Standard for structural steel' 
    }
  ];

  const concreteCodes = [
    { 
      value: 'IS456-2000', 
      label: 'IS 456:2000', 
      description: 'Indian Standard - Plain and Reinforced Concrete' 
    },
    { 
      value: 'ACI318-19', 
      label: 'ACI 318-19', 
      description: 'American Concrete Institute Building Code' 
    },
    { 
      value: 'EN1992-1-1', 
      label: 'EN 1992-1-1', 
      description: 'Eurocode 2: Design of concrete structures' 
    },
    { 
      value: 'BS8110-1', 
      label: 'BS 8110-1:1997', 
      description: 'British Standard for reinforced concrete' 
    }
  ];

  const seismicCodes = [
    { 
      value: 'IS1893-2016', 
      label: 'IS 1893:2016', 
      description: 'Indian Standard - Earthquake Resistant Design' 
    },
    { 
      value: 'ASCE7-16', 
      label: 'ASCE 7-16', 
      description: 'Minimum Design Loads for Buildings' 
    },
    { 
      value: 'EN1998-1', 
      label: 'EN 1998-1', 
      description: 'Eurocode 8: Earthquake resistance' 
    }
  ];

  const windCodes = [
    { 
      value: 'IS875-3-2015', 
      label: 'IS 875 (Part 3):2015', 
      description: 'Indian Standard - Wind Loads' 
    },
    { 
      value: 'ASCE7-16-Wind', 
      label: 'ASCE 7-16', 
      description: 'Wind Load Provisions' 
    },
    { 
      value: 'EN1991-1-4', 
      label: 'EN 1991-1-4', 
      description: 'Eurocode 1: Wind actions' 
    }
  ];

  const handleCodeChange = (category, value) => {
    onSettingsChange('designCodes', { 
      ...settings?.designCodes, 
      [category]: value 
    });
  };

  const handleOptionChange = (option, value) => {
    onSettingsChange('designCodes', { 
      ...settings?.designCodes, 
      options: {
        ...settings?.designCodes?.options,
        [option]: value
      }
    });
  };

  const getCodeInfo = (codeValue, codeList) => {
    const code = codeList?.find(c => c?.value === codeValue);
    return code ? code?.description : '';
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Design Code Selection</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select the design codes and standards for structural analysis and design verification.
        </p>
      </div>
      {/* Steel Design Code */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground flex items-center">
          <Icon name="Wrench" size={18} className="mr-2 text-muted-foreground" />
          Steel Design Code
        </h4>
        
        <Select
          label="Steel Design Standard"
          options={steelCodes}
          value={settings?.designCodes?.steel || 'IS800-2007'}
          onChange={(value) => handleCodeChange('steel', value)}
          description={getCodeInfo(settings?.designCodes?.steel || 'IS800-2007', steelCodes)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Checkbox
            label="Include lateral-torsional buckling checks"
            checked={settings?.designCodes?.options?.steelLTB !== false}
            onChange={(e) => handleOptionChange('steelLTB', e?.target?.checked)}
          />
          <Checkbox
            label="Consider shear lag effects"
            checked={settings?.designCodes?.options?.steelShearLag || false}
            onChange={(e) => handleOptionChange('steelShearLag', e?.target?.checked)}
          />
          <Checkbox
            label="Apply effective length factors"
            checked={settings?.designCodes?.options?.steelEffectiveLength !== false}
            onChange={(e) => handleOptionChange('steelEffectiveLength', e?.target?.checked)}
          />
          <Checkbox
            label="Include connection design checks"
            checked={settings?.designCodes?.options?.steelConnections || false}
            onChange={(e) => handleOptionChange('steelConnections', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Concrete Design Code */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground flex items-center">
          <Icon name="Building" size={18} className="mr-2 text-muted-foreground" />
          Concrete Design Code
        </h4>
        
        <Select
          label="Concrete Design Standard"
          options={concreteCodes}
          value={settings?.designCodes?.concrete || 'IS456-2000'}
          onChange={(value) => handleCodeChange('concrete', value)}
          description={getCodeInfo(settings?.designCodes?.concrete || 'IS456-2000', concreteCodes)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Checkbox
            label="Include long-term deflection"
            checked={settings?.designCodes?.options?.concreteDeflection !== false}
            onChange={(e) => handleOptionChange('concreteDeflection', e?.target?.checked)}
          />
          <Checkbox
            label="Consider creep and shrinkage"
            checked={settings?.designCodes?.options?.concreteCreep !== false}
            onChange={(e) => handleOptionChange('concreteCreep', e?.target?.checked)}
          />
          <Checkbox
            label="Apply minimum reinforcement rules"
            checked={settings?.designCodes?.options?.concreteMinReinf !== false}
            onChange={(e) => handleOptionChange('concreteMinReinf', e?.target?.checked)}
          />
          <Checkbox
            label="Include punching shear checks"
            checked={settings?.designCodes?.options?.concretePunching || false}
            onChange={(e) => handleOptionChange('concretePunching', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Seismic Design Code */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground flex items-center">
          <Icon name="Zap" size={18} className="mr-2 text-muted-foreground" />
          Seismic Design Code
        </h4>
        
        <Select
          label="Seismic Design Standard"
          options={seismicCodes}
          value={settings?.designCodes?.seismic || 'IS1893-2016'}
          onChange={(value) => handleCodeChange('seismic', value)}
          description={getCodeInfo(settings?.designCodes?.seismic || 'IS1893-2016', seismicCodes)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Checkbox
            label="Apply response spectrum analysis"
            checked={settings?.designCodes?.options?.seismicResponse !== false}
            onChange={(e) => handleOptionChange('seismicResponse', e?.target?.checked)}
          />
          <Checkbox
            label="Include P-Delta effects"
            checked={settings?.designCodes?.options?.seismicPDelta || false}
            onChange={(e) => handleOptionChange('seismicPDelta', e?.target?.checked)}
          />
          <Checkbox
            label="Consider soil-structure interaction"
            checked={settings?.designCodes?.options?.seismicSSI || false}
            onChange={(e) => handleOptionChange('seismicSSI', e?.target?.checked)}
          />
          <Checkbox
            label="Apply ductility requirements"
            checked={settings?.designCodes?.options?.seismicDuctility !== false}
            onChange={(e) => handleOptionChange('seismicDuctility', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Wind Design Code */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground flex items-center">
          <Icon name="Wind" size={18} className="mr-2 text-muted-foreground" />
          Wind Design Code
        </h4>
        
        <Select
          label="Wind Load Standard"
          options={windCodes}
          value={settings?.designCodes?.wind || 'IS875-3-2015'}
          onChange={(value) => handleCodeChange('wind', value)}
          description={getCodeInfo(settings?.designCodes?.wind || 'IS875-3-2015', windCodes)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Checkbox
            label="Include dynamic wind effects"
            checked={settings?.designCodes?.options?.windDynamic || false}
            onChange={(e) => handleOptionChange('windDynamic', e?.target?.checked)}
          />
          <Checkbox
            label="Consider terrain roughness"
            checked={settings?.designCodes?.options?.windTerrain !== false}
            onChange={(e) => handleOptionChange('windTerrain', e?.target?.checked)}
          />
          <Checkbox
            label="Apply gust factor"
            checked={settings?.designCodes?.options?.windGust !== false}
            onChange={(e) => handleOptionChange('windGust', e?.target?.checked)}
          />
          <Checkbox
            label="Include vortex shedding"
            checked={settings?.designCodes?.options?.windVortex || false}
            onChange={(e) => handleOptionChange('windVortex', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Load Combination Settings */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-foreground flex items-center">
          <Icon name="Layers" size={18} className="mr-2 text-muted-foreground" />
          Load Combination Settings
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Checkbox
            label="Auto-generate standard load combinations"
            checked={settings?.designCodes?.options?.autoLoadCombos !== false}
            onChange={(e) => handleOptionChange('autoLoadCombos', e?.target?.checked)}
            description="Automatically create load combinations per selected codes"
          />
          <Checkbox
            label="Include accidental load combinations"
            checked={settings?.designCodes?.options?.accidentalLoads || false}
            onChange={(e) => handleOptionChange('accidentalLoads', e?.target?.checked)}
            description="Add combinations for accidental loading scenarios"
          />
          <Checkbox
            label="Apply partial safety factors"
            checked={settings?.designCodes?.options?.partialFactors !== false}
            onChange={(e) => handleOptionChange('partialFactors', e?.target?.checked)}
            description="Use code-specified partial safety factors"
          />
          <Checkbox
            label="Consider construction stage loading"
            checked={settings?.designCodes?.options?.constructionStage || false}
            onChange={(e) => handleOptionChange('constructionStage', e?.target?.checked)}
            description="Include temporary construction loads"
          />
        </div>
      </div>
      {/* Code Compliance Summary */}
      <div className="p-4 bg-success/10 border border-success/20 rounded-md">
        <h5 className="font-medium text-success mb-3 flex items-center">
          <Icon name="Shield" size={18} className="mr-2" />
          Selected Design Codes Summary
        </h5>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Steel:</span>
            <span className="ml-2 font-medium text-foreground">
              {settings?.designCodes?.steel || 'IS 800:2007'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Concrete:</span>
            <span className="ml-2 font-medium text-foreground">
              {settings?.designCodes?.concrete || 'IS 456:2000'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Seismic:</span>
            <span className="ml-2 font-medium text-foreground">
              {settings?.designCodes?.seismic || 'IS 1893:2016'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Wind:</span>
            <span className="ml-2 font-medium text-foreground">
              {settings?.designCodes?.wind || 'IS 875 (Part 3):2015'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCodesSettings;

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface DataInspectorProps {
  data: any;
}

const DataInspector: React.FC<DataInspectorProps> = ({ data }) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // Toggle expansion of JSON tree
  const toggleExpand = (path: string) => {
    if (expandedKeys.includes(path)) {
      setExpandedKeys(expandedKeys.filter(key => key !== path));
    } else {
      setExpandedKeys([...expandedKeys, path]);
    }
  };

  // Render JSON as a collapsible tree
  const renderJsonTree = (obj: any, path = '') => {
    if (obj === null) return <span className="text-muted-foreground">null</span>;
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return <span className="text-muted-foreground">[]</span>;
      
      const currentPath = path ? `${path}.array` : 'array';
      const isExpanded = expandedKeys.includes(currentPath);
      
      return (
        <div className="ml-4">
          <div 
            className="flex items-center cursor-pointer text-sm text-muted-foreground"
            onClick={() => toggleExpand(currentPath)}
          >
            <span className="mr-1">{isExpanded ? '▼' : '▶'}</span>
            <span>Array({obj.length})</span>
          </div>
          
          {isExpanded && (
            <div className="ml-4 border-l-2 border-border pl-2 mt-1">
              {obj.map((item, index) => (
                <div key={index} className="mb-1">
                  <span className="text-muted-foreground mr-2">{index}:</span>
                  {typeof item === 'object' && item !== null 
                    ? renderJsonTree(item, `${currentPath}.${index}`)
                    : <span className={getValueClass(item)}>{formatValue(item)}</span>
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const keys = Object.keys(obj);
      if (keys.length === 0) return <span className="text-muted-foreground">{}</span>;
      
      const currentPath = path ? `${path}.object` : 'object';
      const isExpanded = expandedKeys.includes(currentPath);
      
      return (
        <div className="ml-4">
          <div 
            className="flex items-center cursor-pointer text-sm text-muted-foreground"
            onClick={() => toggleExpand(currentPath)}
          >
            <span className="mr-1">{isExpanded ? '▼' : '▶'}</span>
            <span>Object({keys.length})</span>
          </div>
          
          {isExpanded && (
            <div className="ml-4 border-l-2 border-border pl-2 mt-1">
              {keys.map(key => (
                <div key={key} className="mb-1">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">{key}:</span>
                  {typeof obj[key] === 'object' && obj[key] !== null 
                    ? renderJsonTree(obj[key], `${currentPath}.${key}`)
                    : <span className={getValueClass(obj[key])}>{formatValue(obj[key])}</span>
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return <span className={getValueClass(obj)}>{formatValue(obj)}</span>;
  };

  // Format values for display
  const formatValue = (value: any): string => {
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'undefined') return 'undefined';
    if (value === null) return 'null';
    return String(value);
  };

  // Get CSS classes for different value types
  const getValueClass = (value: any): string => {
    if (typeof value === 'string') return "text-green-600 dark:text-green-400";
    if (typeof value === 'number') return "text-purple-600 dark:text-purple-400";
    if (typeof value === 'boolean') return "text-red-600 dark:text-red-400";
    if (value === null || typeof value === 'undefined') return "text-gray-500 dark:text-gray-400";
    return "";
  };

  const formatJson = (json: any) => {
    try {
      return JSON.stringify(json, null, 2);
    } catch (e) {
      return "Error formatting JSON";
    }
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Failed to copy to clipboard", e);
    }
  };

  return (
    <Card className="glass animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Raw Data Inspector</CardTitle>
            <CardDescription>Examine and analyze the raw JSON data</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            className="transition-all-fast"
          >
            Copy JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tree">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tree">Tree View</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tree" className="mt-4">
            <div className="bg-card/50 rounded-md p-4 overflow-auto max-h-[400px] font-mono text-sm">
              {renderJsonTree(data)}
            </div>
          </TabsContent>
          
          <TabsContent value="raw" className="mt-4">
            <pre className="bg-card/50 rounded-md p-4 overflow-auto max-h-[400px] text-xs">
              {formatJson(data)}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataInspector;

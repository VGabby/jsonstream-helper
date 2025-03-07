
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, CloudDownload, Clock } from "lucide-react";
import { Environment, CURRENT_ENVIRONMENT, getBaseUrl, setEnvironment } from '@/config/endpoints';

interface EndpointSelectorProps {
  onFetchData: (useCache: boolean) => void;
  onEnvironmentChange: (env: Environment) => void;
  dataPoints?: number;
  isLoading?: boolean;
  environment: Environment;
  lastUpdated?: Date;
}

const EndpointSelector: React.FC<EndpointSelectorProps> = ({ 
  onFetchData,
  onEnvironmentChange,
  dataPoints,
  isLoading = false,
  environment,
  lastUpdated
}) => {
  const handleEnvironmentChange = (value: string) => {
    // Call the environment change handler with the new environment value
    onEnvironmentChange(value as Environment);
  };

  // Format the timestamp to a readable format
  const formatTimestamp = (date?: Date) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('default', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <Card className="glass animate-slide-up mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg mb-1">Data Source</CardTitle>
            <CardDescription>Configure endpoint and fetch data</CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
            {dataPoints !== undefined ? (
              <>
                <Database className="h-3 w-3" />
                <span>{dataPoints.toLocaleString()} Data Points</span>
              </>
            ) : 'No Data'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Environment</label>
            <Select 
              value={environment} 
              onValueChange={handleEnvironmentChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs font-mono bg-background/70 p-2 rounded border mt-2">
              Base URL: {getBaseUrl()}
            </div>
          </div>
          
          {/* Last updated timestamp */}
          {lastUpdated && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last updated: {formatTimestamp(lastUpdated)}
            </div>
          )}
          
          <div className="pt-2 grid grid-cols-2 gap-3">
            {/* Refresh button (uses cache if available) */}
            <Button 
              onClick={() => onFetchData(true)} 
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
            
            {/* Fetch from Source button (bypasses cache) */}
            <Button 
              onClick={() => onFetchData(false)} 
              variant="default"
              disabled={isLoading}
            >
              <CloudDownload className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Fetch from Source'}
            </Button>
            
            {dataPoints !== undefined && (
              <p className="text-xs text-center mt-2 text-muted-foreground col-span-2">
                Data for this environment is cached in Supabase
              </p>
            )}
          </div>

          {dataPoints !== undefined && (
            <div className="mt-4 p-4 bg-muted/50 rounded-md animate-fade-in">
              <h4 className="font-medium mb-1">Endpoint Details</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {`${dataPoints.toLocaleString()} data points available`}
              </p>
              <div className="text-xs font-mono bg-background/70 p-2 rounded border">
                {`${getBaseUrl()}/monitor/report`}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EndpointSelector;

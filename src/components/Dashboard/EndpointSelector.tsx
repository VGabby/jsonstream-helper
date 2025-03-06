
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
import { RefreshCw } from "lucide-react";
import { Environment, CURRENT_ENVIRONMENT, getBaseUrl, setEnvironment } from '@/config/endpoints';

interface EndpointSelectorProps {
  onFetchData: () => void;
  onEnvironmentChange: (env: Environment) => void;
  dataPoints?: number;
  isLoading?: boolean;
}

const EndpointSelector: React.FC<EndpointSelectorProps> = ({ 
  onFetchData,
  onEnvironmentChange,
  dataPoints,
  isLoading = false
}) => {
  const handleEnvironmentChange = (value: string) => {
    onEnvironmentChange(value as Environment);
  };

  return (
    <Card className="glass animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg mb-1">Data Source</CardTitle>
            <CardDescription>Configure endpoint and fetch data</CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {dataPoints !== undefined ? `${dataPoints} Data Points` : 'No Data'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Environment</label>
            <Select 
              value={CURRENT_ENVIRONMENT} 
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
          
          <div className="pt-2">
            <Button 
              onClick={onFetchData} 
              className="w-full"
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Fetching...' : 'Fetch Data'}
            </Button>
          </div>

          {dataPoints !== undefined && (
            <div className="mt-4 p-4 bg-muted/50 rounded-md animate-fade-in">
              <h4 className="font-medium mb-1">Endpoint Details</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {`${dataPoints} data points available`}
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

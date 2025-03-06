
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
import { EndpointData } from '@/utils/mockData';

interface EndpointSelectorProps {
  endpoints: EndpointData[];
  selectedEndpoint: string;
  onEndpointChange: (endpoint: string) => void;
}

const EndpointSelector: React.FC<EndpointSelectorProps> = ({ 
  endpoints, 
  selectedEndpoint, 
  onEndpointChange 
}) => {
  // Find the details of the currently selected endpoint
  const currentEndpoint = endpoints.find(e => e.id === selectedEndpoint);

  return (
    <Card className="glass animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg mb-1">Data Source</CardTitle>
            <CardDescription>Select an API endpoint to analyze</CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {endpoints.length} Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select 
            value={selectedEndpoint} 
            onValueChange={onEndpointChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an endpoint" />
            </SelectTrigger>
            <SelectContent>
              {endpoints.map((endpoint) => (
                <SelectItem 
                  key={endpoint.id} 
                  value={endpoint.id}
                  className="transition-all-fast hover:bg-accent/50"
                >
                  {endpoint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {currentEndpoint && (
            <div className="mt-4 p-4 bg-muted/50 rounded-md animate-fade-in">
              <h4 className="font-medium mb-1">Endpoint Details</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {currentEndpoint.description}
              </p>
              <div className="text-xs font-mono bg-background/70 p-2 rounded border">
                {currentEndpoint.url}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EndpointSelector;

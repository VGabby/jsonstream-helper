
import React, { useState, useEffect } from 'react';
import Header from '@/components/Dashboard/Header';
import EndpointSelector from '@/components/Dashboard/EndpointSelector';
import DataVisualization from '@/components/Dashboard/DataVisualization';
import DataInspector from '@/components/Dashboard/DataInspector';
import { mockEndpoints } from '@/utils/mockData';

const Index = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("analytics");
  const [endpointData, setEndpointData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate fetching data when endpoint changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get the selected endpoint's data
      const endpoint = mockEndpoints.find(e => e.id === selectedEndpoint);
      setEndpointData(endpoint?.sampleData || null);
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [selectedEndpoint]);

  // Handle endpoint change
  const handleEndpointChange = (endpoint: string) => {
    setSelectedEndpoint(endpoint);
  };

  // Get the selected endpoint's full details
  const currentEndpoint = mockEndpoints.find(e => e.id === selectedEndpoint);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <Header 
          title="Analytics Dashboard" 
          description="Select and analyze data from different API endpoints"
        />
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar: Endpoint selector */}
          <div className="lg:col-span-1">
            <EndpointSelector 
              endpoints={mockEndpoints}
              selectedEndpoint={selectedEndpoint}
              onEndpointChange={handleEndpointChange}
            />
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loading indicator */}
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px] bg-background/50 rounded-lg border animate-pulse">
                <p className="text-muted-foreground">Loading data...</p>
              </div>
            ) : (
              <>
                {/* Data visualization */}
                <DataVisualization 
                  data={endpointData} 
                  endpoint={selectedEndpoint} 
                />
                
                {/* Data inspector */}
                <DataInspector data={endpointData} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

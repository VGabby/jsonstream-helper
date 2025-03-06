
import React, { useState, useEffect } from 'react';
import Header from '@/components/Dashboard/Header';
import EndpointSelector from '@/components/Dashboard/EndpointSelector';
import DataVisualization from '@/components/Dashboard/DataVisualization';
import DataInspector from '@/components/Dashboard/DataInspector';
import { mockEndpoints } from '@/utils/mockData';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Environment, CURRENT_ENVIRONMENT, setEnvironment, getEndpointUrl, API_ENDPOINTS } from '@/config/endpoints';

const Index = () => {
  const [endpointData, setEndpointData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataPoints, setDataPoints] = useState<number | undefined>(undefined);
  const [environment, setCurrentEnvironment] = useState<Environment>(CURRENT_ENVIRONMENT);

  // Handle environment change
  const handleEnvironmentChange = (env: Environment) => {
    setCurrentEnvironment(env);
    setEnvironment(env);
    // Reset data when environment changes
    setEndpointData(null);
    setDataPoints(undefined);
    toast({
      title: "Environment Changed",
      description: `Switched to ${env} environment`,
    });
  };

  // Simulate fetching data
  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock the response from the monitor/report endpoint
      const mockDataPoints = Math.floor(Math.random() * 1000) + 100;
      setDataPoints(mockDataPoints);
      
      // Get sample data for visualization
      const endpoint = mockEndpoints.find(e => e.id === "analytics");
      setEndpointData(endpoint?.sampleData || null);
      
      toast({
        title: "Data Fetched Successfully",
        description: `Retrieved ${mockDataPoints} data points from ${environment} environment`,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error Fetching Data",
        description: "There was a problem retrieving the data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <Header 
          title="Analytics Dashboard" 
          description="Monitor and analyze data from different environments"
        />
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar: Environment selector */}
          <div className="lg:col-span-1">
            <EndpointSelector 
              onEnvironmentChange={handleEnvironmentChange}
              onFetchData={fetchData}
              dataPoints={dataPoints}
              isLoading={isLoading}
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
                {/* Data visualization - only show if data is available */}
                {endpointData ? (
                  <>
                    <DataVisualization 
                      data={endpointData} 
                      endpoint={"analytics"}
                    />
                    
                    {/* Data inspector */}
                    <DataInspector data={endpointData} />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] bg-background/50 rounded-lg border">
                    <p className="text-muted-foreground mb-4">No data available</p>
                    <Button onClick={fetchData} variant="outline">Fetch Data to Begin</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

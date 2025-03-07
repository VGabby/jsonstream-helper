
import React, { useState, useEffect } from 'react';
import Header from '@/components/Dashboard/Header';
import EndpointSelector from '@/components/Dashboard/EndpointSelector';
import DataVisualization from '@/components/Dashboard/DataVisualization';
import DataInspector from '@/components/Dashboard/DataInspector';
import { mockEndpoints } from '@/utils/mockData';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Environment, CURRENT_ENVIRONMENT, setEnvironment, getEndpointUrl, API_ENDPOINTS } from '@/config/endpoints';
import StatusOverview from '@/components/Dashboard/StatusOverview';
import { supabase } from '@/integrations/supabase/client';

interface ReportData {
  message: string;
  total?: number;
  status?: Array<[string, number]>;
}

const Index = () => {
  const [endpointData, setEndpointData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataPoints, setDataPoints] = useState<number | undefined>(undefined);
  const [environment, setCurrentEnvironment] = useState<Environment>(CURRENT_ENVIRONMENT);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Parse report message to extract total and status information
  const parseReportMessage = (message: string): { total: number, status: Array<[string, number]> } | null => {
    try {
      // Example: "Total: 165549 - Status: [('FAILURE', 19), ('SUCCESS', 165530)]"
      const totalMatch = message.match(/Total: (\d+)/);
      const statusMatch = message.match(/Status: \[(.*)\]/);
      
      if (totalMatch && statusMatch) {
        const total = parseInt(totalMatch[1], 10);
        
        // Parse the status tuples
        const statusString = statusMatch[1];
        const statusRegex = /\('([^']+)', (\d+)\)/g;
        const status: Array<[string, number]> = [];
        
        let match;
        while ((match = statusRegex.exec(statusString)) !== null) {
          status.push([match[1], parseInt(match[2], 10)]);
        }
        
        return { total, status };
      }
      return null;
    } catch (error) {
      console.error("Error parsing report message:", error);
      return null;
    }
  };

  // Fetch report data from Supabase for the current environment
  const fetchReportFromDatabase = async (env: Environment) => {
    try {
      const { data, error } = await supabase
        .from('monitor_reports')
        .select('*')
        .eq('environment', env)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Convert stored data back to the format we need
        const storedReport: ReportData = {
          message: data.message,
          total: data.total_data_points,
          status: data.status_data as Array<[string, number]>
        };

        setReportData(storedReport);
        setDataPoints(data.total_data_points);
        
        // Also fetch sample visualization data
        const endpoint = mockEndpoints.find(e => e.id === "analytics");
        setEndpointData(endpoint?.sampleData || null);
        
        toast({
          title: "Data Loaded",
          description: `Loaded cached data for ${env} environment`,
        });
        
        return true; // Data was found
      }
      
      return false; // No data found
    } catch (error) {
      console.error("Error fetching data from database:", error);
      return false;
    }
  };

  // Handle environment change
  const handleEnvironmentChange = async (env: Environment) => {
    setCurrentEnvironment(env);
    setEnvironment(env);
    
    // Reset UI state
    setIsLoading(true);
    
    // Try to fetch data from the database first
    const dataFound = await fetchReportFromDatabase(env);
    
    if (!dataFound) {
      // Reset data if no cached data was found
      setEndpointData(null);
      setDataPoints(undefined);
      setReportData(null);
      toast({
        title: "Environment Changed",
        description: `Switched to ${env} environment. No cached data found, please fetch new data.`,
      });
    }
    
    setIsLoading(false);
  };

  // Store report data in the database
  const storeReportInDatabase = async (env: Environment, reportData: ReportData) => {
    if (!reportData.total || !reportData.status) return;
    
    try {
      const { error } = await supabase
        .from('monitor_reports')
        .upsert({
          environment: env,
          message: reportData.message,
          total_data_points: reportData.total,
          status_data: reportData.status
        }, {
          onConflict: 'environment'
        });

      if (error) throw error;
      
      console.log(`Stored report data for ${env} environment`);
    } catch (error) {
      console.error("Error storing report in database:", error);
      toast({
        title: "Database Error",
        description: "Failed to cache the data in the database.",
        variant: "destructive",
      });
    }
  };

  // Fetch data from monitor/report endpoint
  const fetchReportData = async () => {
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate response from monitor/report endpoint
      const mockResponse = {
        message: "Total: 165549 - Status: [('FAILURE', 19), ('SUCCESS', 165530)]"
      };
      
      // Parse the message to extract structured data
      const parsedData = parseReportMessage(mockResponse.message);
      
      if (parsedData) {
        const newReportData = {
          message: mockResponse.message,
          total: parsedData.total,
          status: parsedData.status
        };
        
        setReportData(newReportData);
        setDataPoints(parsedData.total);
        
        // Store the data in the database for future use
        await storeReportInDatabase(environment, newReportData);
      } else {
        setReportData({ message: mockResponse.message });
      }
      
      // Get sample data for visualization
      const endpoint = mockEndpoints.find(e => e.id === "analytics");
      setEndpointData(endpoint?.sampleData || null);
      
      toast({
        title: "Data Fetched Successfully",
        description: `Retrieved and cached monitoring report from ${environment} environment`,
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

  // Check for existing data on initial load
  useEffect(() => {
    const checkForExistingData = async () => {
      setIsLoading(true);
      await fetchReportFromDatabase(environment);
      setIsLoading(false);
    };
    
    checkForExistingData();
  }, []);

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
              onFetchData={fetchReportData}
              dataPoints={dataPoints}
              isLoading={isLoading}
              environment={environment}
            />
            
            {/* Status Overview */}
            {reportData && (
              <StatusOverview 
                reportData={reportData} 
                environment={environment}
              />
            )}
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
                    <Button onClick={fetchReportData} variant="outline">Fetch Data to Begin</Button>
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

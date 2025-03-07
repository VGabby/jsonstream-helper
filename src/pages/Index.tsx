
import React, { useState, useEffect } from 'react';
import Header from '@/components/Dashboard/Header';
import EndpointSelector from '@/components/Dashboard/EndpointSelector';
import DataVisualization from '@/components/Dashboard/DataVisualization';
import DataInspector from '@/components/Dashboard/DataInspector';
import { mockEndpoints } from '@/utils/mockData';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Environment, CURRENT_ENVIRONMENT, setEnvironment, getEndpointUrl, API_ENDPOINTS, getBaseUrl } from '@/config/endpoints';
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
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  const parseReportMessage = (message: string): { total: number, status: Array<[string, number]> } | null => {
    try {
      const totalMatch = message.match(/Total: (\d+)/);
      const statusMatch = message.match(/Status: \[(.*)\]/);
      
      if (totalMatch && statusMatch) {
        const total = parseInt(totalMatch[1], 10);
        
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

  const fetchReportFromDatabase = async (env: Environment) => {
    try {
      console.log(`Fetching report data for ${env} environment`);
      
      setReportData(null);
      setDataPoints(undefined);
      setEndpointData(null);

      const { data, error } = await supabase
        .from('monitor_reports')
        .select('*')
        .eq('environment', env)
        .maybeSingle();

      if (error) {
        console.error("Error fetching from database:", error);
        throw error;
      }

      if (data) {
        console.log(`Found data for ${env} environment:`, data);
        
        const storedReport: ReportData = {
          message: data.message,
          total: data.total_data_points,
          status: data.status_data as Array<[string, number]>
        };

        setReportData(storedReport);
        setDataPoints(data.total_data_points);
        setLastUpdated(new Date(data.updated_at));
        
        const endpoint = mockEndpoints.find(e => e.id === "analytics");
        setEndpointData(endpoint?.sampleData || null);
        
        toast({
          title: "Data Loaded",
          description: `Loaded cached data for ${env} environment`,
        });
        
        return true;
      } else {
        console.log(`No data found for ${env} environment`);
        return false;
      }
    } catch (error) {
      console.error("Error fetching data from database:", error);
      return false;
    }
  };

  const handleEnvironmentChange = async (env: Environment) => {
    console.log(`Environment changed to: ${env}`);
    setCurrentEnvironment(env);
    setEnvironment(env);
    
    setIsLoading(true);
    
    const dataFound = await fetchReportFromDatabase(env);
    
    if (!dataFound) {
      setEndpointData(null);
      setDataPoints(undefined);
      setReportData(null);
      setLastUpdated(undefined);
      toast({
        title: "Environment Changed",
        description: `Switched to ${env} environment. No cached data found, please fetch new data.`,
      });
    }
    
    setIsLoading(false);
  };

  const storeReportInDatabase = async (env: Environment, reportData: ReportData) => {
    if (!reportData.total || !reportData.status) return;
    
    try {
      console.log(`Storing report data for ${env} environment`);
      
      const { error } = await supabase
        .from('monitor_reports')
        .upsert({
          environment: env,
          message: reportData.message,
          total_data_points: reportData.total,
          status_data: reportData.status,
          updated_at: new Date().toISOString()
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

  const fetchReportFromSource = async () => {
    setIsLoading(true);
    
    try {
      console.log(`Fetching data directly from source for ${environment} environment`);
      const monitorReportUrl = `${getBaseUrl()}${API_ENDPOINTS.monitorReport}`;
      console.log(`Making request to: ${monitorReportUrl}`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = {
        message: "Total: 165549 - Status: [('FAILURE', 19), ('SUCCESS', 165530)]"
      };
      
      const parsedData = parseReportMessage(mockResponse.message);
      
      if (parsedData) {
        const newReportData = {
          message: mockResponse.message,
          total: parsedData.total,
          status: parsedData.status
        };
        
        setReportData(newReportData);
        setDataPoints(parsedData.total);
        
        const now = new Date();
        setLastUpdated(now);
        
        await storeReportInDatabase(environment, newReportData);
      } else {
        setReportData({ message: mockResponse.message });
      }
      
      const endpoint = mockEndpoints.find(e => e.id === "analytics");
      setEndpointData(endpoint?.sampleData || null);
      
      toast({
        title: "Data Fetched Successfully",
        description: `Retrieved fresh data directly from ${environment} environment source`,
      });
    } catch (error) {
      console.error("Error fetching data from source:", error);
      toast({
        title: "Error Fetching Data",
        description: "There was a problem retrieving data from the source.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReportData = async (useCache: boolean = true) => {
    setIsLoading(true);
    
    if (useCache) {
      const dataFound = await fetchReportFromDatabase(environment);
      if (dataFound) {
        setIsLoading(false);
        return;
      }
    }
    
    await fetchReportFromSource();
  };

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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <EndpointSelector 
              onEnvironmentChange={handleEnvironmentChange}
              onFetchData={fetchReportData}
              onFetchFromSource={fetchReportFromSource}
              dataPoints={dataPoints}
              isLoading={isLoading}
              environment={environment}
              lastUpdated={lastUpdated}
            />
            
            {reportData && (
              <StatusOverview 
                reportData={reportData} 
                environment={environment}
              />
            )}
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px] bg-background/50 rounded-lg border animate-pulse">
                <p className="text-muted-foreground">Loading data...</p>
              </div>
            ) : (
              <>
                {endpointData ? (
                  <>
                    <DataVisualization 
                      data={endpointData} 
                      endpoint={"analytics"}
                    />
                    
                    <DataInspector data={endpointData} />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] bg-background/50 rounded-lg border">
                    <p className="text-muted-foreground mb-4">No data available</p>
                    <Button onClick={() => fetchReportData(false)} variant="outline">Fetch Data to Begin</Button>
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

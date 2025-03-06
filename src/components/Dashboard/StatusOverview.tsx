
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Environment } from '@/config/endpoints';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ReportData {
  message: string;
  total?: number;
  status?: Array<[string, number]>;
}

interface StatusOverviewProps {
  reportData: ReportData;
  environment: Environment;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

const StatusOverview: React.FC<StatusOverviewProps> = ({ reportData, environment }) => {
  // Prepare data for pie chart if status data exists
  const chartData = reportData.status?.map(([name, value]) => ({ name, value })) || [];
  
  // Calculate success rate if possible
  const calculateSuccessRate = () => {
    if (!reportData.status || !reportData.total) return null;
    
    const successItem = reportData.status.find(([status]) => status === 'SUCCESS');
    if (successItem) {
      const successCount = successItem[1];
      return ((successCount / reportData.total) * 100).toFixed(2);
    }
    return null;
  };
  
  const successRate = calculateSuccessRate();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Status Overview</span>
          <span className="text-sm font-normal capitalize">{environment}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reportData.total && (
          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-1">Total Data Points</div>
            <div className="text-2xl font-bold">{reportData.total.toLocaleString()}</div>
            
            {successRate && (
              <div className="mt-3">
                <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
                <div className="text-xl font-semibold text-green-500">{successRate}%</div>
              </div>
            )}
          </div>
        )}
        
        {chartData.length > 0 && (
          <div className="h-[200px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        
        <div className="text-xs font-mono bg-muted/50 p-2 rounded mt-4">
          {reportData.message}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusOverview;

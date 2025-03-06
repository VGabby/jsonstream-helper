
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { extractKeyMetrics } from '@/utils/mockData';

interface DataVisualizationProps {
  data: any;
  endpoint: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, endpoint }) => {
  const metrics = extractKeyMetrics(endpoint, data);
  
  // Generate simple charts based on endpoint type
  const renderCharts = () => {
    switch (endpoint) {
      case "analytics":
        const processedData = data?.pageViews ? 
          Object.entries(data.pageViews).map(([name, value]) => ({ name, value })) : 
          [];
        
        const timeData = data?.timeRanges?.daily ? 
          data.timeRanges.daily.dates.map((date: string, i: number) => ({
            name: date,
            visitors: data.timeRanges.daily.visitors[i]
          })) : [];
          
        const deviceData = data?.devices ? 
          Object.entries(data.devices).map(([name, value]) => ({ name, value })) : 
          [];
        
        return (
          <Tabs defaultValue="pageviews">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pageviews">Page Views</TabsTrigger>
              <TabsTrigger value="visitors">Visitors</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pageviews" className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      border: '1px solid #eaeaea'
                    }} 
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="visitors" className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      border: '1px solid #eaeaea' 
                    }} 
                  />
                  <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="devices" className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      border: '1px solid #eaeaea' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        );
        
      case "products":
        // Sample product visualization
        const productData = Array.isArray(data) ? data.map(p => ({
          name: p.name,
          price: p.price,
          inventory: p.inventory,
          rating: p.rating
        })) : [];
        
        return (
          <Tabs defaultValue="inventory">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="ratings">Ratings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory" className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      border: '1px solid #eaeaea' 
                    }} 
                  />
                  <Bar dataKey="inventory" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="pricing" className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      border: '1px solid #eaeaea' 
                    }} 
                  />
                  <Bar dataKey="price" fill="#00C49F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="ratings" className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      border: '1px solid #eaeaea' 
                    }} 
                  />
                  <Bar dataKey="rating" fill="#FFBB28" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        );
      
      case "users":
        // For users, show sessions distribution
        const userData = Array.isArray(data) ? data.map(u => ({
          name: u.name,
          sessions: u.sessions,
          subscription: u.subscription
        })) : [];
        
        return (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: '1px solid #eaeaea' 
                  }} 
                />
                <Legend />
                <Bar dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
        
      case "orders":
        // For orders, show total by item
        const orderItems = Array.isArray(data) ? data.flatMap(order => 
          order.items.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        ) : [];
        
        // Group and sum by product name
        const aggregatedItems: any[] = [];
        orderItems.forEach(item => {
          const existingItem = aggregatedItems.find(i => i.name === item.name);
          if (existingItem) {
            existingItem.quantity += item.quantity;
            existingItem.total += item.price * item.quantity;
          } else {
            aggregatedItems.push({
              name: item.name,
              quantity: item.quantity,
              total: item.price * item.quantity
            });
          }
        });
        
        return (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aggregatedItems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: '1px solid #eaeaea' 
                  }} 
                />
                <Legend />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total ($)" />
                <Bar dataKey="quantity" fill="#00C49F" radius={[4, 4, 0, 0]} name="Quantity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-[300px] bg-muted/30 rounded-md">
            <p className="text-muted-foreground">Select an endpoint to visualize data</p>
          </div>
        );
    }
  };

  return (
    <Card className="glass animate-slide-up">
      <CardHeader>
        <CardTitle className="text-lg">Data Visualization</CardTitle>
        <CardDescription>Visual representation of your endpoint data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-background/40 p-4 rounded-lg border transition-all-fast hover:shadow-md"
            >
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-semibold mt-1">{metric.value}</p>
            </div>
          ))}
        </div>
        
        {renderCharts()}
      </CardContent>
    </Card>
  );
};

export default DataVisualization;

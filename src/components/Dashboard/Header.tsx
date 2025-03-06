
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HeaderProps {
  title: string;
  description: string;
  dateRange?: string;
}

const Header: React.FC<HeaderProps> = ({ title, description, dateRange = "Last 7 days" }) => {
  return (
    <div className="flex flex-col mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        
        <Tabs defaultValue="7d" className="w-full md:w-auto">
          <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="90d">90d</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex items-center mt-6 justify-between">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors">
          {dateRange}
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Export
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;

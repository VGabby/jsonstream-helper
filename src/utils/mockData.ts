
export interface EndpointData {
  id: string;
  name: string;
  description: string;
  url: string;
  sampleData: any;
}

export const mockEndpoints: EndpointData[] = [
  {
    id: "users",
    name: "Users Endpoint",
    description: "User profile and activity data",
    url: "/api/users",
    sampleData: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        lastActive: "2023-10-15T14:30:22Z",
        sessions: 32,
        registeredAt: "2023-01-05T09:12:34Z",
        subscription: "premium",
        favorites: ["dashboard", "reports", "settings"]
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        lastActive: "2023-10-14T08:45:11Z",
        sessions: 28,
        registeredAt: "2023-02-18T15:22:10Z",
        subscription: "basic",
        favorites: ["analytics", "profile"]
      },
      {
        id: 3,
        name: "Robert Johnson",
        email: "robert@example.com",
        lastActive: "2023-10-15T10:15:32Z",
        sessions: 45,
        registeredAt: "2022-11-30T11:42:50Z",
        subscription: "premium",
        favorites: ["dashboard", "analytics", "reports"]
      }
    ]
  },
  {
    id: "products",
    name: "Products Endpoint",
    description: "Product catalog and inventory data",
    url: "/api/products",
    sampleData: [
      {
        id: "p001",
        name: "Wireless Headphones",
        category: "Electronics",
        price: 129.99,
        inventory: 45,
        rating: 4.7,
        reviews: 128,
        lastRestocked: "2023-09-28T08:15:00Z",
        specifications: {
          brand: "SoundWave",
          color: "Black",
          weight: "250g",
          batteryLife: "20 hours"
        }
      },
      {
        id: "p002",
        name: "Ergonomic Chair",
        category: "Furniture",
        price: 249.99,
        inventory: 12,
        rating: 4.5,
        reviews: 87,
        lastRestocked: "2023-10-05T10:30:00Z",
        specifications: {
          brand: "ComfortPlus",
          color: "Gray",
          weight: "15kg",
          material: "Mesh and Metal"
        }
      },
      {
        id: "p003",
        name: "Smart Watch",
        category: "Electronics",
        price: 199.99,
        inventory: 30,
        rating: 4.8,
        reviews: 156,
        lastRestocked: "2023-10-10T14:45:00Z",
        specifications: {
          brand: "TechFit",
          color: "Silver",
          weight: "45g",
          batteryLife: "48 hours"
        }
      }
    ]
  },
  {
    id: "analytics",
    name: "Analytics Endpoint",
    description: "Website traffic and user behavior metrics",
    url: "/api/analytics",
    sampleData: {
      pageViews: {
        "/home": 12450,
        "/products": 8320,
        "/about": 2140,
        "/contact": 1890,
        "/blog": 4560
      },
      timeRanges: {
        daily: {
          dates: ["2023-10-10", "2023-10-11", "2023-10-12", "2023-10-13", "2023-10-14", "2023-10-15"],
          visitors: [1204, 1356, 1102, 1408, 1505, 1305]
        },
        monthly: {
          months: ["May", "June", "July", "August", "September", "October"],
          visitors: [28450, 31200, 29800, 32600, 35100, 38200]
        }
      },
      devices: {
        desktop: 58.5,
        mobile: 34.2,
        tablet: 7.3
      },
      browsers: {
        chrome: 64.2,
        safari: 18.5,
        firefox: 10.3,
        edge: 5.8,
        other: 1.2
      }
    }
  },
  {
    id: "orders",
    name: "Orders Endpoint",
    description: "Customer order history and details",
    url: "/api/orders",
    sampleData: [
      {
        id: "ord-5724",
        customer: {
          id: 1,
          name: "John Doe",
          email: "john@example.com"
        },
        items: [
          { productId: "p001", name: "Wireless Headphones", quantity: 1, price: 129.99 },
          { productId: "p003", name: "Smart Watch", quantity: 1, price: 199.99 }
        ],
        total: 329.98,
        status: "delivered",
        placedAt: "2023-09-15T11:24:36Z",
        deliveredAt: "2023-09-18T14:12:08Z",
        paymentMethod: "credit card"
      },
      {
        id: "ord-5836",
        customer: {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com"
        },
        items: [
          { productId: "p002", name: "Ergonomic Chair", quantity: 1, price: 249.99 }
        ],
        total: 249.99,
        status: "processing",
        placedAt: "2023-10-14T09:45:21Z",
        deliveredAt: null,
        paymentMethod: "paypal"
      }
    ]
  }
];

// Helper functions for data processing
export const processAnalyticsData = (data: any) => {
  // Convert the pageViews object to an array format suitable for charts
  const pageViewsArray = Object.entries(data.pageViews).map(([page, views]) => ({
    page,
    views
  }));

  // Format the daily visitors data for a line chart
  const dailyVisitors = data.timeRanges.daily.dates.map((date: string, index: number) => ({
    date,
    visitors: data.timeRanges.daily.visitors[index]
  }));

  // Format device and browser data for pie charts
  const deviceData = Object.entries(data.devices).map(([device, percentage]) => ({
    name: device,
    value: percentage
  }));

  const browserData = Object.entries(data.browsers).map(([browser, percentage]) => ({
    name: browser,
    value: percentage
  }));

  return {
    pageViewsArray,
    dailyVisitors,
    deviceData,
    browserData
  };
};

export const processOrdersData = (orders: any[]) => {
  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  // Count orders by status
  const ordersByStatus = orders.reduce((acc: Record<string, number>, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  
  // Extract payment methods
  const paymentMethods = orders.reduce((acc: Record<string, number>, order) => {
    acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
    return acc;
  }, {});
  
  return {
    totalRevenue,
    ordersByStatus,
    paymentMethods,
    orderCount: orders.length
  };
};

export const processProductsData = (products: any[]) => {
  // Calculate average rating
  const avgRating = products.reduce((sum, product) => sum + product.rating, 0) / products.length;
  
  // Find product with highest and lowest inventory
  const highestInventory = [...products].sort((a, b) => b.inventory - a.inventory)[0];
  const lowestInventory = [...products].sort((a, b) => a.inventory - b.inventory)[0];
  
  // Group products by category
  const productsByCategory = products.reduce((acc: Record<string, number>, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  
  return {
    avgRating,
    highestInventory,
    lowestInventory,
    productsByCategory,
    totalProducts: products.length
  };
};

export const extractKeyMetrics = (endpoint: string, data: any): { label: string; value: any }[] => {
  switch (endpoint) {
    case "users":
      return [
        { label: "Total Users", value: data.length },
        { label: "Premium Users", value: data.filter((user: any) => user.subscription === "premium").length },
        { label: "Basic Users", value: data.filter((user: any) => user.subscription === "basic").length },
        { label: "Avg. Sessions", value: Math.round(data.reduce((sum: number, user: any) => sum + user.sessions, 0) / data.length) }
      ];
    case "products":
      const processedData = processProductsData(data);
      return [
        { label: "Total Products", value: processedData.totalProducts },
        { label: "Avg. Rating", value: processedData.avgRating.toFixed(1) },
        { label: "Low Stock", value: processedData.lowestInventory.inventory },
        { label: "Categories", value: Object.keys(processedData.productsByCategory).length }
      ];
    case "analytics":
      return [
        { label: "Total Visitors", value: data.timeRanges.daily.visitors.reduce((a: number, b: number) => a + b, 0) },
        { label: "Most Viewed", value: Object.entries(data.pageViews).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0] },
        { label: "Mobile Users", value: `${data.devices.mobile}%` },
        { label: "Top Browser", value: `${Object.entries(data.browsers).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0]}` }
      ];
    case "orders":
      const orderData = processOrdersData(data);
      return [
        { label: "Total Orders", value: orderData.orderCount },
        { label: "Revenue", value: `$${orderData.totalRevenue.toFixed(2)}` },
        { label: "Delivered", value: orderData.ordersByStatus.delivered || 0 },
        { label: "Processing", value: orderData.ordersByStatus.processing || 0 }
      ];
    default:
      return [];
  }
};

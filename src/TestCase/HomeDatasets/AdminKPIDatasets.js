export const adminKpiTableData = [
  {
    id: "1",
    username: "KPI One",
    description: "Desc 1",
    category: "Category A",
    persona: "Persona X",
    status: "Active",
  },
  {
    id: "2",
    username: "KPI Two",
    description: "Desc 2",
    category: "Category B",
    persona: "Persona Y",
    status: "Inactive",
  },
];

export const adminKpilistData = [
    {
      title: "Total Revenue",
      value: "230K",
      changeText: "12%",
      isPositive: true,
    },
    {
      title: "Customer Drop",
      value: "5K",
      changeText: "8%",
      isPositive: false,
    },
  ];

  export const UsageStatsChartThreeTrendsMock = [
  { name: "Persona 1", value: 7, avgTimeSpent: 1.4, users: 120, status: "Active" },
  { name: "Persona 2", value: 9, avgTimeSpent: 1.8, users: 95, status: "Inactive" },
  { name: "Persona 3", value: 12, avgTimeSpent: 2.4, users: 140, status: "Active" }
];

export const UsageStatsLoginTrendsMock = {
  '6 Months': [
    { month: 'Jan', 'Persona 1': 800, 'Persona 2': 900, 'Persona 3': 400 },
    { month: 'Feb', 'Persona 1': 600, 'Persona 2': 800, 'Persona 3': 500 },
    { month: 'Mar', 'Persona 1': 700, 'Persona 2': 950, 'Persona 3': 600 },
    { month: 'Apr', 'Persona 1': 950, 'Persona 2': 1050, 'Persona 3': 700 },
    { month: 'May', 'Persona 1': 1100, 'Persona 2': 1150, 'Persona 3': 900 },
    { month: 'Jun', 'Persona 1': 1200, 'Persona 2': 1000, 'Persona 3': 1100 },
  ],
  '3 Months': [
    { month: 'Apr', 'Persona 1': 950, 'Persona 2': 1050, 'Persona 3': 700 },
    { month: 'May', 'Persona 1': 1100, 'Persona 2': 1150, 'Persona 3': 900 },
    { month: 'Jun', 'Persona 1': 1200, 'Persona 2': 1000, 'Persona 3': 1100 },
  ],
  '1 Month': [{ month: 'Jun', 'Persona 1': 1200, 'Persona 2': 1000, 'Persona 3': 1100 }],
};

export const UsageStatsTimespentMock = {
  Day: [
    { name: "Persona 1", hours: 7,   avgTimeSpent: 1.4, activeUsers: 120 },
    { name: "Persona 2", hours: 9,   avgTimeSpent: 1.8, activeUsers: 95 },
    { name: "Persona 3", hours: 12,  avgTimeSpent: 2.4, activeUsers: 140 },
  ],

  Week: [
    { name: "Persona 1", hours: 45,  avgTimeSpent: 6.4, activeUsers: 780 },
    { name: "Persona 2", hours: 52,  avgTimeSpent: 7.4, activeUsers: 680 },
    { name: "Persona 3", hours: 68,  avgTimeSpent: 9.7, activeUsers: 820 },
  ],

  Month: [
    { name: "Persona 1", hours: 168, avgTimeSpent: 42.0, activeUsers: 3000 },
    { name: "Persona 2", hours: 200, avgTimeSpent: 50.0, activeUsers: 2800 },
    { name: "Persona 3", hours: 240, avgTimeSpent: 60.0, activeUsers: 3500 },
  ],
};
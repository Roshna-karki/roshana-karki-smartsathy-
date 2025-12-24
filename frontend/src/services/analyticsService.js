const analyticsService = {
  // Get dashboard statistics (mock implementation)
  async getDashboardStats() {
    // Simulate API call 
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock dashboard data
    return {
      totalCampaigns: 12,
      emailsSent: 15420,
      totalSubscribers: 3420,
      averageOpenRate: 24.5,
      averageClickRate: 3.2,
      averageBounceRate: 1.8,
      recentCampaigns: [
        {
          id: '1',
          name: 'Welcome Email Series',
          status: 'sent',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: 'Product Launch Announcement',
          status: 'scheduled',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'Monthly Newsletter',
          status: 'draft',
          createdAt: new Date().toISOString(),
        },
      ],
    };
  },
};

export { analyticsService };


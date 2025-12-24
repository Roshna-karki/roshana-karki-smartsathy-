// Simple mock campaign service
let campaigns = [
  {
    id: 'c1',
    name: 'Welcome Series',
    status: 'sent',
    templateId: 't1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c2',
    name: 'New Feature Announcement',
    status: 'scheduled',
    templateId: 't2',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const generateId = () => Math.random().toString(36).slice(2, 9);

const campaignService = {
  async getCampaigns() {
    await new Promise((r) => setTimeout(r, 400));
    return campaigns.slice().reverse();
  },

  async createCampaign({ name, templateId }) {
    await new Promise((r) => setTimeout(r, 300));
    const newC = { id: generateId(), name, status: 'draft', templateId, createdAt: new Date().toISOString() };
    campaigns.push(newC);
    return newC;
  },

  async updateCampaign(id, updates) {
    await new Promise((r) => setTimeout(r, 300));
    campaigns = campaigns.map((c) => (c.id === id ? { ...c, ...updates } : c));
    return campaigns.find((c) => c.id === id);
  },

  async deleteCampaign(id) {
    await new Promise((r) => setTimeout(r, 300));
    campaigns = campaigns.filter((c) => c.id !== id);
    return true;
  },

  // simple send/schedule mock
  async sendCampaign(id) {
    await new Promise((r) => setTimeout(r, 400));
    campaigns = campaigns.map((c) => (c.id === id ? { ...c, status: 'sent' } : c));
    return campaigns.find((c) => c.id === id);
  },
};

export { campaignService };
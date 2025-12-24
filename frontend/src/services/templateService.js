// Simple mock template service
let templates = [
  {
    id: 't1',
    name: 'Welcome Template',
    subject: 'Welcome to our service',
    content: '<h1>Welcome!</h1><p>Thanks for joining.</p>',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    name: 'Promo Template',
    subject: 'Special Offer Just for You',
    content: '<h1>Save 20%</h1><p>Use code SAVE20</p>',
    createdAt: new Date().toISOString(),
  },
];

const generateId = () => Math.random().toString(36).slice(2, 9);

const templateService = {
  async getTemplates() {
    await new Promise((r) => setTimeout(r, 400));
    return templates.slice().reverse(); // newest first
  },

  async createTemplate({ name, subject, content }) {
    await new Promise((r) => setTimeout(r, 300));
    const newTpl = { id: generateId(), name, subject, content, createdAt: new Date().toISOString() };
    templates.push(newTpl);
    return newTpl;
  },

  async updateTemplate(id, updates) {
    await new Promise((r) => setTimeout(r, 300));
    templates = templates.map((t) => (t.id === id ? { ...t, ...updates } : t));
    return templates.find((t) => t.id === id);
  },

  async deleteTemplate(id) {
    await new Promise((r) => setTimeout(r, 300));
    templates = templates.filter((t) => t.id !== id);
    return true;
  },
};

export { templateService };
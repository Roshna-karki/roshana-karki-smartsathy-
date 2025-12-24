import { useEffect, useState } from 'react';
import { PlusCircle, Send, Edit3, Trash2, Loader2 } from 'lucide-react';
import { campaignService } from '../services/campaignService';
import { templateService } from '../services/templateService';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // create form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [camps, tpls] = await Promise.all([campaignService.getCampaigns(), templateService.getTemplates()]);
      setCampaigns(camps);
      setTemplates(tpls);
      if (!templateId && tpls.length) setTemplateId(tpls[0].id);
    } catch (err) {
      console.error(err);
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setName('');
    if (templates.length) setTemplateId(templates[0].id);
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setName(c.name);
    setTemplateId(c.templateId || '');
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await campaignService.updateCampaign(editing.id, { name, templateId });
      } else {
        await campaignService.createCampaign({ name, templateId });
      }
      setShowForm(false);
      fetchAll();
    } catch (err) {
      console.error(err);
      setError('Failed to save campaign');
    }
  };

  const handleSend = async (id) => {
    if (!confirm('Send campaign now?')) return;
    try {
      await campaignService.sendCampaign(id);
      fetchAll();
    } catch (err) {
      console.error(err);
      setError('Failed to send campaign');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete campaign?')) return;
    try {
      await campaignService.deleteCampaign(id);
      fetchAll();
    } catch (err) {
      console.error(err);
      setError('Failed to delete campaign');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Create, schedule and manage your email campaigns.</p>
        </div>
        <div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <PlusCircle className="w-5 h-5" />
            New Campaign
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-start justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900">{c.name}</p>
              <p className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
              <p className="mt-2 text-sm text-gray-700">Template: {templates.find((t) => t.id === c.templateId)?.name || '—'}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.status === 'sent' ? 'bg-green-100 text-green-700' : c.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                {c.status}
              </span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="text-blue-600 hover:text-blue-800"><Edit3 className="w-5 h-5" /></button>
                <button onClick={() => handleSend(c.id)} className="text-green-600 hover:text-green-800"><Send className="w-5 h-5" /></button>
                <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Campaign' : 'Create Campaign'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Template</label>
                <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                  <option value="">Select template</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
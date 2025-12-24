import { useEffect, useState } from 'react';
import { PlusCircle, Edit3, Trash2, Loader2 } from 'lucide-react';
import { templateService } from '../services/templateService';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // create/edit modal state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setName('');
    setSubject('');
    setContent('');
    setShowForm(true);
  };

  const openEdit = (tpl) => {
    setEditing(tpl);
    setName(tpl.name);
    setSubject(tpl.subject);
    setContent(tpl.content);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await templateService.updateTemplate(editing.id, { name, subject, content });
      } else {
        await templateService.createTemplate({ name, subject, content });
      }
      setShowForm(false);
      fetchTemplates();
    } catch (err) {
      console.error(err);
      setError('Failed to save template');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete template?')) return;
    try {
      await templateService.deleteTemplate(id);
      fetchTemplates();
    } catch (err) {
      console.error(err);
      setError('Failed to delete template');
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
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600 mt-1">Create and manage email templates for your campaigns.</p>
        </div>
        <div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" />
            Create Template
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">{tpl.name}</p>
                <p className="text-sm text-gray-500">{tpl.subject}</p>
                <div className="mt-3 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: tpl.content }} />
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => openEdit(tpl)} className="text-blue-600 hover:text-blue-800">
                  <Edit3 className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(tpl.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Template' : 'Create Template'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">HTML Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
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

export default Templates;
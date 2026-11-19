import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function JobForm({ onSubmit, initialData, departments = [], loading }) {
  const [form, setForm] = useState(initialData || {
    title: '', department: '', description: '', requirements: '', responsibilities: '',
    location: '', job_type: 'FULL_TIME', experience_level: 'MID',
    salary_min: '', salary_max: '', openings: 1, deadline: '', status: 'DRAFT', skills_required: [],
  });
  const [skillInput, setSkillInput] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    if (skillInput.trim() && !form.skills_required.includes(skillInput.trim())) {
      setForm({ ...form, skills_required: [...form.skills_required, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (s) => setForm({ ...form, skills_required: form.skills_required.filter((x) => x !== s) });

  const handleSubmit = (e) => { e.preventDefault(); onSubmit({ ...form, status: e.nativeEvent.submitter?.value || 'DRAFT' }); };
  const localToday = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Job Title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Senior React Developer" required />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
          <select name="department" value={form.department} onChange={handleChange} className="input-field" required>
            <option value="">Select Department</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <Input label="Location" name="location" value={form.location} onChange={handleChange} placeholder="Remote / New York" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
          <select name="job_type" value={form.job_type} onChange={handleChange} className="input-field">
            <option value="FULL_TIME">Full Time</option><option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option><option value="REMOTE">Remote</option><option value="INTERNSHIP">Internship</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Level</label>
          <select name="experience_level" value={form.experience_level} onChange={handleChange} className="input-field">
            <option value="ENTRY">Entry</option><option value="MID">Mid</option><option value="SENIOR">Senior</option><option value="LEAD">Lead</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input label="Min Salary ($)" type="number" name="salary_min" value={form.salary_min} onChange={handleChange} placeholder="60000" />
        <Input label="Max Salary ($)" type="number" name="salary_max" value={form.salary_max} onChange={handleChange} placeholder="120000" />
        <Input label="Openings" type="number" name="openings" value={form.openings} onChange={handleChange} min="1" />
      </div>

      <Input label="Application deadline" type="date" name="deadline" min={localToday} value={form.deadline} onChange={handleChange} required />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field" placeholder="Job description..." required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Requirements</label>
        <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={3} className="input-field" placeholder="Job requirements..." required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Responsibilities <span className="text-gray-400">(optional)</span></label>
        <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} rows={3} className="input-field" placeholder="What will this person work on?" />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills Required</label>
        <div className="flex gap-2">
          <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            className="input-field flex-1" placeholder="Add a skill and press Enter" />
          <Button type="button" variant="secondary" onClick={addSkill}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {form.skills_required.map((s) => (
            <button key={s} type="button" onClick={() => removeSkill(s)} aria-label={`Remove ${s}`} className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-red-50 hover:text-red-600">{s} ×</button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" value="DRAFT" variant="secondary" loading={loading}>Save draft</Button>
        <Button type="submit" value="PUBLISHED" loading={loading}>Publish role</Button>
      </div>
    </form>
  );
}

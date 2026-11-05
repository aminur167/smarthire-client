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

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

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

      <Input label="Deadline" type="date" name="deadline" value={form.deadline} onChange={handleChange} required />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field" placeholder="Job description..." required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Requirements</label>
        <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={3} className="input-field" placeholder="Job requirements..." required />
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
            <span key={s} onClick={() => removeSkill(s)} className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors">
              {s} ×
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>Save Job Posting</Button>
        <Button type="button" variant="outline" onClick={() => onSubmit({ ...form, status: 'PUBLISHED' })} loading={loading}>Publish Now</Button>
      </div>
    </form>
  );
}

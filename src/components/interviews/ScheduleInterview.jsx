import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function ScheduleInterview({ applications = [], onSubmit, loading }) {
  const [form, setForm] = useState({ application: '', interviewer: '', scheduled_at: '', duration_minutes: 60, interview_type: 'VIDEO', meeting_link: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Application</label>
        <select name="application" value={form.application} onChange={handleChange} className="input-field" required>
          <option value="">Select application</option>
          {applications.map((a) => <option key={a.id} value={a.id}>{a.candidate_detail?.first_name} {a.candidate_detail?.last_name} — {a.job_detail?.title}</option>)}
        </select>
      </div>
      <Input label="Scheduled Date & Time" type="datetime-local" name="scheduled_at" value={form.scheduled_at} onChange={handleChange} required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Duration (minutes)" type="number" name="duration_minutes" value={form.duration_minutes} onChange={handleChange} min="15" />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
          <select name="interview_type" value={form.interview_type} onChange={handleChange} className="input-field">
            <option value="VIDEO">Video Call</option><option value="PHONE">Phone</option>
            <option value="IN_PERSON">In-Person</option><option value="TECHNICAL">Technical</option><option value="HR">HR Round</option>
          </select>
        </div>
      </div>
      <Input label="Meeting Link" name="meeting_link" value={form.meeting_link} onChange={handleChange} placeholder="https://meet.google.com/..." />
      <Button type="submit" loading={loading}>Schedule Interview</Button>
    </form>
  );
}

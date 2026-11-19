import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function ScheduleInterview({ applications = [], onSubmit, loading }) {
  const [form, setForm] = useState({ application: '', interviewer: '', scheduled_at: '', duration_minutes: 60, interview_type: 'VIDEO', meeting_link: '', location: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduledAt = new Date(form.scheduled_at);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) return;
    onSubmit({ ...form, scheduled_at: scheduledAt.toISOString() });
  };
  const localNow = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="interview-application" className="block text-sm font-medium text-gray-700 mb-1.5">Candidate application</label>
        <select id="interview-application" name="application" value={form.application} onChange={handleChange} className="input-field" required>
          <option value="">Select application</option>
          {applications.map((a) => <option key={a.id} value={a.id}>{a.candidate_detail?.first_name} {a.candidate_detail?.last_name} — {a.job_detail?.title}</option>)}
        </select>
      </div>
      <Input label="Date & time" type="datetime-local" name="scheduled_at" value={form.scheduled_at} min={localNow} onChange={handleChange} required />
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
      {form.interview_type === 'IN_PERSON' && <Input label="Meeting location" name="location" value={form.location} onChange={handleChange} placeholder="Office address or room" required/>}
      {form.interview_type === 'PHONE' && <Input label="Dial-in details" name="location" value={form.location} onChange={handleChange} placeholder="Phone number or dial-in instructions"/>}
      <Input label="Meeting Link" name="meeting_link" value={form.meeting_link} onChange={handleChange} placeholder="https://meet.google.com/..." />
      <Button type="submit" loading={loading}>Schedule Interview</Button>
    </form>
  );
}

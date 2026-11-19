import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BriefcaseBusiness, CalendarDays, Check, CheckCheck, FileText, Info } from 'lucide-react';
import { getNotifications, markNotificationRead } from '../api/dashboard';
import Loader from '../components/common/Loader';
import { formatDate, formatTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const icons = { APPLICATION: FileText, INTERVIEW: CalendarDays, JOB: BriefcaseBusiness, SYSTEM: Info };

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();
  const load = async () => {
    try { const { data } = await getNotifications(); setItems(data?.results || data || []); }
    catch { toast.error('Could not load notifications. Please try again.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const markRead = async (notification) => {
    if (notification.is_read) return;
    setItems((current) => current.map((item) => item.id === notification.id ? { ...item, is_read: true } : item));
    try { await markNotificationRead(notification.id); window.dispatchEvent(new Event('notifications-updated')); }
    catch { setItems((current) => current.map((item) => item.id === notification.id ? { ...item, is_read: false } : item)); toast.error('Could not update this notification.'); }
  };
  const markAllRead = async () => {
    const previous = items; setItems((current) => current.map((item) => ({ ...item, is_read: true })));
    try { await markNotificationRead(); window.dispatchEvent(new Event('notifications-updated')); toast.success('All notifications marked as read.'); }
    catch { setItems(previous); toast.error('Could not update notifications.'); }
  };
  const openNotification = async (item) => {
    await markRead(item);
    if (item.link?.startsWith('/') && !item.link.startsWith('//')) navigate(item.link);
  };
  if (loading) return <Loader/>;
  const unread = items.filter((item) => !item.is_read).length;
  const shown = filter === 'UNREAD' ? items.filter((item) => !item.is_read) : items;

  return <div className="mx-auto max-w-4xl space-y-6"><header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-800">Your workspace</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Notifications</h1><p className="mt-2 text-sm text-slate-500">Stay current on applications, interviews and workspace updates.</p></div>{unread > 0 && <button onClick={markAllRead} className="btn-secondary h-10 px-3 text-xs"><CheckCheck className="h-4 w-4"/>Mark all as read</button>}</header>
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-2"><Bell className="h-4 w-4 text-emerald-800"/><p className="text-sm font-bold text-slate-800">{unread} unread</p></div><div className="flex rounded-lg bg-slate-100 p-1"><button onClick={() => setFilter('ALL')} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${filter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>All</button><button onClick={() => setFilter('UNREAD')} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${filter === 'UNREAD' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Unread</button></div></div>
      {shown.length ? <div className="divide-y divide-slate-100">{shown.map((item) => { const Icon = icons[item.notification_type] || Bell; const hasLink = item.link?.startsWith('/') && !item.link.startsWith('//'); return <article key={item.id} className={`flex items-start gap-4 px-5 py-4 transition ${item.is_read ? 'bg-white' : 'bg-emerald-50/40'}`}><span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.is_read ? 'bg-slate-100 text-slate-500' : 'bg-[#edf7e2] text-[#47713a]'}`}><Icon className="h-4 w-4"/></span><button type="button" onClick={() => openNotification(item)} className="min-w-0 flex-1 text-left"><span className="flex flex-wrap items-center gap-2"><span className="text-sm font-bold text-slate-800">{item.title}</span>{!item.is_read && <span className="h-1.5 w-1.5 rounded-full bg-emerald-700"/>}</span><span className="mt-1 block text-sm leading-5 text-slate-600">{item.message}</span><span className="mt-2 block text-[11px] text-slate-400">{formatDate(item.created_at)} · {formatTime(item.created_at)}</span></button>{hasLink && <span className="mt-2 text-xs font-semibold text-emerald-800">Open</span>}{!item.is_read && <button type="button" aria-label="Mark as read" onClick={() => markRead(item)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-white hover:text-emerald-800"><Check className="h-4 w-4"/></button>}</article>; })}</div> : <div className="px-6 py-14 text-center"><Bell className="mx-auto h-8 w-8 text-slate-300"/><p className="mt-3 text-sm font-semibold text-slate-700">{filter === 'UNREAD' ? 'You’re all caught up' : 'Nothing new for now'}</p><p className="mt-1 text-xs text-slate-400">Updates from your workspace will appear here.</p></div>}
    </section>
  </div>;
}

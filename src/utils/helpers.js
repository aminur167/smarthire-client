import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  try { return format(typeof date === 'string' ? parseISO(date) : date, 'MMM d, yyyy'); }
  catch { return '—'; }
};

export const formatTime = (date) => {
  if (!date) return '';
  try { return format(typeof date === 'string' ? parseISO(date) : date, 'h:mm a'); }
  catch { return ''; }
};

export const timeAgo = (date) => {
  if (!date) return '';
  try { return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true }); }
  catch { return ''; }
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const classNames = (...classes) => classes.filter(Boolean).join(' ');

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// "3 hours ago", "2 days ago"
export const fromNow = (date) => dayjs(date).fromNow();

// "Jun 18, 2026"
export const formatDate = (date) => dayjs(date).format('MMM D, YYYY');

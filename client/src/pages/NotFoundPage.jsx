import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <p className="font-display text-6xl font-bold text-coral-500">404</p>
    <h1 className="mt-2 font-display text-xl font-semibold text-ink-800">
      Page not found
    </h1>
    <p className="mt-1 text-sm text-ink-500">
      The page you&apos;re looking for doesn&apos;t exist.
    </p>
    <Button as={Link} to="/" className="mt-6">
      Back to feed
    </Button>
  </div>
);

export default NotFoundPage;

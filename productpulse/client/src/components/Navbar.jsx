import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import Avatar from './Avatar';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-500 text-white shadow-soft">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 3.5 17 12H3z" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold text-ink-900">
            Product<span className="text-coral-500">Pulse</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button as={Link} to="/submit" size="sm">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1z" />
            </svg>
            Submit
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Avatar name={user.name} color={user.avatarColor} size={32} />
              <span className="hidden text-sm font-medium text-ink-700 sm:inline">
                {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button as={Link} to="/register" variant="secondary" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

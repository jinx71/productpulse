import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      toast.success('Account created 🎉');
      navigate(from, { replace: true });
    } catch (err) {
      if (Array.isArray(err.errors) && err.errors.length) {
        err.errors.forEach((e) => {
          if (e.param) setError(e.param, { type: 'server', message: e.msg });
        });
      } else {
        toast.error(err.message || 'Could not create account');
      }
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-2xl font-bold text-ink-900">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-ink-500">
        Join ProductPulse to submit launches, upvote, and comment.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <Input
          label="Name"
          placeholder="Maya Chen"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 40, message: 'Name must be at most 40 characters' },
          })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-coral-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../validation/authSchemas';
import { loginUser } from '../../api/auth';
import { useTheme } from '../../theme/ThemeContext';

export default function Login({ setUser }) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const emailTrimmed = data.email.trim().toLowerCase();

      const user = await loginUser(emailTrimmed, data.password);

      localStorage.setItem(
        'sprout_user',
        JSON.stringify({
          email: emailTrimmed,
          ...(user?.id && { id: user.id }),
        })
      );
        
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError('root', {
        message: err?.response?.data?.error || err.message || 'Login failed',
      });
    }
  };

  return (
    <div className="sprout-bg flex items-center justify-center">
      <div className="auth-card pop show">
        <h1 className="text-3xl font-bold text-center">Log In</h1>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register('email')}
              className={`auth-input ${
                errors.email ? 'sprout-input-error' : ''
              }`}
            />
            {errors.email && (
              <p className="sprout-error-text">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              {...register('password')}
              className={`auth-input ${
                errors.password ? 'sprout-input-error' : ''
              }`}
            />
            {errors.password && (
              <p className="sprout-error-text">{errors.password.message}</p>
            )}
          </div>

          {/* FORM ERROR */}
          {errors.root && (
            <div className="sprout-error-text text-center">
              {errors.root.message}
            </div>
          )}

          <button disabled={isSubmitting} className="auth-button" type="submit">
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* NAV LINK  */}
        <p className="text-center text-sm">
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>

        {/* THEME TOGGLE */}
        <div className="flex justify-center gap-6 text-2xl pt-2">
          <span
            onClick={() => setTheme('light')}
            className={`cursor-pointer ${
              theme === 'light' ? 'scale-125' : 'opacity-50'
            }`}
          >
            ☀️
          </span>

          <span
            onClick={() => setTheme('dark')}
            className={`cursor-pointer ${
              theme === 'dark' ? 'scale-125' : 'opacity-50'
            }`}
          >
            🌙
          </span>
        </div>
      </div>
    </div>
  );
}

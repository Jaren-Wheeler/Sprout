import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth.js';
import { useTheme } from '../../theme/ThemeContext.jsx';

export default function Login() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const newErrors = {};
    const emailTrimmed = email.trim().toLowerCase();

    if (!emailTrimmed) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(emailTrimmed))
      newErrors.email = 'Please enter a valid email';

    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});

      const user = await loginUser(emailTrimmed, password);

      localStorage.setItem(
        'sprout_user',
        JSON.stringify({
          email: emailTrimmed,
          ...(user?.id && { id: user.id }),
        })
      );

      navigate('/dashboard');
    } catch (err) {
      setErrors({ form: err.message || 'Login failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sprout-bg flex items-center justify-center">
      <div className="auth-card pop show">
        <h1 className="text-3xl font-bold text-center">Log In</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="auth-input"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="auth-input"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* FORM ERROR */}
          {errors.form && (
            <div className="text-red-500 text-center">{errors.form}</div>
          )}

          {/* BUTTON */}
          <button disabled={submitting} className="auth-button" type="submit">
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* NAV LINK */}
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

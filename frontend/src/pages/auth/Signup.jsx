// frontend/src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../../api/auth.js';
import { useTheme } from '../../theme/ThemeContext.jsx';

export default function Signup() {
  const { theme, setTheme } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const newErrors = {};

    const fullNameTrimmed = fullName.trim();
    const emailTrimmed = email.trim().toLowerCase();

    if (!fullNameTrimmed) newErrors.fullName = 'Full name is required';

    if (!emailTrimmed) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(emailTrimmed))
      newErrors.email = 'Please enter a valid email';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';

    if (!confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});

      const created = await registerUser(
        fullNameTrimmed,
        emailTrimmed,
        password
      );

      let user = created;
      try {
        user = await loginUser(emailTrimmed, password);
      } catch {
        // ignore
      }

      try {
        localStorage.setItem(
          'sprout_user',
          JSON.stringify({
            email: emailTrimmed,
            ...(user?.id ? { id: user.id } : {}),
          })
        );
      } catch {
        // ignore
      }

      navigate('/dashboard');
    } catch (err) {
      setErrors({ form: err.message || 'Signup failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sprout-bg flex items-center justify-center">
      <div className="auth-card pop show">
        <h1 className="text-3xl font-bold text-center">Sign Up</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* FULL NAME */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="auth-input"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="auth-input"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.form && (
            <div className="text-red-500 text-center">{errors.form}</div>
          )}

          <button type="submit" disabled={submitting} className="auth-button">
            {submitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="font-semibold cursor-pointer hover:underline"
          >
            Log In
          </span>
        </p>

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

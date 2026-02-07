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
    <div className={`home ${theme}`}>
      <div className="auth-container pop show">
        <h1 className="pop show">Sign Up</h1>

        <form className="auth-form pop show delay-1" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <div className="field-error">{errors.fullName || ''}</div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <div className="field-error">{errors.email || ''}</div>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <div className="field-error">{errors.password || ''}</div>

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <div className="field-error">{errors.confirmPassword || ''}</div>

          {errors.form && <div className="error-box">{errors.form}</div>}

          <button className="btn signup" type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-link pop show delay-2">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Log In</span>
        </p>

        <div className="theme-icons pop show delay-3">
          <span
            className={theme === 'light' ? 'active' : ''}
            onClick={() => setTheme('light')}
          >
            ☀️
          </span>
          <span
            className={theme === 'dark' ? 'active' : ''}
            onClick={() => setTheme('dark')}
          >
            🌙
          </span>
        </div>
      </div>
    </div>
  );
}

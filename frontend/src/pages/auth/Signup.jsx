import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../../validation/authSchemas';
import { registerUser, loginUser } from '../../api/auth';
import { useTheme } from '../../theme/ThemeContext';

export default function Signup({ setUser }) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      const fullNameTrimmed = data.fullName.trim();
      const emailTrimmed = data.email.trim().toLowerCase();

      await registerUser(
        fullNameTrimmed,
        emailTrimmed,
        data.password
      );

      let user = await loginUser(emailTrimmed, data.password);
     
      setUser(user);

    
      localStorage.setItem(
        'sprout_user',
        JSON.stringify({
          email: emailTrimmed,
          ...(user?.id ? { id: user.id } : {}),
        })
      );
      
      navigate('/dashboard');
    } catch (err) {
      setError('root', {
        message: err?.response?.data?.error || err.message || 'Signup failed',
      });
    }
  };

  return (
    <div className="sprout-bg flex items-center justify-center">
      <div className="auth-card pop show">
        <h1 className="text-3xl font-bold text-center">Sign Up</h1>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* FULL NAME */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register('fullName')}
              className={`auth-input ${
                errors.fullName ? 'sprout-input-error' : ''
              }`}
            />
            {errors.fullName && (
              <p className="sprout-error-text">{errors.fullName.message}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email"
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
              {...register('password')}
              className={`auth-input ${
                errors.password ? 'sprout-input-error' : ''
              }`}
            />
            {errors.password && (
              <p className="sprout-error-text">{errors.password.message}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register('confirmPassword')}
              className={`auth-input ${
                errors.confirmPassword ? 'sprout-input-error' : ''
              }`}
            />
            {errors.confirmPassword && (
              <p className="sprout-error-text">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* FORM LEVEL ERROR */}
          {errors.root && (
            <div className="sprout-error-text text-center">
              {errors.root.message}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="auth-button">
            {isSubmitting ? 'Creating...' : 'Create Account'}
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

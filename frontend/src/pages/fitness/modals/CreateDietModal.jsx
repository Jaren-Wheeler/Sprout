import { useEffect, useState } from 'react';
import SproutModal from '../../../components/ui/SproutModal';

export default function CreateDietModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Diet name is required';
    } else if (name.trim().length > 30) {
      nextErrors.name = 'Diet name cannot exceed 30 characters';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    onCreate({
      name: name.trim(),
      description: description.trim(),
    });
  }

  return (
    <SproutModal onClose={onClose}>
      <div className="sprout-panel p-6 w-full max-w-md space-y-5 shadow-lg">
        <h2 className="text-xl font-semibold text-amber-900">
          Create New Diet
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Diet Name */}
          <div>
            <label className="text-sm text-amber-900/70">Diet Name</label>

            <input
              className="sprout-input"
              placeholder="Lean Bulk"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="sprout-btn-muted px-4"
            >
              Cancel
            </button>

            <button type="submit" className="sprout-btn-primary px-4">
              Create
            </button>
          </div>
        </form>
      </div>
    </SproutModal>
  );
}

import { useEffect, useState } from 'react';
import SproutModal from '../../components/ui/SproutModal';

export default function CreateDietModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return;

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
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-amber-900/70">Description</label>

            <input
              className="sprout-input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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

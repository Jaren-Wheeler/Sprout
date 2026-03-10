import { useEffect, useState } from 'react';
import SproutModal from '../../components/ui/SproutModal';

export default function AddDietItemModal({ isOpen, meal, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [sugar, setSugar] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setSugar('');
  }, [isOpen]);

  if (!isOpen) return null;

  async function submit(isPreset) {
    if (!name.trim() || !calories) return;

    await onCreate({
      name: name.trim(),
      meal,
      calories: Number(calories),
      protein: Number(protein || 0),
      carbs: Number(carbs || 0),
      fat: Number(fat || 0),
      sugar: Number(sugar || 0),
      isPreset,
    });
  }

  return (
    <SproutModal onClose={onClose}>
      <div className="sprout-panel p-6 w-full max-w-md space-y-5 shadow-lg">
        <h2 className="text-xl font-semibold text-amber-900">
          Log a food item
        </h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-amber-900/70">Food Name</label>
            <input
              className="sprout-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chicken breast"
            />
          </div>

          <div>
            <label className="text-sm text-amber-900/70">Calories</label>
            <input
              className="sprout-input"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              inputMode="numeric"
              placeholder="200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-amber-900/70">Protein</label>
              <input
                className="sprout-input"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                inputMode="numeric"
                placeholder="30"
              />
            </div>

            <div>
              <label className="text-sm text-amber-900/70">Carbs</label>
              <input
                className="sprout-input"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                inputMode="numeric"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm text-amber-900/70">Fat</label>
              <input
                className="sprout-input"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                inputMode="numeric"
                placeholder="5"
              />
            </div>

            <div>
              <label className="text-sm text-amber-900/70">Sugar</label>
              <input
                className="sprout-input"
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
                inputMode="numeric"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="sprout-btn-muted px-4">
            Cancel
          </button>

          <button
            onClick={() => submit(false)}
            className="sprout-btn-primary px-4"
          >
            Create
          </button>

          <button
            onClick={() => submit(true)}
            className="sprout-btn-success px-4"
          >
            Save preset
          </button>
        </div>
      </div>
    </SproutModal>
  );
}

import { useEffect, useState } from 'react';
import { getFoodDetails, searchFoods } from '../../../../api/usda';

export default function FoodSearch({ onSelect }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [highlighted, setHighlighted] = useState(0);

  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setSearching(true);

        const foods = await searchFoods(query);
        setResults(foods || []);
      } catch (err) {
        console.error('Food search failed', err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setHighlighted(0);
  }, [results]);

  async function handleSelect(food) {
    try {
      const details = await getFoodDetails(food.fdcId);

      onSelect(details);

      setSearch('');
      setResults([]);
    } catch (err) {
      console.error('Failed to load food details', err);
    }
  }

  function handleKeyDown(e) {
    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((prev) => (prev + 1 >= results.length ? 0 : prev + 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((prev) => (prev - 1 < 0 ? results.length - 1 : prev - 1));
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(results[highlighted]);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm text-amber-900/70">Search USDA foods</label>

        <input
          className="sprout-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search chicken, rice, yogurt..."
        />

        {searching && (
          <div className="text-xs text-amber-900/60 mt-1">Searching...</div>
        )}
      </div>

      {results.length > 0 && (
        <div className="border rounded-lg max-h-40 overflow-y-auto bg-white">
          {results.map((food, index) => (
            <button
              key={food.fdcId}
              type="button"
              onClick={() => handleSelect(food)}
              className={`block w-full text-left px-3 py-2 text-sm
                ${highlighted === index ? 'bg-amber-100' : 'hover:bg-amber-50'}
              `}
            >
              <div className="font-medium">{food.name}</div>

              {food.brandName && (
                <div className="text-xs text-gray-500">{food.brandName}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

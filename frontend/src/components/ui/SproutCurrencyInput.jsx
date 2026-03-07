import { formatCurrency, stripCurrencyFormatting } from '../../utils/format';

export default function SproutCurrencyInput({
  register,
  name,
  error,
  placeholder,
}) {
  return (
    <div>
      <input
        type="text"
        inputMode="decimal"
        maxLength={14}
        className={`sprout-input ${error ? 'sprout-input-error' : ''}`}
        placeholder={placeholder}
        {...register(name)}
        onFocus={(e) => {
          e.target.value = stripCurrencyFormatting(e.target.value);
        }}
        onBlur={(e) => {
          const clean = stripCurrencyFormatting(e.target.value);
          if (clean) {
            e.target.value = formatCurrency(clean);
          }
        }}
        onKeyDown={(e) => {
          if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
          }
        }}
      />
      {error && <p className="sprout-error-text">{error.message}</p>}
    </div>
  );
}

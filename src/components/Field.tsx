import * as React from 'react';

type FieldProps = {
  label: string;
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  stacked?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

type SelectFieldProps = Omit<FieldProps, 'type' | 'onChange'> & {
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  stacked,
  autoFocus,
  placeholder,
  options
}) => {
  return (
    <div className={`flex ${stacked ? 'flex-col gap-1' : 'flex-row items-center gap-3'}`}>
      <label className="font-semibold">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="rounded p-1 dark:bg-zinc-700 bg-gray-200 flex-1"
        autoFocus={autoFocus}
        placeholder={placeholder}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

const Field: React.FC<FieldProps> = ({
  label,
  value,
  type,
  onChange,
  stacked,
  autoFocus,
  placeholder
}) => {
  return (
    <div className={`flex ${stacked ? 'flex-col gap-1' : 'flex-row items-center gap-3'}`}>
      <label className="font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="rounded p-1 dark:bg-zinc-700 bg-gray-200 flex-1"
        autoFocus={autoFocus}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Field;
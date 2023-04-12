import { Input, Select, Typography } from "antd";
import * as React from "react";
import DatePicker from "./DatePicker";
import { Moment } from "moment";
import { Option } from "antd/es/mentions";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  stacked?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
};

type SelectFieldProps = Omit<TextFieldProps, "onChange"> & {
  options: string[];
  onChange: (value: string) => void;
};

type DateFieldProps = Omit<TextFieldProps, "onChange" | "value"> & {
  value: Moment;
  onChange: (date: Moment | null, dateString: string) => void;
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  stacked,
  autoFocus,
  placeholder,
  options,
}) => {
  return (
    <div className={`flex ${stacked ? "flex-col gap-1" : "flex-row items-center gap-3"}`}>
      <Typography.Text strong>{label}</Typography.Text>
      <Select
        onChange={onChange}
        className="flex-1"
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={value}
      >
        {options.map((option) => (
          <Select.Option key={option} value={option}>
            {option}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  stacked,
  autoFocus,
  placeholder,
}) => {
  return (
    <div className={`flex ${stacked ? "flex-col gap-1" : "flex-row items-center gap-3"}`}>
      <Typography.Text strong>{label}</Typography.Text>
      <Input
        value={value}
        onChange={onChange}
        className="flex-1"
        autoFocus={autoFocus}
        placeholder={placeholder}
      />
    </div>
  );
};

export const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  stacked,
  autoFocus,
  placeholder,
}) => {
  return (
    <div className={`flex ${stacked ? "flex-col gap-1" : "flex-row items-center gap-3"}`}>
      <Typography.Text strong>{label}</Typography.Text>
      <DatePicker
        value={value}
        onChange={onChange}
        className="flex-1"
        autoFocus={autoFocus}
        placeholder={placeholder}
      />
    </div>
  );
};

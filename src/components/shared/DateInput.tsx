import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { PADDING, ROUNDED, TEXT_INPUT } from "../design";

interface DateInputProps {
  id?: string;
  name?: string;
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  readOnly?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  tabIndex?: number;
  className?: string;
  required?: boolean;
  min?: string;
  max?: string;
}

const DateInput = ({
  className,
  onBlur,
  onFocus,
  onChange,
  readOnly,
  value,
  setValue,
  tabIndex,
  id,
  name,
  max,
  min,
  required,
}: DateInputProps) => {
  return (
    <input
      id={id}
      name={name}
      type="date"
      required={required}
      value={value}
      onChange={(e) =>
        setValue
          ? setValue(e.target.value)
          : onChange
          ? onChange(e)
          : console.log(e)
      }
      onBlur={onBlur}
      onFocus={onFocus}
      readOnly={readOnly}
      className={className ? className : TEXT_INPUT}
      tabIndex={tabIndex}
      min={min}
      max={max}
    />
  );
};

export default DateInput;

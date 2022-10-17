import { Dispatch, SetStateAction } from "react";
import { TEXT_INPUT } from "../design";

interface InputProps {
  id?: string;
  name?: string;
  type?: "number" | string;
  value?: number;
  setValue?: Dispatch<SetStateAction<number>>;
  readOnly?: boolean;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  tabIndex?: number;
  className?: string;
}

const NumberInput = ({
  className,
  onBlur,
  onFocus,
  placeholder,
  readOnly,
  setValue,
  type,
  value,
  tabIndex,
  id,
  name,
}: InputProps) => {
  return (
    <input
      id={id}
      name={name}
      type={type ? type : "number"}
      value={value}
      onChange={(e) => setValue && setValue(Number(e.target.value))}
      onBlur={onBlur}
      onFocus={onFocus}
      readOnly={readOnly}
      placeholder={placeholder}
      className={className ? className : TEXT_INPUT}
      tabIndex={tabIndex}
    />
  );
};

export default NumberInput;

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { TEXT_INPUT } from "../design";

interface InputProps {
  id?: string;
  name?: string;
  type?: "number" | string;
  value?: number;
  setValue?: Dispatch<SetStateAction<number>>;
  readOnly?: boolean;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyUp?: () => void;
  tabIndex?: number;
  className?: string;
}

const NumberInput = ({
  className,
  onBlur,
  onFocus,
  onChange,
  onKeyUp,
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
      onChange={(e) =>
        setValue
          ? setValue(Number(e.target.value))
          : onChange
          ? onChange(e)
          : console.log(Number(e))
      }
      onBlur={onBlur}
      onKeyUp={onKeyUp}
      onFocus={onFocus}
      readOnly={readOnly}
      placeholder={placeholder}
      className={className ? className : TEXT_INPUT}
      min={0}
      max={9999999}
      tabIndex={tabIndex}
    />
  );
};

export default NumberInput;

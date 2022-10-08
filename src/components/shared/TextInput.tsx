import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { TEXT_INPUT } from "../../../lib/design";

interface InputProps {
  id?: string;
  name?: string;
  type?: "text" | "url" | "email" | string;
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  readOnly?: boolean;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyUp?: () => void;
  tabIndex?: number;
  className?: string;
}

const TextInput = ({
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
      type={type ? type : "text"}
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
      onKeyUp={onKeyUp}
      readOnly={readOnly}
      placeholder={placeholder}
      className={className ? className : TEXT_INPUT}
      tabIndex={tabIndex}
    />
  );
};

export default TextInput;

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { PADDING, ROUNDED } from "../design";

interface TextareaProps {
  id?: string;
  name?: string;
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  readOnly?: boolean;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyUp?: () => void;
  tabIndex?: number;
  className?: string;
  required?: boolean;
}

const Textarea = ({
  className,
  onBlur,
  onFocus,
  onChange,
  onKeyUp,
  placeholder,
  readOnly,
  setValue,
  value,
  tabIndex,
  id,
  name,
  required,
}: TextareaProps) => {
  return (
    <textarea
      id={id}
      name={name}
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
      onKeyUp={onKeyUp}
      readOnly={readOnly}
      placeholder={placeholder}
      className={
        className
          ? className
          : ` caret-primary border border-primary focus:outline outline-primary bg-primaryLight dark:bg-primaryDark ${ROUNDED} ${PADDING} `
      }
      rows={2}
      cols={22}
      tabIndex={tabIndex}
    />
  );
};

export default Textarea;

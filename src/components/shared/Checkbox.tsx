import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface CheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  setValue?: Dispatch<SetStateAction<string>>;
  readOnly?: boolean;
  label?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyUp?: () => void;
  tabIndex?: number;
  className?: string;
}

const Checkbox = ({
  className,
  onBlur,
  onFocus,
  onChange,
  onKeyUp,
  readOnly,
  setValue,
  tabIndex,
  id,
  name,
  label,
  checked,
}: CheckboxProps) => {
  return (
    <div className="flex items-center accent-primary">
      <input
        id={id}
        name={name}
        type="checkbox"
        onChange={(e) =>
          setValue
            ? setValue(e.target.value)
            : onChange
            ? onChange(e)
            : console.log(e)
        }
        checked={checked}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyUp={onKeyUp}
        readOnly={readOnly}
        className={className}
        tabIndex={tabIndex}
      />
      <label htmlFor={id} className="ml-1">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;

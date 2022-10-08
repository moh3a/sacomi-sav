import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import React, { Dispatch, SetStateAction, useState } from "react";
import { PASSWORD_INPUT } from "../../../lib/design";

interface PasswordProps {
  id?: string;
  name?: string;
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  readOnly?: boolean;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  tabIndex?: number;
  className?: string;
}

const PasswordInput = ({
  className,
  onBlur,
  onFocus,
  placeholder,
  readOnly,
  setValue,
  value,
  tabIndex,
  id,
  name,
}: PasswordProps) => {
  const [hidden, setHidden] = useState(true);
  return (
    <div className="relative inline">
      <input
        id={id}
        name={name}
        type={hidden ? "password" : "text"}
        value={value}
        onChange={(e) => setValue && setValue(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        readOnly={readOnly}
        placeholder={placeholder}
        className={className ? className : PASSWORD_INPUT}
        tabIndex={tabIndex}
        maxLength={16}
        minLength={4}
      />
      <div
        className="absolute top-0 right-2 cursor-pointer"
        onClick={() => setHidden(!hidden)}
      >
        {hidden ? (
          <EyeOffIcon className={`h-5 w-5 inline`} />
        ) : (
          <EyeIcon className={`h-5 w-5 inline`} />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;

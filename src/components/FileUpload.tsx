import { UploadIcon } from "@heroicons/react/outline";
import { ChangeEvent, useRef } from "react";

export interface FileUploadProps {
  acceptedFileTypes?: string;
  allowMultipleFiles?: boolean;
  onChange: (formData: FormData) => void;
  uploadFileName: string;
}

const FileUpload = ({
  acceptedFileTypes = "text/xml,application/xml",
  allowMultipleFiles = false,
  onChange,
  uploadFileName,
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const onClickHandler = () => {
    fileInputRef.current?.click();
  };

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    } else if (event.target.files?.length > 1) {
      formRef.current?.reset();
    } else {
      const formData = new FormData();
      Array.from(event.target.files).forEach((file) => {
        formData.append(event.target.name, file);
      });
      onChange(formData);
      formRef.current?.reset();
    }
  };

  return (
    <form ref={formRef}>
      <button
        className={`bg-slate-100 hover:bg-slate-200 text-black p-2 font-bold rounded-full`}
        type="button"
        onClick={onClickHandler}
      >
        <UploadIcon className="h-5 w-5 text-teal-500" />
      </button>
      <input
        accept={acceptedFileTypes}
        multiple={allowMultipleFiles}
        name={uploadFileName}
        onChange={onChangeHandler}
        ref={fileInputRef}
        maxLength={1}
        style={{ display: "none" }}
        type="file"
      />
    </form>
  );
};

export default FileUpload;

import axios, { AxiosRequestConfig } from "axios";
import { useState } from "react";

import FileUpload from "./FileUpload";
import LoadingSpinner from "./shared/LoadingSpinner";

export const Uploader = () => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{
    type?: "success" | "error";
    text?: string;
  }>({ type: undefined, text: undefined });
  const [loading, setLoading] = useState(false);

  const onChange = async (formData: FormData) => {
    const config: AxiosRequestConfig = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        setProgress(Math.round((event.loaded * 100) / event.total));
      },
    };
    const { data } = await axios.post("/api/uploads", formData, config);
    if (data.success) {
      setMessage({ type: "success", text: data.message });
      setLoading(true);
      setTimeout(() => {
        setMessage({ type: undefined, text: undefined });
        setProgress(0);
      }, 3000);
    }
    if (data.destinations) {
      const { data: parsed_xml } = await axios.post(
        "/api/migrations/xmlParser",
        {
          filePaths: data.destinations,
        }
      );

      if (parsed_xml.success) {
        setMessage({ type: "success", text: parsed_xml.message });
      } else {
        setMessage({ type: "error", text: parsed_xml.message });
      }
      setLoading(false);
      setTimeout(() => {
        setMessage({ type: undefined, text: undefined });
      }, 3000);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <FileUpload
          uploadFileName="sav_uploads"
          allowMultipleFiles={true}
          onChange={onChange}
        />
      </div>
      {loading && (
        <div className="w-full flex justify-center">
          <LoadingSpinner size="medium" />
        </div>
      )}
      {progress !== 0 && (
        <div className="bg-neutral-200 mx-auto max-w-md rounded-full h-2.5 mt-4 dark:bg-neutral-800">
          <div
            className="bg-teal-500 h-2.5 rounded-full"
            style={{ width: progress + "%" }}
          />
        </div>
      )}
      {message.type && (
        <div
          className={`mb-4 font-bold text-center ${
            message.type === "success" ? "text-teal-500" : "text-red.500"
          } italic`}
        >
          {message.text}
        </div>
      )}
    </>
  );
};

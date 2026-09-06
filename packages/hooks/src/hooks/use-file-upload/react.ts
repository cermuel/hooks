import { useState } from "react";
import { type FileUploadOptions } from "./core";

export function useFileUpload(options: FileUploadOptions = {}) {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const validate = (fileList: FileList | File[]) => {
    const nextFiles = Array.from(fileList);
    const nextErrors = nextFiles.flatMap((file) => {
      if (options.maxSize && file.size > options.maxSize) return [`${file.name} is too large.`];
      if (options.accept?.length && !options.accept.includes(file.type)) return [`${file.name} is not an accepted type.`];
      return [];
    });
    setErrors(nextErrors);
    if (nextErrors.length === 0) setFiles(options.multiple === false ? nextFiles.slice(0, 1) : nextFiles);
  };
  return { files, errors, setFiles, validate, clear: () => { setFiles([]); setErrors([]); } };
}

import { ref } from "vue";
import { type FileUploadOptions } from "./core";

export function useFileUpload(options: FileUploadOptions = {}) {
  const files = ref<File[]>([]);
  const errors = ref<string[]>([]);
  const validate = (fileList: FileList | File[]) => {
    const nextFiles = Array.from(fileList);
    const nextErrors = nextFiles.flatMap((file) => {
      if (options.maxSize && file.size > options.maxSize) return [`${file.name} is too large.`];
      if (options.accept?.length && !options.accept.includes(file.type)) return [`${file.name} is not an accepted type.`];
      return [];
    });
    errors.value = nextErrors;
    if (nextErrors.length === 0) files.value = options.multiple === false ? nextFiles.slice(0, 1) : nextFiles;
  };
  return { files, errors, setFiles: (next: File[]) => { files.value = next; }, validate, clear: () => { files.value = []; errors.value = []; } };
}

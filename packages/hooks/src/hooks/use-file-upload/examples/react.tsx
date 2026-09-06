import { useFileUpload } from "@cermuel/hooks/react";

export function useFileUploadExample() {
  const upload = useFileUpload({ accept: ['image/png'] });

  return <p>{upload.files.length} files</p>;
}

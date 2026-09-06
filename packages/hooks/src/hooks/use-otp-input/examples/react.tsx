import { useOtpInput } from "@cermuel/hooks/react";

export function useOtpInputExample() {
  const otp = useOtpInput(6);

  return <p>{otp.value}</p>;
}

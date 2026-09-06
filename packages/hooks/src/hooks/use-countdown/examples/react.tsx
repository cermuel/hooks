import { useCountdown } from "@cermuel/hooks/react";

export function useCountdownExample() {
  const countdown = useCountdown(10);

  return <button type="button" onClick={countdown.start}>{countdown.remaining}</button>;
}

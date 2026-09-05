import { useEffect, useState } from "react";

import { getOnlineStatus, subscribeToOnlineStatus } from "./core";

export function useOnline(): boolean {
  const [online, setOnline] = useState(getOnlineStatus);

  useEffect(() => subscribeToOnlineStatus(setOnline), []);

  return online;
}

import { useEffect, useState } from "react";

import { getOnlineStatus, subscribeToOnlineStatus } from "../core/online";

export function useOnline(): boolean {
  const [online, setOnline] = useState(getOnlineStatus);

  useEffect(() => subscribeToOnlineStatus(setOnline), []);

  return online;
}

# useOnline

Track whether the user currently has a network connection.

## Installation

```bash
npm install @cermuel/hooks
```

## React

```tsx
import { useOnline } from "@cermuel/hooks/react";

export function Example() {
  const online = useOnline();

  return <p>{online ? "Online" : "Offline"}</p>;
}
```

## Vue

```vue
<script setup lang="ts">
import { useOnline } from "@cermuel/hooks/vue";

const online = useOnline();
</script>

<template>
  <p>{{ online ? "Online" : "Offline" }}</p>
</template>
```

## API

### `useOnline()`

Returns the current browser online status and updates when the `online` or `offline` events fire.

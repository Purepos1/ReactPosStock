import { signal } from "@preact/signals-react";
import NetInfo from "@react-native-community/netinfo";

export const connectionStatus = signal<{
  isConnected: boolean | null;
  type: string | null;
  lastChecked: string | null;
}>({
  isConnected: null, // null = not checked yet
  type: null,
  lastChecked: null,
});

export const updateConnectionStatus = async () => {
  const state = await NetInfo.fetch();
  connectionStatus.value = {
    isConnected: state.isConnected,
    type: state.type,
    lastChecked: new Date().toISOString(),
  };
};

NetInfo.addEventListener((state) => {
  connectionStatus.value = {
    isConnected: state.isConnected,
    type: state.type,
    lastChecked: new Date().toISOString(),
  };
});

import create from "zustand";
import { Config } from "@prisma/client";

/**
 * CURRENT ID SLICE
 */
interface CurrentIdState extends Config {
  setCurrentId: (data: Config) => void;
}

export const useCurrentIdStore = create<CurrentIdState>((set) => ({
  id: "",
  current_deliveries_id: "",
  current_entries_id: "",
  current_jobs_id: 0,
  current_orders_id: "",
  current_prestations_id: "",
  current_balance: 0,
  setCurrentId: (data) =>
    set(() => ({
      id: data.id,
      current_deliveries_id: data.current_deliveries_id,
      current_entries_id: data.current_entries_id,
      current_jobs_id: data.current_jobs_id,
      current_orders_id: data.current_orders_id,
      current_prestations_id: data.current_prestations_id,
      current_balance: data.current_balance,
    })),
}));

/**
 * SELECTED SLICE
 */
type SelectedEntry = { [K in Collection["name"]]: SelectedData | undefined };

interface SelectedData {
  collection: Collection["name"];
  cursor?: any[];
  one?: any;
  id?: String;
}

interface SelectedStore {
  selected: SelectedEntry;
  set_selected_cursor: (data: SelectedData) => void;
  set_selected_one: (data: SelectedData) => void;
  set_selected_id: (data: SelectedData) => void;
}

export const useSelectedStore = create<SelectedStore>((set, get) => ({
  selected: {
    clients: undefined,
    deliveries: undefined,
    entries: undefined,
    jobs: undefined,
    orders: undefined,
    prestationDetails: undefined,
    prestations: undefined,
    products: undefined,
    transactions: undefined,
    users: undefined,
  },
  set_selected_cursor: (data) =>
    set({
      selected: {
        ...get().selected,
        [data.collection]: {
          ...get().selected[data.collection],
          cursor: data.cursor,
        },
      },
    }),
  set_selected_one: (data) =>
    set({
      selected: {
        ...get().selected,
        [data.collection]: {
          ...get().selected[data.collection],
          one: data.one,
        },
      },
    }),
  set_selected_id: (data) =>
    set({
      selected: {
        ...get().selected,
        [data.collection]: { ...get().selected[data.collection], id: data.id },
      },
    }),
}));

/**
 * REALTIME FUNCTIONNALITY
 */
import { io } from "socket.io-client";
import { Collection } from "../types";
export enum ActionType {
  LOCK,
  UPDATE,
  NONE,
}

interface ActionData {
  type: ActionType;
  collection: Collection["name"];
  id?: string;
}

interface RealtimeData {
  connected: boolean;
  actions: ActionData[];
}

interface RealtimeStore extends RealtimeData {
  send_action: (action: ActionData) => void;
  remove_action: (id: string) => void;
  clear_actions: () => void;
}

export const useRealtimeStore = create<RealtimeStore>((set, get) => {
  const ws = typeof window !== "undefined" ? io("http://localhost:3001") : null;
  if (ws) {
    ws.on("connect", () => {
      set({ connected: true });
    })
      .on("disconnect", () => {
        set({ connected: false });
      })
      .on("reaction", (action) => {
        set({
          connected: true,
          actions: get().actions ? [...get().actions, action] : [action],
        });
      });
  } else set({ connected: false });
  return {
    connected: false,
    actions: [],
    send_action: (action) => ws?.emit("action", action),
    remove_action: (id) =>
      set({ actions: get().actions.filter((e) => e.id !== id) }),
    clear_actions: () => set({ actions: [] }),
  };
});

/**
 * NOTIFICATIONS
 */
export enum NotificationStatus {
  None,
  Success,
  Warning,
  Error,
}

interface NotificationData {
  status: NotificationStatus;
  text?: string;
}

interface NotificationStore extends NotificationData {
  success: (text: string, timeout: number) => void;
  warning: (text: string, timeout: number) => void;
  error: (text: string, timeout: number) => void;
  clear: () => void;
}

const EMPTY_NOTIFICATION = {
  text: "",
  status: NotificationStatus.None,
};

const CLEAR_NOTIFICATION = (set: any, timeout: number | undefined) => {
  setTimeout(() => {
    set(EMPTY_NOTIFICATION);
  }, timeout || 10000);
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  ...EMPTY_NOTIFICATION,
  success: (text, timeout) => {
    set({
      text,
      status: NotificationStatus.Success,
    });
    CLEAR_NOTIFICATION(set, timeout);
  },
  warning: (text, timeout) => {
    set({
      text,
      status: NotificationStatus.Warning,
    });
    CLEAR_NOTIFICATION(set, timeout);
  },
  error: (text, timeout) => {
    set({
      text,
      status: NotificationStatus.Error,
    });
    CLEAR_NOTIFICATION(set, timeout);
  },
  clear: () => set(EMPTY_NOTIFICATION),
}));
import create from "zustand";
import {
  Client,
  Delivery,
  Order,
  Job,
  Product,
  Transaction,
  Prestation,
  Entry,
  Config,
} from "@prisma/client";

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
 * SELECTED ALL SLICE
 */
interface SelectedAllData {
  selected_clients: Client[];
  selected_deliveries: Delivery[];
  selected_entries: Entry[];
  selected_jobs: Job[];
  selected_orders: Order[];
  selected_products: Product[];
  selected_prestations: Prestation[];
  selected_transactions: Transaction[];
}

interface SelectedAllStore extends SelectedAllData {
  set_selected_clients: (data: Client[]) => void;
  set_selected_deliveries: (data: Delivery[]) => void;
  set_selected_entries: (data: Entry[]) => void;
  set_selected_jobs: (data: Job[]) => void;
  set_selected_orders: (data: Order[]) => void;
  set_selected_products: (data: Product[]) => void;
  set_selected_prestations: (data: Prestation[]) => void;
  set_selected_transactions: (data: Transaction[]) => void;
}

export const useSelectedAllStore = create<SelectedAllStore>((set) => ({
  selected_clients: [],
  selected_deliveries: [],
  selected_entries: [],
  selected_jobs: [],
  selected_orders: [],
  selected_products: [],
  selected_prestations: [],
  selected_transactions: [],
  set_selected_clients: (data) => set({ selected_clients: data }),
  set_selected_deliveries: (data) => set({ selected_deliveries: data }),
  set_selected_entries: (data) => set({ selected_entries: data }),
  set_selected_jobs: (data) => set({ selected_jobs: data }),
  set_selected_orders: (data) => set({ selected_orders: data }),
  set_selected_products: (data) => set({ selected_products: data }),
  set_selected_prestations: (data) => set({ selected_prestations: data }),
  set_selected_transactions: (data) => set({ selected_transactions: data }),
}));

/**
 * SELECTED ID SLICE
 */
interface SelectedIdData {
  selected_id: any;
}

interface SelectedIdStore extends SelectedIdData {
  set_selected_id: (data: any) => void;
}

export const useSelectedIdStore = create<SelectedIdStore>((set) => ({
  selected_id: 0,
  set_selected_id: (data) => set({ selected_id: data }),
}));

/**
 * SELECTED ONE SLICE
 */
interface SelectedOneData {
  selected_client?: Client;
  selected_delivery?: Delivery;
  selected_entry?: Entry;
  selected_job?: Job;
  selected_order?: Order;
  selected_product?: Product;
  selected_prestation?: Prestation;
  selected_transaction?: Transaction;
  selected_one?: any;
}

interface SelectedOneStore extends SelectedOneData {
  set_selected_client: (data: Client) => void;
  set_selected_delivery: (data: Delivery) => void;
  set_selected_entry: (data: Entry) => void;
  set_selected_job: (data: Job) => void;
  set_selected_order: (data: Order) => void;
  set_selected_product: (data: Product) => void;
  set_selected_prestation: (data: Prestation) => void;
  set_selected_transaction: (data: Transaction) => void;
  set_selected_one: (data: any) => void;
}

export const useSelectedOneStore = create<SelectedOneStore>((set) => ({
  selected_client: undefined,
  selected_delivery: undefined,
  selected_entry: undefined,
  selected_job: undefined,
  selected_order: undefined,
  selected_product: undefined,
  selected_prestation: undefined,
  selected_transaction: undefined,
  selected_one: undefined,
  set_selected_client: (data) => set({ selected_client: data }),
  set_selected_delivery: (data) => set({ selected_delivery: data }),
  set_selected_entry: (data) => set({ selected_entry: data }),
  set_selected_job: (data) => set({ selected_job: data }),
  set_selected_order: (data) => set({ selected_order: data }),
  set_selected_product: (data) => set({ selected_product: data }),
  set_selected_prestation: (data) => set({ selected_prestation: data }),
  set_selected_transaction: (data) => set({ selected_transaction: data }),
  set_selected_one: (data) => set({ selected_one: data }),
}));

/**
 * REALTIME FUNCTIONNALITY
 */
import { io } from "socket.io-client";

interface RealtimeData {
  connected: boolean;
  messages: string[];
}

interface RealtimeStore extends RealtimeData {
  send_action: (message: string) => void;
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
      .on("reaction", (message) => {
        set({ connected: true, messages: [...get().messages, message] });
      });
  } else set({ connected: false });
  return {
    connected: false,
    messages: [],
    send_action: (message) => ws?.emit("action", message),
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
  warning: (text: string, timeout?: number) => void;
  error: (text: string, timeout?: number) => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  status: NotificationStatus.None,
  text: "",
  success: (text, timeout) => {
    set({
      text,
      status: NotificationStatus.Success,
    });
    setTimeout(() => {
      set({
        text: "",
        status: NotificationStatus.None,
      });
    }, timeout || 10000);
  },
  warning: (text, timeout) => {
    set({
      text,
      status: NotificationStatus.Warning,
    });
    setTimeout(() => {
      set({
        text: "",
        status: NotificationStatus.None,
      });
    }, timeout || 10000);
  },
  error: (text, timeout) => {
    set({
      text,
      status: NotificationStatus.Error,
    });
    setTimeout(() => {
      set({
        text: "",
        status: NotificationStatus.None,
      });
    }, timeout || 10000);
  },
  clear: () => set({ text: "", status: NotificationStatus.None }),
}));

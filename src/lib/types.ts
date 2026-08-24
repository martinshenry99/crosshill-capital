export interface Profile {
  id: string;
  email: string;
  full_name: string;
  country: string;
  phone?: string;
  role: "investor" | "admin";
  status: "active" | "suspended" | "pending";
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  total_invested: number;
  current_value: number;
  total_returns: number;
  returns_percentage: number;
  btc_allocation: number;
  eth_allocation: number;
  usdt_allocation: number;
  other_allocation: number;
  updated_at: string;
}

export interface Deposit {
  id: string;
  user_id: string;
  amount: number;
  currency: "BTC" | "ETH" | "USDT";
  usd_value: number;
  tx_hash?: string;
  wallet_address: string;
  status: "pending" | "confirmed" | "rejected";
  admin_note?: string;
  created_at: string;
  confirmed_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: "deposit" | "withdrawal" | "profit" | "loss" | "fee";
  amount: number;
  currency: string;
  description?: string;
  reference_id?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
}

export interface WalletAddress {
  id: string;
  currency: "BTC" | "ETH" | "USDT";
  address: string;
  network: string;
  is_active: boolean;
  label?: string;
  created_at: string;
}

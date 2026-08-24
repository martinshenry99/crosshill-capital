"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Save } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { WalletAddress } from "@/lib/types";

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState<WalletAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    currency: "BTC" as "BTC" | "ETH" | "USDT",
    address: "",
    network: "",
    label: "",
  });

  useEffect(() => {
    fetchWallets();
  }, []);

  async function fetchWallets() {
    const supabase = createClient();
    const { data } = await supabase
      .from("wallet_addresses")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setWallets(data);
    setLoading(false);
  }

  const addWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    await supabase.from("wallet_addresses").insert({
      currency: formData.currency,
      address: formData.address,
      network: formData.network,
      label: formData.label || null,
      is_active: true,
    });

    setFormData({ currency: "BTC", address: "", network: "", label: "" });
    setShowForm(false);
    fetchWallets();
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    const supabase = createClient();
    await supabase
      .from("wallet_addresses")
      .update({ is_active: !currentState })
      .eq("id", id);
    fetchWallets();
  };

  const deleteWallet = async (id: string) => {
    if (!confirm("Are you sure you want to delete this wallet address?")) return;
    const supabase = createClient();
    await supabase.from("wallet_addresses").delete().eq("id", id);
    fetchWallets();
  };

  const networkOptions: Record<string, string[]> = {
    BTC: ["Bitcoin (BTC)"],
    ETH: ["Ethereum (ERC-20)", "Arbitrum", "Optimism"],
    USDT: ["Ethereum (ERC-20)", "Tron (TRC-20)", "BNB Smart Chain (BEP-20)"],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet Configuration</h1>
          <p className="text-muted">
            Manage receiving wallet addresses for investor deposits
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Wallet
        </Button>
      </div>

      {/* Add Wallet Form */}
      {showForm && (
        <Card>
          <CardContent>
            <CardTitle className="mb-4">Add New Wallet Address</CardTitle>
            <form onSubmit={addWallet} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Currency</label>
                  <select
                    className="w-full h-11 px-4 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currency: e.target.value as "BTC" | "ETH" | "USDT",
                        network: "",
                      })
                    }
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Network</label>
                  <select
                    className="w-full h-11 px-4 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    value={formData.network}
                    onChange={(e) =>
                      setFormData({ ...formData, network: e.target.value })
                    }
                    required
                  >
                    <option value="">Select network</option>
                    {networkOptions[formData.currency]?.map((net) => (
                      <option key={net} value={net}>
                        {net}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Input
                label="Wallet Address"
                placeholder="Enter your receiving wallet address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
              <Input
                label="Label (optional)"
                placeholder="e.g. Main BTC Wallet, Cold Storage"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              />
              <div className="flex gap-3">
                <Button type="submit" variant="accent">
                  <Save className="w-4 h-4 mr-2" />
                  Save Wallet
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Wallets List */}
      <div className="space-y-4">
        {wallets.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-muted text-center py-8">
                No wallet addresses configured yet. Add one above.
              </p>
            </CardContent>
          </Card>
        ) : (
          wallets.map((wallet) => (
            <Card key={wallet.id}>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          wallet.currency === "BTC"
                            ? "bg-orange-100 text-orange-600"
                            : wallet.currency === "ETH"
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {wallet.currency}
                      </span>
                      <span className="text-sm text-muted">{wallet.network}</span>
                      {wallet.label && (
                        <span className="text-sm text-muted">• {wallet.label}</span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          wallet.is_active
                            ? "bg-success/10 text-success"
                            : "bg-muted/10 text-muted"
                        }`}
                      >
                        {wallet.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <code className="text-sm text-foreground break-all">
                      {wallet.address}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant={wallet.is_active ? "ghost" : "success"}
                      onClick={() => toggleActive(wallet.id, wallet.is_active)}
                    >
                      {wallet.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <button
                      onClick={() => deleteWallet(wallet.id)}
                      className="p-2 hover:bg-danger/10 rounded text-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

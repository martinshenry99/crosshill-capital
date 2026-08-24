"use client";

import { useEffect, useState } from "react";
import { Copy, Check, AlertCircle, Clock, Info } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { Deposit } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const WALLET_ADDRESSES = {
  BTC: {
    address: "bc1qft3kedkl5njlskwjntzpg8hapwqrl80z85hxvn",
    network: "Bitcoin (BTC)",
    label: "Bitcoin Network",
  },
  ETH: {
    address: "0x680Cdd102BA2AAC2bF6990bD287B538e592a46D9",
    network: "Ethereum (ERC-20)",
    label: "Ethereum Network",
  },
  USDT: {
    address: "0x680Cdd102BA2AAC2bF6990bD287B538e592a46D9",
    network: "Ethereum (ERC-20)",
    label: "ERC-20 USDT",
  },
};

export default function DepositPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<"BTC" | "ETH" | "USDT">("BTC");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: depositsData } = await supabase
        .from("deposits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (depositsData) setDeposits(depositsData);
      setLoading(false);
    }

    fetchData();
  }, []);

  const activeWallet = WALLET_ADDRESSES[selectedCurrency];

  const copyAddress = () => {
    navigator.clipboard.writeText(activeWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("deposits").insert({
      user_id: user.id,
      amount: parseFloat(amount),
      currency: selectedCurrency,
      tx_hash: txHash || null,
      wallet_address: activeWallet.address,
      status: "pending",
    });

    if (!error) {
      setSuccess(true);
      setAmount("");
      setTxHash("");
      const { data } = await supabase
        .from("deposits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setDeposits(data);
    }

    setSubmitting(false);
    setTimeout(() => setSuccess(false), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Deposit</h1>
        <p className="text-muted text-sm sm:text-base">Send crypto to your investment account</p>
      </div>

      {success && (
        <div className="bg-success/10 border border-success/20 text-success rounded-lg px-4 py-3 text-sm flex items-start gap-2">
          <Check className="w-5 h-5 shrink-0 mt-0.5" />
          <span>Deposit submitted successfully! It will be confirmed by our team within 24 hours.</span>
        </div>
      )}

      {/* Investment Tiers Reminder */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-foreground mb-1">Investment Plans</p>
          <p className="text-muted">
            Regular: min $500 &bull; VIP: min $10,000 &bull; VVIP: min $100,000 (crypto equivalent)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Deposit Form */}
        <Card>
          <CardContent>
            <CardTitle className="mb-6">Make a Deposit</CardTitle>

            {/* Currency Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Currency
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {(["BTC", "ETH", "USDT"] as const).map((currency) => (
                  <button
                    key={currency}
                    type="button"
                    onClick={() => setSelectedCurrency(currency)}
                    className={`py-3 px-3 sm:px-4 rounded-lg border-2 text-center font-medium transition-all cursor-pointer text-sm sm:text-base ${
                      selectedCurrency === currency
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted hover:border-primary/30"
                    }`}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Send {selectedCurrency} to this address
              </label>
              <div className="flex items-center gap-2 bg-background rounded-lg border border-border p-3">
                <code className="flex-1 text-xs sm:text-sm break-all text-foreground">
                  {activeWallet.address}
                </code>
                <button
                  onClick={copyAddress}
                  className="shrink-0 p-2 hover:bg-primary/10 rounded-lg transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <Copy className="w-5 h-5 text-muted" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted mt-2">
                Network: {activeWallet.network} &bull; {activeWallet.label}
              </p>
            </div>

            {/* Deposit Confirmation Form */}
            <form onSubmit={handleSubmitDeposit} className="space-y-4">
              <Input
                label={`Amount (${selectedCurrency})`}
                type="number"
                step="any"
                placeholder={`0.00 ${selectedCurrency}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <Input
                label="Transaction Hash (optional)"
                placeholder="Paste your tx hash for faster confirmation"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Confirm Deposit"}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-warning/5 border border-warning/10 rounded-lg">
              <p className="text-xs text-muted">
                <strong className="text-foreground">Important:</strong> Only send{" "}
                <strong>{selectedCurrency}</strong> on the{" "}
                <strong>{activeWallet.network}</strong> network to the address above.
                Sending any other token or using a wrong network may result in permanent
                loss. Deposits are typically confirmed within 24 hours.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Deposit History */}
        <Card>
          <CardContent>
            <CardTitle className="mb-6">Deposit History</CardTitle>
            {deposits.length === 0 ? (
              <p className="text-muted text-center py-8 text-sm">
                No deposits yet. Make your first deposit to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {deposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                          deposit.status === "confirmed"
                            ? "bg-success/10"
                            : deposit.status === "rejected"
                            ? "bg-danger/10"
                            : "bg-warning/10"
                        }`}
                      >
                        {deposit.status === "confirmed" ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                        ) : deposit.status === "rejected" ? (
                          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-danger" />
                        ) : (
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {deposit.amount} {deposit.currency}
                        </p>
                        <p className="text-xs text-muted">
                          {formatDate(deposit.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          deposit.status === "confirmed"
                            ? "bg-success/10 text-success"
                            : deposit.status === "rejected"
                            ? "bg-danger/10 text-danger"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {deposit.status}
                      </span>
                      {deposit.usd_value > 0 && (
                        <p className="text-xs text-muted mt-1">
                          {formatCurrency(deposit.usd_value)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

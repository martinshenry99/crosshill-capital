"use client";

import { useEffect, useState } from "react";
import { Check, X, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, shortenAddress } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Deposit, Profile } from "@/lib/types";

interface DepositWithUser extends Deposit {
  profiles?: Profile;
}

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<DepositWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [usdValue, setUsdValue] = useState("");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    fetchDeposits();
  }, [filter]);

  async function fetchDeposits() {
    const supabase = createClient();
    let query = supabase
      .from("deposits")
      .select("*, profiles(full_name, email)")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    if (data) setDeposits(data as unknown as DepositWithUser[]);
    setLoading(false);
  }

  const approveDeposit = async (deposit: DepositWithUser) => {
    const supabase = createClient();
    const usdVal = parseFloat(usdValue) || 0;

    // Update deposit status
    await supabase
      .from("deposits")
      .update({
        status: "confirmed",
        usd_value: usdVal,
        admin_note: adminNote || null,
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", deposit.id);

    // Update portfolio
    const { data: portfolio } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", deposit.user_id)
      .single();

    if (portfolio) {
      const newTotalInvested = Number(portfolio.total_invested) + usdVal;
      const newCurrentValue = Number(portfolio.current_value) + usdVal;
      await supabase
        .from("portfolios")
        .update({
          total_invested: newTotalInvested,
          current_value: newCurrentValue,
          total_returns: newCurrentValue - newTotalInvested,
          returns_percentage:
            newTotalInvested > 0
              ? ((newCurrentValue - newTotalInvested) / newTotalInvested) * 100
              : 0,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", deposit.user_id);
    }

    // Create transaction record
    await supabase.from("transactions").insert({
      user_id: deposit.user_id,
      type: "deposit",
      amount: usdVal,
      currency: "USD",
      description: `${deposit.amount} ${deposit.currency} deposit confirmed`,
      reference_id: deposit.id,
    });

    // Send notification
    await supabase.from("notifications").insert({
      user_id: deposit.user_id,
      title: "Deposit Confirmed",
      message: `Your deposit of ${deposit.amount} ${deposit.currency} (${formatCurrency(usdVal)}) has been confirmed.`,
      type: "success",
    });

    setProcessingId(null);
    setUsdValue("");
    setAdminNote("");
    fetchDeposits();
  };

  const rejectDeposit = async (deposit: DepositWithUser) => {
    const supabase = createClient();

    await supabase
      .from("deposits")
      .update({
        status: "rejected",
        admin_note: adminNote || "Deposit rejected",
      })
      .eq("id", deposit.id);

    // Send notification
    await supabase.from("notifications").insert({
      user_id: deposit.user_id,
      title: "Deposit Rejected",
      message: adminNote || "Your deposit could not be verified. Please contact support.",
      type: "error",
    });

    setProcessingId(null);
    setAdminNote("");
    fetchDeposits();
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Deposits</h1>
        <p className="text-muted">Review and approve investor deposits</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["pending", "confirmed", "rejected", "all"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filter === type
                ? "bg-primary text-white"
                : "bg-white border border-border text-muted hover:text-primary"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Deposits List */}
      <div className="space-y-4">
        {deposits.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-muted text-center py-8">
                No {filter !== "all" ? filter : ""} deposits found.
              </p>
            </CardContent>
          </Card>
        ) : (
          deposits.map((deposit) => (
            <Card key={deposit.id}>
              <CardContent>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        deposit.status === "confirmed"
                          ? "bg-success/10"
                          : deposit.status === "rejected"
                          ? "bg-danger/10"
                          : "bg-warning/10"
                      }`}
                    >
                      {deposit.status === "confirmed" ? (
                        <Check className="w-6 h-6 text-success" />
                      ) : deposit.status === "rejected" ? (
                        <X className="w-6 h-6 text-danger" />
                      ) : (
                        <Clock className="w-6 h-6 text-warning" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {deposit.amount} {deposit.currency}
                      </p>
                      <p className="text-sm text-muted">
                        From: {(deposit as any).profiles?.full_name || "Unknown"} ({(deposit as any).profiles?.email})
                      </p>
                      <p className="text-xs text-muted mt-1">
                        {formatDate(deposit.created_at)}
                        {deposit.tx_hash && (
                          <span className="ml-2">
                            TX: {shortenAddress(deposit.tx_hash)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {deposit.status === "pending" && (
                      <>
                        {processingId === deposit.id ? (
                          <div className="flex flex-col gap-2 w-full lg:w-auto">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="USD value"
                              className="px-3 py-2 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              value={usdValue}
                              onChange={(e) => setUsdValue(e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Admin note (optional)"
                              className="px-3 py-2 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                              value={adminNote}
                              onChange={(e) => setAdminNote(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => approveDeposit(deposit)}
                                disabled={!usdValue}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => rejectDeposit(deposit)}
                              >
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setProcessingId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => setProcessingId(deposit.id)}
                          >
                            Process
                          </Button>
                        )}
                      </>
                    )}
                    {deposit.status === "confirmed" && deposit.usd_value > 0 && (
                      <span className="text-sm font-medium text-success">
                        {formatCurrency(deposit.usd_value)}
                      </span>
                    )}
                    {deposit.status === "rejected" && deposit.admin_note && (
                      <span className="text-sm text-danger">
                        {deposit.admin_note}
                      </span>
                    )}
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

"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, ArrowDownUp } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Transaction } from "@/lib/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      let query = supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("type", filter);
      }

      const { data } = await query;
      if (data) setTransactions(data);
      setLoading(false);
    }

    fetchData();
  }, [filter]);

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
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted">Your complete transaction history</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "deposit", "withdrawal", "profit", "loss", "fee"].map((type) => (
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

      <Card>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <ArrowDownUp className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="text-muted">No transactions found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => {
                const isCredit = tx.type === "deposit" || tx.type === "profit";
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-4 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isCredit ? "bg-success/10" : "bg-danger/10"
                        }`}
                      >
                        {isCredit ? (
                          <TrendingUp className="w-5 h-5 text-success" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-danger" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{tx.type}</p>
                        <p className="text-sm text-muted">
                          {tx.description || `${tx.type} transaction`}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {formatDate(tx.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          isCredit ? "text-success" : "text-danger"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                        {formatCurrency(Math.abs(tx.amount))}
                      </p>
                      <p className="text-xs text-muted">{tx.currency}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

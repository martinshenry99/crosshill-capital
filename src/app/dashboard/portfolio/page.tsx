"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Portfolio } from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#f97316", "#6366f1", "#10b981", "#64748b"];

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) setPortfolio(data);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const allocations = [
    { name: "Bitcoin (BTC)", value: portfolio?.btc_allocation || 0, color: COLORS[0] },
    { name: "Ethereum (ETH)", value: portfolio?.eth_allocation || 0, color: COLORS[1] },
    { name: "Tether (USDT)", value: portfolio?.usdt_allocation || 0, color: COLORS[2] },
    { name: "Other", value: portfolio?.other_allocation || 0, color: COLORS[3] },
  ].filter((a) => a.value > 0);

  const hasAllocations = allocations.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
        <p className="text-muted">Your asset allocation and breakdown</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <Card>
          <CardContent>
            <CardTitle className="mb-6">Asset Allocation</CardTitle>
            {hasAllocations ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocations}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {allocations.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Allocation"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center">
                <p className="text-muted text-center">
                  No allocations yet. Your portfolio will be allocated after your first deposit is confirmed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Allocation Details */}
        <Card>
          <CardContent>
            <CardTitle className="mb-6">Breakdown</CardTitle>
            <div className="space-y-4">
              {[
                {
                  name: "Bitcoin (BTC)",
                  allocation: portfolio?.btc_allocation || 0,
                  color: "bg-orange-500",
                },
                {
                  name: "Ethereum (ETH)",
                  allocation: portfolio?.eth_allocation || 0,
                  color: "bg-indigo-500",
                },
                {
                  name: "Tether (USDT)",
                  allocation: portfolio?.usdt_allocation || 0,
                  color: "bg-emerald-500",
                },
                {
                  name: "Other Assets",
                  allocation: portfolio?.other_allocation || 0,
                  color: "bg-slate-500",
                },
              ].map((asset) => (
                <div key={asset.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{asset.name}</span>
                    <span className="text-muted">{asset.allocation}%</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full ${asset.color} rounded-full transition-all`}
                      style={{ width: `${asset.allocation}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted">
                    Value:{" "}
                    {formatCurrency(
                      ((portfolio?.current_value || 0) * asset.allocation) / 100
                    )}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardContent>
          <CardTitle className="mb-4">Portfolio Summary</CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted">Total Invested</p>
              <p className="text-xl font-bold">
                {formatCurrency(portfolio?.total_invested || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">Current Value</p>
              <p className="text-xl font-bold">
                {formatCurrency(portfolio?.current_value || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">Total Returns</p>
              <p className={`text-xl font-bold ${(portfolio?.total_returns || 0) >= 0 ? "text-success" : "text-danger"}`}>
                {formatCurrency(portfolio?.total_returns || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">Last Updated</p>
              <p className="text-xl font-bold">
                {portfolio?.updated_at
                  ? new Date(portfolio.updated_at).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

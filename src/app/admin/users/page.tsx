"use client";

import { useEffect, useState } from "react";
import { Search, Edit, Ban, CheckCircle } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Portfolio } from "@/lib/types";

interface InvestorWithPortfolio extends Profile {
  portfolio?: Portfolio;
}

export default function AdminUsersPage() {
  const [investors, setInvestors] = useState<InvestorWithPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    total_invested: "",
    current_value: "",
    btc_allocation: "",
    eth_allocation: "",
    usdt_allocation: "",
    other_allocation: "",
  });

  useEffect(() => {
    fetchInvestors();
  }, []);

  async function fetchInvestors() {
    const supabase = createClient();
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "investor")
      .order("created_at", { ascending: false });

    if (profiles) {
      const { data: portfolios } = await supabase
        .from("portfolios")
        .select("*");

      const combined = profiles.map((p) => ({
        ...p,
        portfolio: portfolios?.find((port) => port.user_id === p.id),
      }));

      setInvestors(combined);
    }
    setLoading(false);
  }

  const startEditing = (investor: InvestorWithPortfolio) => {
    setEditingUser(investor.id);
    setEditValues({
      total_invested: String(investor.portfolio?.total_invested || 0),
      current_value: String(investor.portfolio?.current_value || 0),
      btc_allocation: String(investor.portfolio?.btc_allocation || 0),
      eth_allocation: String(investor.portfolio?.eth_allocation || 0),
      usdt_allocation: String(investor.portfolio?.usdt_allocation || 0),
      other_allocation: String(investor.portfolio?.other_allocation || 0),
    });
  };

  const savePortfolio = async (userId: string) => {
    const supabase = createClient();
    const totalInvested = parseFloat(editValues.total_invested) || 0;
    const currentValue = parseFloat(editValues.current_value) || 0;
    const totalReturns = currentValue - totalInvested;
    const returnsPercentage =
      totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

    await supabase
      .from("portfolios")
      .update({
        total_invested: totalInvested,
        current_value: currentValue,
        total_returns: totalReturns,
        returns_percentage: returnsPercentage,
        btc_allocation: parseFloat(editValues.btc_allocation) || 0,
        eth_allocation: parseFloat(editValues.eth_allocation) || 0,
        usdt_allocation: parseFloat(editValues.usdt_allocation) || 0,
        other_allocation: parseFloat(editValues.other_allocation) || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    setEditingUser(null);
    fetchInvestors();
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const supabase = createClient();
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    await supabase
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", userId);
    fetchInvestors();
  };

  const filtered = investors.filter(
    (inv) =>
      inv.full_name.toLowerCase().includes(search.toLowerCase()) ||
      inv.email.toLowerCase().includes(search.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-foreground">Manage Investors</h1>
        <p className="text-muted">{investors.length} registered investors</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted">Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted">Email</th>
                <th className="text-left py-3 px-4 font-medium text-muted">Country</th>
                <th className="text-left py-3 px-4 font-medium text-muted">Invested</th>
                <th className="text-left py-3 px-4 font-medium text-muted">Value</th>
                <th className="text-left py-3 px-4 font-medium text-muted">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((investor) => (
                <tr key={investor.id} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium">{investor.full_name}</td>
                  <td className="py-3 px-4 text-muted">{investor.email}</td>
                  <td className="py-3 px-4">{investor.country}</td>
                  <td className="py-3 px-4">
                    {formatCurrency(investor.portfolio?.total_invested || 0)}
                  </td>
                  <td className="py-3 px-4">
                    {formatCurrency(investor.portfolio?.current_value || 0)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        investor.status === "active"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}
                    >
                      {investor.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditing(investor)}
                        className="p-1.5 hover:bg-primary/10 rounded text-primary"
                        title="Edit portfolio"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(investor.id, investor.status)}
                        className={`p-1.5 rounded ${
                          investor.status === "active"
                            ? "hover:bg-danger/10 text-danger"
                            : "hover:bg-success/10 text-success"
                        }`}
                        title={investor.status === "active" ? "Suspend" : "Activate"}
                      >
                        {investor.status === "active" ? (
                          <Ban className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Update Portfolio</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Total Invested ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={editValues.total_invested}
                  onChange={(e) =>
                    setEditValues({ ...editValues, total_invested: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Current Value ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={editValues.current_value}
                  onChange={(e) =>
                    setEditValues({ ...editValues, current_value: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">BTC %</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    value={editValues.btc_allocation}
                    onChange={(e) =>
                      setEditValues({ ...editValues, btc_allocation: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">ETH %</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    value={editValues.eth_allocation}
                    onChange={(e) =>
                      setEditValues({ ...editValues, eth_allocation: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">USDT %</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    value={editValues.usdt_allocation}
                    onChange={(e) =>
                      setEditValues({ ...editValues, usdt_allocation: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Other %</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    value={editValues.other_allocation}
                    onChange={(e) =>
                      setEditValues({ ...editValues, other_allocation: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                className="flex-1"
                onClick={() => savePortfolio(editingUser)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

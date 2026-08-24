"use client";

import { useEffect, useState } from "react";
import { Users, DollarSign, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface AdminStats {
  totalUsers: number;
  totalInvested: number;
  pendingDeposits: number;
  confirmedDeposits: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalInvested: 0,
    pendingDeposits: 0,
    confirmedDeposits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      const [usersRes, portfoliosRes, pendingRes, confirmedRes] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("id", { count: "exact" })
            .eq("role", "investor"),
          supabase.from("portfolios").select("total_invested"),
          supabase
            .from("deposits")
            .select("id", { count: "exact" })
            .eq("status", "pending"),
          supabase
            .from("deposits")
            .select("id", { count: "exact" })
            .eq("status", "confirmed"),
        ]);

      const totalInvested =
        portfoliosRes.data?.reduce((sum, p) => sum + Number(p.total_invested), 0) || 0;

      setStats({
        totalUsers: usersRes.count || 0,
        totalInvested,
        pendingDeposits: pendingRes.count || 0,
        confirmedDeposits: confirmedRes.count || 0,
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

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
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted">Overview of platform activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Total Investors</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Total Invested</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalInvested)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Pending Deposits</p>
                <p className="text-2xl font-bold text-warning">
                  {stats.pendingDeposits}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Confirmed Deposits</p>
                <p className="text-2xl font-bold text-success">
                  {stats.confirmedDeposits}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

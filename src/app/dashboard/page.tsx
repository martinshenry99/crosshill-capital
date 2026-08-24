"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Crown,
  Star,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Portfolio, Transaction } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const performanceData = [
  { month: "Jan", value: 10000 },
  { month: "Feb", value: 10450 },
  { month: "Mar", value: 11200 },
  { month: "Apr", value: 10800 },
  { month: "May", value: 11800 },
  { month: "Jun", value: 12500 },
  { month: "Jul", value: 13100 },
  { month: "Aug", value: 13800 },
];

const investmentPlans = [
  {
    name: "Regular",
    icon: Shield,
    minDeposit: "$500",
    roi: "5% ROI monthly",
    features: [
      "Minimum deposit: $500",
      "5% monthly returns",
      "Standard portfolio management",
      "Monthly performance reports",
      "Email support",
      "BTC, ETH, USDT allocation",
    ],
    color: "border-border",
    iconColor: "text-primary bg-primary/10",
    badge: null,
  },
  {
    name: "VIP",
    icon: Star,
    minDeposit: "$10,000+",
    roi: "8% ROI monthly",
    features: [
      "Minimum deposit: $10,000",
      "8% monthly returns",
      "Priority portfolio management",
      "Weekly performance reports",
      "Priority support",
      "Enhanced allocation strategies",
      "Early access to new assets",
    ],
    color: "border-accent",
    iconColor: "text-accent bg-accent/10",
    badge: "Popular",
  },
  {
    name: "VVIP",
    icon: Crown,
    minDeposit: "$100,000+",
    roi: "10-12% ROI monthly",
    features: [
      "Minimum deposit: $100,000",
      "10% - 12% monthly returns",
      "Dedicated account manager",
      "Daily performance reports",
      "24/7 VIP support",
      "Custom allocation strategies",
      "Exclusive investment opportunities",
      "Priority withdrawals",
    ],
    color: "border-primary",
    iconColor: "text-white bg-primary",
    badge: "Elite",
  },
];

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserName(user.user_metadata?.full_name?.split(" ")[0] || "Investor");

      const [portfolioRes, transactionsRes] = await Promise.all([
        supabase.from("portfolios").select("*").eq("user_id", user.id).single(),
        supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (portfolioRes.data) setPortfolio(portfolioRes.data);
      if (transactionsRes.data) setRecentTransactions(transactionsRes.data);
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

  const totalInvested = portfolio?.total_invested || 0;
  const currentValue = portfolio?.current_value || 0;
  const totalReturns = portfolio?.total_returns || 0;
  const returnsPercentage = portfolio?.returns_percentage || 0;
  const isPositive = totalReturns >= 0;

  const userPlan =
    totalInvested >= 100000
      ? "VVIP"
      : totalInvested >= 10000
      ? "VIP"
      : totalInvested >= 500
      ? "Regular"
      : null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Welcome back, {userName}
        </h1>
        <p className="text-muted text-sm sm:text-base">
          Here&apos;s your portfolio overview.
          {userPlan && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold bg-accent/10 text-accent px-2 py-0.5 rounded-full">
              <Crown className="w-3 h-3" /> {userPlan} Plan
            </span>
          )}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted mb-1">Total Invested</p>
                <p className="text-lg sm:text-2xl font-bold">
                  {formatCurrency(totalInvested)}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted mb-1">Current Value</p>
                <p className="text-lg sm:text-2xl font-bold">
                  {formatCurrency(currentValue)}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted mb-1">Total Returns</p>
                <p className={`text-lg sm:text-2xl font-bold ${isPositive ? "text-success" : "text-danger"}`}>
                  {formatCurrency(totalReturns)}
                </p>
              </div>
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                  isPositive ? "bg-success/10" : "bg-danger/10"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                ) : (
                  <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-danger" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted mb-1">Returns %</p>
                <p className={`text-lg sm:text-2xl font-bold ${isPositive ? "text-success" : "text-danger"}`}>
                  {formatPercentage(returnsPercentage)}
                </p>
              </div>
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                  isPositive ? "bg-success/10" : "bg-danger/10"
                }`}
              >
                <ArrowUpRight className={`w-5 h-5 sm:w-6 sm:h-6 ${isPositive ? "text-success" : "text-danger rotate-90"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Plans */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Investment Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {investmentPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border-2 ${plan.color} bg-white p-5 sm:p-6 hover:shadow-lg transition-shadow`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-primary-dark text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl ${plan.iconColor} flex items-center justify-center mb-4`}>
                <plan.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-accent font-semibold">{plan.minDeposit}</p>
              <p className="text-xs text-success font-bold mb-4">{plan.roi}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <span className="text-primary mt-0.5">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard/deposit">
                <Button
                  variant={plan.name === "VIP" ? "accent" : "default"}
                  size="sm"
                  className="w-full"
                >
                  Invest Now <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardContent>
          <CardTitle className="mb-6">Portfolio Performance</CardTitle>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), "Value"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#166534"
                  strokeWidth={3}
                  dot={{ fill: "#166534", r: 4 }}
                  activeDot={{ r: 6, fill: "#c9a84c" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardContent>
          <CardTitle className="mb-4">Recent Transactions</CardTitle>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted mb-4">
                No transactions yet. Make your first deposit to get started.
              </p>
              <Link href="/dashboard/deposit">
                <Button variant="accent" size="sm">
                  Make a Deposit <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                        tx.type === "deposit" || tx.type === "profit"
                          ? "bg-success/10"
                          : "bg-danger/10"
                      }`}
                    >
                      {tx.type === "deposit" || tx.type === "profit" ? (
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-danger" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm capitalize">{tx.type}</p>
                      <p className="text-xs text-muted hidden sm:block">{tx.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-sm ${
                        tx.type === "deposit" || tx.type === "profit"
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {tx.type === "deposit" || tx.type === "profit" ? "+" : "-"}
                      {formatCurrency(Math.abs(tx.amount))}
                    </p>
                    <p className="text-xs text-muted">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

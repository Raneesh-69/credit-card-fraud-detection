import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import {
  predictTransaction,
  getDemoTransaction,
  getAnalytics,
  analyzeCSV,
} from "./services/api";
const navigation = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "prediction",
    label: "Fraud Analyzer",
    icon: CreditCard,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    id: "model",
    label: "ML Model",
    icon: BrainCircuit,
  },
];

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [history, setHistory] = useState([]);

  const currentPage =
    navigation.find((item) => item.id === activePage) || navigation[0];

  return (
    <div className="min-h-screen bg-[#06080d] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[140px]" />

        <div className="absolute right-[-10%] top-[30%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-[250px] shrink-0 border-r border-white/[0.07] bg-[#080b11]/80 backdrop-blur-xl lg:flex lg:flex-col">
          <Sidebar activePage={activePage} setActivePage={setActivePage} />
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenu && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenu(false)}
            />

            <aside className="relative h-full w-[280px] border-r border-white/[0.08] bg-[#080b11]">
              <Sidebar
                activePage={activePage}
                setActivePage={(page) => {
                  setActivePage(page);
                  setMobileMenu(false);
                }}
              />

              <button
                onClick={() => setMobileMenu(false)}
                className="absolute right-4 top-5 rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[0.07] bg-[#06080d]/75 px-5 backdrop-blur-xl sm:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenu(true)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2.5 text-slate-300 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  AI Security Platform
                </p>

                <h1 className="mt-0.5 text-lg font-semibold tracking-tight">
                  {currentPage.label}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />

                <span className="text-xs font-medium text-emerald-300">
                  API Online
                </span>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <ShieldCheck size={17} className="text-cyan-300" />
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
            {activePage === "dashboard" && (
              <Dashboard history={history} setActivePage={setActivePage} />
            )}

            {activePage === "prediction" && (
              <Prediction history={history} setHistory={setHistory} />
            )}

            {activePage === "analytics" && <Analytics />}

            {activePage === "model" && <Model />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   SIDEBAR
   ============================================================ */

function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-[72px] items-center border-b border-white/[0.07] px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08]">
            <ShieldCheck size={19} className="text-cyan-300" />

            <span className="absolute inset-0 rounded-xl shadow-[0_0_25px_rgba(34,211,238,.12)]" />
          </div>

          <div>
            <div className="text-sm font-bold tracking-tight">
              FRAUD<span className="text-cyan-300">AI</span>
            </div>

            <div className="text-[9px] font-medium uppercase tracking-[0.22em] text-slate-600">
              Risk Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all ${
                  active
                    ? "bg-cyan-400/[0.09] text-cyan-200"
                    : "text-slate-500 hover:bg-white/[0.035] hover:text-slate-200"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    active
                      ? "text-cyan-300"
                      : "text-slate-600 group-hover:text-slate-300"
                  }
                />

                <span>{item.label}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="my-7 h-px bg-white/[0.06]" />

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          System
        </p>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">Model Status</span>

            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.7)]" />
          </div>

          <p className="text-sm font-medium text-slate-200">XGBoost Engine</p>

          <p className="mt-1 text-[11px] text-slate-600">Version 1.0.0</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.07] p-4">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/10 text-cyan-300">
            <Sparkles size={15} />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-300">ML Detection</p>

            <p className="text-[10px] text-slate-600">Real-time analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */

function Dashboard({ history, setActivePage }) {
  const analyzedCount = history.length;

  const fraudCount = history.filter(
    (item) => item.prediction === "Fraud",
  ).length;

  const legitimateCount = history.filter(
    (item) => item.prediction === "Legitimate",
  ).length;

  const highRiskCount = history.filter((item) => item.risk === "HIGH").length;
  const totalAmount = history.reduce(
    (total, item) => total + Number(item.amount || 0),
    0,
  );
  const stats = [
    {
      title: "Total Transactions",
      value: "284,807",
      change: "Dataset",
      icon: CreditCard,
    },
    {
      title: "Fraud Cases",
      value: "492",
      change: "0.17% of transactions",
      icon: AlertTriangle,
    },
    {
      title: "Model Recall",
      value: "85%",
      change: "Fraud detection",
      icon: Activity,
    },
    {
      title: "PR-AUC",
      value: "0.8795",
      change: "XGBoost",
      icon: BrainCircuit,
    },
  ];

  return (
    <div className="space-y-7">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0c121b] via-[#090d14] to-[#071015] p-7 sm:p-9">
        <div className="absolute right-[-80px] top-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-400/[0.07] blur-[90px]" />

        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5">
            <Sparkles size={13} className="text-cyan-300" />

            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-cyan-200">
              AI Risk Intelligence
            </span>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Detect fraud before
            <span className="text-cyan-300"> it becomes a problem.</span>
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Analyze credit card transactions using a trained XGBoost machine
            learning model and identify suspicious transaction patterns in real
            time.
          </p>

          <button
            onClick={() => setActivePage("prediction")}
            className="mt-7 flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#031014] transition hover:bg-cyan-300"
          >
            Analyze Transaction
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>
      {/* LIVE DETECTION MONITOR */}

      <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.02] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.8)]" />

              <h3 className="font-semibold text-slate-100">
                Live Detection Monitor
              </h3>
            </div>

            <p className="mt-1 text-xs text-slate-600">
              Real-time statistics from transactions analyzed in this session.
            </p>
          </div>

          <Activity size={18} className="text-cyan-300" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {/* TOTAL ANALYZED */}
          <div className="rounded-xl border border-white/[0.06] bg-black/10 p-5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
              Total Analyzed
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {analyzedCount}
            </p>

            <p className="mt-1 text-[11px] text-slate-600">
              Transactions analyzed
            </p>
          </div>

          {/* FRAUD DETECTED */}
          <div className="rounded-xl border border-red-400/10 bg-red-400/[0.03] p-5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
              Fraud Detected
            </p>

            <p className="mt-2 text-2xl font-semibold text-red-400">
              {fraudCount}
            </p>

            <p className="mt-1 text-[11px] text-slate-600">
              Suspicious predictions
            </p>
          </div>

          {/* LEGITIMATE */}
          <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.03] p-5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
              Legitimate
            </p>

            <p className="mt-2 text-2xl font-semibold text-emerald-400">
              {legitimateCount}
            </p>

            <p className="mt-1 text-[11px] text-slate-600">Safe predictions</p>
          </div>

          {/* HIGH RISK */}
          <div className="rounded-xl border border-amber-400/10 bg-amber-400/[0.03] p-5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
              High Risk
            </p>

            <p className="mt-2 text-2xl font-semibold text-amber-400">
              {highRiskCount}
            </p>

            <p className="mt-1 text-[11px] text-slate-600">
              Requires attention
            </p>
          </div>
          {/* TOTAL AMOUNT */}
          <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
              Total Amount
            </p>

            <p className="mt-2 text-2xl font-semibold text-cyan-300">
              ₹
              {totalAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>

            <p className="mt-1 text-[11px] text-slate-600">
              Transaction value analyzed
            </p>
          </div>
        </div>
      </section>
      {/* FRAUD DETECTION TREND + SESSION SUMMARY */}

      <section className="grid gap-5 xl:grid-cols-3">
        {/* Fraud Detection Trend */}
        <div className="xl:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-100">
                Fraud Detection Trend
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Detection probability across analyzed transactions.
              </p>
            </div>

            <Activity size={18} className="text-cyan-300" />
          </div>

          <div className="h-[280px]">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[...history].reverse().map((item, index) => ({
                    name: index + 1,
                    probability: Number(item.probability || 0) * 100,
                  }))}
                >
                  <defs>
                    <linearGradient
                      id="fraudGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#22d3ee"
                        stopOpacity={0.35}
                      />

                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                    tickFormatter={(value) => `${value}%`}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#07111a",
                      border: "1px solid rgba(34,211,238,0.15)",
                      borderRadius: "12px",
                      color: "#e2e8f0",
                    }}
                    formatter={(value) => [
                      `${Number(value).toFixed(2)}%`,
                      "Fraud Probability",
                    ]}
                    labelFormatter={(label) => `Transaction ${label}`}
                  />

                  <Area
                    type="monotone"
                    dataKey="probability"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    fill="url(#fraudGradient)"
                    dot={{
                      r: 3,
                      fill: "#22d3ee",
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 5,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Activity size={28} className="mx-auto mb-3 text-slate-700" />

                  <p className="text-sm text-slate-500">
                    No detection data yet
                  </p>

                  <p className="mt-1 text-xs text-slate-700">
                    Analyze transactions to populate the chart.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Session Summary */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-slate-100">Session Summary</h3>

            <p className="mt-1 text-xs text-slate-600">
              Current detection session overview.
            </p>
          </div>

          <div className="space-y-6">
            {/* Fraud Rate */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Fraud Detection Rate
                </span>

                <span className="text-sm font-semibold text-red-400">
                  {analyzedCount > 0
                    ? ((fraudCount / analyzedCount) * 100).toFixed(1)
                    : "0.0"}
                  %
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full bg-red-400 transition-all duration-500"
                  style={{
                    width: `${
                      analyzedCount > 0 ? (fraudCount / analyzedCount) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Legitimate Rate */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">Legitimate Rate</span>

                <span className="text-sm font-semibold text-emerald-400">
                  {analyzedCount > 0
                    ? ((legitimateCount / analyzedCount) * 100).toFixed(1)
                    : "0.0"}
                  %
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{
                    width: `${
                      analyzedCount > 0
                        ? (legitimateCount / analyzedCount) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* High Risk Rate */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">High Risk Rate</span>

                <span className="text-sm font-semibold text-amber-400">
                  {analyzedCount > 0
                    ? ((highRiskCount / analyzedCount) * 100).toFixed(1)
                    : "0.0"}
                  %
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{
                    width: `${
                      analyzedCount > 0
                        ? (highRiskCount / analyzedCount) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lower dashboard */}
      {/* Lower dashboard */}
      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-100">
                Detection Overview
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Dataset transaction distribution
              </p>
            </div>

            <BarChart3 size={18} className="text-slate-600" />
          </div>

          <div className="flex h-[220px] items-end gap-2">
            {[
              30, 48, 42, 65, 54, 72, 60, 82, 69, 91, 75, 88, 67, 94, 80, 100,
            ].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-md bg-cyan-400/20 transition hover:bg-cyan-400/40"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <div className="mt-4 flex justify-between text-[10px] text-slate-600">
            <span>Transaction activity</span>
            <span>Latest</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-slate-100">Model Health</h3>

            <p className="mt-1 text-xs text-slate-600">
              Current XGBoost performance
            </p>
          </div>

          <Metric label="ROC-AUC" value="98.26%" />
          <Metric label="PR-AUC" value="87.95%" />
          <Metric label="Precision" value="86%" />
          <Metric label="Recall" value="85%" />

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-3">
            <ShieldCheck size={16} className="text-emerald-400" />

            <span className="text-xs text-emerald-300">Model operational</span>
          </div>
        </div>
      </section>
      {/* RECENT DETECTIONS */}

      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-100">Recent Detections</h3>

            <p className="mt-1 text-xs text-slate-600">
              Latest transactions analyzed by the XGBoost engine.
            </p>
          </div>

          <span className="rounded-full border border-white/[0.07] px-3 py-1 text-[10px] text-slate-500">
            {history.length} TOTAL
          </span>
        </div>

        {history.length === 0 ? (
          <div className="rounded-xl border border-white/[0.05] bg-black/10 py-10 text-center">
            <ShieldCheck size={28} className="mx-auto text-slate-700" />

            <p className="mt-3 text-sm text-slate-500">No detections yet.</p>

            <p className="mt-1 text-xs text-slate-700">
              Analyze a transaction to see it here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-slate-600">
                  <th className="px-3 py-3">Time</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Prediction</th>
                  <th className="px-3 py-3">Probability</th>
                  <th className="px-3 py-3">Risk</th>
                </tr>
              </thead>

              <tbody>
                {history.slice(0, 5).map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                  >
                    <td className="px-3 py-4 text-xs text-slate-500">
                      {item.time}
                    </td>

                    <td className="px-3 py-4 text-sm font-medium text-slate-200">
                      ₹{Number(item.amount).toFixed(2)}
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={
                          item.prediction === "Fraud"
                            ? "text-xs font-medium text-red-400"
                            : "text-xs font-medium text-emerald-400"
                        }
                      >
                        {item.prediction}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-xs text-slate-400">
                      {(Number(item.probability) * 100).toFixed(2)}%
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={
                          item.risk === "HIGH"
                            ? "text-xs font-medium text-red-400"
                            : item.risk === "MEDIUM"
                              ? "text-xs font-medium text-amber-400"
                              : "text-xs font-medium text-emerald-400"
                        }
                      >
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */

function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:border-cyan-400/15 hover:bg-white/[0.03]">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
          <Icon size={18} className="text-cyan-300" />
        </div>

        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
          ML
        </span>
      </div>

      <p className="mt-5 text-xs text-slate-500">{title}</p>

      <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-600">{change}</p>
    </div>
  );
}

/* ============================================================
   METRIC
   ============================================================ */

function Metric({ label, value }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex justify-between">
        <span className="text-xs text-slate-500">{label}</span>

        <span className="text-xs font-semibold text-slate-200">{value}</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-cyan-400/70"
          style={{
            width: value,
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   PREDICTION
   ============================================================ */
function Prediction({ history, setHistory }) {
  const [amount, setAmount] = useState(100);
  const [time, setTime] = useState(0);

  const [features, setFeatures] = useState(
    Object.fromEntries(Array.from({ length: 28 }, (_, i) => [`V${i + 1}`, 0])),
  );

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [csvResult, setCsvResult] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState("");
  const updateFeature = (name, value) => {
    setFeatures((previous) => ({
      ...previous,
      [name]: Number(value),
    }));
  };

  const analyzeTransaction = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const transaction = {
        Time: Number(time),

        V1: Number(features.V1),
        V2: Number(features.V2),
        V3: Number(features.V3),
        V4: Number(features.V4),
        V5: Number(features.V5),
        V6: Number(features.V6),
        V7: Number(features.V7),
        V8: Number(features.V8),
        V9: Number(features.V9),
        V10: Number(features.V10),
        V11: Number(features.V11),
        V12: Number(features.V12),
        V13: Number(features.V13),
        V14: Number(features.V14),
        V15: Number(features.V15),
        V16: Number(features.V16),
        V17: Number(features.V17),
        V18: Number(features.V18),
        V19: Number(features.V19),
        V20: Number(features.V20),
        V21: Number(features.V21),
        V22: Number(features.V22),
        V23: Number(features.V23),
        V24: Number(features.V24),
        V25: Number(features.V25),
        V26: Number(features.V26),
        V27: Number(features.V27),
        V28: Number(features.V28),

        Amount: Number(amount),
      };
      const data = await predictTransaction(transaction);

      setResult(data);

      setHistory((previous) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          amount: transaction.Amount,
          prediction: data.fraud ? "Fraud" : "Legitimate",
          probability: Number(data.fraud_probability),
          risk: data.risk,
        },
        ...previous,
      ]);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the ML backend. Make sure FastAPI is running on port 8000.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAnalyzer = () => {
    setAmount(100);
    setTime(0);

    setFeatures(
      Object.fromEntries(
        Array.from({ length: 28 }, (_, i) => [`V${i + 1}`, 0]),
      ),
    );

    setResult(null);
    setError("");
  };
  const loadDemoTransaction = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const demo = await getDemoTransaction();

      setAmount(demo.Amount);
      setTime(demo.Time);

      const newFeatures = {};

      for (let i = 1; i <= 28; i++) {
        newFeatures[`V${i}`] = demo[`V${i}`];
      }

      setFeatures(newFeatures);

      const prediction = await predictTransaction({
        Time: demo.Time,

        ...newFeatures,

        Amount: demo.Amount,
      });
      setResult({
        ...prediction,
        actual_class: demo.actual_class,
      });

      setHistory((previous) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          amount: demo.Amount,
          prediction: prediction.fraud ? "Fraud" : "Legitimate",
          probability: Number(prediction.fraud_probability),
          risk: prediction.risk,
          actualClass: demo.actual_class,
        },
        ...previous,
      ]);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load demo transaction. Make sure FastAPI is running.",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleCSVAnalysis = async () => {
    if (!csvFile) {
      setCsvError("Please select a CSV file first.");
      return;
    }

    try {
      setCsvLoading(true);
      setCsvError("");
      setCsvResult(null);

      const data = await analyzeCSV(csvFile);

      setCsvResult(data);
    } catch (error) {
      console.error("CSV analysis error:", error);

      setCsvError(
        error.response?.data?.detail ||
          "Unable to analyze CSV. Make sure FastAPI is running.",
      );
    } finally {
      setCsvLoading(false);
    }
  };
  return (
    <div className="space-y-7">
      {/* PAGE HEADER */}
      <section>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
          <Sparkles size={13} />
          Real-time machine learning
        </div>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Transaction Risk Analyzer
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Submit transaction features to the XGBoost fraud detection engine and
          receive a real-time risk assessment.
        </p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
        {/* =====================================================
            INPUT PANEL
        ===================================================== */}

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <div className="mb-7 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.07]">
                <CreditCard size={19} className="text-cyan-300" />
              </div>

              <div>
                <h3 className="font-semibold">Transaction Input</h3>

                <p className="text-xs text-slate-600">
                  Enter transaction characteristics
                </p>
              </div>
            </div>
            <button
              onClick={loadDemoTransaction}
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04] hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles size={16} />
              Load Demo Transaction
            </button>
            <button
              onClick={resetAnalyzer}
              className="text-xs text-slate-600 transition hover:text-slate-300"
            >
              Reset
            </button>
          </div>

          {/* BASIC FEATURES */}

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Transaction Amount"
              prefix="₹"
              type="number"
              value={amount}
              onChange={(value) => setAmount(value)}
              placeholder="100"
            />

            <InputField
              label="Transaction Time"
              type="number"
              value={time}
              onChange={(value) => setTime(value)}
              placeholder="0"
            />
          </div>

          {/* ADVANCED FEATURES */}

          <div className="mt-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-300">
                  PCA Feature Vector
                </h4>

                <p className="mt-1 text-[11px] text-slate-600">
                  V1–V28 are anonymized features from the original fraud
                  detection dataset.
                </p>
              </div>

              <span className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[10px] text-slate-600">
                28 FEATURES
              </span>
            </div>

            <div className="grid max-h-[360px] gap-3 overflow-y-auto pr-2 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(features).map((feature) => (
                <div key={feature}>
                  <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
                    {feature}
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={features[feature]}
                    onChange={(event) =>
                      updateFeature(feature, event.target.value)
                    }
                    className="w-full rounded-xl border border-white/[0.07] bg-black/20 px-3 py-2.5 text-xs text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:bg-cyan-400/[0.02]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ANALYZE BUTTON */}

          <button
            onClick={analyzeTransaction}
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-[#031014] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#031014]/30 border-t-[#031014]" />
                Analyzing Transaction...
              </>
            ) : (
              <>
                <BrainCircuit size={17} />
                Analyze Transaction
              </>
            )}
          </button>

          {/* ERROR */}

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-400/10 bg-red-400/[0.04] p-4">
              <AlertTriangle
                size={17}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <p className="text-xs leading-5 text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* =====================================================
            RESULT PANEL
        ===================================================== */}

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <div className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              AI Risk Assessment
            </p>

            <h3 className="mt-2 font-semibold">Detection Result</h3>
          </div>

          {!result ? (
            <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025]">
                <div className="absolute inset-2 rounded-full border border-dashed border-white/[0.06]" />

                <ShieldCheck size={38} className="text-slate-700" />
              </div>

              <h4 className="mt-6 font-semibold text-slate-300">
                Awaiting analysis
              </h4>

              <p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">
                Configure the transaction features and run the XGBoost model to
                generate a risk assessment.
              </p>
            </div>
          ) : (
            <PredictionResult result={result} />
          )}
        </div>
      </div>

      {/* DETECTION HISTORY */}
      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-100">Detection History</h3>

            <p className="mt-1 text-xs text-slate-600">
              Recent transactions analyzed by XGBoost.
            </p>
          </div>

          <span className="rounded-full border border-white/[0.07] px-3 py-1 text-[10px] text-slate-500">
            {history.length} DETECTIONS
          </span>
        </div>

        {history.length === 0 ? (
          <div className="rounded-xl border border-white/[0.05] bg-black/10 py-10 text-center">
            <ShieldCheck size={28} className="mx-auto text-slate-700" />

            <p className="mt-3 text-sm text-slate-500">
              No transactions analyzed yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-slate-600">
                  <th className="px-3 py-3">Time</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Prediction</th>
                  <th className="px-3 py-3">Probability</th>
                  <th className="px-3 py-3">Risk</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                  >
                    <td className="px-3 py-4 text-xs text-slate-500">
                      {item.time}
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-200">
                      ₹{Number(item.amount).toFixed(2)}
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={
                          item.prediction === "Fraud"
                            ? "text-xs font-medium text-red-400"
                            : "text-xs font-medium text-emerald-400"
                        }
                      >
                        {item.prediction}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-xs text-slate-400">
                      {item.probability.toFixed(4)}%
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={
                          item.risk === "HIGH"
                            ? "text-xs font-medium text-red-400"
                            : item.risk === "MEDIUM"
                              ? "text-xs font-medium text-amber-400"
                              : "text-xs font-medium text-emerald-400"
                        }
                      >
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {/* DATASET ANALYZER */}

      <section className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/[0.06]">
                <BarChart3 size={16} className="text-cyan-300" />
              </div>

              <h3 className="font-semibold text-slate-100">Dataset Analyzer</h3>
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-600">
              Upload a supported fraud dataset to analyze its existing
              transaction labels and statistics.
            </p>
          </div>
        </div>

        {/* DATASET DOWNLOADS */}

        <div className="mb-6">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-slate-600">
            Sample Datasets
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="/sample-data/User0_credit_card_transactions.csv"
              download
              className="group rounded-xl border border-white/[0.06] bg-black/10 p-4 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.03]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    User0 Transactions
                  </p>

                  <p className="mt-1 text-[11px] text-slate-600">
                    19,963 transactions
                  </p>
                </div>

                <span className="text-xs text-cyan-300 transition group-hover:translate-y-0.5">
                  ↓ CSV
                </span>
              </div>
            </a>

            <a
              href="/sample-data/CC_FRAUD.csv"
              download
              className="group rounded-xl border border-white/[0.06] bg-black/10 p-4 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.03]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    CC Fraud Dataset
                  </p>

                  <p className="mt-1 text-[11px] text-slate-600">
                    94,682 transactions
                  </p>
                </div>

                <span className="text-xs text-cyan-300 transition group-hover:translate-y-0.5">
                  ↓ CSV
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* UPLOAD */}

        <div className="rounded-xl border border-dashed border-white/[0.10] bg-black/10 p-6 text-center transition hover:border-cyan-400/20">
          <input
            id="csv-upload"
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              setCsvFile(file || null);
              setCsvResult(null);
              setCsvError("");
            }}
          />

          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05]">
              <CreditCard size={22} className="text-cyan-300" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-200">
              {csvFile ? csvFile.name : "Choose a CSV file"}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Supported datasets: User0 Transactions and CC Fraud
            </p>
          </label>

          {csvFile && (
            <button
              onClick={handleCSVAnalysis}
              disabled={csvLoading}
              className="mt-5 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#031014] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {csvLoading ? "Analyzing Dataset..." : "Analyze Dataset"}
            </button>
          )}
        </div>

        {/* ERROR */}

        {csvError && (
          <div className="mt-4 rounded-xl border border-red-400/10 bg-red-400/[0.03] px-4 py-3 text-sm text-red-400">
            {csvError}
          </div>
        )}

        {/* RESULTS */}

        {csvResult && (
          <div className="mt-6">
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-100">
                {csvResult.dataset}
              </p>

              <p className="mt-1 text-xs text-slate-600">
                {csvResult.filename}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {/* TOTAL */}

              <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Total Transactions
                </p>

                <p className="mt-2 text-xl font-semibold text-white">
                  {Number(csvResult.total_transactions).toLocaleString("en-IN")}
                </p>
              </div>

              {/* FRAUD */}

              <div className="rounded-xl border border-red-400/10 bg-red-400/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Fraud
                </p>

                <p className="mt-2 text-xl font-semibold text-red-400">
                  {Number(csvResult.fraud_count).toLocaleString("en-IN")}
                </p>
              </div>

              {/* LEGITIMATE */}

              <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Legitimate
                </p>

                <p className="mt-2 text-xl font-semibold text-emerald-400">
                  {Number(csvResult.legitimate_count).toLocaleString("en-IN")}
                </p>
              </div>

              {/* FRAUD RATE */}

              <div className="rounded-xl border border-amber-400/10 bg-amber-400/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Fraud Rate
                </p>

                <p className="mt-2 text-xl font-semibold text-amber-400">
                  {Number(csvResult.fraud_rate).toFixed(2)}%
                </p>
              </div>
            </div>

            {/* AMOUNT STATISTICS */}

            {csvResult.total_amount !== null && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Total Transaction Amount
                  </p>

                  <p className="mt-2 text-lg font-semibold text-cyan-300">
                    ₹
                    {Number(csvResult.total_amount).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Average Transaction
                  </p>

                  <p className="mt-2 text-lg font-semibold text-slate-200">
                    ₹
                    {Number(csvResult.average_amount).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function InputField({
  label,
  prefix,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-slate-500">
        {label}
      </label>

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">
            {prefix}
          </span>
        )}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-xl border border-white/[0.07] bg-black/20 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:bg-cyan-400/[0.02] ${
            prefix ? "pl-8 pr-3" : "px-3"
          }`}
        />
      </div>
    </div>
  );
}
function PredictionResult({ result }) {
  const probability = Number(result.fraud_probability || 0);

  const isFraud = result.fraud;
  const risk = result.risk;

  const riskColor =
    risk === "HIGH"
      ? "text-red-400"
      : risk === "MEDIUM"
        ? "text-amber-400"
        : "text-emerald-400";

  const riskBackground =
    risk === "HIGH"
      ? "bg-red-400/[0.06] border-red-400/15"
      : risk === "MEDIUM"
        ? "bg-amber-400/[0.06] border-amber-400/15"
        : "bg-emerald-400/[0.06] border-emerald-400/15";

  const circumference = 2 * Math.PI * 52;

  const offset =
    circumference - (Math.min(probability, 100) / 100) * circumference;

  return (
    <div className="flex min-h-[430px] flex-col items-center">
      {/* GAUGE */}

      <div className="relative mt-5 h-44 w-44">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-white/[0.05]"
          />

          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className={riskColor}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 900ms ease",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tracking-tight">
            {probability.toFixed(4)}%
          </span>

          <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-600">
            Fraud Probability
          </span>
        </div>
      </div>

      {/* RESULT */}

      <div
        className={`mt-5 rounded-2xl border px-7 py-4 text-center ${riskBackground}`}
      >
        <div className={`text-lg font-bold tracking-wide ${riskColor}`}>
          {isFraud ? "FRAUD DETECTED" : "LEGITIMATE TRANSACTION"}
        </div>

        <div className={`mt-1 text-xs font-medium ${riskColor}`}>
          {risk} RISK
        </div>
      </div>

      {/* DETAILS */}

      <div className="mt-7 grid w-full grid-cols-2 gap-3">
        <ResultStat
          label="Prediction"
          value={isFraud ? "Fraud" : "Legitimate"}
        />

        <ResultStat label="Risk Level" value={risk} />
      </div>

      {/* MODEL */}

      <div className="mt-5 flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-black/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <BrainCircuit size={15} className="text-cyan-300" />

          <span className="text-xs text-slate-500">Detection Engine</span>
        </div>

        <span className="text-xs font-medium text-slate-300">XGBoost</span>
      </div>
    </div>
  );
}
function ResultStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/10 p-4">
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-200">{value}</p>
    </div>
  );
}
/* ============================================================
   ANALYTICS
   ============================================================ */
function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const result = await getAnalytics();

        setData(result);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load model analytics. Make sure FastAPI is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-500">
            Loading model analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-6">
        <p className="text-sm text-red-300">
          {error || "Analytics unavailable."}
        </p>
      </div>
    );
  }

  const metrics = data.metrics;
  const dataset = data.dataset;
  const matrix = data.confusion_matrix;

  const rocData = data.roc_curve.map((point) => ({
    fpr: point.fpr,
    tpr: point.tpr,
  }));

  const prData = data.precision_recall_curve.map((point) => ({
    recall: point.recall,
    precision: point.precision,
  }));

  const modelData = Object.entries(data.model_comparison).map(
    ([name, values]) => ({
      name:
        name === "Logistic Regression"
          ? "Logistic"
          : name === "Random Forest"
            ? "Random Forest"
            : "XGBoost",

      rocAuc: Number(values.roc_auc),
      prAuc: Number(values.pr_auc),
    }),
  );

  return (
    <div className="space-y-7">
      {/* HEADER */}

      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
          Data intelligence
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Fraud Analytics
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Real evaluation metrics generated from the trained {data.model} fraud
          detection model.
        </p>
      </section>

      {/* METRICS */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsMetric
          title="ROC-AUC"
          value={`${(metrics.roc_auc * 100).toFixed(2)}%`}
          description="Ranking performance"
        />

        <AnalyticsMetric
          title="PR-AUC"
          value={`${(metrics.pr_auc * 100).toFixed(2)}%`}
          description="Imbalanced classification"
        />

        <AnalyticsMetric
          title="Precision"
          value={`${(metrics.precision * 100).toFixed(1)}%`}
          description="Fraud predictions"
        />

        <AnalyticsMetric
          title="Recall"
          value={`${(metrics.recall * 100).toFixed(1)}%`}
          description="Fraud detected"
        />
      </section>

      {/* DATASET */}

      <section className="grid gap-4 sm:grid-cols-3">
        <DatasetCard
          title="Total Transactions"
          value={dataset.total_transactions}
        />

        <DatasetCard
          title="Legitimate"
          value={dataset.legitimate_transactions}
        />

        <DatasetCard title="Fraudulent" value={dataset.fraud_transactions} />
      </section>

      {/* DISTRIBUTION */}

      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <div className="mb-6">
          <h3 className="font-semibold">Transaction Distribution</h3>

          <p className="mt-1 text-xs text-slate-600">
            Class imbalance within the complete dataset.
          </p>
        </div>

        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                {
                  name: "Transactions",
                  legitimate: dataset.legitimate_transactions,
                  fraud: dataset.fraud_transactions,
                },
              ]}
              layout="vertical"
              margin={{
                left: 0,
                right: 20,
              }}
            >
              <XAxis type="number" hide />

              <YAxis type="category" dataKey="name" hide />

              <Tooltip
                contentStyle={{
                  background: "#0b1018",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />

              <Bar
                dataKey="legitimate"
                stackId="a"
                fill="#22d3ee"
                radius={[8, 0, 0, 8]}
              />

              <Bar
                dataKey="fraud"
                stackId="a"
                fill="#f87171"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-5 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Legitimate
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            Fraud
          </div>
        </div>
      </section>

      {/* ROC + PR */}

      <section className="grid gap-5 xl:grid-cols-2">
        {/* ROC */}

        <ChartCard
          title="ROC Curve"
          description="True positive rate vs false positive rate"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rocData}>
              <CartesianGrid stroke="rgba(255,255,255,.05)" />

              <XAxis
                dataKey="fpr"
                tickFormatter={(value) => value.toFixed(1)}
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                dataKey="tpr"
                tickFormatter={(value) => value.toFixed(1)}
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "#0b1018",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: "12px",
                  fontSize: "11px",
                }}
              />

              <Line
                type="monotone"
                dataKey="tpr"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* PR */}

        <ChartCard
          title="Precision–Recall Curve"
          description="Precision vs recall for fraud detection"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={prData}>
              <CartesianGrid stroke="rgba(255,255,255,.05)" />

              <XAxis
                dataKey="recall"
                tickFormatter={(value) => value.toFixed(1)}
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                dataKey="precision"
                tickFormatter={(value) => value.toFixed(1)}
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "#0b1018",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: "12px",
                  fontSize: "11px",
                }}
              />

              <Line
                type="monotone"
                dataKey="precision"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* MODEL COMPARISON */}

      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <div className="mb-6">
          <h3 className="font-semibold">Model Comparison</h3>

          <p className="mt-1 text-xs text-slate-600">
            Performance comparison using the same test set.
          </p>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={modelData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false} />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "#64748b",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0.7, 1]}
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "#0b1018",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: "12px",
                  fontSize: "11px",
                }}
              />

              <Bar
                dataKey="rocAuc"
                name="ROC-AUC"
                fill="#22d3ee"
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="prAuc"
                name="PR-AUC"
                fill="#a78bfa"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* CONFUSION MATRIX */}

      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <div className="mb-6">
          <h3 className="font-semibold">Confusion Matrix</h3>

          <p className="mt-1 text-xs text-slate-600">
            Predictions on the held-out test set.
          </p>
        </div>

        <div className="mx-auto grid max-w-[600px] grid-cols-2 gap-3">
          <MatrixCell
            title="True Negative"
            value={matrix.true_negative}
            type="correct"
          />

          <MatrixCell
            title="False Positive"
            value={matrix.false_positive}
            type="warning"
          />

          <MatrixCell
            title="False Negative"
            value={matrix.false_negative}
            type="danger"
          />

          <MatrixCell
            title="True Positive"
            value={matrix.true_positive}
            type="correct"
          />
        </div>
      </section>
    </div>
  );
}
function ChartCard({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
      <div className="mb-5">
        <h3 className="font-semibold">{title}</h3>

        <p className="mt-1 text-xs text-slate-600">{description}</p>
      </div>

      <div className="h-[300px]">{children}</div>
    </div>
  );
}
function AnalyticsMetric({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <p className="text-xs text-slate-500">{title}</p>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-600">{description}</p>
    </div>
  );
}

function DatasetCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
      <p className="text-xs text-slate-500">{title}</p>

      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function MatrixCell({ title, value, type }) {
  const styles = {
    correct: "border-emerald-400/10 bg-emerald-400/[0.04] text-emerald-300",

    warning: "border-amber-400/10 bg-amber-400/[0.04] text-amber-300",

    danger: "border-red-400/10 bg-red-400/[0.04] text-red-300",
  };

  return (
    <div className={`rounded-2xl border p-6 text-center ${styles[type]}`}>
      <p className="text-[10px] uppercase tracking-wider opacity-60">{title}</p>

      <p className="mt-2 text-2xl font-semibold">{value.toLocaleString()}</p>
    </div>
  );
}
function AnalyticsCard({ title, value, percentage }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-3 text-3xl font-semibold">{value}</p>

      <p className="mt-2 text-xs text-slate-600">{percentage} of dataset</p>
    </div>
  );
}

/* ============================================================
   MODEL
   ============================================================ */

function Model() {
  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
          Machine learning
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          XGBoost Model
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Performance metrics from the trained fraud detection model.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="ROC-AUC"
          value="0.9826"
          change="Excellent separation"
          icon={Activity}
        />

        <StatCard
          title="PR-AUC"
          value="0.8795"
          change="Imbalanced metric"
          icon={BarChart3}
        />

        <StatCard
          title="Precision"
          value="86%"
          change="Fraud predictions"
          icon={ShieldCheck}
        />

        <StatCard
          title="Recall"
          value="85%"
          change="Fraud detected"
          icon={AlertTriangle}
        />
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
        <h3 className="font-semibold">Model Architecture</h3>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {[
            "Transaction Input",
            "StandardScaler",
            "XGBoost",
            "Risk Prediction",
          ].map((item, index) => (
            <div key={item} className="flex items-center gap-3">
              <div className="flex-1 rounded-xl border border-white/[0.07] bg-black/10 p-4">
                <p className="text-xs text-slate-500">Step {index + 1}</p>

                <p className="mt-1 text-sm font-medium">{item}</p>
              </div>

              {index < 3 && (
                <ChevronRight
                  size={16}
                  className="hidden text-slate-700 md:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

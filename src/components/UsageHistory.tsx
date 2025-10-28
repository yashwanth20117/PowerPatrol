import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingDown, TrendingUp, Calendar, BarChart3, ArrowUpRight, ArrowDownRight, BarChart2 } from 'lucide-react';
import { MonthlyUsage, PriceSlab } from '../App';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UsageHistoryProps {
  monthlyHistory: MonthlyUsage[];
  priceSlabs: PriceSlab[];
}

export function UsageHistory({ monthlyHistory, priceSlabs }: UsageHistoryProps) {
  // Show empty state if no history
  if (monthlyHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
          <BarChart2 className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-xl text-slate-300 mb-2">No Usage History Yet</h3>
        <p className="text-slate-400 mb-6 max-w-sm">
          Your monthly usage data will appear here once you start recording your electricity bills.
        </p>
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 text-left space-y-2 max-w-sm">
          <p className="text-sm text-slate-300">💡 Tip:</p>
          <p className="text-sm text-slate-400">
            Track your appliance usage on the Devices tab to estimate your monthly consumption and costs.
          </p>
        </div>
      </div>
    );
  }

  // Calculate trends
  const latestMonth = monthlyHistory[monthlyHistory.length - 1];
  const previousMonth = monthlyHistory[monthlyHistory.length - 2];
  
  const unitChange = latestMonth && previousMonth 
    ? ((latestMonth.units - previousMonth.units) / previousMonth.units) * 100 
    : 0;
  
  const costChange = latestMonth && previousMonth 
    ? ((latestMonth.cost - previousMonth.cost) / previousMonth.cost) * 100 
    : 0;

  const avgUnits = monthlyHistory.length > 0 ? monthlyHistory.reduce((sum, m) => sum + m.units, 0) / monthlyHistory.length : 0;
  const avgCost = monthlyHistory.length > 0 ? monthlyHistory.reduce((sum, m) => sum + m.cost, 0) / monthlyHistory.length : 0;

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="w-4 h-4" />;
    return <ArrowDownRight className="w-4 h-4" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-red-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Monthly Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-slate-400">Units Usage</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl text-slate-100">{latestMonth?.units || 0}</p>
                {previousMonth && (
                  <span className={`flex items-center text-sm ${getTrendColor(unitChange)}`}>
                    {getTrendIcon(unitChange)}
                    {Math.abs(unitChange).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400">Cost</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl text-slate-100">₹{latestMonth?.cost || 0}</p>
                {previousMonth && (
                  <span className={`flex items-center text-sm ${getTrendColor(costChange)}`}>
                    {getTrendIcon(costChange)}
                    {Math.abs(costChange).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              6-Month Average
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-slate-400">Avg. Units/Month</p>
              <p className="text-2xl text-slate-100">{avgUnits.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Avg. Cost/Month</p>
              <p className="text-2xl text-slate-100">₹{avgCost.toFixed(0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Chart */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Energy Usage Trend</CardTitle>
          <CardDescription className="text-slate-400 text-sm">Last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend 
                  wrapperStyle={{ color: '#94a3b8' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="units" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Units (kWh)"
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cost Chart */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Cost Comparison</CardTitle>
          <CardDescription className="text-slate-400 text-sm">Last 6 months bills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(value: number) => `₹${value}`}
                />
                <Legend 
                  wrapperStyle={{ color: '#94a3b8' }}
                />
                <Bar 
                  dataKey="cost" 
                  fill="#3b82f6" 
                  name="Cost (₹)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Details - Mobile Optimized */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Monthly Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {monthlyHistory.map((month, index) => {
              const prevMonth = index > 0 ? monthlyHistory[index - 1] : null;
              const change = prevMonth 
                ? ((month.cost - prevMonth.cost) / prevMonth.cost) * 100 
                : 0;
              const costPerUnit = month.cost / month.units;

              return (
                <div key={month.month} className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-slate-100">{month.month}</p>
                      <p className="text-xs text-slate-400">₹{costPerUnit.toFixed(2)}/unit</p>
                    </div>
                    {prevMonth && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${change > 0 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}
                      >
                        {change > 0 ? '+' : ''}{change.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Units</p>
                      <p className="text-slate-200">{month.units} kWh</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Cost</p>
                      <p className="text-slate-200">₹{month.cost}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-100">
            💡 Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-green-100">
          {unitChange < 0 && (
            <p className="flex items-start gap-2">
              <span className="text-green-400 shrink-0">✓</span>
              Great job! You've reduced your usage by {Math.abs(unitChange).toFixed(1)}% compared to last month.
            </p>
          )}
          {latestMonth && latestMonth.units > avgUnits && (
            <p className="flex items-start gap-2">
              <span className="text-yellow-400 shrink-0">⚠</span>
              Your current usage is {((latestMonth.units / avgUnits - 1) * 100).toFixed(0)}% higher than your 6-month average.
            </p>
          )}
          {latestMonth && latestMonth.units < avgUnits && (
            <p className="flex items-start gap-2">
              <span className="text-green-400 shrink-0">✓</span>
              You're using {((1 - latestMonth.units / avgUnits) * 100).toFixed(0)}% less than your 6-month average!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
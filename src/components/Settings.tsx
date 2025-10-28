import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Moon, Sun, Settings as SettingsIcon, Plane, AlertTriangle } from 'lucide-react';

interface SettingsProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  vacationMode: boolean;
  onVacationModeChange: (enabled: boolean) => void;
  dailyLimit: number;
  monthlyLimit: number;
  onDailyLimitChange: (limit: number) => void;
  onMonthlyLimitChange: (limit: number) => void;
}

export function Settings({
  theme,
  onThemeChange,
  vacationMode,
  onVacationModeChange,
  dailyLimit,
  monthlyLimit,
  onDailyLimitChange,
  onMonthlyLimitChange,
}: SettingsProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-slate-100" />
            <span className="text-slate-100">App Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-200">Theme</Label>
              <p className="text-xs text-slate-400">Switch between light and dark mode</p>
            </div>
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-slate-400" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-500" />
              )}
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
              />
            </div>
          </div>

          {/* Vacation Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-200 flex items-center gap-2">
                <Plane className="w-4 h-4 text-blue-400" />
                Vacation Mode
              </Label>
              <p className="text-xs text-slate-400">Reduce usage estimates while away</p>
            </div>
            <Switch
              checked={vacationMode}
              onCheckedChange={onVacationModeChange}
            />
          </div>

          {vacationMode && (
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3">
              <p className="text-xs text-blue-300">
                ✈️ Vacation mode active. Device usage reduced by 80% in calculations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Limits */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <span className="text-slate-100">Usage Limits</span>
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Get alerts when you exceed these limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="daily-limit" className="text-slate-200">Daily Limit (Units)</Label>
            <Input
              id="daily-limit"
              type="number"
              value={dailyLimit}
              onChange={(e) => onDailyLimitChange(Number(e.target.value))}
              className="mt-2"
              min="0"
              step="1"
            />
            <p className="text-xs text-slate-400 mt-1">
              Alert when daily usage exceeds this limit
            </p>
          </div>

          <div>
            <Label htmlFor="monthly-limit" className="text-slate-200">Monthly Limit (Units)</Label>
            <Input
              id="monthly-limit"
              type="number"
              value={monthlyLimit}
              onChange={(e) => onMonthlyLimitChange(Number(e.target.value))}
              className="mt-2"
              min="0"
              step="10"
            />
            <p className="text-xs text-slate-400 mt-1">
              Alert when monthly usage exceeds this limit
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4">
        <p className="text-xs text-slate-400 text-center leading-relaxed">
          ⚠️ <span className="text-slate-300">Disclaimer:</span> Estimates are approximate and may vary based on actual usage and local rates. PowerPatrol provides indicative calculations only.
        </p>
      </div>
    </div>
  );
}

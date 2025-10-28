import { useState, useEffect } from 'react';
import { ApplianceTracker } from './components/ApplianceTracker';
import { UsageSummary } from './components/UsageSummary';
import { EcoTips } from './components/EcoTips';
import { UsageHistory } from './components/UsageHistory';
import { Settings } from './components/Settings';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Alert, AlertDescription } from './components/ui/alert';
import { Zap, Power, TrendingUp, Leaf, Settings as SettingsIcon, AlertTriangle, X } from 'lucide-react';
import { Button } from './components/ui/button';

export interface Appliance {
  id: string;
  name: string;
  category: string;
  wattage: number;
  hoursPerDay: number;
  isOn: boolean;
  usageType?: 'regular' | 'occasional' | 'seasonal';
  seasonalMonths?: string[]; // e.g., ['Dec', 'Jan', 'Feb'] for winter
}

export interface PriceSlab {
  id: string;
  from: number;
  to: number | null; // null means unlimited
  rate: number;
}

export interface MonthlyUsage {
  month: string; // e.g., "Oct 2024"
  units: number;
  cost: number;
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [vacationMode, setVacationMode] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(20); // units
  const [monthlyLimit, setMonthlyLimit] = useState(500); // units
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());

  const [appliances, setAppliances] = useState<Appliance[]>([
    {
      id: '1',
      name: 'LED TV',
      category: 'Entertainment',
      wattage: 80,
      hoursPerDay: 5,
      isOn: true,
      usageType: 'regular',
    },
    {
      id: '2',
      name: 'Ceiling Fan',
      category: 'Cooling',
      wattage: 75,
      hoursPerDay: 8,
      isOn: true,
      usageType: 'regular',
    },
  ]);

  const [priceSlabs, setPriceSlabs] = useState<PriceSlab[]>([
    { id: '1', from: 0, to: 100, rate: 3 },
    { id: '2', from: 101, to: 200, rate: 5 },
    { id: '3', from: 201, to: 400, rate: 7 },
    { id: '4', from: 401, to: null, rate: 9 },
  ]);

  // Historical usage data (last 6 months)
  const [monthlyHistory, setMonthlyHistory] = useState<MonthlyUsage[]>([]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const addAppliance = (appliance: Omit<Appliance, 'id'>) => {
    const newAppliance = {
      ...appliance,
      id: Date.now().toString(),
    };
    setAppliances([...appliances, newAppliance]);
  };

  const updateAppliance = (id: string, updates: Partial<Appliance>) => {
    setAppliances(appliances.map(app => 
      app.id === id ? { ...app, ...updates } : app
    ));
  };

  const deleteAppliance = (id: string) => {
    setAppliances(appliances.filter(app => app.id !== id));
  };

  const toggleAppliance = (id: string) => {
    setAppliances(appliances.map(app =>
      app.id === id ? { ...app, isOn: !app.isOn } : app
    ));
  };

  // Calculate current usage for warnings
  const calculateCurrentUsage = () => {
    const activeAppliances = appliances.filter(app => app.isOn);
    const vacationMultiplier = vacationMode ? 0.2 : 1; // 80% reduction in vacation mode
    
    const dailyUnits = activeAppliances.reduce((total, app) => {
      let hours = app.hoursPerDay;
      
      // Occasional usage: average 2 days per month = ~6.7% of time
      if (app.usageType === 'occasional') {
        hours = hours * (2 / 30);
      }
      
      // Seasonal usage: check if current month matches
      if (app.usageType === 'seasonal' && app.seasonalMonths) {
        const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
        if (!app.seasonalMonths.includes(currentMonth)) {
          hours = 0; // Not in season
        }
      }
      
      return total + (app.wattage * hours * vacationMultiplier) / 1000;
    }, 0);

    return {
      daily: dailyUnits,
      monthly: dailyUnits * 30,
    };
  };

  const currentUsage = calculateCurrentUsage();
  const dailyWarning = currentUsage.daily > dailyLimit && !dismissedWarnings.has('daily');
  const monthlyWarning = currentUsage.monthly > monthlyLimit && !dismissedWarnings.has('monthly');

  const dismissWarning = (type: string) => {
    setDismissedWarnings(new Set(dismissedWarnings).add(type));
  };

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-950 via-green-950 to-emerald-950' 
        : 'bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50'
    }`}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className={`sticky top-0 z-10 backdrop-blur-sm border-b ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-slate-950 to-slate-950/95 border-slate-800' 
            : 'bg-gradient-to-b from-white to-white/95 border-gray-200'
        }`}>
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-900/50">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>PowerPatrol</h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-green-100' : 'text-gray-700'}`}>Energy Saver Assistant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Warnings */}
        {(dailyWarning || monthlyWarning) && (
          <div className="px-4 pt-4 space-y-2">
            {dailyWarning && (
              <Alert className="bg-orange-900/20 border-orange-800/50">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <AlertDescription className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-orange-100">
                      <strong>Daily limit exceeded!</strong>
                    </p>
                    <p className="text-xs text-orange-200 mt-1">
                      Current: {currentUsage.daily.toFixed(1)} units | Limit: {dailyLimit} units
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-orange-400 hover:text-orange-300"
                    onClick={() => dismissWarning('daily')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {monthlyWarning && (
              <Alert className="bg-red-900/20 border-red-800/50">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <AlertDescription className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-red-100">
                      <strong>Monthly limit projected to exceed!</strong>
                    </p>
                    <p className="text-xs text-red-200 mt-1">
                      Projected: {currentUsage.monthly.toFixed(0)} units | Limit: {monthlyLimit} units
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-red-400 hover:text-red-300"
                    onClick={() => dismissWarning('monthly')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="pb-20">
          <Tabs defaultValue="home" className="w-full">
            <TabsContent value="home" className="mt-0 space-y-4 p-4">
              <UsageSummary 
                appliances={appliances} 
                priceSlabs={priceSlabs}
                onPriceSlabsChange={setPriceSlabs}
                vacationMode={vacationMode}
                theme={theme}
              />
            </TabsContent>

            <TabsContent value="tracker" className="mt-0 p-4">
              <ApplianceTracker
                appliances={appliances}
                onAddAppliance={addAppliance}
                onUpdateAppliance={updateAppliance}
                onDeleteAppliance={deleteAppliance}
                onToggleAppliance={toggleAppliance}
                theme={theme}
              />
            </TabsContent>

            <TabsContent value="history" className="mt-0 p-4">
              <UsageHistory 
                monthlyHistory={monthlyHistory}
                priceSlabs={priceSlabs}
                theme={theme}
              />
            </TabsContent>

            <TabsContent value="tips" className="mt-0 p-4">
              <EcoTips appliances={appliances} theme={theme} />
            </TabsContent>

            <TabsContent value="settings" className="mt-0 p-4">
              <Settings
                theme={theme}
                onThemeChange={setTheme}
                vacationMode={vacationMode}
                onVacationModeChange={setVacationMode}
                dailyLimit={dailyLimit}
                monthlyLimit={monthlyLimit}
                onDailyLimitChange={setDailyLimit}
                onMonthlyLimitChange={setMonthlyLimit}
              />
            </TabsContent>

            {/* Bottom Navigation */}
            <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t ${
              theme === 'dark' 
                ? 'bg-slate-950/95 border-slate-800' 
                : 'bg-white/95 border-gray-200'
            }`}>
              <TabsList className="grid w-full grid-cols-5 h-16 bg-transparent border-0 rounded-none">
                <TabsTrigger value="home" className={`flex-col gap-1 ${
                  theme === 'dark'
                    ? 'data-[state=active]:bg-slate-800 data-[state=active]:text-green-400'
                    : 'data-[state=active]:bg-gray-100 data-[state=active]:text-green-600'
                }`}>
                  <Zap className="w-5 h-5" />
                  <span className="text-xs">Home</span>
                </TabsTrigger>
                <TabsTrigger value="tracker" className={`flex-col gap-1 ${
                  theme === 'dark'
                    ? 'data-[state=active]:bg-slate-800 data-[state=active]:text-green-400'
                    : 'data-[state=active]:bg-gray-100 data-[state=active]:text-green-600'
                }`}>
                  <Power className="w-5 h-5" />
                  <span className="text-xs">Devices</span>
                </TabsTrigger>
                <TabsTrigger value="history" className={`flex-col gap-1 ${
                  theme === 'dark'
                    ? 'data-[state=active]:bg-slate-800 data-[state=active]:text-green-400'
                    : 'data-[state=active]:bg-gray-100 data-[state=active]:text-green-600'
                }`}>
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-xs">History</span>
                </TabsTrigger>
                <TabsTrigger value="tips" className={`flex-col gap-1 ${
                  theme === 'dark'
                    ? 'data-[state=active]:bg-slate-800 data-[state=active]:text-green-400'
                    : 'data-[state=active]:bg-gray-100 data-[state=active]:text-green-600'
                }`}>
                  <Leaf className="w-5 h-5" />
                  <span className="text-xs">Tips</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className={`flex-col gap-1 ${
                  theme === 'dark'
                    ? 'data-[state=active]:bg-slate-800 data-[state=active]:text-green-400'
                    : 'data-[state=active]:bg-gray-100 data-[state=active]:text-green-600'
                }`}>
                  <SettingsIcon className="w-5 h-5" />
                  <span className="text-xs">Settings</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
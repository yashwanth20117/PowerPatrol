import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { IndianRupee, Zap, TrendingUp, Calendar, Settings, Plus, Trash2, Edit } from 'lucide-react';
import { Appliance, PriceSlab } from '../App';

interface UsageSummaryProps {
  appliances: Appliance[];
  priceSlabs: PriceSlab[];
  onPriceSlabsChange: (slabs: PriceSlab[]) => void;
  vacationMode: boolean;
  theme: 'light' | 'dark';
}

export function UsageSummary({ appliances, priceSlabs, onPriceSlabsChange, vacationMode, theme }: UsageSummaryProps) {
  const [isSlabDialogOpen, setIsSlabDialogOpen] = useState(false);
  const [editingSlabs, setEditingSlabs] = useState<PriceSlab[]>([...priceSlabs]);

  // Calculate only for appliances that are ON
  const activeAppliances = appliances.filter(app => app.isOn);
  const vacationMultiplier = vacationMode ? 0.2 : 1; // 80% reduction in vacation mode
  
  // Daily consumption in kWh (units)
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

  // Monthly units only (removed yearly)
  const monthlyUnits = dailyUnits * 30;

  // Calculate cost based on slabs
  const calculateSlabCost = (units: number): number => {
    let cost = 0;
    let remainingUnits = units;
    
    // Sort slabs by 'from' value
    const sortedSlabs = [...priceSlabs].sort((a, b) => a.from - b.from);
    
    for (const slab of sortedSlabs) {
      if (remainingUnits <= 0) break;
      
      const slabStart = slab.from;
      const slabEnd = slab.to === null ? Infinity : slab.to;
      const slabSize = slabEnd - slabStart + 1;
      
      // Calculate how many units fall in this slab
      const unitsInThisSlab = Math.min(remainingUnits, slabSize);
      
      if (units >= slabStart) {
        const applicableUnits = slab.to === null 
          ? remainingUnits 
          : Math.min(remainingUnits, Math.max(0, slabEnd - Math.max(slabStart - 1, units - remainingUnits)));
        
        if (applicableUnits > 0) {
          cost += applicableUnits * slab.rate;
          remainingUnits -= applicableUnits;
        }
      }
    }
    
    return cost;
  };

  // Costs with ₹20 buffer added for realistic estimates
  const BUFFER_AMOUNT = 20;
  const dailyCost = calculateSlabCost(dailyUnits) + (BUFFER_AMOUNT / 30);
  const monthlyCost = calculateSlabCost(monthlyUnits) + BUFFER_AMOUNT;

  // Average household usage for comparison (units/day)
  const avgHouseholdDaily = 15; // ~450 units/month (typical Indian household)
  const usagePercentage = (dailyUnits / avgHouseholdDaily) * 100;

  const getUsageStatus = () => {
    if (usagePercentage < 50) return { color: 'text-green-600', text: 'Excellent!' };
    if (usagePercentage < 80) return { color: 'text-yellow-600', text: 'Good' };
    if (usagePercentage < 100) return { color: 'text-orange-600', text: 'Above Average' };
    return { color: 'text-red-600', text: 'High Usage' };
  };

  const status = getUsageStatus();

  const handleAddSlab = () => {
    const lastSlab = editingSlabs[editingSlabs.length - 1];
    const newFrom = lastSlab && lastSlab.to !== null ? lastSlab.to + 1 : 0;
    
    setEditingSlabs([
      ...editingSlabs.map(slab => ({ ...slab, to: slab.to })),
      {
        id: Date.now().toString(),
        from: newFrom,
        to: newFrom + 99,
        rate: 5,
      }
    ]);
  };

  const handleUpdateSlab = (id: string, field: keyof PriceSlab, value: any) => {
    setEditingSlabs(editingSlabs.map(slab => 
      slab.id === id ? { ...slab, [field]: value } : slab
    ));
  };

  const handleDeleteSlab = (id: string) => {
    if (editingSlabs.length > 1) {
      setEditingSlabs(editingSlabs.filter(slab => slab.id !== id));
    }
  };

  const handleSaveSlabs = () => {
    onPriceSlabsChange(editingSlabs);
    setIsSlabDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setEditingSlabs([...priceSlabs]);
    setIsSlabDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Current Usage - Hero Card */}
      <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-800/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div>
              <p className="text-sm text-green-100 mb-1">Today's Energy Usage</p>
              <p className="text-5xl text-white">{dailyUnits.toFixed(1)}</p>
              <p className="text-lg text-green-100">Units</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-800/50">
              <div>
                <p className="text-xs text-green-100">Daily Cost</p>
                <p className="text-2xl text-white">₹{dailyCost.toFixed(0)}</p>
              </div>
              <div>
                <p className="text-xs text-green-100">Monthly Est.</p>
                <p className="text-2xl text-white">₹{monthlyCost.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl text-white">{appliances.length}</p>
            <p className="text-xs text-slate-200 mt-1">Devices</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl text-green-400">{activeAppliances.length}</p>
            <p className="text-xs text-slate-200 mt-1">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl text-white">{activeAppliances.reduce((sum, app) => sum + app.wattage, 0)}</p>
            <p className="text-xs text-slate-200 mt-1">Watts</p>
          </CardContent>
        </Card>
      </div>

      {/* Energy Rate Setting */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-white">Electricity Tariff</CardTitle>
            <Drawer open={isSlabDialogOpen} onOpenChange={setIsSlabDialogOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleOpenDialog}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-slate-900 border-slate-700 max-h-[90vh]">
                <DrawerHeader>
                  <DrawerTitle className="text-white">Configure Price Slabs</DrawerTitle>
                  <DrawerDescription className="text-slate-300">
                    Set up your electricity pricing tiers
                  </DrawerDescription>
                </DrawerHeader>
                <div className="overflow-y-auto px-4 pb-8">
                
                <div className="space-y-4">
                  {editingSlabs.map((slab, index) => (
                    <div key={slab.id} className="flex items-end gap-2 p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs text-slate-100">From (Units)</Label>
                          <Input
                            type="number"
                            value={slab.from}
                            onChange={(e) => handleUpdateSlab(slab.id, 'from', parseInt(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-100">To (Units)</Label>
                          <Input
                            type="number"
                            value={slab.to ?? ''}
                            onChange={(e) => handleUpdateSlab(slab.id, 'to', e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="Unlimited"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-100">Rate (₹/unit)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={slab.rate}
                            onChange={(e) => handleUpdateSlab(slab.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSlab(slab.id)}
                        disabled={editingSlabs.length === 1}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button variant="outline" onClick={handleAddSlab} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Slab
                  </Button>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsSlabDialogOpen(false)} className="flex-1 h-12">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveSlabs} className="flex-1 bg-green-600 hover:bg-green-700 h-12">
                      Save Slabs
                    </Button>
                  </div>
                </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-slate-100 text-sm">Current Tariff Slabs</Label>
            <div className="space-y-1">
              {priceSlabs.slice(0, 2).map((slab, index) => (
                <div key={slab.id} className="text-xs p-2 bg-slate-800/50 rounded flex justify-between">
                  <span className="text-slate-200">
                    {slab.from} - {slab.to === null ? '∞' : slab.to} units
                  </span>
                  <span className="text-white">₹{slab.rate}/unit</span>
                </div>
              ))}
              {priceSlabs.length > 2 && (
                <p className="text-xs text-slate-300 text-center pt-1">+{priceSlabs.length - 2} more slabs</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Status */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-100">Usage Status</span>
              <span className={`text-sm ${status.color}`}>{status.text}</span>
            </div>
            <Progress value={Math.min(usagePercentage, 100)} className="h-2" />
            <p className="text-xs text-slate-200 text-center">
              {usagePercentage.toFixed(0)}% of average household
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Projected Costs */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-white">Monthly Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div>
              <p className="text-xs text-slate-200">Estimated Monthly Bill</p>
              <p className="text-xl text-white">₹{monthlyCost.toFixed(0)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-200">{monthlyUnits.toFixed(0)} units</p>
              <p className="text-xs text-green-400 mt-1">+₹{BUFFER_AMOUNT} buffer</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

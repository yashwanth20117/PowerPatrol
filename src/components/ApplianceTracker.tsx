import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Trash2, Plus, Power, Tv, Fan, Lightbulb, Laptop, Wind, Flame, Calendar, Clock } from 'lucide-react';
import { Appliance } from '../App';

interface ApplianceTrackerProps {
  appliances: Appliance[];
  onAddAppliance: (appliance: Omit<Appliance, 'id'>) => void;
  onUpdateAppliance: (id: string, updates: Partial<Appliance>) => void;
  onDeleteAppliance: (id: string) => void;
  onToggleAppliance: (id: string) => void;
  theme: 'light' | 'dark';
}

const APPLIANCE_PRESETS = [
  { name: 'LED Bulb', category: 'Lighting', wattage: 10, avgHours: 5, usageType: 'regular' as const },
  { name: 'Incandescent Bulb', category: 'Lighting', wattage: 60, avgHours: 4, usageType: 'regular' as const },
  { name: 'Tube Light', category: 'Lighting', wattage: 40, avgHours: 6, usageType: 'regular' as const },
  { name: 'LED TV', category: 'Entertainment', wattage: 80, avgHours: 5, usageType: 'regular' as const },
  { name: 'LCD TV', category: 'Entertainment', wattage: 150, avgHours: 4, usageType: 'regular' as const },
  { name: 'Ceiling Fan', category: 'Cooling', wattage: 75, avgHours: 8, usageType: 'regular' as const },
  { name: 'Table Fan', category: 'Cooling', wattage: 50, avgHours: 6, usageType: 'regular' as const },
  { name: 'Laptop', category: 'Electronics', wattage: 50, avgHours: 6, usageType: 'regular' as const },
  { name: 'Desktop Computer', category: 'Electronics', wattage: 200, avgHours: 5, usageType: 'regular' as const },
  { name: 'Phone Charger', category: 'Electronics', wattage: 5, avgHours: 3, usageType: 'regular' as const },
  { name: 'Refrigerator', category: 'Appliances', wattage: 150, avgHours: 24, usageType: 'regular' as const },
  { name: 'Washing Machine', category: 'Appliances', wattage: 500, avgHours: 1, usageType: 'regular' as const },
  { name: 'Air Conditioner', category: 'Cooling', wattage: 1500, avgHours: 6, usageType: 'seasonal' as const, seasonalMonths: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] },
  { name: 'Room Heater', category: 'Appliances', wattage: 2000, avgHours: 4, usageType: 'seasonal' as const, seasonalMonths: ['Dec', 'Jan', 'Feb'] },
  { name: 'Microwave', category: 'Appliances', wattage: 1000, avgHours: 0.5, usageType: 'regular' as const },
  { name: 'Water Heater (Geyser)', category: 'Appliances', wattage: 2000, avgHours: 1, usageType: 'seasonal' as const, seasonalMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'] },
  { name: 'Iron Box', category: 'Appliances', wattage: 1000, avgHours: 0.5, usageType: 'occasional' as const },
  { name: 'Vacuum Cleaner', category: 'Appliances', wattage: 1400, avgHours: 0.5, usageType: 'occasional' as const },
  { name: 'Mixer Grinder', category: 'Appliances', wattage: 500, avgHours: 0.5, usageType: 'regular' as const },
  { name: 'Water Pump', category: 'Appliances', wattage: 750, avgHours: 1, usageType: 'regular' as const },
];

const CATEGORY_ICONS: Record<string, any> = {
  Lighting: Lightbulb,
  Entertainment: Tv,
  Cooling: Wind,
  Electronics: Laptop,
  Appliances: Flame,
};

export function ApplianceTracker({ 
  appliances, 
  onAddAppliance, 
  onUpdateAppliance, 
  onDeleteAppliance,
  onToggleAppliance,
  theme 
}: ApplianceTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    wattage: '',
    hoursPerDay: '',
    usageType: 'regular' as 'regular' | 'occasional' | 'seasonal',
    seasonalMonths: [] as string[],
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handlePresetSelect = (preset: typeof APPLIANCE_PRESETS[0]) => {
    setFormData({
      name: preset.name,
      category: preset.category,
      wattage: preset.wattage.toString(),
      hoursPerDay: preset.avgHours.toString(),
      usageType: preset.usageType,
      seasonalMonths: preset.seasonalMonths || [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.category && formData.wattage && formData.hoursPerDay) {
      onAddAppliance({
        name: formData.name,
        category: formData.category,
        wattage: parseFloat(formData.wattage),
        hoursPerDay: parseFloat(formData.hoursPerDay),
        isOn: true,
        usageType: formData.usageType,
        seasonalMonths: formData.usageType === 'seasonal' ? formData.seasonalMonths : undefined,
      });
      setFormData({ 
        name: '', 
        category: '', 
        wattage: '', 
        hoursPerDay: '', 
        usageType: 'regular',
        seasonalMonths: [],
      });
      setIsDialogOpen(false);
    }
  };

  const toggleSeasonalMonth = (month: string) => {
    if (formData.seasonalMonths.includes(month)) {
      setFormData({
        ...formData,
        seasonalMonths: formData.seasonalMonths.filter(m => m !== month),
      });
    } else {
      setFormData({
        ...formData,
        seasonalMonths: [...formData.seasonalMonths, month],
      });
    }
  };

  const getUsageTypeBadge = (appliance: Appliance) => {
    if (appliance.usageType === 'occasional') {
      return <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 text-xs ml-1"><Clock className="w-3 h-3 mr-1" />Occasional</Badge>;
    }
    if (appliance.usageType === 'seasonal') {
      return <Badge variant="secondary" className="bg-blue-900/50 text-blue-300 text-xs ml-1"><Calendar className="w-3 h-3 mr-1" />Seasonal</Badge>;
    }
    return null;
  };

  const getCategoryIcon = (category: string) => {
    const Icon = CATEGORY_ICONS[category] || Power;
    return <Icon className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Lighting: 'bg-yellow-100 text-yellow-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Cooling: 'bg-blue-100 text-blue-800',
      Electronics: 'bg-green-100 text-green-800',
      Appliances: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DrawerTrigger asChild>
          <Button className="w-full bg-green-600 hover:bg-green-700 h-12">
            <Plus className="w-5 h-5 mr-2" />
            Add New Device
          </Button>
        </DrawerTrigger>
        <DrawerContent className={`border-slate-700 max-h-[90vh] ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
          <DrawerHeader>
            <DrawerTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Add New Appliance</DrawerTitle>
            <DrawerDescription className={theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}>
              Choose a preset or enter custom details
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-8">
            <div className="space-y-6">
              {/* Presets */}
              <div>
                <Label className={theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}>Quick Add (Presets with Average Usage)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {APPLIANCE_PRESETS.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-3 border-slate-700"
                      onClick={() => handlePresetSelect(preset)}
                    >
                      <div className="text-left w-full">
                        <div className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{preset.name}</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                          {preset.wattage}W • {preset.avgHours}h/day
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className={theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}>Appliance Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Living Room TV"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className={theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lighting">Lighting</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Cooling">Cooling</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Appliances">Appliances</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wattage" className={theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}>Power (Watts)</Label>
                    <Input
                      id="wattage"
                      type="number"
                      value={formData.wattage}
                      onChange={(e) => setFormData({ ...formData, wattage: e.target.value })}
                      placeholder="100"
                      min="1"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hours" className={theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}>Hours/Day</Label>
                    <Input
                      id="hours"
                      type="number"
                      step="0.5"
                      value={formData.hoursPerDay}
                      onChange={(e) => setFormData({ ...formData, hoursPerDay: e.target.value })}
                      placeholder="4"
                      min="0"
                      max="24"
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Usage Type */}
                <div>
                  <Label htmlFor="usageType" className={theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}>Usage Pattern</Label>
                  <Select 
                    value={formData.usageType} 
                    onValueChange={(value: 'regular' | 'occasional' | 'seasonal') => 
                      setFormData({ ...formData, usageType: value, seasonalMonths: [] })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select usage type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular (Daily Use)</SelectItem>
                      <SelectItem value="occasional">Occasional (1-2 days/month)</SelectItem>
                      <SelectItem value="seasonal">Seasonal (Specific Months)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>
                    {formData.usageType === 'regular' && 'Used every day'}
                    {formData.usageType === 'occasional' && 'Used only 1-2 days per month'}
                    {formData.usageType === 'seasonal' && 'Used only during specific months'}
                  </p>
                </div>

                {/* Seasonal Months Selection */}
                {formData.usageType === 'seasonal' && (
                  <div>
                    <Label className={theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}>Active Months</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {months.map((month) => (
                        <div key={month} className="flex items-center space-x-2">
                          <Checkbox
                            id={month}
                            checked={formData.seasonalMonths.includes(month)}
                            onCheckedChange={() => toggleSeasonalMonth(month)}
                          />
                          <label
                            htmlFor={month}
                            className={`text-xs cursor-pointer ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}
                          >
                            {month}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12">
                  Add Appliance
                </Button>
              </form>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Appliances List */}
      <Card className={theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Devices</CardTitle>
          <CardDescription className={`text-sm ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>Tap to toggle on/off</CardDescription>
        </CardHeader>
        <CardContent>
          {appliances.length === 0 ? (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-slate-200' : 'text-gray-600'}`}>
              <Power className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No appliances added yet.</p>
              <p className="text-sm">Click "Add New Device" to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appliances.map((appliance) => (
                <div
                  key={appliance.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    appliance.isOn 
                      ? theme === 'dark'
                        ? 'bg-slate-800/50 border-green-700'
                        : 'bg-green-50 border-green-600'
                      : theme === 'dark'
                        ? 'bg-slate-900/30 border-slate-700 opacity-60'
                        : 'bg-gray-50 border-gray-300 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className={theme === 'dark' ? 'text-slate-100 mb-1' : 'text-gray-900 mb-1'}>{appliance.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className={`${getCategoryColor(appliance.category)} text-xs`}>
                            <span className="mr-1">{getCategoryIcon(appliance.category)}</span>
                            {appliance.category}
                          </Badge>
                          {getUsageTypeBadge(appliance)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`switch-${appliance.id}`}
                          checked={appliance.isOn}
                          onCheckedChange={() => onToggleAppliance(appliance.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteAppliance(appliance.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-950/50 h-9 w-9"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className={`text-center p-2 rounded ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'}`}>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>Power</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{appliance.wattage}W</p>
                      </div>
                      <div className={`text-center p-2 rounded ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'}`}>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>Usage</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{appliance.hoursPerDay}h</p>
                      </div>
                      <div className={`text-center p-2 rounded ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'}`}>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-200' : 'text-gray-700'}`}>Daily</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {((appliance.wattage * appliance.hoursPerDay) / 1000).toFixed(1)}
                        </p>
                      </div>
                    </div>
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

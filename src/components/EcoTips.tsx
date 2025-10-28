import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Lightbulb, 
  Leaf, 
  TrendingDown, 
  Clock, 
  ThermometerSun,
  Unplug,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Appliance } from '../App';

interface EcoTipsProps {
  appliances: Appliance[];
}

export function EcoTips({ appliances }: EcoTipsProps) {
  // Generate personalized tips based on user's appliances
  const generatePersonalizedTips = () => {
    const tips = [];

    // Check for old lighting
    const incandescentBulbs = appliances.filter(app => 
      app.name.toLowerCase().includes('incandescent')
    );
    if (incandescentBulbs.length > 0) {
      const savings = incandescentBulbs.reduce((sum, bulb) => sum + (bulb.wattage - 10) * bulb.hoursPerDay, 0) / 1000;
      tips.push({
        title: 'Switch to LED Bulbs',
        description: `You have ${incandescentBulbs.length} incandescent bulb(s). LED bulbs use 80% less energy.`,
        impact: 'High',
        savings: `Save ~₹${(savings * 5 * 365).toFixed(0)}/year`,
        icon: Lightbulb,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      });
    }

    // Check for AC usage
    const ac = appliances.find(app => 
      app.name.toLowerCase().includes('air conditioner') || app.name.toLowerCase().includes('ac')
    );
    if (ac && ac.hoursPerDay > 8) {
      tips.push({
        title: 'Optimize AC Usage',
        description: 'Set your thermostat to 78°F (25°C) when home. Each degree lower increases energy use by 6-8%.',
        impact: 'High',
        savings: 'Save up to ₹10,000/year',
        icon: ThermometerSun,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      });
    }

    // Check for always-on devices
    const alwaysOn = appliances.filter(app => app.hoursPerDay >= 20);
    if (alwaysOn.length > 2) {
      tips.push({
        title: 'Unplug Vampire Devices',
        description: `${alwaysOn.length} devices are on 20+ hours/day. Unplug chargers and electronics when not in use.`,
        impact: 'Medium',
        savings: 'Save up to ₹5,000/year',
        icon: Unplug,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      });
    }

    return tips;
  };

  const personalizedTips = generatePersonalizedTips();

  const ecoSwaps = [
    {
      from: 'Incandescent Bulb (60W)',
      to: 'LED Bulb (10W)',
      savings: '83% less energy',
      yearlySavings: '₹2,500',
      icon: Lightbulb,
    },
    {
      from: 'Old Refrigerator (500W)',
      to: 'Energy Star Fridge (150W)',
      savings: '70% less energy',
      yearlySavings: '₹9,000',
      icon: Sparkles,
    },
    {
      from: 'Desktop Computer (200W)',
      to: 'Laptop (50W)',
      savings: '75% less energy',
      yearlySavings: '₹4,000',
      icon: TrendingDown,
    },
    {
      from: 'LCD TV (150W)',
      to: 'LED TV (80W)',
      savings: '47% less energy',
      yearlySavings: '₹2,000',
      icon: Sparkles,
    },
  ];

  const generalTips = [
    {
      title: 'Use Power Strips',
      description: 'Connect multiple devices to a power strip and turn it off when not in use to eliminate standby power.',
      icon: Unplug,
    },
    {
      title: 'Natural Light',
      description: 'Open curtains during the day to reduce lighting needs. Use task lighting instead of illuminating entire rooms.',
      icon: Lightbulb,
    },
    {
      title: 'Smart Scheduling',
      description: 'Run dishwashers and washing machines during off-peak hours (typically 9 PM - 7 AM).',
      icon: Clock,
    },
    {
      title: 'Regular Maintenance',
      description: 'Clean AC filters monthly and refrigerator coils annually to maintain efficiency.',
      icon: Leaf,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Personalized Alerts */}
      {personalizedTips.length > 0 && (
        <Card className="border-2 border-green-800/50 bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <AlertCircle className="w-5 h-5 text-green-400" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription className="text-slate-400">Based on your current appliances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {personalizedTips.map((tip, index) => (
              <Alert key={index} className={`${tip.bgColor} border-0 bg-slate-800/50`}>
                <tip.icon className={`w-5 h-5 ${tip.color}`} />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-slate-100">{tip.title}</p>
                      <Badge variant="secondary" className="shrink-0 bg-slate-700 text-slate-200">
                        {tip.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300">{tip.description}</p>
                    <p className="text-sm text-green-400">{tip.savings}</p>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Eco Swaps */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100 text-base">
            <Sparkles className="w-5 h-5 text-green-400" />
            Eco Swaps
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Energy-efficient alternatives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ecoSwaps.map((swap, index) => (
            <div key={index} className="p-3 bg-gradient-to-r from-green-950/50 to-emerald-950/50 rounded-lg border border-green-900/50">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-green-900/50 text-green-300 text-xs">
                  {swap.savings}
                </Badge>
                <p className="text-xs text-green-300">
                  {swap.yearlySavings}/yr
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 line-through">{swap.from}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <ArrowRight className="w-3 h-3 text-green-400" />
                  <span className="text-slate-100">{swap.to}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* General Energy Saving Tips */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100 text-base">
            <Leaf className="w-5 h-5 text-green-400" />
            General Tips
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Simple energy-saving habits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {generalTips.map((tip, index) => (
            <div key={index} className="flex gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center shrink-0">
                <tip.icon className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-100 mb-1">{tip.title}</p>
                <p className="text-xs text-slate-400">{tip.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-800/50">
        <CardHeader>
          <CardTitle className="text-green-100">🌍 Your Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-100">
            By following these eco tips, you could reduce your carbon footprint by up to 30% and save thousands of rupees annually on electricity bills.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

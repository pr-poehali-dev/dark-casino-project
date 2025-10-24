import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InventoryProps {
  items: Array<{ name: string; rarity: string; emoji: string }>;
}

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500',
};

export default function Inventory({ items }: InventoryProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="text-6xl mb-4 opacity-30">📦</div>
        <h3 className="text-2xl font-bold mb-2">Инвентарь пуст</h3>
        <p className="text-muted-foreground">Откройте кейсы, чтобы получить призы!</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Инвентарь ({items.length})</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <Card
            key={index}
            className="p-6 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="space-y-3">
              <Badge
                variant="secondary"
                className={`${rarityColors[item.rarity as keyof typeof rarityColors]} text-white text-xs`}
              >
                {item.rarity.toUpperCase()}
              </Badge>
              
              <div className="text-center py-4">
                <div className="text-5xl mb-3">{item.emoji}</div>
                <p className="font-semibold text-sm">{item.name}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

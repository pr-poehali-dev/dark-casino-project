import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface InventoryProps {
  items: Array<{ name: string; rarity: string; emoji: string; price: number; id: string }>;
  onSell: (itemId: string, price: number) => void;
}

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500',
};

export default function Inventory({ items, onSell }: InventoryProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="text-6xl mb-4 opacity-30">📦</div>
        <h3 className="text-2xl font-bold mb-2">Инвентарь пуст</h3>
        <p className="text-muted-foreground">Откройте кейсы, чтобы получить NFT!</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Инвентарь ({items.length})</h2>
        <div className="text-sm text-muted-foreground">
          Всего на сумму: {items.reduce((sum, item) => sum + item.price, 0)} ₽
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="p-4 hover:scale-105 transition-transform relative overflow-hidden"
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
                <p className="font-semibold text-sm mb-2">{item.name}</p>
                <div className="flex items-center justify-center gap-1 text-primary font-bold">
                  <Icon name="Coins" size={16} />
                  <span>{item.price} ₽</span>
                </div>
              </div>

              <Button
                onClick={() => onSell(item.id, item.price)}
                variant="outline"
                size="sm"
                className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Icon name="DollarSign" size={16} className="mr-1" />
                Продать
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

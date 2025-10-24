import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CaseOpeningProps {
  caseData: {
    name: string;
    items: Array<{ name: string; rarity: string; emoji: string }>;
  };
  onComplete: (wonItem: { name: string; rarity: string; emoji: string }) => void;
  onClose: () => void;
}

const rarityColors = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-500',
};

export default function CaseOpening({ caseData, onComplete, onClose }: CaseOpeningProps) {
  const [isSpinning, setIsSpinning] = useState(true);
  const [wonItem, setWonItem] = useState<{ name: string; rarity: string; emoji: string } | null>(null);

  useEffect(() => {
    const items = [...caseData.items, ...caseData.items, ...caseData.items, ...caseData.items];
    const randomIndex = Math.floor(Math.random() * caseData.items.length);
    const selectedItem = caseData.items[randomIndex];

    const timer = setTimeout(() => {
      setIsSpinning(false);
      setWonItem(selectedItem);
    }, 3000);

    return () => clearTimeout(timer);
  }, [caseData]);

  const handleComplete = () => {
    if (wonItem) {
      onComplete(wonItem);
    }
  };

  const allItems = [...caseData.items, ...caseData.items, ...caseData.items, ...caseData.items];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-4xl p-8 bg-card border-border overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <Icon name="X" size={24} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-8">
          Открытие: {caseData.name}
        </h2>

        <div className="relative h-64 mb-8 overflow-hidden">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary z-10 shadow-[0_0_20px_rgba(255,215,0,0.8)]" />
          
          <div className={`flex gap-4 h-full items-center ${isSpinning ? 'animate-spin-slow' : ''}`}>
            {allItems.map((item, index) => (
              <Card
                key={index}
                className={`min-w-[200px] h-48 flex flex-col items-center justify-center gap-4 bg-gradient-to-br ${
                  rarityColors[item.rarity as keyof typeof rarityColors]
                } p-6`}
              >
                <div className="text-6xl">{item.emoji}</div>
                <p className="font-bold text-white text-center text-sm">{item.name}</p>
              </Card>
            ))}
          </div>
        </div>

        {!isSpinning && wonItem && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="text-6xl mb-4 animate-pulse-glow">{wonItem.emoji}</div>
            <h3 className="text-2xl font-bold">Поздравляем!</h3>
            <p className="text-xl">Вы выиграли: {wonItem.name}</p>
            
            <Button
              onClick={handleComplete}
              className="h-12 px-8 text-lg font-semibold glow-gold"
              size="lg"
            >
              <Icon name="Check" size={20} className="mr-2" />
              Забрать приз
            </Button>
          </div>
        )}

        {isSpinning && (
          <div className="text-center">
            <p className="text-xl text-muted-foreground animate-pulse">
              Вращаем барабан...
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

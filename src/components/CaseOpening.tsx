import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CaseOpeningProps {
  caseData: {
    name: string;
    items: Array<{ name: string; rarity: string; emoji: string; price: number }>;
  };
  onComplete: (wonItem: { name: string; rarity: string; emoji: string; price: number }) => void;
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
  const [wonItem, setWonItem] = useState<{ name: string; rarity: string; emoji: string; price: number } | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const weightedItems: Array<{ name: string; rarity: string; emoji: string; price: number }> = [];
    
    caseData.items.forEach(item => {
      let weight = 1;
      if (item.rarity === 'common') weight = 50;
      else if (item.rarity === 'rare') weight = 25;
      else if (item.rarity === 'epic') weight = 10;
      else if (item.rarity === 'legendary') weight = 2;
      
      for (let i = 0; i < weight; i++) {
        weightedItems.push(item);
      }
    });
    
    const randomIndex = Math.floor(Math.random() * weightedItems.length);
    const selectedItem = weightedItems[randomIndex];
    
    const spinContext = new AudioContext();
    const spinOscillator = spinContext.createOscillator();
    const spinGain = spinContext.createGain();
    spinOscillator.connect(spinGain);
    spinGain.connect(spinContext.destination);
    spinOscillator.frequency.value = 200;
    spinOscillator.type = 'sine';
    spinGain.gain.value = 0.1;
    spinOscillator.start();
    
    let currentPos = 0;
    const targetPos = 2000 + (randomIndex * 220);
    const duration = 3000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      currentPos = targetPos * easeOut;
      setScrollPosition(currentPos);
      
      spinOscillator.frequency.value = 200 + (1 - progress) * 400;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        spinOscillator.stop();
        spinContext.close();
        setIsSpinning(false);
        setWonItem(selectedItem);
        
        const winContext = new AudioContext();
        const winOscillator = winContext.createOscillator();
        const winGain = winContext.createGain();
        winOscillator.connect(winGain);
        winGain.connect(winContext.destination);
        winOscillator.type = 'sine';
        winGain.gain.value = 0.15;
        
        winOscillator.frequency.setValueAtTime(523.25, winContext.currentTime);
        winOscillator.frequency.setValueAtTime(659.25, winContext.currentTime + 0.1);
        winOscillator.frequency.setValueAtTime(783.99, winContext.currentTime + 0.2);
        
        winOscillator.start();
        winOscillator.stop(winContext.currentTime + 0.5);
      }
    };
    
    animate();
    
    return () => {
      spinOscillator.stop();
      spinContext.close();
    };
  }, [caseData]);

  const handleComplete = () => {
    if (wonItem) {
      onComplete(wonItem);
    }
  };

  const extendedItems = [];
  for (let i = 0; i < 20; i++) {
    extendedItems.push(...caseData.items);
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-5xl p-8 bg-card border-2 border-primary/30 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-20"
        >
          <Icon name="X" size={24} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Открытие: {caseData.name}
        </h2>

        <div className="relative h-72 mb-8 overflow-hidden rounded-xl bg-muted/20">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary z-10 shadow-[0_0_30px_rgba(255,215,0,0.9)] -ml-0.5" />
          
          <div className="absolute inset-y-0 left-1/2 w-64 -ml-32 pointer-events-none z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
          </div>
          
          <div 
            className="flex gap-5 h-full items-center absolute"
            style={{
              transform: `translateX(-${scrollPosition}px)`,
              willChange: 'transform',
              paddingLeft: '50%'
            }}
          >
            {extendedItems.map((item, index) => (
              <Card
                key={index}
                className={`min-w-[200px] h-56 flex flex-col items-center justify-center gap-4 bg-gradient-to-br ${
                  rarityColors[item.rarity as keyof typeof rarityColors]
                } p-6 shadow-2xl border-2 border-white/20`}
              >
                <div className="text-7xl drop-shadow-lg">{item.emoji}</div>
                <p className="font-bold text-white text-center text-sm leading-tight">{item.name}</p>
                <div className="text-xs text-white/80 font-semibold">{item.price} ₽</div>
              </Card>
            ))}
          </div>
        </div>

        {!isSpinning && wonItem && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="text-8xl mb-4 animate-pulse-glow drop-shadow-2xl">{wonItem.emoji}</div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Поздравляем!
            </h3>
            <p className="text-2xl font-semibold">{wonItem.name}</p>
            <p className="text-xl text-primary font-bold flex items-center justify-center gap-2">
              <Icon name="Coins" size={24} />
              Стоимость: {wonItem.price} ₽
            </p>
            
            <Button
              onClick={handleComplete}
              className="h-14 px-10 text-xl font-semibold glow-gold shadow-2xl"
              size="lg"
            >
              <Icon name="Check" size={24} className="mr-2" />
              Забрать NFT
            </Button>
          </div>
        )}

        {isSpinning && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-xl text-muted-foreground mt-4 font-medium">
              Вращаем барабан...
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
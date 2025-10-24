import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import CaseLogo from '@/components/CaseLogo';

interface CaseCardProps {
  caseData: {
    id: number;
    name: string;
    price: number;
    image: string;
    rarity: string;
    logoType: 'starter' | 'premium' | 'gold';
  };
  onOpen: (caseData: any) => void;
  disabled?: boolean;
}

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500',
};

const rarityGlow = {
  common: '',
  rare: 'glow-purple',
  epic: 'glow-purple',
  legendary: 'glow-gold',
};

export default function CaseCard({ caseData, onOpen, disabled }: CaseCardProps) {
  return (
    <Card className={`relative overflow-hidden group hover:scale-105 transition-all duration-300 ${rarityGlow[caseData.rarity as keyof typeof rarityGlow]}`}>
      <div className={`absolute inset-0 ${rarityColors[caseData.rarity as keyof typeof rarityColors]} opacity-10 group-hover:opacity-20 transition-opacity`} />
      
      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={`${rarityColors[caseData.rarity as keyof typeof rarityColors]} text-white`}>
            {caseData.rarity.toUpperCase()}
          </Badge>
          <div className="text-2xl">{caseData.image}</div>
        </div>

        <div className="text-center py-8">
          <div className="flex justify-center mb-6">
            <CaseLogo type={caseData.logoType} size={120} />
          </div>
          <h3 className="text-xl font-bold mb-2">{caseData.name}</h3>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-primary">
            <Icon name="Coins" size={20} />
            <span className="text-2xl font-bold">{caseData.price} ₽</span>
          </div>
          
          <Button
            onClick={() => onOpen(caseData)}
            disabled={disabled}
            className="flex-1 h-12 text-lg font-semibold glow-gold"
            size="lg"
          >
            Открыть
          </Button>
        </div>
      </div>
    </Card>
  );
}
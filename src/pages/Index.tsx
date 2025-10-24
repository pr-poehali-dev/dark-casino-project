import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import CaseCard from '@/components/CaseCard';
import CaseOpening from '@/components/CaseOpening';
import Inventory from '@/components/Inventory';
import Navigation from '@/components/Navigation';

const CASES = [
  {
    id: 1,
    name: 'Стартовый кейс',
    price: 50,
    image: '🎁',
    rarity: 'common',
    items: [
      { name: 'Telegram Premium 1 месяц', rarity: 'common', emoji: '⭐' },
      { name: 'Стикерпак', rarity: 'common', emoji: '😀' },
      { name: 'Telegram Premium 3 месяца', rarity: 'rare', emoji: '⭐⭐' },
      { name: 'Эмодзи-статус', rarity: 'rare', emoji: '🔥' },
    ]
  },
  {
    id: 2,
    name: 'Премиум кейс',
    price: 150,
    image: '💎',
    rarity: 'rare',
    items: [
      { name: 'Telegram Premium 3 месяца', rarity: 'rare', emoji: '⭐⭐' },
      { name: 'Звезды 100 шт', rarity: 'rare', emoji: '✨' },
      { name: 'Telegram Premium 6 месяцев', rarity: 'epic', emoji: '⭐⭐⭐' },
      { name: 'Коллекционный стикерпак', rarity: 'epic', emoji: '🎨' },
    ]
  },
  {
    id: 3,
    name: 'Золотой кейс',
    price: 500,
    image: '👑',
    rarity: 'epic',
    items: [
      { name: 'Telegram Premium 6 месяцев', rarity: 'epic', emoji: '⭐⭐⭐' },
      { name: 'Звезды 500 шт', rarity: 'epic', emoji: '✨✨' },
      { name: 'Telegram Premium 1 год', rarity: 'legendary', emoji: '⭐⭐⭐⭐' },
      { name: 'Уникальный юзернейм', rarity: 'legendary', emoji: '💫' },
    ]
  },
];

export default function Index() {
  const [balance, setBalance] = useState(1000);
  const [activeSection, setActiveSection] = useState('cases');
  const [openingCase, setOpeningCase] = useState<typeof CASES[0] | null>(null);
  const [inventory, setInventory] = useState<Array<{name: string, rarity: string, emoji: string}>>([]);

  const handleOpenCase = (caseData: typeof CASES[0]) => {
    if (balance >= caseData.price) {
      setBalance(balance - caseData.price);
      setOpeningCase(caseData);
    }
  };

  const handleCaseOpened = (wonItem: {name: string, rarity: string, emoji: string}) => {
    setInventory([...inventory, wonItem]);
    setOpeningCase(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🎰</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TELEGRAM CASINO
            </h1>
          </div>
          
          <Card className="px-6 py-3 bg-card border-border glow-gold">
            <div className="flex items-center gap-3">
              <Icon name="Wallet" size={24} className="text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Баланс</p>
                <p className="text-xl font-bold text-primary">{balance} ₽</p>
              </div>
            </div>
          </Card>
        </header>

        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

        {activeSection === 'cases' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Доступные кейсы</h2>
              <Button variant="outline" className="gap-2">
                <Icon name="Filter" size={18} />
                Фильтр
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CASES.map((caseData) => (
                <CaseCard
                  key={caseData.id}
                  caseData={caseData}
                  onOpen={handleOpenCase}
                  disabled={balance < caseData.price}
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'inventory' && (
          <Inventory items={inventory} />
        )}

        {activeSection === 'deposit' && (
          <div className="animate-fade-in">
            <Card className="p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Пополнение баланса</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[100, 500, 1000, 2000, 5000, 10000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      className="h-16 text-lg font-semibold hover:border-primary hover:text-primary"
                      onClick={() => setBalance(balance + amount)}
                    >
                      {amount} ₽
                    </Button>
                  ))}
                </div>
                <Button className="w-full h-12 text-lg font-semibold glow-gold" size="lg">
                  <Icon name="CreditCard" size={20} className="mr-2" />
                  Оплатить
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'withdraw' && (
          <div className="animate-fade-in">
            <Card className="p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Вывод средств</h2>
              <div className="space-y-4">
                <div className="text-center text-muted-foreground">
                  <Icon name="Ban" size={48} className="mx-auto mb-4 text-destructive" />
                  <p className="text-lg">Минимальная сумма вывода: 1000 ₽</p>
                  <p className="text-sm mt-2">Ваш баланс: {balance} ₽</p>
                </div>
                <Button 
                  className="w-full h-12 text-lg font-semibold" 
                  size="lg"
                  disabled={balance < 1000}
                >
                  <Icon name="ArrowUpRight" size={20} className="mr-2" />
                  Вывести
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="animate-fade-in">
            <Card className="p-8 max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  👤
                </div>
                <h2 className="text-2xl font-bold">Игрок #{Math.floor(Math.random() * 10000)}</h2>
                <p className="text-muted-foreground">Уровень 1</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Открыто кейсов</span>
                  <span className="font-bold">{inventory.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="text-muted-foreground">В инвентаре</span>
                  <span className="font-bold">{inventory.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Баланс</span>
                  <span className="font-bold text-primary">{balance} ₽</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {openingCase && (
        <CaseOpening
          caseData={openingCase}
          onComplete={handleCaseOpened}
          onClose={() => setOpeningCase(null)}
        />
      )}
    </div>
  );
}

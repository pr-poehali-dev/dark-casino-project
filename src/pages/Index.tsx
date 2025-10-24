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
    name: 'Новогодний кейс',
    price: 300,
    image: '🎁',
    rarity: 'common',
    logoType: 'starter' as const,
    items: [
      { name: 'Шапка Санты', rarity: 'common', emoji: '🎅', price: 225, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
      { name: 'Пряничный человек', rarity: 'common', emoji: '🍪', price: 356, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
      { name: 'Новогодний венок', rarity: 'rare', emoji: '🎄', price: 347, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
      { name: 'Рождественские колокольчики', rarity: 'rare', emoji: '🔔', price: 356, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
      { name: 'Снежный шар', rarity: 'epic', emoji: '🔮', price: 725, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
    ]
  },
  {
    id: 2,
    name: 'Романтический кейс',
    price: 800,
    image: '💎',
    rarity: 'rare',
    logoType: 'premium' as const,
    items: [
      { name: 'Письмо с сердцем', rarity: 'common', emoji: '💌', price: 601, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
      { name: 'Букет роз', rarity: 'rare', emoji: '💐', price: 522, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
      { name: 'Золотое кольцо', rarity: 'rare', emoji: '💍', price: 914, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
      { name: 'Шоколадное сердце', rarity: 'epic', emoji: '🍫', price: 781, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
      { name: 'Розовый медведь', rarity: 'epic', emoji: '🧸', price: 3920, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
      { name: 'Кольцо в коробке', rarity: 'legendary', emoji: '💎', price: 3050, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
    ]
  },
  {
    id: 3,
    name: 'Люкс кейс',
    price: 1500,
    image: '👑',
    rarity: 'epic',
    logoType: 'gold' as const,
    items: [
      { name: 'Зелье любви', rarity: 'rare', emoji: '🧪', price: 1700, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
      { name: 'Золотое сердце', rarity: 'epic', emoji: '💛', price: 1819, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
      { name: 'Баночка с сердцами', rarity: 'epic', emoji: '🫙', price: 465, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
      { name: 'Оранжевая сумка', rarity: 'legendary', emoji: '👜', price: 13957, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
    ]
  },
  {
    id: 4,
    name: 'Праздничный кейс',
    price: 350,
    image: '🎉',
    rarity: 'common',
    logoType: 'starter' as const,
    items: [
      { name: 'Цифры 2025', rarity: 'common', emoji: '🔢', price: 327, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
      { name: 'Змея с подарком', rarity: 'common', emoji: '🐍', price: 333, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
      { name: 'Часы Деда Мороза', rarity: 'rare', emoji: '⏰', price: 339, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
      { name: 'Леденец', rarity: 'rare', emoji: '🍭', price: 293, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
      { name: 'Салют', rarity: 'epic', emoji: '🎆', price: 334, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
    ]
  },
];

export default function Index() {
  const [balance, setBalance] = useState(1000);
  const [activeSection, setActiveSection] = useState('cases');
  const [openingCase, setOpeningCase] = useState<typeof CASES[0] | null>(null);
  const [inventory, setInventory] = useState<Array<{name: string, rarity: string, emoji: string, price: number, id: string}>>([]);

  const handleOpenCase = (caseData: typeof CASES[0]) => {
    if (balance >= caseData.price) {
      setBalance(balance - caseData.price);
      setOpeningCase(caseData);
    }
  };

  const handleCaseOpened = (wonItem: {name: string, rarity: string, emoji: string, price: number}) => {
    const itemWithId = { ...wonItem, id: Date.now().toString() + Math.random() };
    setInventory([...inventory, itemWithId]);
    setOpeningCase(null);
  };

  const handleSellItem = (itemId: string, price: number) => {
    setInventory(inventory.filter(item => item.id !== itemId));
    setBalance(balance + price);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🎰</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              telorezov casino
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
          <Inventory items={inventory} onSell={handleSellItem} />
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
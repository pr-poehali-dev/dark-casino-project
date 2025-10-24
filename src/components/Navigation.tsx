import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const navItems = [
    { id: 'cases', label: 'Кейсы', icon: 'Package' },
    { id: 'inventory', label: 'Инвентарь', icon: 'Briefcase' },
    { id: 'deposit', label: 'Пополнение', icon: 'Plus' },
    { id: 'withdraw', label: 'Вывод', icon: 'ArrowUpRight' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
  ];

  return (
    <Card className="mb-8 p-2 bg-card border-border">
      <div className="flex items-center justify-around gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-lg transition-all ${
              activeSection === item.id
                ? 'bg-primary text-primary-foreground shadow-lg glow-gold'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={item.icon as any} size={24} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

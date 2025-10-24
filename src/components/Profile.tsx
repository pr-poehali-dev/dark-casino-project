import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ProfileProps {
  user: any;
  sessionToken: string;
  onUpdate: (updatedUser: any) => void;
  onClose: () => void;
}

const avatarOptions = [
  '👤', '🎭', '🎪', '🎲', '🃏', '💎', '👑', '🦊',
  '🐺', '🦁', '🐯', '🐼', '🦄', '🐉', '🔥', '⚡',
  '💫', '🌟', '✨', '🎯', '🎰', '🎨', '🚀', '👾'
];

export default function Profile({ user, sessionToken, onUpdate, onClose }: ProfileProps) {
  const [nickname, setNickname] = useState(user.nickname);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar_url || '👤');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/3cffbf5c-2145-41a0-b61d-ed0586cbcf32', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': sessionToken,
        },
        body: JSON.stringify({
          user_id: user.user_id,
          nickname,
          avatar_url: selectedAvatar,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onUpdate(data.user);
        onClose();
      } else {
        setError(data.error || 'Произошла ошибка');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 space-y-6 border-2 border-primary/30 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="X" size={24} />
        </button>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Редактировать профиль
          </h2>
          <p className="text-muted-foreground text-sm">ID: {user.user_id}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">Аватар</label>
            <div className="grid grid-cols-8 gap-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-3xl p-3 rounded-lg transition-all hover:scale-110 ${
                    selectedAvatar === avatar
                      ? 'bg-primary/20 ring-2 ring-primary scale-110'
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-medium">
              Никнейм
            </label>
            <Input
              id="nickname"
              type="text"
              placeholder="Ваш никнейм"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="bg-muted/50"
            />
          </div>

          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Баланс</span>
              <div className="flex items-center gap-1 text-primary font-bold">
                <span>⭐</span>
                <span>{user.balance}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Дата регистрации</span>
              <span className="text-sm font-medium">
                {new Date(user.created_at).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </>
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

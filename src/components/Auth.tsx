import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AuthProps {
  onAuth: (user: any, token: string) => void;
}

export default function Auth({ onAuth }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/3cffbf5c-2145-41a0-b61d-ed0586cbcf32', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          email,
          password,
          nickname: isLogin ? undefined : nickname || email.split('@')[0],
        }),
      });

      const data = await response.json();

      if (data.success) {
        onAuth(data.user, data.session_token);
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <Card className="w-full max-w-md p-8 space-y-6 border-2 border-primary/20">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="text-6xl">🎰</div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dark Casino
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-muted/50"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="nickname" className="text-sm font-medium">
                Никнейм (опционально)
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
          )}

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Пароль
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-muted/50"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>{isLogin ? 'Войти' : 'Зарегистрироваться'}</>
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLogin ? (
              <>
                Нет аккаунта?{' '}
                <span className="text-primary font-semibold">Зарегистрируйтесь</span>
              </>
            ) : (
              <>
                Уже есть аккаунт? <span className="text-primary font-semibold">Войдите</span>
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}

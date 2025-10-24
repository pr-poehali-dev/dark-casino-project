interface CaseLogoProps {
  type: 'starter' | 'premium' | 'gold';
  size?: number;
}

export default function CaseLogo({ type, size = 80 }: CaseLogoProps) {
  const logos = {
    starter: (
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-2xl opacity-90 shadow-xl" />
        <div className="absolute inset-0 bg-gradient-to-tl from-white/20 to-transparent rounded-2xl" />
        <div className="relative text-4xl drop-shadow-lg">🎁</div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-300 rounded-full border-2 border-gray-700 flex items-center justify-center text-xs">
          ★
        </div>
      </div>
    ),
    premium: (
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 rounded-2xl shadow-2xl animate-pulse-glow" />
        <div className="absolute inset-0 bg-gradient-to-tl from-white/30 to-transparent rounded-2xl" />
        <div className="absolute inset-2 border-2 border-white/30 rounded-xl" />
        <div className="relative text-4xl drop-shadow-2xl filter brightness-110">💎</div>
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg">
          ◆
        </div>
      </div>
    ),
    gold: (
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 rounded-2xl shadow-2xl glow-gold" />
        <div className="absolute inset-0 bg-gradient-to-tl from-yellow-200/40 to-transparent rounded-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_50%)] rounded-2xl" />
        <div className="absolute inset-1 border-2 border-yellow-200/50 rounded-xl" />
        <div className="absolute inset-3 border border-yellow-400/30 rounded-lg" />
        <div className="relative text-5xl drop-shadow-2xl filter brightness-110 animate-pulse-glow">👑</div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-full border-3 border-white flex items-center justify-center text-sm font-bold text-yellow-900 shadow-xl glow-gold">
          ♔
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-yellow-700/20 rounded-2xl" />
      </div>
    ),
  };

  return logos[type];
}

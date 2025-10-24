interface NFTImageProps {
  name: string;
  img?: string;
  size?: number;
  className?: string;
}

const NFT_IMAGES: Record<string, { x: number; y: number; img: string }> = {
  'Шапка Санты': { x: 0, y: 4, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
  'Пряничный человек': { x: 1, y: 3, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
  'Новогодний венок': { x: 2, y: 3, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
  'Рождественские колокольчики': { x: 0, y: 5, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
  'Снежный шар': { x: 1, y: 4, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
  'Цифры 2025': { x: 0, y: 0, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
  'Змея с подарком': { x: 1, y: 0, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
  'Часы Деда Мороза': { x: 0, y: 1, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
  'Леденец': { x: 1, y: 1, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
  'Салют': { x: 1, y: 2, img: 'https://cdn.poehali.dev/files/f09e2d45-3edd-4008-92c8-0252ce266e7e.png' },
  
  'Письмо с сердцем': { x: 0, y: 1, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
  'Букет роз': { x: 1, y: 1, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
  'Золотое кольцо': { x: 2, y: 1, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
  'Шоколадное сердце': { x: 2, y: 2, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
  'Розовый медведь': { x: 1, y: 3, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
  'Кольцо в коробке': { x: 2, y: 3, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
  'Зелье любви': { x: 0, y: 3, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
  'Золотое сердце': { x: 0, y: 4, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
  'Баночка с сердцами': { x: 1, y: 4, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
  'Оранжевая сумка': { x: 2, y: 4, img: 'https://cdn.poehali.dev/files/caa19f21-33fa-4f69-920c-6bd254236360.png' },
};

export default function NFTImage({ name, img, size = 80, className = '' }: NFTImageProps) {
  const nftData = NFT_IMAGES[name];
  
  if (!nftData) {
    return <div className={`text-6xl ${className}`}>🎁</div>;
  }

  const CELL_SIZE = 120;
  const xPos = -(nftData.x * CELL_SIZE);
  const yPos = -(nftData.y * CELL_SIZE);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute"
        style={{
          width: CELL_SIZE * 3,
          height: CELL_SIZE * 6,
          backgroundImage: `url(${nftData.img})`,
          backgroundSize: 'cover',
          backgroundPosition: `${xPos}px ${yPos}px`,
          transform: `scale(${size / CELL_SIZE})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
  );
}

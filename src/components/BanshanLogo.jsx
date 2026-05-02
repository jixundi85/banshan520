// 半山AIX Logo 组件 - 几何化Logo设计
// 中文部分：半字方块化等粗，山字重构为W形
// 英文部分：A几何斜切，I/X等粗硬朗化

export function BanshanLogo({ className = '', size = 'large' }) {
  const sizeClasses = {
    small: { svg: 60, text: 'text-xl' },
    medium: { svg: 80, text: 'text-2xl' },
    large: { svg: 120, text: 'text-4xl md:text-5xl' },
    xlarge: { svg: 180, text: 'text-6xl md:text-7xl' }
  }
  
  const { svg } = sizeClasses[size] || sizeClasses.large
  
  // 渐变色配置
  const gradientId = `logo-gradient-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <svg 
        width={svg} 
        height={svg * 0.6} 
        viewBox="0 0 240 144" 
        className="logo-svg"
      >
        <defs>
          {/* 主渐变 - 紫到青 */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          
          {/* 发光效果 */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* 阴影 */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.4"/>
          </filter>
        </defs>
        
        <g fill={`url(#${gradientId})`} filter="url(#shadow)">
          {/* ===== 半 字 - 方块化等粗设计 ===== */}
          <g className="animate-pulse" style={{ animationDelay: '0s' }}>
            {/* 方块化的 "半" 字 */}
            {/* 顶部横 - 方块化 */}
            <rect x="10" y="25" width="28" height="8" rx="1" />
            {/* 左侧撇 - 改为几何三角 */}
            <polygon points="15,33 10,55 22,50" />
            {/* 右侧捺 - 改为几何三角 */}
            <polygon points="38,33 45,55 33,50" />
            {/* 中间竖 - 方块化 */}
            <rect x="25" y="28" width="8" height="70" rx="1" />
            {/* 底部横 - 方块化 */}
            <rect x="10" y="95" width="40" height="8" rx="1" />
          </g>
          
          {/* ===== 山 字 - 重构为W形 ===== */}
          <g className="animate-pulse" style={{ animationDelay: '0.2s' }}>
            {/* W形的 "山" 字 - 三个尖峰 */}
            {/* 左峰 */}
            <polygon points="60,100 70,30 80,100" />
            {/* 中峰 */}
            <polygon points="90,100 100,15 110,100" />
            {/* 右峰 */}
            <polygon points="120,100 130,30 140,100" />
            {/* 底部横线连接 */}
            <rect x="60" y="100" width="80" height="8" rx="1" />
          </g>
          
          {/* ===== A I X 英文 - 几何无衬线 ===== */}
          
          {/* A - 斜切几何化 */}
          <g className="animate-pulse" style={{ animationDelay: '0.4s' }}>
            {/* A的左斜 */}
            <polygon points="155,100 175,25 180,30" />
            {/* A的右斜 */}
            <polygon points="180,30 200,100 195,100 180,45" />
            {/* A的横杠 */}
            <rect x="162" y="70" width="30" height="6" rx="1" transform="rotate(-15 177 73)" />
            {/* A的顶部小三角强调 */}
            <polygon points="175,25 180,30 170,30" fillOpacity="0.5" />
          </g>
          
          {/* I - 等粗硬朗 */}
          <g className="animate-pulse" style={{ animationDelay: '0.6s' }}>
            {/* I 的竖线 - 等粗 */}
            <rect x="210" y="25" width="10" height="75" rx="2" />
            {/* I 的顶部横线 */}
            <rect x="205" y="22" width="20" height="6" rx="1" />
            {/* I 的底部横线 */}
            <rect x="205" y="97" width="20" height="6" rx="1" />
          </g>
          
          {/* X - 等粗硬朗斜切 */}
          <g className="animate-pulse" style={{ animationDelay: '0.8s' }}>
            {/* X 的左上到右下斜线 */}
            <polygon points="230,25 238,25 270,100 262,100" />
            {/* X 的右上到左下斜线 */}
            <polygon points="262,25 270,25 238,100 230,100" />
            {/* X 的强调点 */}
            <rect x="248" y="55" width="12" height="6" rx="1" transform="rotate(-45 254 58)" />
          </g>
        </g>
        
        {/* 装饰性元素 - 科技感光点 */}
        <circle cx="50" cy="10" r="3" fill="#d946ef" opacity="0.8" className="animate-ping" />
        <circle cx="200" cy="120" r="2" fill="#06b6d4" opacity="0.8" className="animate-ping" style={{ animationDelay: '0.5s' }} />
      </svg>
    </div>
  )
}

export default BanshanLogo

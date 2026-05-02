// 骨架屏组件库 - 统一加载状态

export function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl" />
        <div className="flex-1">
          <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-white/10 rounded w-full mb-2" />
      <div className="h-3 bg-white/10 rounded w-2/3" />
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-white/10 rounded"
          style={{ width: `${100 - (i * 15)}%` }}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }
  return (
    <div className={`${sizes[size]} bg-white/10 rounded-full animate-pulse`} />
  )
}

export function SkeletonButton({ width = 'w-32' }) {
  return (
    <div className={`h-10 ${width} bg-white/10 rounded-lg animate-pulse`} />
  )
}

export function SkeletonImage({ aspectRatio = 'aspect-video' }) {
  return (
    <div className={`w-full ${aspectRatio} bg-white/10 rounded-xl animate-pulse`} />
  )
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 bg-white/10 rounded-lg" />
          <div className="flex-1">
            <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonGrid({ count = 6, cols = 3 }) {
  const colClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }
  return (
    <div className={`grid ${colClasses[cols]} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-white/10 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-white/10 rounded w-1/4" />
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-4 bg-white/10 rounded w-1/2" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-white/10 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex gap-4 pb-3 border-b border-white/10">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1 h-5 bg-white/10 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="flex-1 h-4 bg-white/10 rounded" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonPage() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-white/10 rounded w-1/4" />
      <div className="h-4 bg-white/10 rounded w-1/2" />
      <SkeletonGrid count={6} cols={3} />
    </div>
  )
}

// 页面级加载状态
export function PageLoading({ message = '加载中...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin mb-4" />
      <p className="text-white/60">{message}</p>
    </div>
  )
}

// 区域级加载状态
export function SectionLoading({ height = '200px' }) {
  return (
    <div className="flex items-center justify-center" style={{ height }}>
      <div className="w-8 h-8 border-3 border-white/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
}

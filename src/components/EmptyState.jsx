import { useNavigate } from 'react-router-dom'

// 空状态组件库 - 统一无数据展示

const icons = {
  search: (
    <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  box: (
    <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  document: (
    <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  project: (
    <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  message: (
    <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  user: (
    <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  star: (
    <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  cart: (
    <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  bell: (
    <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
}

export function EmptyState({ 
  icon = 'box', 
  title = '暂无数据', 
  description = '', 
  actionText = '', 
  actionLink = '', 
  onAction,
  compact = false 
}) {
  const navigate = useNavigate()

  const handleAction = () => {
    if (onAction) {
      onAction()
    } else if (actionLink) {
      navigate(actionLink)
    }
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-3">{icons[icon]}</div>
        <p className="text-white/60 text-sm">{title}</p>
        {actionText && (
          <button 
            onClick={handleAction}
            className="mt-3 text-blue-400 hover:text-blue-300 text-sm"
          >
            {actionText} →
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6">{icons[icon]}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-white/60 max-w-md mb-6">{description}</p>
      )}
      {actionText && (
        <button 
          onClick={handleAction}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

// 预定义的空状态场景
export function EmptySearch({ keyword = '', onClear }) {
  return (
    <EmptyState 
      icon="search"
      title={keyword ? `未找到 "${keyword}" 的相关结果` : '请输入搜索关键词'}
      description={keyword ? '换个关键词试试，或浏览全部内容' : ''}
      actionText={keyword ? '清除搜索' : ''}
      onAction={onClear}
    />
  )
}

export function EmptyProject({ isOPC = false }) {
  return (
    <EmptyState 
      icon="project"
      title="暂无项目"
      description={isOPC 
        ? '还没有分配给你的项目，去匹配中心看看吧'
        : '还没有创建项目，发布需求开始匹配OPC'
      }
      actionText={isOPC ? '去匹配中心' : '发布需求'}
      actionLink={isOPC ? '/matching' : '/demand-publish'}
    />
  )
}

export function EmptyMessage() {
  return (
    <EmptyState 
      icon="message"
      title="暂无消息"
      description="还没有收到任何消息，去社区看看吧"
      actionText="去社区"
      actionLink="/community"
    />
  )
}

export function EmptyNotification() {
  return (
    <EmptyState 
      icon="bell"
      title="暂无通知"
      description="还没有收到系统通知"
      compact
    />
  )
}

export function EmptyCart() {
  return (
    <EmptyState 
      icon="cart"
      title="购物车是空的"
      description="去看看有什么感兴趣的课程或服务"
      actionText="去逛逛"
      actionLink="/training"
    />
  )
}

export function EmptyFavorites() {
  return (
    <EmptyState 
      icon="star"
      title="暂无收藏"
      description="收藏感兴趣的内容，方便以后查看"
      actionText="去发现"
      actionLink="/"
    />
  )
}

export function EmptyDocument({ title = '暂无文档' }) {
  return (
    <EmptyState 
      icon="document"
      title={title}
      compact
    />
  )
}

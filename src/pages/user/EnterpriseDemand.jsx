/**
 * 企业需求发布页面
 * 已重构为需求中心 /demand-center 的入口页面
 * 此页面现在重定向到需求中心
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EnterpriseDemand() {
  const navigate = useNavigate()

  // 重定向到需求中心
  useEffect(() => {
    navigate('/demand-center', { replace: true })
  }, [navigate])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">正在跳转到需求中心...</p>
      </div>
    </div>
  )
}

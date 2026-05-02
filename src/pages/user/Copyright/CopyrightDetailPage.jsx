/**
 * 版权详情页 - 根据类型显示不同UI
 */
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCopyrightDetail, initCopyrightData } from '../../../data/copyrightSchema'
import PortraitDetail from './PortraitDetail'
import NovelDetail from './NovelDetail'
import FilmDetail from './FilmDetail'

export default function CopyrightDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初始化数据
    initCopyrightData()
    
    // 获取商品详情
    const data = getCopyrightDetail(id)
    setItem(data)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl animate-pulse">加载中...</div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-4">商品不存在</div>
        <button 
          onClick={() => navigate('/copyright')}
          className="px-6 py-3 bg-cyan-600 text-white rounded-xl"
        >
          返回版权中心
        </button>
      </div>
    )
  }

  // 根据类型渲染不同的详情页
  const renderDetail = () => {
    switch (item.type) {
      case 'portrait':
        return <PortraitDetail item={item} onBack={() => navigate('/copyright')} />
      case 'novel':
        return <NovelDetail item={item} onBack={() => navigate('/copyright')} />
      case 'film':
        return <FilmDetail item={item} onBack={() => navigate('/copyright')} />
      default:
        return <PortraitDetail item={item} onBack={() => navigate('/copyright')} />
    }
  }

  return renderDetail()
}

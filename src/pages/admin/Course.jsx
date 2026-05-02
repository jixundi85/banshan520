import { useState, useEffect } from 'react'
import {
  Search, Plus, Edit, Trash2, Eye, EyeOff,
  BookOpen, Users, DollarSign, Star, RefreshCw, Video
} from 'lucide-react'
import dataService from './dataService'

const CATEGORY_META = {
  'AI短视频': { icon: '🎬', color: 'from-cyan-500 to-blue-600' },
  'AI短剧': { icon: '🎭', color: 'from-violet-500 to-purple-600' },
  'AI漫剧': { icon: '📚', color: 'from-pink-500 to-rose-600' },
  'AI电影': { icon: '🎥', color: 'from-orange-500 to-amber-600' },
  'AI设计师': { icon: '🎨', color: 'from-emerald-500 to-teal-600' },
  'AI带货变现': { icon: '💰', color: 'from-yellow-500 to-orange-500' },
}

export default function Course() {
  const [courses, setCourses] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [currentCourse, setCurrentCourse] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = () => {
    const data = dataService.loadData('courses') || []
    setCourses(data)
  }

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const filteredCourses = courses.filter(course => {
    if (categoryFilter !== 'all' && course.category !== categoryFilter) return false
    if (statusFilter !== 'all' && course.status !== statusFilter) return false
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      return (
        course.title.toLowerCase().includes(keyword) ||
        course.teacher.toLowerCase().includes(keyword)
      )
    }
    return true
  })

  const handleEdit = (course) => {
    setCurrentCourse(course)
    setEditForm({ ...course })
    setShowEditModal(true)
  }

  const handleView = (course) => {
    setCurrentCourse(course)
    setShowDetailModal(true)
  }

  const handleSave = () => {
    dataService.updateRecord('courses', currentCourse.id, editForm)
    loadCourses()
    setShowEditModal(false)
    showToast('课程信息已更新')
  }

  const handleDelete = (course) => {
    if (window.confirm(`确定要删除课程 "${course.title}" 吗？`)) {
      dataService.deleteRecord('courses', course.id)
      loadCourses()
      showToast('课程已删除')
    }
  }

  const handleToggleStatus = (course) => {
    const newStatus = course.status === 'published' ? 'draft' : 'published'
    dataService.updateRecord('courses', course.id, { status: newStatus })
    loadCourses()
    showToast(`课程已${newStatus === 'published' ? '上架' : '下架'}`)
  }

  const handleToggleFeatured = (course) => {
    dataService.updateRecord('courses', course.id, { featured: !course.featured })
    loadCourses()
    showToast(course.featured ? '已取消精选' : '已设为精选')
  }

  const handleAdd = () => {
    setCurrentCourse(null)
    setEditForm({
      title: '',
      category: 'AI短视频',
      teacher: '',
      teacherId: null,
      price: 0,
      students: 0,
      rating: 5.0,
      thumbnail: '',
      featured: false,
      status: 'draft',
      description: '',
      chapters: []
    })
    setShowEditModal(true)
  }

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    featured: courses.filter(c => c.featured).length,
    totalStudents: courses.reduce((sum, c) => sum + (c.students || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-green-500 text-white">
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">课程管理</h1>
          <p className="text-gray-400">管理平台所有课程内容</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadCourses} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            刷新
          </button>
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            添加课程
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-400">课程总数</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.published}</div>
              <div className="text-sm text-gray-400">已上架</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.featured}</div>
              <div className="text-sm text-gray-400">精选课程</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
              <div className="text-sm text-gray-400">总学习人数</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索课程名称或讲师..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="all">全部分类</option>
            {Object.keys(CATEGORY_META).map(cat => (
              <option key={cat} value={cat}>{CATEGORY_META[cat].icon} {cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="all">全部状态</option>
            <option value="published">已上架</option>
            <option value="draft">草稿</option>
          </select>
          <div className="text-sm text-gray-400">
            共 {filteredCourses.length} 条结果
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">课程</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">分类</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">讲师</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">价格</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">学习人数</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${CATEGORY_META[course.category]?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-xl`}>
                        {CATEGORY_META[course.category]?.icon || '📚'}
                      </div>
                      <div>
                        <div className="text-sm font-medium flex items-center gap-2">
                          {course.title}
                          {course.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                        </div>
                        <div className="text-xs text-gray-400">评分 {course.rating}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-white/10 text-xs rounded">
                      {CATEGORY_META[course.category]?.icon} {course.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{course.teacher}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${course.price === 0 ? 'text-green-400' : 'text-amber-400'}`}>
                      {course.price === 0 ? '免费' : `¥${course.price}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{course.students?.toLocaleString() || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.status === 'published'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {course.status === 'published' ? '已上架' : '草稿'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleView(course)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(course)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleToggleFeatured(course)} className="p-2 hover:bg-white/10 rounded-lg">
                        <Star className={`w-4 h-4 ${course.featured ? 'text-amber-400 fill-amber-400' : 'text-gray-400'}`} />
                      </button>
                      <button onClick={() => handleToggleStatus(course)} className="p-2 hover:bg-white/10 rounded-lg">
                        {course.status === 'published' ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-green-400" />
                        )}
                      </button>
                      <button onClick={() => handleDelete(course)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-8" onClick={() => setShowEditModal(false)}>
          <div className="bg-slate-800/95 rounded-2xl border border-white/10 w-full max-w-2xl mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold">{currentCourse ? '编辑课程' : '添加课程'}</h3>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400">
                ×
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm text-gray-400 mb-1">课程名称</label>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="输入课程名称"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">分类</label>
                  <select
                    value={editForm.category || 'AI短视频'}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    {Object.keys(CATEGORY_META).map(cat => (
                      <option key={cat} value={cat}>{CATEGORY_META[cat].icon} {cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">讲师</label>
                  <input
                    type="text"
                    value={editForm.teacher || ''}
                    onChange={(e) => setEditForm({ ...editForm, teacher: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="讲师名称"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">价格（0=免费）</label>
                  <input
                    type="number"
                    value={editForm.price || 0}
                    onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">学习人数</label>
                  <input
                    type="number"
                    value={editForm.students || 0}
                    onChange={(e) => setEditForm({ ...editForm, students: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">评分</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editForm.rating || 5}
                    onChange={(e) => setEditForm({ ...editForm, rating: parseFloat(e.target.value) || 5 })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">状态</label>
                  <select
                    value={editForm.status || 'draft'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="draft">草稿</option>
                    <option value="published">已上架</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">设为精选</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.featured || false}
                    onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                    className="w-5 h-5 rounded bg-white/5 border border-white/20 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-sm">在首页精选区域展示</span>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400">
                取消
              </button>
              <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white font-medium">
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && currentCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowDetailModal(false)}>
          <div className="bg-slate-800/95 rounded-2xl border border-white/10 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold">课程详情</h3>
              <button onClick={() => setShowDetailModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400">
                ×
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${CATEGORY_META[currentCourse.category]?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-3xl`}>
                  {CATEGORY_META[currentCourse.category]?.icon || '📚'}
                </div>
                <div>
                  <div className="text-xl font-bold flex items-center gap-2">
                    {currentCourse.title}
                    {currentCourse.featured && <Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
                  </div>
                  <div className="text-gray-400">{currentCourse.teacher} · {currentCourse.category}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">价格</span>
                  <span className="text-amber-400 font-bold">{currentCourse.price === 0 ? '免费' : `¥${currentCourse.price}`}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">学习人数</span>
                  <span>{currentCourse.students?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">评分</span>
                  <span className="text-amber-400">{currentCourse.rating}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">状态</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    currentCourse.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {currentCourse.status === 'published' ? '已上架' : '草稿'}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">创建时间</span>
                  <span>{currentCourse.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

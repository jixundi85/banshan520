import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Upload, X, Image, Type, Tag, 
  DollarSign, Eye, Save, Send, Plus, Trash2,
  GripVertical, ChevronDown, ChevronRight, Video, CheckCircle
} from 'lucide-react';
import './CreateTutorial.css';

export default function CreateTutorial() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 判断是否为编辑模式
  const editData = location.state?.tutorial;
  const isEditMode = location.state?.isEdit && editData;
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    subtitle: '',
    description: '',
    coverImage: '',
    tags: [],
    isPaid: true,
    price: 99,
    freeChapters: 2, // 免费试看章节数
    category: '',
    level: 'beginner',
    isDraft: true
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [chapters, setChapters] = useState([
    {
      id: 1,
      title: '',
      content: '',
      isFree: false,
      isExpanded: true,
      lessons: [
        { id: 1, title: '', duration: '', videoUrl: '' }
      ]
    }
  ]);
  const [currentChapter, setCurrentChapter] = useState(null);
  
  // 初始化编辑模式数据
  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        id: editData.id || null,
        title: editData.title || '',
        subtitle: editData.subtitle || '',
        description: editData.description || '',
        coverImage: editData.coverImage || '',
        tags: editData.tags || [],
        isPaid: editData.isPaid !== false,
        price: editData.price || 99,
        freeChapters: editData.freeChapters || 2,
        category: editData.category || '',
        level: editData.level || 'beginner',
        isDraft: editData.status === 'draft'
      });
      if (editData.chapters && editData.chapters.length > 0) {
        setChapters(editData.chapters.map((ch, idx) => ({
          ...ch,
          id: ch.id || idx + 1,
          isExpanded: idx === 0
        })));
      }
      if (editData.coverImage) {
        setUploadedImages([{ id: 1, url: editData.coverImage, name: 'cover' }]);
      }
    }
  }, [isEditMode, editData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, coverImage: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 课时视频上传处理
  const handleLessonVideoUpload = (chapterId, lessonId, e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!validTypes.includes(file.type)) {
        alert('请上传 MP4、WebM 或 MOV 格式的视频文件');
        return;
      }
      if (file.size > 500 * 1024 * 1024) {
        alert('视频文件大小不能超过 500MB');
        return;
      }
      
      const videoUrl = URL.createObjectURL(file);
      setChapters(chapters.map(c => {
        if (c.id === chapterId) {
          return {
            ...c,
            lessons: c.lessons.map(l => 
              l.id === lessonId ? { 
                ...l, 
                videoUrl: videoUrl,
                videoName: file.name,
                videoSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
              } : l
            )
          };
        }
        return c;
      }));
    }
  };

  const removeLessonVideo = (chapterId, lessonId) => {
    setChapters(chapters.map(c => {
      if (c.id === chapterId) {
        return {
          ...c,
          lessons: c.lessons.map(l => 
            l.id === lessonId ? { 
              ...l, 
              videoUrl: '',
              videoName: '',
              videoSize: ''
            } : l
          )
        };
      }
      return c;
    }));
  };

  // 章节操作
  const addChapter = () => {
    const newChapter = {
      id: Date.now(),
      title: '',
      content: '',
      isFree: false,
      isExpanded: true,
      lessons: [
        { id: Date.now(), title: '', duration: '', videoUrl: '' }
      ]
    };
    setChapters([...chapters, newChapter]);
  };

  const removeChapter = (chapterId) => {
    if (chapters.length <= 1) {
      alert('至少需要保留一个章节');
      return;
    }
    setChapters(chapters.filter(c => c.id !== chapterId));
  };

  const updateChapter = (chapterId, field, value) => {
    setChapters(chapters.map(c => 
      c.id === chapterId ? { ...c, [field]: value } : c
    ));
  };

  const toggleChapter = (chapterId) => {
    setChapters(chapters.map(c =>
      c.id === chapterId ? { ...c, isExpanded: !c.isExpanded } : c
    ));
  };

  // 课时操作
  const addLesson = (chapterId) => {
    setChapters(chapters.map(c => {
      if (c.id === chapterId) {
        return {
          ...c,
          lessons: [...c.lessons, { 
            id: Date.now(), 
            title: '', 
            duration: '', 
            videoUrl: '' 
          }]
        };
      }
      return c;
    }));
  };

  const removeLesson = (chapterId, lessonId) => {
    setChapters(chapters.map(c => {
      if (c.id === chapterId && c.lessons.length > 1) {
        return {
          ...c,
          lessons: c.lessons.filter(l => l.id !== lessonId)
        };
      }
      return c;
    }));
  };

  const updateLesson = (chapterId, lessonId, field, value) => {
    setChapters(chapters.map(c => {
      if (c.id === chapterId) {
        return {
          ...c,
          lessons: c.lessons.map(l => 
            l.id === lessonId ? { ...l, [field]: value } : l
          )
        };
      }
      return c;
    }));
  };

  const handleSubmit = async (isDraft = true) => {
    // 检查登录状态
    const token = localStorage.getItem('token');
    if (!token) {
      if (window.confirm('请先登录后再创建教程，是否前往登录？')) {
        navigate('/login', { state: { from: '/user/create-tutorial' } });
      }
      return;
    }

    // 验证必填项
    if (!formData.title.trim()) {
      alert('请输入教程标题');
      return;
    }
    if (!formData.description.trim()) {
      alert('请输入教程简介');
      return;
    }
    if (!formData.coverImage) {
      alert('请上传教程封面图');
      return;
    }

    // 检查章节
    const validChapters = chapters.filter(c => c.title.trim());
    if (validChapters.length === 0) {
      alert('请至少填写一个章节标题');
      return;
    }

    setIsSubmitting(true);
    
    // 构建完整教程数据（包含免费章节设置）
    const tutorialData = {
      ...formData,
      chapters: chapters.map((chapter, index) => ({
        ...chapter,
        isFree: index < formData.freeChapters, // 前N章免费
        lessons: chapter.lessons.map(lesson => ({
          ...lesson,
          // 视频URL等信息已在lesson中
        }))
      })),
      totalChapters: validChapters.length,
      freeChapters: formData.freeChapters,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // 模拟提交 - 实际项目中这里会发送到后端API
    // 保存到本地存储作为演示
    const savedTutorials = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
    const tutorialWithId = {
      ...tutorialData,
      id: Date.now(),
      status: isDraft ? 'draft' : 'published'
    };
    savedTutorials.push(tutorialWithId);
    localStorage.setItem('savedTutorials', JSON.stringify(savedTutorials));
    
    setTimeout(() => {
      setIsSubmitting(false);
      if (isDraft) {
        alert('草稿保存成功！\\n\\n💡 提示：您设置的免费试看章节数为前 ' + formData.freeChapters + ' 章');
        navigate('/user/creator');
      } else {
        const freeInfo = formData.isPaid && formData.freeChapters > 0 
          ? '\\n\\n📖 付费设置：前 ' + formData.freeChapters + ' 章免费试看，剩余 ' + (validChapters.length - formData.freeChapters) + ' 章需购买'
          : '';
        alert('教程发布成功！即将跳转到培训孵化页面...' + freeInfo);
        navigate('/training');
      }
    }, 1500);
  };

  const levels = [
    { value: 'beginner', label: '入门' },
    { value: 'intermediate', label: '进阶' },
    { value: 'advanced', label: '精通' }
  ];

  // 分类必须与培训孵化板块（TrainingPage.jsx）的 CATEGORY_META 完全对应
  const categories = [
    { value: 'shortvideo', label: '🎬 AI短视频' },
    { value: 'shortdrama', label: '🎭 AI短剧' },
    { value: 'mangadrama', label: '📚 AI漫剧' },
    { value: 'film', label: '🎥 AI电影' },
    { value: 'designer', label: '🎨 AI设计师' },
    { value: 'commerce', label: '💰 AI带货变现' }
  ];

  return (
    <div className="create-tutorial-page">
      <div className="tutorial-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/user/creator')}>
            <ArrowLeft size={20} />
          </button>
          <h1>{isEditMode ? '编辑教程' : '创建教程'}</h1>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
          >
            <Save size={18} />
            保存草稿
          </button>
          <button 
            className="btn-primary"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
          >
            <Send size={18} />
            {isSubmitting ? '发布中...' : '发布教程'}
          </button>
        </div>
      </div>

      <div className="tutorial-content">
        <div className="form-main">
          {/* 基本信息 */}
          <div className="form-section">
            <h3 className="section-title">基本信息</h3>
            
            <div className="form-row">
              <div className="form-group flex-2">
                <label className="form-label">
                  <Type size={16} />
                  教程标题 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="例如：AI绘图从入门到精通"
                  className="form-input"
                  maxLength={30}
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">
                  <Tag size={16} />
                  难度等级
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {levels.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Type size={16} />
                副标题
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="教程副标题（可选）"
                className="form-input"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Type size={16} />
                教程简介 <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="简要描述教程内容、学习收获、适用人群等"
                className="form-textarea"
                rows={4}
                maxLength={300}
              />
              <div className="input-hint">{formData.description.length}/300</div>
            </div>
          </div>

          {/* 封面图 */}
          <div className="form-section">
            <h3 className="section-title">教程封面</h3>
            {formData.coverImage ? (
              <div className="cover-preview">
                <img src={formData.coverImage} alt="封面预览" />
                <div className="cover-overlay">
                  <label className="change-cover-btn">
                    <Upload size={18} />
                    更换封面
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="upload-zone">
                <Upload size={40} />
                <span>点击上传教程封面</span>
                <span className="upload-hint">建议尺寸 800x450，支持 JPG、PNG</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* 章节内容 */}
          <div className="form-section">
            <h3 className="section-title">章节内容</h3>
            <div className="chapters-container">
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="chapter-card">
                  <div className="chapter-header" onClick={() => toggleChapter(chapter.id)}>
                    <div className="chapter-left">
                      <GripVertical size={18} className="drag-handle" />
                      <span className="chapter-number">第{chapterIndex + 1}章</span>
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="请输入章节标题"
                        className="chapter-title-input"
                      />
                    </div>
                    <div className="chapter-actions" onClick={(e) => e.stopPropagation()}>
                      <label className="free-toggle">
                        <input
                          type="checkbox"
                          checked={chapter.isFree}
                          onChange={(e) => updateChapter(chapter.id, 'isFree', e.target.checked)}
                        />
                        <span>免费试看</span>
                      </label>
                      <button 
                        className="chapter-btn"
                        onClick={() => removeChapter(chapter.id)}
                        title="删除章节"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="chapter-btn">
                        {chapter.isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                    </div>
                  </div>

                  {chapter.isExpanded && (
                    <div className="chapter-body">
                      <div className="lessons-list">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="lesson-item">
                            <div className="lesson-number">{lessonIndex + 1}</div>
                            <div className="lesson-content">
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => updateLesson(chapter.id, lesson.id, 'title', e.target.value)}
                                placeholder="课时标题"
                                className="lesson-title-input"
                              />
                              <input
                                type="text"
                                value={lesson.duration}
                                onChange={(e) => updateLesson(chapter.id, lesson.id, 'duration', e.target.value)}
                                placeholder="时长（如：15:30）"
                                className="lesson-duration-input"
                              />
                            </div>
                            <div className="lesson-video-actions">
                              {lesson.videoUrl ? (
                                <>
                                  <span className="video-uploaded-badge">
                                    <CheckCircle size={12} />
                                    已上传
                                  </span>
                                  <button 
                                    className="lesson-btn delete"
                                    onClick={() => removeLessonVideo(chapter.id, lesson.id)}
                                    title="删除视频"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <label className="lesson-video-upload-btn">
                                  <Video size={14} />
                                  上传视频
                                  <input
                                    type="file"
                                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                    onChange={(e) => handleLessonVideoUpload(chapter.id, lesson.id, e)}
                                    style={{ display: 'none' }}
                                  />
                                </label>
                              )}
                            </div>
                            <button 
                              className="lesson-btn delete"
                              onClick={() => removeLesson(chapter.id, lesson.id)}
                              disabled={chapter.lessons.length <= 1}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button 
                        className="add-lesson-btn"
                        onClick={() => addLesson(chapter.id)}
                      >
                        <Plus size={16} />
                        添加课时
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="add-chapter-btn" onClick={addChapter}>
              <Plus size={18} />
              添加章节
            </button>
          </div>
        </div>

        <div className="form-sidebar">
          {/* 分类 */}
          <div className="sidebar-section">
            <label className="form-label">
              <Tag size={16} />
              教程分类
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">请选择分类</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* 标签 */}
          <div className="sidebar-section">
            <label className="form-label">
              <Tag size={16} />
              标签（最多5个）
            </label>
            <div className="tags-input">
              <div className="tags-list">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              {formData.tags.length < 5 && (
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入后回车添加"
                  className="tag-input"
                />
              )}
            </div>
          </div>

          {/* 价格设置 */}
          <div className="sidebar-section">
            <label className="form-label">
              <DollarSign size={16} />
              付费设置
            </label>
            <div className="price-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={formData.isPaid}
                  onChange={handleInputChange}
                  name="isPaid"
                />
                <span className="toggle-switch"></span>
                <span>设置付费教程</span>
              </label>
            </div>
            {formData.isPaid && (
              <>
                <div className="price-input">
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    placeholder="设置价格"
                    min="1"
                    max="999"
                  />
                  <span>积分</span>
                </div>
                {/* 免费试看章节数设置 */}
                <div className="free-chapters-setting" style={{ marginTop: 12 }}>
                  <label className="form-label" style={{ fontSize: 12, color: '#94a3b8' }}>
                    免费试看章节数
                  </label>
                  <select
                    name="freeChapters"
                    value={formData.freeChapters}
                    onChange={handleInputChange}
                    className="form-select"
                    style={{ marginTop: 6 }}
                  >
                    <option value={0}>不开放免费试看</option>
                    <option value={1}>免费试看前1章</option>
                    <option value={2}>免费试看前2章</option>
                    <option value={3}>免费试看前3章</option>
                    <option value={chapters.length >= 4 ? 4 : chapters.length}>
                      {chapters.length >= 4 ? '免费试看前4章' : `免费试看前${chapters.length}章`}
                    </option>
                  </select>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                    付费教程建议设置1-3章免费试看，可提高购买转化率
                  </div>
                </div>
              </>
            )}
            <div className="price-hint">
              {formData.isPaid 
                ? `用户需支付${formData.price}积分解锁全部章节` 
                : '免费教程可获得更多曝光'}
            </div>
          </div>

          {/* 预览 */}
          <div className="sidebar-section">
            <button 
              className="preview-btn"
              onClick={() => setShowPreview(true)}
            >
              <Eye size={18} />
              预览效果
            </button>
          </div>
        </div>
      </div>

      {/* 预览弹窗 */}
      {showPreview && (
        <div className="preview-modal" onClick={() => setShowPreview(false)}>
          <div className="preview-content" onClick={e => e.stopPropagation()}>
            <div className="preview-header">
              <span>教程预览</span>
              <button onClick={() => setShowPreview(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="preview-body">
              {formData.coverImage && (
                <img src={formData.coverImage} alt="封面" className="preview-cover" />
              )}
              <h2>{formData.title || '教程标题'}</h2>
              {formData.subtitle && <p className="preview-subtitle">{formData.subtitle}</p>}
              <p className="preview-desc">{formData.description || '教程简介...'}</p>
              <div className="preview-meta">
                <span className="preview-level">{levels.find(l => l.value === formData.level)?.label}</span>
                <span>•</span>
                <span>{chapters.length}个章节</span>
                <span>•</span>
                <span>{chapters.reduce((acc, c) => acc + c.lessons.length, 0)}个课时</span>
              </div>
              <div className="preview-tags">
                {formData.tags.map((tag, i) => (
                  <span key={i} className="preview-tag">{tag}</span>
                ))}
              </div>
              {formData.isPaid && (
                <div className="preview-price">
                  <DollarSign size={16} />
                  <span>{formData.price} 积分</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Upload, X, Image, Type, Tag, 
  DollarSign, Eye, Save, Send, Plus, Trash2,
  GripVertical, ChevronDown, ChevronRight, Video, CheckCircle,
  User, Award, Briefcase, FileText, Play
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreateTutorial.css';

// 分类与前端完全对应
const categories = [
  { value: 'shortvideo', label: '🎬 AI短视频' },
  { value: 'shortdrama', label: '🎭 AI短剧' },
  { value: 'mangadrama', label: '📚 AI漫剧' },
  { value: 'film', label: '🎥 AI电影' },
  { value: 'designer', label: '🎨 AI设计师' },
  { value: 'commerce', label: '💰 AI带货变现' }
];

// 章节等级选项
const chapterLevels = [
  { value: '入门', label: '入门篇', color: '#22c55e' },
  { value: '中级', label: '中级篇', color: '#3b82f6' },
  { value: '进阶', label: '进阶篇', color: '#f59e0b' },
  { value: '高级', label: '高级篇', color: '#ef4444' }
];

export default function CreateTutorial() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const editData = location.state?.tutorial;
  const isEditMode = location.state?.isEdit && editData;
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    subtitle: '',
    description: '',
    coverImage: '',
    tags: [],
    category: '',
    price: 699,
    originalPrice: 1999,
    pointsPrice: 6990,
    isDraft: true,
    // 新增：课程详情富文本
    detailContent: '',
    // 新增：宣传视频
    promoVideo: {
      coverUrl: '',
      videoUrl: ''
    },
    // 讲师信息
    teacher: {
      name: '',
      avatar: '',
      title: '',
      bio: '',
      expertise: [],
      works: []
    }
  });
  
  const [tagInput, setTagInput] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [workInput, setWorkInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // 章节结构：支持等级划分
  const [chapters, setChapters] = useState([
    {
      id: 1,
      title: '',
      level: '入门',
      isExpanded: true,
      lessons: [
        { id: 1, title: '', duration: '', isFree: true, videoUrl: '' }
      ]
    }
  ]);
  
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
        category: editData.category || '',
        price: editData.price || 699,
        originalPrice: editData.originalPrice || 1999,
        pointsPrice: editData.pointsPrice || 6990,
        isDraft: editData.status === 'draft',
        teacher: editData.teacher || {
          name: '',
          avatar: '',
          title: '',
          bio: '',
          expertise: [],
          works: []
        }
      });
      
      if (editData.chapters && editData.chapters.length > 0) {
        setChapters(editData.chapters.map((ch, idx) => ({
          ...ch,
          id: ch.id || idx + 1,
          level: ch.level || '入门',
          isExpanded: idx === 0
        })));
      }
    }
  }, [isEditMode, editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeacherChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      teacher: { ...prev.teacher, [field]: value }
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

  const handleAddExpertise = () => {
    if (expertiseInput.trim() && formData.teacher.expertise.length < 5) {
      handleTeacherChange('expertise', [...formData.teacher.expertise, expertiseInput.trim()]);
      setExpertiseInput('');
    }
  };

  const handleRemoveExpertise = (item) => {
    handleTeacherChange('expertise', formData.teacher.expertise.filter(e => e !== item));
  };

  const handleAddWork = () => {
    if (workInput.trim() && formData.teacher.works.length < 5) {
      handleTeacherChange('works', [...formData.teacher.works, workInput.trim()]);
      setWorkInput('');
    }
  };

  const handleRemoveWork = (item) => {
    handleTeacherChange('works', formData.teacher.works.filter(w => w !== item));
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

  // 章节操作
  const addChapter = () => {
    const newChapter = {
      id: Date.now(),
      title: '',
      level: '入门',
      isExpanded: true,
      lessons: [{ id: Date.now(), title: '', duration: '10:00', isFree: false, videoUrl: '' }]
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
            duration: '10:00', 
            isFree: false,
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
        return { ...c, lessons: c.lessons.filter(l => l.id !== lessonId) };
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

  const handleLessonVideoUpload = (chapterId, lessonId, e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      updateLesson(chapterId, lessonId, 'videoUrl', videoUrl);
    }
  };

  const handleSubmit = async (isDraft = true) => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (window.confirm('请先登录后再创建教程，是否前往登录？')) {
        navigate('/login', { state: { from: '/user/create-tutorial' } });
      }
      return;
    }

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
    if (!formData.category) {
      alert('请选择教程分类');
      return;
    }

    const validChapters = chapters.filter(c => c.title.trim());
    if (validChapters.length === 0) {
      alert('请至少填写一个章节标题');
      return;
    }

    setIsSubmitting(true);
    
    // 获取当前用户信息
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const tutorialData = {
      ...formData,
      id: isEditMode ? editData.id : Date.now(),
      status: isDraft ? 'draft' : 'published',
      creatorName: user.nickname || user.username || '创作者',
      creatorId: user.id || 'unknown',
      chapters: chapters.map(ch => ({
        ...ch,
        lessons: ch.lessons.map(l => ({
          title: l.title,
          duration: l.duration,
          isFree: l.isFree,
          videoUrl: l.videoUrl
        }))
      })),
      totalChapters: validChapters.length,
      lessons: chapters.reduce((sum, ch) => sum + ch.lessons.length, 0),
      students: isEditMode ? (editData.students || 0) : 0,
      rating: isEditMode ? (editData.rating || 4.8) : 4.8,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };
    
    // 保存到 localStorage
    const savedTutorials = JSON.parse(localStorage.getItem('savedTutorials') || '[]');
    
    if (isEditMode) {
      const index = savedTutorials.findIndex(t => t.id === editData.id);
      if (index >= 0) {
        savedTutorials[index] = tutorialData;
      } else {
        savedTutorials.push(tutorialData);
      }
    } else {
      savedTutorials.push(tutorialData);
    }
    
    localStorage.setItem('savedTutorials', JSON.stringify(savedTutorials));
    
    // 触发更新事件
    window.dispatchEvent(new Event('creatorTutorialsUpdated'));
    
    setTimeout(() => {
      setIsSubmitting(false);
      if (isDraft) {
        alert('草稿保存成功！');
        navigate('/user/creator');
      } else {
        alert('教程发布成功！');
        navigate('/training');
      }
    }, 1000);
  };

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
            
            <div className="form-group">
              <label className="form-label">
                <Type size={16} />
                教程标题 <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="例如：AI短视频实战体系课：从零基础到职业创作者"
                className="form-input"
                maxLength={50}
              />
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
                placeholder="一句话描述课程核心价值"
                className="form-input"
                maxLength={80}
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
                placeholder="详细描述教程内容、学习收获、适用人群等"
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
                    <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                  </label>
                </div>
              </div>
            ) : (
              <label className="upload-zone">
                <Upload size={40} />
                <span>点击上传教程封面</span>
                <span className="upload-hint">建议尺寸 800x450，支持 JPG、PNG</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
              </label>
            )}
          </div>

          {/* 讲师信息 */}
          <div className="form-section">
            <h3 className="section-title">讲师信息</h3>
            
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">
                  <User size={16} />
                  讲师名称 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.teacher.name}
                  onChange={(e) => handleTeacherChange('name', e.target.value)}
                  placeholder="讲师姓名"
                  className="form-input"
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">
                  <Award size={16} />
                  讲师头衔
                </label>
                <input
                  type="text"
                  value={formData.teacher.title}
                  onChange={(e) => handleTeacherChange('title', e.target.value)}
                  placeholder="例如：AI短视频导师"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Type size={16} />
                个人简介
              </label>
              <textarea
                value={formData.teacher.bio}
                onChange={(e) => handleTeacherChange('bio', e.target.value)}
                placeholder="讲师背景介绍"
                className="form-textarea"
                rows={2}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Briefcase size={16} />
                擅长领域
              </label>
              <div className="tags-input">
                <div className="tags-list">
                  {formData.teacher.expertise.map((item, index) => (
                    <span key={index} className="tag-item">
                      {item}
                      <button onClick={() => handleRemoveExpertise(item)}><X size={12} /></button>
                    </span>
                  ))}
                </div>
                {formData.teacher.expertise.length < 5 && (
                  <input
                    type="text"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpertise())}
                    placeholder="输入后回车添加"
                    className="tag-input"
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Award size={16} />
                代表作品
              </label>
              <div className="tags-input">
                <div className="tags-list">
                  {formData.teacher.works.map((item, index) => (
                    <span key={index} className="tag-item">
                      {item}
                      <button onClick={() => handleRemoveWork(item)}><X size={12} /></button>
                    </span>
                  ))}
                </div>
                {formData.teacher.works.length < 5 && (
                  <input
                    type="text"
                    value={workInput}
                    onChange={(e) => setWorkInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddWork())}
                    placeholder="输入后回车添加"
                    className="tag-input"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 课程详情 - 富文本编辑 */}
          <div className="form-section">
            <h3 className="section-title">课程详情</h3>
            <p className="section-desc">编辑课程详情页展示内容，支持图文混排</p>
            <div className="detail-editor-container">
              <ReactQuill
                theme="snow"
                value={formData.detailContent}
                onChange={(content) => setFormData({ ...formData, detailContent: content })}
                placeholder="在这里编辑课程详情内容，可以插入图片、文字..."
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['image', 'link'],
                    ['clean']
                  ]
                }}
              />
            </div>
            <div className="detail-preview-toggle">
              <button
                type="button"
                className="preview-btn"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye size={16} />
                {showPreview ? '关闭预览' : '预览效果'}
              </button>
            </div>
            {showPreview && (
              <div className="detail-preview">
                <h4>预览效果</h4>
                <div 
                  className="preview-content"
                  dangerouslySetInnerHTML={{ __html: formData.detailContent || '<p style="color: #64748b;">暂无内容，请在上方编辑器中添加...</p>' }}
                />
              </div>
            )}
          </div>

          {/* 章节内容 */}
          <div className="form-section">
            <h3 className="section-title">课程大纲</h3>
            <div className="chapters-container">
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="chapter-card">
                  <div className="chapter-header" onClick={() => toggleChapter(chapter.id)}>
                    <div className="chapter-left">
                      <GripVertical size={18} className="drag-handle" />
                      <span className="chapter-number">第{chapterIndex + 1}章</span>
                      <select
                        value={chapter.level}
                        onChange={(e) => updateChapter(chapter.id, 'level', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="chapter-level-select"
                      >
                        {chapterLevels.map(l => (
                          <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="章节标题"
                        className="chapter-title-input"
                      />
                    </div>
                    <div className="chapter-actions" onClick={(e) => e.stopPropagation()}>
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
                                placeholder="时长"
                                className="lesson-duration-input"
                              />
                            </div>
                            <label className="free-toggle">
                              <input
                                type="checkbox"
                                checked={lesson.isFree}
                                onChange={(e) => updateLesson(chapter.id, lesson.id, 'isFree', e.target.checked)}
                              />
                              <span>免费</span>
                            </label>
                            <div className="lesson-video-actions">
                              {lesson.videoUrl ? (
                                <>
                                  <span className="video-uploaded-badge">
                                    <CheckCircle size={12} />
                                    已上传
                                  </span>
                                  <button 
                                    className="lesson-btn delete"
                                    onClick={() => updateLesson(chapter.id, lesson.id, 'videoUrl', '')}
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <label className="lesson-video-upload-btn">
                                  <Video size={14} />
                                  视频
                                  <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleLessonVideoUpload(chapter.id, lesson.id, e)}
                                    hidden
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
              教程分类 <span className="required">*</span>
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
                    <button onClick={() => handleRemoveTag(tag)}><X size={12} /></button>
                  </span>
                ))}
              </div>
              {formData.tags.length < 5 && (
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
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
              价格设置
            </label>
            <div className="price-input-group">
              <div className="price-field">
                <label>现价（元）</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className="form-input"
                />
              </div>
              <div className="price-field">
                <label>原价（元）</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  className="form-input"
                />
              </div>
            </div>
            <div className="price-field" style={{ marginTop: 12 }}>
              <label>积分价格</label>
              <input
                type="number"
                name="pointsPrice"
                value={formData.pointsPrice}
                onChange={handleInputChange}
                min="0"
                className="form-input"
              />
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
              <button onClick={() => setShowPreview(false)}><X size={20} /></button>
            </div>
            <div className="preview-body">
              {formData.coverImage && (
                <img src={formData.coverImage} alt="封面" className="preview-cover" />
              )}
              <h2>{formData.title || '教程标题'}</h2>
              {formData.subtitle && <p className="preview-subtitle">{formData.subtitle}</p>}
              <p className="preview-desc">{formData.description || '教程简介...'}</p>
              
              {formData.teacher.name && (
                <div className="preview-teacher">
                  <div className="preview-teacher-name">讲师：{formData.teacher.name}</div>
                  {formData.teacher.expertise.length > 0 && (
                    <div className="preview-teacher-expertise">
                      擅长：{formData.teacher.expertise.join('、')}
                    </div>
                  )}
                </div>
              )}
              
              <div className="preview-meta">
                <span>{chapters.length}个章节</span>
                <span>•</span>
                <span>{chapters.reduce((acc, c) => acc + c.lessons.length, 0)}个课时</span>
              </div>
              
              <div className="preview-tags">
                {formData.tags.map((tag, i) => (
                  <span key={i} className="preview-tag">{tag}</span>
                ))}
              </div>
              
              <div className="preview-price">
                <span className="preview-current-price">¥{formData.price}</span>
                <span className="preview-original-price">¥{formData.originalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

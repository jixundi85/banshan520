import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Upload, X, Image, Type, Tag, 
  DollarSign, Eye, Save, Send, Video, Play, CheckCircle,
  BookOpen, Zap, Plus, Trash2, Edit3, ChevronDown, ChevronUp,
  Lock, Unlock, Menu, GripVertical, ChevronLeft,
  Crown, ExternalLink, Link2, Star
} from 'lucide-react';
import './PublishCase.css';

export default function PublishCase() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 判断是否为编辑模式
  const editData = location.state?.caseData;
  const isEditMode = location.state?.isEdit && editData;
  
  // 目录面板状态
  const [showToc, setShowToc] = useState(true);  // 是否显示目录面板
  const [activeChapterId, setActiveChapterId] = useState(null);  // 当前激活的章节
  const chapterRefs = useRef({});  // 章节DOM引用
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    content: '',
    coverImage: '',
    category: '',
    tags: [],
    // 付费设置
    isFree: true,              // 是否完全免费
    price: 0,                  // 人民币价格（元）
    pointsPrice: 0,            // 积分解锁价格
    freeVideoPercent: 80,      // 视频免费预览百分比（默认80%）
    freeChapters: 1,           // 图文教程免费章节数（默认1章）
    isDraft: true
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState('');
  
  // 代表作设置
  const [featuredWorks, setFeaturedWorks] = useState([
    { id: 1, title: '', desc: '', cover: '', type: 'local', videoUrl: '' }
  ]);
  const [showFeaturedEditor, setShowFeaturedEditor] = useState(false);
  
  // 初始化编辑模式数据
  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        id: editData.id || null,
        title: editData.title || '',
        description: editData.description || '',
        content: editData.content || '',
        coverImage: editData.coverImage || '',
        category: editData.category || '',
        tags: editData.tags || [],
        isFree: editData.isFree !== false,
        price: editData.price || 0,
        pointsPrice: editData.pointsPrice || 0,
        freeVideoPercent: editData.freeVideoPercent || 80,
        freeChapters: editData.freeChapters || 1,
        isDraft: editData.status === 'draft'
      });
      if (editData.coverImage) {
        setUploadedImages([{ id: 1, url: editData.coverImage, name: 'cover' }]);
      }
    }
  }, [isEditMode, editData]);

  // 教程章节数据
  const [chapters, setChapters] = useState([
    {
      id: 1,
      title: '',
      duration: '3分钟',
      isFree: true,
      pointsCost: 0,  // 每个章节单独的积分价格
      steps: []
    }
  ]);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingStep, setEditingStep] = useState(null);
  const [showChapterEditor, setShowChapterEditor] = useState(false);
  
  // 自动聚焦第一个空标题章节
  useEffect(() => {
    if (!activeChapterId && chapters.length > 0) {
      setActiveChapterId(chapters[0].id);
    }
  }, [chapters]);
  
  // 滚动到指定章节
  const scrollToChapter = (chapterId) => {
    setActiveChapterId(chapterId);
    const ref = chapterRefs.current[chapterId];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // 监听滚动，自动更新当前章节
  useEffect(() => {
    const handleScroll = () => {
      let currentChapter = chapters[0]?.id;
      for (const [id, ref] of Object.entries(chapterRefs.current)) {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top <= 150) {
            currentChapter = id;
          }
        }
      }
      if (currentChapter && currentChapter !== activeChapterId) {
        setActiveChapterId(parseInt(currentChapter));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapters]);

  // 教程步骤类型
  const stepTypes = [
    { value: 'text', label: '📝 文字' },
    { value: 'image', label: '🖼️ 图片' },
    { value: 'video', label: '🎬 视频' },
    { value: 'tip', label: '💡 提示' }
  ];

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
        const newImage = {
          id: Date.now(),
          url: event.target.result,
          name: file.name
        };
        setUploadedImages(prev => [...prev, newImage]);
        if (!formData.coverImage) {
          setFormData(prev => ({ ...prev, coverImage: event.target.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetCover = (imageUrl) => {
    setFormData(prev => ({ ...prev, coverImage: imageUrl }));
  };

  const handleRemoveImage = (imageId) => {
    const image = uploadedImages.find(img => img.id === imageId);
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    if (formData.coverImage === image?.url) {
      setFormData(prev => ({ 
        ...prev, 
        coverImage: uploadedImages.length > 1 
          ? uploadedImages.find(img => img.id !== imageId)?.url 
          : '' 
      }));
    }
  };

  // 视频上传处理
  const handleVideoUpload = (e) => {
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
      setUploadedVideo({
        id: Date.now(),
        url: videoUrl,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
      
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.addEventListener('loadeddata', () => {
        video.currentTime = 1;
      });
      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg');
        setVideoThumbnail(thumbnailUrl);
        if (!formData.coverImage) {
          setFormData(prev => ({ ...prev, coverImage: thumbnailUrl }));
        }
      });
    }
  };

  const handleRemoveVideo = () => {
    if (uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo.url);
      setUploadedVideo(null);
      setVideoThumbnail('');
    }
  };

  const handleVideoThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setVideoThumbnail(event.target.result);
        setFormData(prev => ({ ...prev, coverImage: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ========== 代表作管理 ==========
  const addFeaturedWork = () => {
    if (featuredWorks.length >= 6) {
      alert('最多可设置6个代表作品');
      return;
    }
    setFeaturedWorks([...featuredWorks, { 
      id: Date.now(), 
      title: '', 
      desc: '', 
      cover: '', 
      type: 'local', 
      videoUrl: '' 
    }]);
  };

  const removeFeaturedWork = (id) => {
    if (featuredWorks.length <= 1) {
      alert('至少需要保留一个代表作品');
      return;
    }
    setFeaturedWorks(featuredWorks.filter(w => w.id !== id));
  };

  const updateFeaturedWork = (id, updates) => {
    setFeaturedWorks(featuredWorks.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
  };

  const handleFeaturedCoverUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateFeaturedWork(id, { cover: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeaturedVideoUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!validTypes.includes(file.type)) {
        alert('请上传 MP4、WebM 格式的视频文件');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        alert('视频文件大小不能超过 100MB');
        return;
      }
      const videoUrl = URL.createObjectURL(file);
      updateFeaturedWork(id, { videoUrl, type: 'local' });
    }
  };

  // ========== 教程章节管理 ==========
  const addChapter = () => {
    const newChapter = {
      id: Date.now(),
      title: '',
      duration: '3分钟',
      isFree: chapters.length < formData.freeChapters,
      pointsCost: 0,  // 新章节默认免费
      steps: []
    };
    setChapters([...chapters, newChapter]);
    // 自动滚动到新章节
    setTimeout(() => scrollToChapter(newChapter.id), 100);
  };

  const removeChapter = (chapterId) => {
    if (chapters.length <= 1) {
      alert('至少需要保留一个章节');
      return;
    }
    setChapters(chapters.filter(c => c.id !== chapterId));
  };

  const updateChapter = (chapterId, updates) => {
    setChapters(chapters.map(c => {
      if (c.id === chapterId) {
        // 如果修改了 isFree，同步更新 freeChapters
        if (updates.isFree !== undefined && updates.isFree !== c.isFree) {
          const freeCount = updates.isFree 
            ? (chapters.filter(ch => ch.id === chapterId || ch.isFree).length)
            : (chapters.filter(ch => ch.id !== chapterId && ch.isFree).length - 1);
          if (updates.isFree) {
            setFormData(prev => ({ ...prev, freeChapters: Math.max(prev.freeChapters, freeCount) }));
          }
        }
        return { ...c, ...updates };
      }
      return c;
    }));
    // 同步更新 activeChapterId
    if (updates.title !== undefined) {
      setActiveChapterId(chapterId);
    }
  };

  // ========== 教程步骤管理 ==========
  const addStep = (chapterId, stepType = 'text') => {
    const newStep = createStep(stepType);
    setChapters(chapters.map(c => {
      if (c.id === chapterId) {
        return { ...c, steps: [...c.steps, newStep] };
      }
      return c;
    }));
  };

  const createStep = (type) => {
    switch (type) {
      case 'text':
        return { type: 'text', content: '' };
      case 'image':
        return { type: 'image', src: '', caption: '' };
      case 'video':
        return { type: 'video', src: '', title: '' };
      case 'tip':
        return { type: 'tip', icon: '💡', title: '', content: '' };
      default:
        return { type: 'text', content: '' };
    }
  };

  const updateStep = (chapterId, stepIndex, updates) => {
    setChapters(chapters.map(c => {
      if (c.id === chapterId) {
        const newSteps = [...c.steps];
        newSteps[stepIndex] = { ...newSteps[stepIndex], ...updates };
        return { ...c, steps: newSteps };
      }
      return c;
    }));
  };

  const removeStep = (chapterId, stepIndex) => {
    setChapters(chapters.map(c => {
      if (c.id === chapterId) {
        return { ...c, steps: c.steps.filter((_, i) => i !== stepIndex) };
      }
      return c;
    }));
  };

  const handleStepImageUpload = (chapterId, stepIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateStep(chapterId, stepIndex, { src: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 步骤视频上传处理
  const handleStepVideoUpload = (chapterId, stepIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!validTypes.includes(file.type)) {
        alert('请上传 MP4、WebM 或 MOV 格式的视频文件');
        return;
      }
      if (file.size > 200 * 1024 * 1024) { // 限制200MB
        alert('视频文件大小不能超过 200MB');
        return;
      }
      
      const videoUrl = URL.createObjectURL(file);
      updateStep(chapterId, stepIndex, { src: videoUrl, fileName: file.name });
    }
  };

  // 步骤视频标题更新
  const handleStepVideoTitleChange = (chapterId, stepIndex, value) => {
    updateStep(chapterId, stepIndex, { title: value });
  };

  const handleSubmit = async (isDraft = true) => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (window.confirm('请先登录后再发布案例，是否前往登录？')) {
        navigate('/login', { state: { from: '/user/publish-case' } });
      }
      return;
    }

    if (!formData.title.trim()) {
      alert('请输入案例标题');
      return;
    }
    if (!formData.description.trim()) {
      alert('请输入案例描述');
      return;
    }
    if (!formData.coverImage) {
      alert('请上传案例封面图');
      return;
    }
    if (!formData.category) {
      alert('请选择案例分类');
      return;
    }

    // 验证章节数据
    const validChapters = chapters.filter(c => c.title.trim() !== '' || c.steps.length > 0);
    if (validChapters.length === 0) {
      alert('请至少添加一个带标题的教程章节');
      return;
    }

    setIsSubmitting(true);
    
    // 构建教程数据
    const tutorialData = {
      totalChapters: validChapters.length,
      freeChapters: Math.min(formData.freeChapters, validChapters.length),
      chapters: validChapters.map((c, index) => ({
        id: index + 1,
        title: c.title || `第${index + 1}章`,
        duration: c.duration || '3分钟',
        isFree: c.isFree,  // 使用章节自己的设置
        pointsCost: c.pointsCost || 0,  // 保存章节的积分价格
        steps: c.steps.filter(s => s.content || s.src)
      }))
    };

    // 过滤有效的代表作
    const validFeaturedWorks = featuredWorks.filter(w => w.title.trim() && w.cover);
    
    const caseData = {
      id: Date.now(),
      title: formData.title,
      subtitle: formData.description,
      creator: {
        name: localStorage.getItem('userName') || '我',
        avatar: (localStorage.getItem('userName') || '我').charAt(0),
        followers: 0,
        bio: 'AI创作爱好者'
      },
      thumbnail: formData.coverImage,
      videoUrl: uploadedVideo?.url || '',
      freeVideoUrl: uploadedVideo?.url || '',
      duration: '00:00',
      views: 0,
      likes: 0,
      comments: 0,
      tags: formData.tags,
      category: formData.category,
      createdAt: new Date().toISOString().split('T')[0],
      isFree: formData.isFree,
      price: formData.price || 0,
      pointsPrice: formData.pointsPrice || 0,
      freeVideoPercent: formData.freeVideoPercent,
      freeChapters: tutorialData.freeChapters,
      unlockPoints: formData.pointsPrice || 0,
      tutorial: tutorialData,
      relatedCases: [],
      isDraft: isDraft,
      status: isDraft ? 'draft' : 'published',
      featuredWorks: validFeaturedWorks
    };

    const existingCases = JSON.parse(localStorage.getItem('publishedCases') || '[]');
    
    if (isDraft) {
      const draftIndex = existingCases.findIndex(c => c.id === caseData.id);
      if (draftIndex >= 0) {
        existingCases[draftIndex] = caseData;
      } else {
        existingCases.push(caseData);
      }
      localStorage.setItem('publishedCases', JSON.stringify(existingCases));
      setIsSubmitting(false);
      alert('草稿保存成功！');
      navigate('/user/creator');
    } else {
      const filteredCases = existingCases.filter(c => c.id !== caseData.id);
      filteredCases.unshift({ ...caseData, isDraft: false, status: 'published' });
      localStorage.setItem('publishedCases', JSON.stringify(filteredCases));
      
      // 处理视频时长（添加超时保护）
      const updateDuration = (durationStr) => {
        const updatedCases = JSON.parse(localStorage.getItem('publishedCases') || '[]');
        const caseIndex = updatedCases.findIndex(c => c.id === caseData.id);
        if (caseIndex >= 0) {
          updatedCases[caseIndex].duration = durationStr;
          localStorage.setItem('publishedCases', JSON.stringify(updatedCases));
        }
      };
      
      if (uploadedVideo?.url) {
        const video = document.createElement('video');
        video.src = uploadedVideo.url;
        
        // 设置超时保护，3秒后自动继续
        const timeout = setTimeout(() => {
          updateDuration('0:00');
          finishPublish();
        }, 3000);
        
        video.onloadedmetadata = () => {
          clearTimeout(timeout);
          const duration = Math.floor(video.duration);
          const minutes = Math.floor(duration / 60);
          const seconds = duration % 60;
          const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          updateDuration(durationStr);
          finishPublish();
        };
        
        video.onerror = () => {
          clearTimeout(timeout);
          updateDuration('0:00');
          finishPublish();
        };
      } else {
        // 没有视频时直接完成发布
        finishPublish();
      }
      
      function finishPublish() {
        setIsSubmitting(false);
        alert('案例发布成功！即将跳转到培训孵化页面...');
        navigate('/training');
      }
    }
  };

  // 分类
  const categories = [
    { value: 'shortvideo', label: '🎬 AI短视频' },
    { value: 'shortdrama', label: '🎭 AI短剧' },
    { value: 'mangadrama', label: '📚 AI漫剧' },
    { value: 'film', label: '🎥 AI电影' },
    { value: 'designer', label: '🎨 AI设计师' },
    { value: 'commerce', label: '💰 AI带货变现' }
  ];

  return (
    <div className="publish-case-page">
      <div className="publish-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/user/creator')}>
            <ArrowLeft size={20} />
          </button>
          <h1>{isEditMode ? '编辑案例' : '发布案例'}</h1>
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
            {isSubmitting ? '发布中...' : '立即发布'}
          </button>
        </div>
      </div>

      <div className="publish-content">
        {/* ========== 左侧目录面板 ========== */}
        <div className={`toc-panel ${showToc ? 'open' : ''}`}>
          <div className="toc-header">
            <div className="toc-title">
              <BookOpen size={16} />
              <span>目录导航</span>
            </div>
            <button className="toc-toggle" onClick={() => setShowToc(!showToc)}>
              {showToc ? <ChevronLeft size={18} /> : <Menu size={18} />}
            </button>
          </div>
          
          {showToc && (
            <div className="toc-list">
              {chapters.length === 0 ? (
                <div className="toc-empty">暂无章节</div>
              ) : (
                chapters.map((chapter, index) => (
                  <div 
                    key={chapter.id}
                    className={`toc-item ${activeChapterId === chapter.id ? 'active' : ''}`}
                    onClick={() => scrollToChapter(chapter.id)}
                  >
                    <div className="toc-item-left">
                      <span className="toc-number">{index + 1}</span>
                      <span className="toc-item-title">
                        {chapter.title || `第${index + 1}章`}
                      </span>
                    </div>
                    <div className="toc-item-right">
                      {chapter.isFree ? (
                        <Unlock size={14} className="toc-free-icon" />
                      ) : (
                        <Lock size={14} className="toc-lock-icon" />
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {/* 统计信息 */}
              <div className="toc-stats">
                <div className="toc-stat-item">
                  <span className="toc-stat-label">免费章节</span>
                  <span className="toc-stat-value free">{chapters.filter(c => c.isFree).length}</span>
                </div>
                <div className="toc-stat-item">
                  <span className="toc-stat-label">付费章节</span>
                  <span className="toc-stat-value locked">{chapters.filter(c => !c.isFree).length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="form-main" ref={el => chapterRefs.current['main'] = el}>
          {/* 标题 */}
          <div className="form-section">
            <label className="form-label">
              <Type size={16} />
              案例标题 <span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="请输入案例标题，简洁明了更能吸引关注"
              className="form-input"
              maxLength={50}
            />
            <div className="input-hint">{formData.title.length}/50</div>
          </div>

          {/* 描述 */}
          <div className="form-section">
            <label className="form-label">
              <Type size={16} />
              案例描述 <span className="required">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="简要描述这个案例的背景、目标和亮点"
              className="form-textarea"
              rows={3}
              maxLength={200}
            />
            <div className="input-hint">{formData.description.length}/200</div>
          </div>

          {/* 封面图 */}
          <div className="form-section">
            <label className="form-label">
              <Image size={16} />
              封面图片 <span className="required">*</span>
            </label>
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
                <span>点击上传封面图片</span>
                <span className="upload-hint">建议尺寸 800x600，支持 JPG、PNG</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* 视频上传 */}
          <div className="form-section">
            <label className="form-label">
              <Video size={16} />
              案例视频（可选）
            </label>
            {uploadedVideo ? (
              <div className="video-uploaded">
                <div className="video-preview">
                  {videoThumbnail ? (
                    <img src={videoThumbnail} alt="视频预览" />
                  ) : (
                    <div className="video-placeholder">
                      <Video size={40} />
                    </div>
                  )}
                  <div className="video-play-overlay">
                    <div className="play-btn-large">
                      <Play size={24} />
                    </div>
                  </div>
                </div>
                <div className="video-info">
                  <div className="video-name">
                    <CheckCircle size={16} className="video-check" />
                    <span>{uploadedVideo.name}</span>
                  </div>
                  <div className="video-size">{uploadedVideo.size}</div>
                  <div className="video-actions">
                    <label className="video-action-btn">
                      <Upload size={14} />
                      更换视频
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        onChange={handleVideoUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <button className="video-action-btn delete" onClick={handleRemoveVideo}>
                      <X size={14} />
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="upload-zone video-upload-zone">
                <Upload size={40} />
                <span>点击上传案例视频</span>
                <span className="upload-hint">支持 MP4、WebM、MOV 格式，最大 500MB</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleVideoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* ========== 代表作品设置 ========== */}
          <div className="form-section featured-works-section">
            <label className="form-label">
              <Crown size={16} />
              代表作品
              <span className="label-hint">（展示在讲师卡片中，最多6个）</span>
            </label>
            
            <div className="featured-works-list">
              {featuredWorks.map((work, index) => (
                <div key={work.id} className="featured-work-item">
                  <div className="featured-work-header">
                    <span className="featured-work-num">作品 {index + 1}</span>
                    <button 
                      className="featured-work-remove"
                      onClick={() => removeFeaturedWork(work.id)}
                      title="删除"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="featured-work-content">
                    {/* 封面图 */}
                    <div className="featured-work-cover">
                      {work.cover ? (
                        <div className="featured-cover-preview">
                          <img src={work.cover} alt={work.title} />
                          <label className="featured-cover-change">
                            <Upload size={14} />
                            更换
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFeaturedCoverUpload(work.id, e)}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="featured-cover-upload">
                          <Image size={24} />
                          <span>上传封面</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFeaturedCoverUpload(work.id, e)}
                            style={{ display: 'none' }}
                          />
                        </label>
                      )}
                    </div>
                    
                    <div className="featured-work-fields">
                      {/* 作品标题 */}
                      <input
                        type="text"
                        placeholder="作品标题"
                        value={work.title}
                        onChange={(e) => updateFeaturedWork(work.id, { title: e.target.value })}
                        className="featured-work-title-input"
                      />
                      
                      {/* 作品描述 */}
                      <input
                        type="text"
                        placeholder="简短描述（如：抖音爆款内容创作心法）"
                        value={work.desc}
                        onChange={(e) => updateFeaturedWork(work.id, { desc: e.target.value })}
                        className="featured-work-desc-input"
                      />
                      
                      {/* 类型选择 */}
                      <div className="featured-work-type">
                        <label className="featured-type-label">来源：</label>
                        <select
                          value={work.type}
                          onChange={(e) => updateFeaturedWork(work.id, { type: e.target.value })}
                          className="featured-type-select"
                        >
                          <option value="local">本地上传</option>
                          <option value="douyin">抖音</option>
                          <option value="wechat">视频号</option>
                          <option value="link">外部链接</option>
                        </select>
                      </div>
                      
                      {/* 根据类型显示不同输入 */}
                      {work.type === 'local' && (
                        <div className="featured-work-video">
                          {work.videoUrl ? (
                            <div className="featured-video-uploaded">
                              <span className="featured-video-name">
                                <CheckCircle size={14} /> 视频已上传
                              </span>
                              <label className="featured-video-change">
                                <Upload size={12} /> 更换
                                <input
                                  type="file"
                                  accept="video/mp4,video/webm"
                                  onChange={(e) => handleFeaturedVideoUpload(work.id, e)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                            </div>
                          ) : (
                            <label className="featured-video-upload">
                              <Video size={16} />
                              <span>上传视频</span>
                              <input
                                type="file"
                                accept="video/mp4,video/webm"
                                onChange={(e) => handleFeaturedVideoUpload(work.id, e)}
                                style={{ display: 'none' }}
                              />
                            </label>
                          )}
                        </div>
                      )}
                      
                      {(work.type === 'douyin' || work.type === 'wechat' || work.type === 'link') && (
                        <div className="featured-work-link">
                          <Link2 size={14} />
                          <input
                            type="text"
                            placeholder={work.type === 'douyin' ? '抖音视频链接' : work.type === 'wechat' ? '视频号链接' : '外部链接'}
                            value={work.platformUrl || ''}
                            onChange={(e) => updateFeaturedWork(work.id, { platformUrl: e.target.value })}
                            className="featured-link-input"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                className="add-featured-work-btn"
                onClick={addFeaturedWork}
                disabled={featuredWorks.length >= 6}
              >
                <Plus size={16} />
                添加代表作品 ({featuredWorks.length}/6)
              </button>
            </div>
          </div>

          {/* ========== 图文教程编辑 ========== */}
          <div className="form-section tutorial-section">
            <label className="form-label">
              <BookOpen size={16} />
              图文拆解教程
              <span className="label-hint">（用户可在案例详情页查看部分免费章节）</span>
            </label>

            <div className="tutorial-editor">
              {chapters.map((chapter, chapterIndex) => (
                <div 
                  key={chapter.id} 
                  className={`tutorial-chapter-editor ${activeChapterId === chapter.id ? 'active' : ''}`}
                  ref={el => chapterRefs.current[chapter.id] = el}
                >
                  <div className="chapter-header">
                    <div className="chapter-number">第 {chapterIndex + 1} 章</div>
                    <div className="chapter-title-input">
                      <input
                        type="text"
                        placeholder="输入章节标题，如：第一章 选题与策划"
                        value={chapter.title}
                        onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                        className="chapter-title-field"
                      />
                    </div>
                    <div className="chapter-duration-input">
                      <input
                        type="text"
                        placeholder="时长"
                        value={chapter.duration}
                        onChange={(e) => updateChapter(chapter.id, { duration: e.target.value })}
                        className="duration-field"
                      />
                    </div>
                    
                    {/* 章节付费设置 */}
                    {!formData.isFree && (
                      <div className="chapter-price-toggle">
                        <button 
                          className={`chapter-price-btn ${chapter.isFree ? 'free' : 'paid'}`}
                          onClick={() => updateChapter(chapter.id, { 
                            isFree: !chapter.isFree,
                            pointsCost: !chapter.isFree ? 0 : formData.pointsPrice
                          })}
                          title={chapter.isFree ? '点击设为付费章节' : '点击设为免费章节'}
                        >
                          {chapter.isFree ? (
                            <>
                              <Unlock size={14} />
                              <span>免费</span>
                            </>
                          ) : (
                            <>
                              <Lock size={14} />
                              <span>{chapter.pointsCost > 0 ? `${chapter.pointsCost}积分` : '付费'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    
                    <button 
                      className="chapter-delete-btn"
                      onClick={() => removeChapter(chapter.id)}
                      title="删除章节"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {/* 付费章节积分设置 */}
                  {!formData.isFree && !chapter.isFree && (
                    <div className="chapter-points-setting">
                      <label className="chapter-points-label">
                        <Zap size={12} />
                        积分解锁价格
                      </label>
                      <input
                        type="number"
                        className="chapter-points-input"
                        value={chapter.pointsCost || ''}
                        onChange={(e) => updateChapter(chapter.id, { pointsCost: parseInt(e.target.value) || 0 })}
                        placeholder="如：50"
                        min="0"
                      />
                      <span className="chapter-points-unit">积分</span>
                    </div>
                  )}

                  {/* 章节内容步骤 */}
                  <div className="chapter-steps">
                    {chapter.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="step-item">
                        <div className="step-type-badge">
                          {step.type === 'text' && '📝'}
                          {step.type === 'image' && '🖼️'}
                          {step.type === 'video' && '🎬'}
                          {step.type === 'tip' && '💡'}
                        </div>
                        <div className="step-content-editor">
                          {step.type === 'text' && (
                            <textarea
                              placeholder="输入文字内容，支持 Markdown 格式..."
                              value={step.content}
                              onChange={(e) => updateStep(chapter.id, stepIndex, { content: e.target.value })}
                              className="step-textarea"
                              rows={4}
                            />
                          )}
                          {step.type === 'image' && (
                            <div className="step-image-editor">
                              {step.src ? (
                                <div className="step-image-preview">
                                  <img src={step.src} alt="预览" />
                                  <button 
                                    className="step-image-change"
                                    onClick={() => document.getElementById(`step-img-${chapter.id}-${stepIndex}`).click()}
                                  >
                                    更换图片
                                  </button>
                                  <input
                                    id={`step-img-${chapter.id}-${stepIndex}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleStepImageUpload(chapter.id, stepIndex, e)}
                                    style={{ display: 'none' }}
                                  />
                                </div>
                              ) : (
                                <label className="step-image-upload">
                                  <Upload size={24} />
                                  <span>上传图片</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleStepImageUpload(chapter.id, stepIndex, e)}
                                    style={{ display: 'none' }}
                                  />
                                </label>
                              )}
                              <input
                                type="text"
                                placeholder="图片说明文字"
                                value={step.caption || ''}
                                onChange={(e) => updateStep(chapter.id, stepIndex, { caption: e.target.value })}
                                className="step-caption-input"
                              />
                            </div>
                          )}
                          {step.type === 'video' && (
                            <div className="step-video-editor">
                              <input
                                type="text"
                                placeholder="视频标题（可选）"
                                value={step.title || ''}
                                onChange={(e) => handleStepVideoTitleChange(chapter.id, stepIndex, e.target.value)}
                                className="step-video-title"
                              />
                              {step.src ? (
                                <div className="step-video-preview">
                                  <video 
                                    src={step.src} 
                                    controls 
                                    className="step-video-player"
                                    poster=""
                                  />
                                  <div className="step-video-actions">
                                    <label className="step-video-change">
                                      <Upload size={14} />
                                      更换视频
                                      <input
                                        type="file"
                                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                        onChange={(e) => handleStepVideoUpload(chapter.id, stepIndex, e)}
                                        style={{ display: 'none' }}
                                      />
                                    </label>
                                    <button 
                                      className="step-video-remove"
                                      onClick={() => updateStep(chapter.id, stepIndex, { src: '', fileName: '' })}
                                    >
                                      <X size={14} />
                                      移除
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <label className="step-video-upload">
                                  <Video size={28} />
                                  <span>上传视频片段</span>
                                  <span className="upload-hint">MP4/WebM/MOV，最大200MB</span>
                                  <input
                                    type="file"
                                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                    onChange={(e) => handleStepVideoUpload(chapter.id, stepIndex, e)}
                                    style={{ display: 'none' }}
                                  />
                                </label>
                              )}
                            </div>
                          )}
                          {step.type === 'tip' && (
                            <div className="step-tip-editor">
                              <input
                                type="text"
                                placeholder="提示标题"
                                value={step.title || ''}
                                onChange={(e) => updateStep(chapter.id, stepIndex, { title: e.target.value })}
                                className="step-tip-title"
                              />
                              <textarea
                                placeholder="提示内容..."
                                value={step.content}
                                onChange={(e) => updateStep(chapter.id, stepIndex, { content: e.target.value })}
                                className="step-textarea"
                                rows={3}
                              />
                            </div>
                          )}
                        </div>
                        <button 
                          className="step-delete-btn"
                          onClick={() => removeStep(chapter.id, stepIndex)}
                          title="删除此步骤"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* 添加步骤按钮 */}
                  <div className="add-step-buttons">
                    {stepTypes.map(st => (
                      <button
                        key={st.value}
                        className="add-step-btn"
                        onClick={() => addStep(chapter.id, st.value)}
                      >
                        <Plus size={14} /> {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* 添加章节按钮 */}
              <button className="add-chapter-btn" onClick={addChapter}>
                <Plus size={18} />
                添加新章节
              </button>
            </div>
          </div>
        </div>

        <div className="form-sidebar">
          {/* 分类 */}
          <div className="sidebar-section">
            <label className="form-label">
              <Tag size={16} />
              案例分类
            </label>
            <select
              name="category"
              className="form-select"
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
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
                  placeholder="输入标签后回车添加"
                  className="tag-input"
                />
              )}
            </div>
          </div>

          {/* 付费设置 */}
          <div className="sidebar-section">
            <label className="form-label">
              <DollarSign size={16} />
              付费设置
            </label>
            
            {/* 完全免费开关 */}
            <div className="price-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    isFree: e.target.checked, 
                    price: 0, 
                    pointsPrice: 0 
                  }))}
                  name="isFree"
                />
                <span className="toggle-switch"></span>
                <span>完全免费（所有内容免费看）</span>
              </label>
            </div>
            
            {!formData.isFree && (
              <>
                {/* 价格信息提示 */}
                <div className="price-info-box">
                  <div className="price-info-icon">💡</div>
                  <div className="price-info-text">
                    设置付费后，用户需要购买才能查看完整内容。
                    <br/>建议同时设置积分和人民币两种价格。
                  </div>
                </div>
                
                {/* 视频免费预览比例 */}
                <div className="price-detail-item">
                  <label className="price-detail-label">
                    <Video size={14} />
                    视频免费预览
                  </label>
                  <div className="price-detail-input">
                    <input
                      type="range"
                      min="10"
                      max="90"
                      step="10"
                      value={formData.freeVideoPercent}
                      onChange={(e) => setFormData(prev => ({ ...prev, freeVideoPercent: parseInt(e.target.value) }))}
                      className="price-range"
                    />
                    <span className="price-range-value">{formData.freeVideoPercent}%</span>
                  </div>
                  <div className="price-detail-hint">
                    用户可免费观看前 {formData.freeVideoPercent}% 的视频
                  </div>
                </div>
                
                {/* 图文教程免费章节 */}
                <div className="price-detail-item">
                  <label className="price-detail-label">
                    <BookOpen size={14} />
                    教程免费章节
                  </label>
                  <div className="price-detail-input">
                    <input
                      type="number"
                      value={formData.freeChapters}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        freeChapters: Math.max(1, Math.min(parseInt(e.target.value) || 1, chapters.length))
                      }))}
                      min="1"
                      max={chapters.length}
                      className="price-number"
                    />
                    <span className="price-unit">章</span>
                  </div>
                  <div className="price-detail-hint">
                    前 {Math.min(formData.freeChapters, chapters.length)} 章图文教程免费看
                  </div>
                </div>
                
                {/* 积分解锁价格 */}
                <div className="price-detail-item">
                  <label className="price-detail-label">
                    <Zap size={14} />
                    积分解锁价格
                  </label>
                  <div className="price-detail-input">
                    <input
                      type="number"
                      name="pointsPrice"
                      value={formData.pointsPrice || ''}
                      onChange={handleInputChange}
                      placeholder="如：99"
                      min="0"
                      max="9999"
                      className="price-number"
                    />
                    <span className="price-unit">积分</span>
                  </div>
                  <div className="price-detail-hint">
                    用户可用积分购买，建议设为 50-500 积分
                  </div>
                </div>
                
                {/* 人民币价格 */}
                <div className="price-detail-item">
                  <label className="price-detail-label">
                    <DollarSign size={14} />
                    人民币价格（可选）
                  </label>
                  <div className="price-detail-input">
                    <span className="price-currency">¥</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleInputChange}
                      placeholder="如：9.9"
                      min="0"
                      max="999"
                      step="0.1"
                      className="price-number"
                    />
                  </div>
                  <div className="price-detail-hint">
                    如不设置，仅支持积分购买
                  </div>
                </div>
                
                {/* 价格预览 */}
                {(formData.price > 0 || formData.pointsPrice > 0) && (
                  <div className="price-preview-box">
                    <div className="price-preview-title">📋 解锁内容</div>
                    <ul className="price-preview-list">
                      <li>✓ 完整视频（100%）</li>
                      <li>✓ 全部图文教程</li>
                      <li>✓ 配套素材资源</li>
                      <li>✓ 永久查看权限</li>
                    </ul>
                    <div className="price-preview-amount">
                      {formData.price > 0 && <span>¥{formData.price}</span>}
                      {formData.price > 0 && formData.pointsPrice > 0 && <span className="price-or">或</span>}
                      {formData.pointsPrice > 0 && <span>{formData.pointsPrice}积分</span>}
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div className="price-hint">
              {formData.isFree 
                ? '🌟 免费案例可获得更多曝光和关注' 
                : '💰 设置合理价格可获得稳定收益'}
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
              <span>案例预览</span>
              <button onClick={() => setShowPreview(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="preview-body">
              {formData.coverImage && (
                <img src={formData.coverImage} alt="封面" className="preview-cover" />
              )}
              <h2>{formData.title || '案例标题'}</h2>
              <p className="preview-desc">{formData.description || '案例描述...'}</p>
              <div className="preview-tags">
                {formData.tags.map((tag, i) => (
                  <span key={i} className="preview-tag">{tag}</span>
                ))}
              </div>
              {chapters.length > 0 && (
                <div className="preview-chapters">
                  <div className="preview-chapters-title">📚 教程章节</div>
                  {chapters.map((c, i) => (
                    <div key={c.id} className="preview-chapter-item">
                      <span>{c.title || `第${i+1}章`}</span>
                      <span className="preview-chapter-steps">{c.steps.length} 个步骤</span>
                    </div>
                  ))}
                </div>
              )}
              {!formData.isFree && (formData.price > 0 || formData.pointsPrice > 0) && (
                <div className="preview-price">
                  <DollarSign size={16} />
                  <span>
                    {formData.price > 0 && `¥${formData.price}`}
                    {formData.price > 0 && formData.pointsPrice > 0 && ' 或 '}
                    {formData.pointsPrice > 0 && `${formData.pointsPrice}积分`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { aiService, AI_MODELS } from '../../services/comprehensiveAIService'
import './AIConfigPage.css'

const AIConfigPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const [config, setConfig] = useState({
    // 对话模型
    openai: '',
    anthropic: '',
    gemini: '',
    qwen: '',
    zhipu: '',
    doubao: '',
    ernie: '',
    xunfei: '',
    hunyuan: '',
    stability: '',
    // 图像模型
    pollinations: 'free',
    // 视频生成模型
    kling: '',
    haibo: '',
    jimeng: '',
    cogvideo: '',
    hunyuan_video: '',
    luma: '',
    runway: '',
    pika: '',
    // 语音合成
    minimax_tts: '',
    fish_tts: '',
    cosyvoice: ''
  })
  
  const [testResults, setTestResults] = useState({})
  const [testing, setTesting] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedConfig = localStorage.getItem('ai_api_config')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }, [])

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem('ai_api_config', JSON.stringify(config))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTest = async (provider) => {
    setTesting(provider)
    setTestResults(prev => ({ ...prev, [provider]: 'testing' }))
    
    try {
      const testMessage = [{ role: 'user', content: '请回复"测试成功"，只需回复这四个字。' }]
      
      switch (provider) {
        case 'openai':
          if (!config.openai) throw new Error('请先输入 API Key')
          await testOpenAI(config.openai, testMessage)
          break
        case 'anthropic':
          if (!config.anthropic) throw new Error('请先输入 API Key')
          await testAnthropic(config.anthropic, testMessage)
          break
        case 'gemini':
          if (!config.gemini) throw new Error('请先输入 API Key')
          await testGemini(config.gemini, testMessage)
          break
        case 'qwen':
          if (!config.qwen) throw new Error('请先输入 API Key')
          await testQwen(config.qwen, testMessage)
          break
        case 'zhipu':
          if (!config.zhipu) throw new Error('请先输入 API Key')
          await testZhipu(config.zhipu, testMessage)
          break
        case 'doubao':
          if (!config.doubao) throw new Error('请先输入 API Key')
          await testDoubao(config.doubao, testMessage)
          break
        case 'pollinations':
          await testPollinations()
          break
        default:
          throw new Error('暂不支持测试此模型')
      }
      
      setTestResults(prev => ({ ...prev, [provider]: 'success' }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, [provider]: 'error' }))
      alert(`${getProviderName(provider)} 测试失败: ${error.message}`)
    } finally {
      setTesting(null)
    }
  }

  const testOpenAI = async (apiKey, messages) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 50
      })
    })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'API Key 无效')
    }
    return response.json()
  }

  const testAnthropic = async (apiKey, messages) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 50,
        messages
      })
    })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'API Key 无效')
    }
    return response.json()
  }

  const testGemini = async (apiKey, messages) => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: messages[0].content }] }],
          generationConfig: { maxOutputTokens: 50 }
        })
      }
    )
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'API Key 无效')
    }
    return response.json()
  }

  const testQwen = async (apiKey, messages) => {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages,
        max_tokens: 50
      })
    })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'API Key 无效')
    }
    return response.json()
  }

  const testZhipu = async (apiKey, messages) => {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages
      })
    })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'API Key 无效')
    }
    return response.json()
  }

  const testDoubao = async (apiKey, messages) => {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'doubao-lite-32k',
        messages
      })
    })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'API Key 无效')
    }
    return response.json()
  }

  const testPollinations = async () => {
    const params = new URLSearchParams({
      prompt: 'a cute cat',
      width: '256',
      height: '256',
      nolog: 'true'
    })
    const response = await fetch(`https://image.pollinations.ai/${params.toString()}`)
    if (!response.ok) throw new Error('网络请求失败')
    return { success: true }
  }

  const getProviderName = (provider) => {
    const names = {
      openai: 'OpenAI (GPT)',
      anthropic: 'Anthropic (Claude)',
      gemini: 'Google (Gemini)',
      qwen: '通义千问',
      zhipu: '智谱GLM',
      doubao: '豆包',
      pollinations: 'Pollinations (免费)',
      stability: 'Stability AI',
      // 视频模型
      kling: '可灵 AI (快手)',
      haibo: '海螺 AI (字节)',
      jimeng: '即梦 (字节)',
      cogvideo: 'CogVideoX (智谱)',
      hunyuan_video: '混元视频 (腾讯)',
      luma: 'Luma Dream Machine',
      runway: 'Runway Gen-3',
      pika: 'Pika',
      // 语音模型
      minimax_tts: 'MiniMax 语音',
      fish_tts: 'Fish TTS',
      cosyvoice: 'CosyVoice (阿里)'
    }
    return names[provider] || provider
  }

  return (
    <div className="ai-config-page">
      <div className="config-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          返回
        </button>
        <h1>AI 模型配置</h1>
        <p className="subtitle">配置您的API密钥以启用真实AI能力</p>
      </div>

      <div className="config-content">
        <div className="free-models-banner">
          <span className="free-badge">免费</span>
          <div className="free-info">
            <strong>Pollinations AI</strong> - 无需API Key，直接可用
            <br />
            <span className="free-models">支持 Flux、Turbo 等图像生成模型</span>
          </div>
          <button 
            className={`test-btn ${testResults.pollinations === 'success' ? 'success' : ''}`}
            onClick={() => handleTest('pollinations')}
            disabled={testing === 'pollinations'}
          >
            {testing === 'pollinations' ? '测试中...' : testResults.pollinations === 'success' ? '可用' : '测试'}
          </button>
        </div>

        <div className="models-grid">
          {/* 对话模型 */}
          <div className="config-section-title">
            <span>💬 对话模型</span>
          </div>
          {[
            { key: 'openai', name: 'OpenAI', icon: '🤖', desc: 'GPT-4o, GPT-4, DALL-E 3' },
            { key: 'anthropic', name: 'Anthropic', icon: '🧠', desc: 'Claude 3.5 Sonnet, Claude 3' },
            { key: 'gemini', name: 'Google Gemini', icon: '✨', desc: 'Gemini 1.5 Pro, Gemini 2.0 Flash' },
            { key: 'qwen', name: '通义千问', icon: '🐱', desc: 'Qwen2-72B, Qwen-Max, Qwen-VL' },
            { key: 'zhipu', name: '智谱GLM', icon: '🔮', desc: 'GLM-4, GLM-4V, CogVideoX' },
            { key: 'doubao', name: '豆包', icon: '🥜', desc: '豆包 Pro, 豆包 Lite, 海螺视频' }
          ].map(provider => (
            <div key={provider.key} className="model-card">
              <div className="model-header">
                <span className="model-icon">{provider.icon}</span>
                <h3>{provider.name}</h3>
              </div>
              <p className="model-desc">{provider.desc}</p>
              
              <div className="input-group">
                <input
                  type="password"
                  value={config[provider.key]}
                  onChange={(e) => handleChange(provider.key, e.target.value)}
                  placeholder={`输入 ${provider.name} API Key`}
                />
              </div>
              
              <div className="model-actions">
                <button
                  className={`test-btn ${testResults[provider.key] === 'success' ? 'success' : testResults[provider.key] === 'error' ? 'error' : ''}`}
                  onClick={() => handleTest(provider.key)}
                  disabled={testing === provider.key || !config[provider.key]}
                >
                  {testing === provider.key ? '测试中...' :
                   testResults[provider.key] === 'success' ? '可用' :
                   testResults[provider.key] === 'error' ? '失败' : '测试连接'}
                </button>
              </div>
            </div>
          ))}

          {/* 视频生成模型 */}
          <div className="config-section-title">
            <span>🎬 视频生成模型</span>
          </div>
          {[
            { key: 'kling', name: '可灵 AI', icon: '🎯', desc: '快手旗下，高质量视频生成', tag: '推荐' },
            { key: 'haibo', name: '海螺 AI', icon: '🐚', desc: '字节跳动，即梦同源' },
            { key: 'jimeng', name: '即梦', icon: '✨', desc: '字节跳动，支持图片生视频' },
            { key: 'cogvideo', name: 'CogVideoX', icon: '🔮', desc: '智谱AI，开源可控' },
            { key: 'hunyuan_video', name: '混元视频', icon: '🐧', desc: '腾讯视频生成' },
            { key: 'luma', name: 'Luma Dream Machine', icon: '💫', desc: '好莱坞级视频质量' },
            { key: 'runway', name: 'Runway Gen-3', icon: '🎬', desc: 'AI影视级视频生成' },
            { key: 'pika', name: 'Pika', icon: '🎈', desc: '快速视频生成' }
          ].map(provider => (
            <div key={provider.key} className="model-card">
              <div className="model-header">
                <span className="model-icon">{provider.icon}</span>
                <h3>{provider.name}</h3>
                {provider.tag && <span className="model-tag">{provider.tag}</span>}
              </div>
              <p className="model-desc">{provider.desc}</p>
              
              <div className="input-group">
                <input
                  type="password"
                  value={config[provider.key]}
                  onChange={(e) => handleChange(provider.key, e.target.value)}
                  placeholder={`输入 ${provider.name} API Key`}
                />
              </div>
              
              <div className="model-actions">
                <button
                  className={`test-btn ${testResults[provider.key] === 'success' ? 'success' : testResults[provider.key] === 'error' ? 'error' : ''}`}
                  onClick={() => handleTest(provider.key)}
                  disabled={testing === provider.key || !config[provider.key]}
                >
                  {testing === provider.key ? '测试中...' :
                   testResults[provider.key] === 'success' ? '可用' :
                   testResults[provider.key] === 'error' ? '失败' : '测试连接'}
                </button>
              </div>
            </div>
          ))}

          {/* 语音合成模型 */}
          <div className="config-section-title">
            <span>🎙️ 语音合成模型</span>
          </div>
          {[
            { key: 'openai_tts', name: 'OpenAI TTS', icon: '🔊', desc: '标准语音合成' },
            { key: 'azure_tts', name: 'Azure 语音', icon: '☁️', desc: '微软云语音，多语言' },
            { key: 'minimax_tts', name: 'MiniMax 语音', icon: '🎙️', desc: '高质量语音克隆' },
            { key: 'fish_tts', name: 'Fish TTS', icon: '🐟', desc: '情感语音合成' },
            { key: 'cosyvoice', name: 'CosyVoice', icon: '🏠', desc: '阿里开源语音' }
          ].map(provider => (
            <div key={provider.key} className="model-card">
              <div className="model-header">
                <span className="model-icon">{provider.icon}</span>
                <h3>{provider.name}</h3>
              </div>
              <p className="model-desc">{provider.desc}</p>
              
              <div className="input-group">
                <input
                  type="password"
                  value={config[provider.key]}
                  onChange={(e) => handleChange(provider.key, e.target.value)}
                  placeholder={`输入 ${provider.name} API Key`}
                />
              </div>
              
              <div className="model-actions">
                <button
                  className={`test-btn ${testResults[provider.key] === 'success' ? 'success' : testResults[provider.key] === 'error' ? 'error' : ''}`}
                  onClick={() => handleTest(provider.key)}
                  disabled={testing === provider.key || !config[provider.key]}
                >
                  {testing === provider.key ? '测试中...' :
                   testResults[provider.key] === 'success' ? '可用' :
                   testResults[provider.key] === 'error' ? '失败' : '测试连接'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="save-section">
          <button className="save-btn" onClick={handleSave}>
            {saved ? '已保存' : '保存配置'}
          </button>
        </div>

        <div className="usage-guide">
          <h3>获取 API Key</h3>
          <div className="guide-links">
            <div className="guide-group">
              <span className="guide-label">💬 对话模型</span>
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI</a>
              <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">Anthropic</a>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google</a>
              <a href="https://dashscope.console.aliyun.com/apiKey" target="_blank" rel="noopener noreferrer">通义千问</a>
              <a href="https://open.bigmodel.cn/usercenter/apikeys" target="_blank" rel="noopener noreferrer">智谱</a>
              <a href="https://console.volcengine.com/ark" target="_blank" rel="noopener noreferrer">豆包</a>
            </div>
            <div className="guide-group">
              <span className="guide-label">🎬 视频模型</span>
              <a href="https://klingai.com" target="_blank" rel="noopener noreferrer">可灵AI</a>
              <a href="https://jimeng.jianying.com" target="_blank" rel="noopener noreferrer">即梦</a>
              <a href="https://open.bigmodel.cn/usercenter/apikeys" target="_blank" rel="noopener noreferrer">CogVideoX</a>
              <a href="https://cloud.tencent.com/product/hunyuan" target="_blank" rel="noopener noreferrer">混元视频</a>
              <a href="https://lumalabs.ai/dream-machine" target="_blank" rel="noopener noreferrer">Luma</a>
              <a href="https://runwayml.com" target="_blank" rel="noopener noreferrer">Runway</a>
              <a href="https://pika.art" target="_blank" rel="noopener noreferrer">Pika</a>
            </div>
            <div className="guide-group">
              <span className="guide-label">🎙️ 语音模型</span>
              <a href="https://www.minimaxi.com/tts" target="_blank" rel="noopener noreferrer">MiniMax</a>
              <a href="https://fish.audio" target="_blank" rel="noopener noreferrer">Fish TTS</a>
              <a href="https://github.com/modelscope/CosyVoice" target="_blank" rel="noopener noreferrer">CosyVoice</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIConfigPage

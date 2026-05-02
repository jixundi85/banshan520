import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Shield, 
  Server, 
  Globe, 
  Calculator,
  CheckCircle,
  TrendingUp,
  Building2,
  ArrowRight,
  MessageCircle,
  Calendar,
  X,
  Phone,
  Mail,
  Clock,
  Users,
  Cpu,
  Database,
  HardDrive,
  Zap,
  Award,
  FileText,
  ChevronRight,
  Check
} from 'lucide-react'
import './OffshoreHub.css'

const OffshoreHub = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [calculatorData, setCalculatorData] = useState({
    projectBudget: 50000,
    isAIGC: true,
    isMSC: true,
    equipmentCost: 100000
  })
  const [showConsultModal, setShowConsultModal] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [consultForm, setConsultForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    question: ''
  })
  const [demoForm, setDemoForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    interest: ''
  })

  const calculateIncentives = () => {
    const { projectBudget, isAIGC, isMSC, equipmentCost } = calculatorData
    
    // MDAG补贴 (最高50万林吉特)
    const mdagGrant = Math.min(projectBudget * 0.3, 500000 * 1.6) // 转换为人民币
    
    // FIMI返还 (30-35%)
    const fimiRebate = isAIGC ? projectBudget * 0.325 : 0
    
    // MSC免税 (5-10年)
    const mscTaxSaving = isMSC ? projectBudget * 0.24 : 0 // 假设24%税率
    
    // 设备抵扣 (60-100%)
    const equipmentDeduction = equipmentCost * 0.8
    
    const totalBenefit = mdagGrant + fimiRebate + mscTaxSaving + equipmentDeduction
    
    return {
      mdagGrant: Math.round(mdagGrant),
      fimiRebate: Math.round(fimiRebate),
      mscTaxSaving: Math.round(mscTaxSaving),
      equipmentDeduction: Math.round(equipmentDeduction),
      totalBenefit: Math.round(totalBenefit),
      netCost: projectBudget - totalBenefit
    }
  }

  const incentives = calculateIncentives()

  const dataCenterSpecs = [
    { label: '地理位置', value: '马来西亚 · 吉隆坡', icon: MapPin },
    { label: '合规认证', value: 'ISO 27001 / SOC 2 Type II', icon: Shield },
    { label: '算力规模', value: '1000+ GPU Cluster', icon: Server },
    { label: '网络延迟', value: '<50ms 覆盖东盟', icon: Globe }
  ]

  const policyTools = [
    {
      name: 'MDAG-AI',
      fullName: '数字加速补助金',
      benefit: '最高50万林吉特',
      description: 'AI项目研发补贴，无上限申请'
    },
    {
      name: 'FIMI',
      fullName: '影视/AIGC制作返还',
      benefit: '30%-35%现金返还',
      description: '内容制作成本返还，降低财务风险'
    },
    {
      name: 'MSC',
      fullName: '多媒体超级走廊地位',
      benefit: '5-10年全额免税',
      description: '企业所得税全免，设备投资抵扣'
    }
  ]

  // 离岸节点数据
  const offshoreNodes = [
    {
      id: 'kl',
      name: '吉隆坡数据中心',
      location: '马来西亚 · 吉隆坡',
      flag: '🇲🇾',
      status: '运营中',
      specs: {
        compute: '1000+ GPU Cluster (NVIDIA H100/A100)',
        storage: '50PB 分布式存储',
        network: '<50ms 覆盖东盟，直连新加坡/香港',
        power: '100% 可再生能源供电'
      },
      compliance: ['ISO 27001', 'SOC 2 Type II', 'PCI DSS', 'GDPR Ready'],
      features: ['数据主权独立', 'MSC免税地位', '24/7中文技术支持'],
      pricing: {
        gpu: '¥8/小时/卡',
        storage: '¥0.5/GB/月',
        bandwidth: '¥0.8/GB'
      }
    },
    {
      id: 'sg',
      name: '新加坡金融节点',
      location: '新加坡',
      flag: '🇸🇬',
      status: '建设中',
      specs: {
        compute: '500+ GPU Cluster',
        storage: '20PB 企业级存储',
        network: '<10ms 东南亚金融专线',
        power: '双路供电+UPS'
      },
      compliance: ['MAS TRM', 'ISO 27001', 'SOC 2', 'PCI DSS Level 1'],
      features: ['金融级安全', '低延迟交易', '合规审计支持'],
      pricing: {
        gpu: '¥12/小时/卡',
        storage: '¥0.8/GB/月',
        bandwidth: '¥1.2/GB'
      }
    },
    {
      id: 'dxb',
      name: '迪拜中东枢纽',
      location: '阿联酋 · 迪拜',
      flag: '🇦🇪',
      status: '规划中',
      specs: {
        compute: '800+ GPU Cluster',
        storage: '30PB 对象存储',
        network: '<100ms 覆盖中东非',
        power: '太阳能+市电混合'
      },
      compliance: ['ISO 27001', 'SOC 2', 'UAE Data Law Compliant'],
      features: ['中东市场入口', '零企业所得税', '多语言支持'],
      pricing: {
        gpu: '¥10/小时/卡',
        storage: '¥0.6/GB/月',
        bandwidth: '¥1.0/GB'
      }
    }
  ]

  // 服务套餐
  const servicePackages = [
    {
      name: '基础版',
      price: '¥5,000/月',
      description: '适合初创企业和小型项目',
      features: [
        '2x GPU 算力',
        '1TB 存储空间',
        '5TB 月流量',
        '基础技术支持',
        '标准安全防护'
      ],
      cta: '立即开通',
      popular: false
    },
    {
      name: '专业版',
      price: '¥20,000/月',
      description: '适合中型企业和AI研发团队',
      features: [
        '8x GPU 算力 (H100)',
        '10TB 存储空间',
        '50TB 月流量',
        '7x24中文技术支持',
        '企业级安全防护',
        '专属网络通道',
        'MSC免税申请协助'
      ],
      cta: '立即开通',
      popular: true
    },
    {
      name: '企业版',
      price: '定制报价',
      description: '适合大型企业和算力密集型应用',
      features: [
        '定制GPU集群规模',
        '无限存储扩展',
        '独享带宽',
        '专属技术团队',
        '定制化合规方案',
        '私有化部署选项',
        '全流程政策申请',
        '专属客户经理'
      ],
      cta: '联系销售',
      popular: false
    }
  ]

  const handleConsultSubmit = (e) => {
    e.preventDefault()
    // 保存咨询记录到localStorage
    const consultations = JSON.parse(localStorage.getItem('offshore_consultations') || '[]')
    consultations.push({
      ...consultForm,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    })
    localStorage.setItem('offshore_consultations', JSON.stringify(consultations))
    alert('咨询提交成功！我们的专家将在24小时内联系您。')
    setShowConsultModal(false)
    setConsultForm({ name: '', company: '', phone: '', email: '', question: '' })
  }

  const handleDemoSubmit = (e) => {
    e.preventDefault()
    // 保存演示预约到localStorage
    const demos = JSON.parse(localStorage.getItem('offshore_demos') || '[]')
    demos.push({
      ...demoForm,
      id: Date.now(),
      status: 'scheduled',
      createdAt: new Date().toISOString()
    })
    localStorage.setItem('offshore_demos', JSON.stringify(demos))
    alert('演示预约成功！我们将通过邮件发送会议链接。')
    setShowDemoModal(false)
    setDemoForm({ name: '', company: '', phone: '', email: '', date: '', time: '', interest: '' })
  }

  return (
    <div className="offshore-hub">
      {/* Hero Section */}
      <div className="hub-hero">
        <div className="hero-badge">
          <Globe size={16} />
          东盟数字枢纽
        </div>
        <h1>马来西亚离岸数据中心</h1>
        <p className="hero-subtitle">
          数据主权独立 · 政策红利套利 · 碳硅协同飞轮
        </p>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">1150亿</span>
            <span className="stat-label">林吉特数据中心投资</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">600亿</span>
            <span className="stat-label">2030年AI GDP贡献</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">2万亿</span>
            <span className="stat-label">美元 DEFA协议潜力</span>
          </div>
        </div>
        <Link to="/enterprise-diagnosis" className="hero-cta">
          开始AI成熟度诊断
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* CTA Buttons */}
      <div className="hub-ctas">
        <button className="hub-cta-btn primary" onClick={() => setShowConsultModal(true)}>
          <MessageCircle size={18} />
          在线咨询
        </button>
        <button className="hub-cta-btn secondary" onClick={() => setShowDemoModal(true)}>
          <Calendar size={18} />
          预约演示
        </button>
      </div>

      {/* Tabs */}
      <div className="hub-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Server size={18} />
          基础设施
        </button>
        <button 
          className={`tab-btn ${activeTab === 'nodes' ? 'active' : ''}`}
          onClick={() => setActiveTab('nodes')}
        >
          <Globe size={18} />
          全球节点
        </button>
        <button 
          className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
          onClick={() => setActiveTab('packages')}
        >
          <Award size={18} />
          服务套餐
        </button>
        <button 
          className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          <Calculator size={18} />
          政策计算器
        </button>
        <button 
          className={`tab-btn ${activeTab === 'strategy' ? 'active' : ''}`}
          onClick={() => setActiveTab('strategy')}
        >
          <TrendingUp size={18} />
          地缘战略
        </button>
      </div>

      {/* Tab Content */}
      <div className="hub-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="section-header">
              <h2>吉隆坡离岸节点</h2>
              <p>规避单一强权管辖，实现数字主权离岸化</p>
            </div>
            
            <div className="specs-grid">
              {dataCenterSpecs.map((spec, index) => (
                <div key={index} className="spec-card">
                  <div className="spec-icon">
                    <spec.icon size={24} />
                  </div>
                  <div className="spec-info">
                    <span className="spec-label">{spec.label}</span>
                    <span className="spec-value">{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="advantages-section">
              <h3>核心优势</h3>
              <div className="advantages-grid">
                <div className="advantage-item">
                  <CheckCircle size={20} className="check-icon" />
                  <div>
                    <h4>数据主权独立</h4>
                    <p>企业数据私有化部署，免于被公有云巨头绑架</p>
                  </div>
                </div>
                <div className="advantage-item">
                  <CheckCircle size={20} className="check-icon" />
                  <div>
                    <h4>合规成本优势</h4>
                    <p>规避东盟数据本地化政策，年省150-200亿美元合规成本</p>
                  </div>
                </div>
                <div className="advantage-item">
                  <CheckCircle size={20} className="check-icon" />
                  <div>
                    <h4>算力成本低廉</h4>
                    <p>全球顶级算力集群，成本仅为北美60%</p>
                  </div>
                </div>
                <div className="advantage-item">
                  <CheckCircle size={20} className="check-icon" />
                  <div>
                    <h4>辐射东南亚</h4>
                    <p>合法合规辐射6.5亿人口的东盟市场</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nodes' && (
          <div className="nodes-section">
            <div className="section-header">
              <h2>全球离岸节点</h2>
              <p>选择最适合您业务的数据中心位置</p>
            </div>
            
            <div className="nodes-grid">
              {offshoreNodes.map((node) => (
                <div 
                  key={node.id} 
                  className={`node-card ${node.status === '运营中' ? 'active' : ''}`}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="node-header">
                    <span className="node-flag">{node.flag}</span>
                    <div className="node-title-group">
                      <h3>{node.name}</h3>
                      <span className="node-location">{node.location}</span>
                    </div>
                    <span className={`node-status ${node.status === '运营中' ? 'operational' : node.status === '建设中' ? 'building' : 'planning'}`}>
                      {node.status}
                    </span>
                  </div>
                  
                  <div className="node-specs-preview">
                    <div className="spec-item">
                      <Cpu size={16} />
                      <span>{node.specs.compute.split(' ')[0]}</span>
                    </div>
                    <div className="spec-item">
                      <Database size={16} />
                      <span>{node.specs.storage.split(' ')[0]}</span>
                    </div>
                    <div className="spec-item">
                      <Zap size={16} />
                      <span>{node.specs.network.split(' ')[0]}</span>
                    </div>
                  </div>
                  
                  <div className="node-features">
                    {node.features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                  
                  <button className="view-details-btn">
                    查看详情 <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            {selectedNode && (
              <div className="node-detail-modal" onClick={() => setSelectedNode(null)}>
                <div className="node-detail-content" onClick={(e) => e.stopPropagation()}>
                  <div className="node-detail-header">
                    <div className="node-title-wrapper">
                      <span className="node-flag-large">{selectedNode.flag}</span>
                      <div>
                        <h3>{selectedNode.name}</h3>
                        <p>{selectedNode.location}</p>
                      </div>
                    </div>
                    <button className="close-btn" onClick={() => setSelectedNode(null)}>
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="node-detail-body">
                    <div className="detail-section">
                      <h4><Server size={18} /> 技术规格</h4>
                      <div className="specs-list">
                        <div className="spec-row">
                          <span className="spec-label">算力</span>
                          <span className="spec-value">{selectedNode.specs.compute}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">存储</span>
                          <span className="spec-value">{selectedNode.specs.storage}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">网络</span>
                          <span className="spec-value">{selectedNode.specs.network}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">电力</span>
                          <span className="spec-value">{selectedNode.specs.power}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="detail-section">
                      <h4><Shield size={18} /> 合规认证</h4>
                      <div className="compliance-tags">
                        {selectedNode.compliance.map((cert, idx) => (
                          <span key={idx} className="compliance-tag">{cert}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="detail-section">
                      <h4><Award size={18} /> 核心优势</h4>
                      <ul className="features-list">
                        {selectedNode.features.map((feature, idx) => (
                          <li key={idx}><Check size={16} /> {feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="detail-section">
                      <h4><Calculator size={18} /> 参考价格</h4>
                      <div className="pricing-list">
                        <div className="price-row">
                          <span>GPU算力</span>
                          <strong>{selectedNode.pricing.gpu}</strong>
                        </div>
                        <div className="price-row">
                          <span>存储</span>
                          <strong>{selectedNode.pricing.storage}</strong>
                        </div>
                        <div className="price-row">
                          <span>带宽</span>
                          <strong>{selectedNode.pricing.bandwidth}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="node-detail-footer">
                    <button className="consult-btn" onClick={() => { setSelectedNode(null); setShowConsultModal(true); }}>
                      <MessageCircle size={18} />
                      咨询此节点
                    </button>
                    <button className="demo-btn" onClick={() => { setSelectedNode(null); setShowDemoModal(true); }}>
                      <Calendar size={18} />
                      预约演示
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="packages-section">
            <div className="section-header">
              <h2>服务套餐</h2>
              <p>选择适合您业务规模的离岸数据中心方案</p>
            </div>
            
            <div className="packages-grid">
              {servicePackages.map((pkg, index) => (
                <div key={index} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
                  {pkg.popular && <div className="popular-badge">最受欢迎</div>}
                  <div className="package-header">
                    <h3>{pkg.name}</h3>
                    <p className="package-desc">{pkg.description}</p>
                    <div className="package-price">{pkg.price}</div>
                  </div>
                  
                  <ul className="package-features">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx}>
                        <CheckCircle size={16} className="feature-check" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    className={`package-cta ${pkg.popular ? 'primary' : 'secondary'}`}
                    onClick={() => pkg.popular ? setShowConsultModal(true) : setShowDemoModal(true)}
                  >
                    {pkg.cta}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="packages-compare">
              <h3>套餐对比</h3>
              <div className="compare-table-wrapper">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th>功能特性</th>
                      <th>基础版</th>
                      <th className="highlight">专业版</th>
                      <th>企业版</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>GPU算力</td>
                      <td>2x GPU</td>
                      <td className="highlight">8x H100</td>
                      <td>定制</td>
                    </tr>
                    <tr>
                      <td>存储空间</td>
                      <td>1TB</td>
                      <td className="highlight">10TB</td>
                      <td>无限</td>
                    </tr>
                    <tr>
                      <td>月流量</td>
                      <td>5TB</td>
                      <td className="highlight">50TB</td>
                      <td>独享</td>
                    </tr>
                    <tr>
                      <td>技术支持</td>
                      <td>基础</td>
                      <td className="highlight">7x24中文</td>
                      <td>专属团队</td>
                    </tr>
                    <tr>
                      <td>政策申请</td>
                      <td>自助</td>
                      <td className="highlight">协助</td>
                      <td>全流程</td>
                    </tr>
                    <tr>
                      <td>合规支持</td>
                      <td>标准</td>
                      <td className="highlight">企业级</td>
                      <td>定制</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="calculator-section">
            <div className="section-header">
              <h2>政策红利计算器</h2>
              <p>一键计算MDAG、FIMI、MSC等政策优惠</p>
            </div>

            <div className="calculator-form">
              <div className="form-group">
                <label>项目预算 (人民币)</label>
                <input 
                  type="number" 
                  value={calculatorData.projectBudget}
                  onChange={(e) => setCalculatorData({...calculatorData, projectBudget: Number(e.target.value)})}
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input 
                    type="checkbox" 
                    checked={calculatorData.isAIGC}
                    onChange={(e) => setCalculatorData({...calculatorData, isAIGC: e.target.checked})}
                  />
                  属于AIGC/影视制作项目
                </label>
              </div>
              <div className="form-group checkbox">
                <label>
                  <input 
                    type="checkbox" 
                    checked={calculatorData.isMSC}
                    onChange={(e) => setCalculatorData({...calculatorData, isMSC: e.target.checked})}
                  />
                  申请MSC地位
                </label>
              </div>
              <div className="form-group">
                <label>设备投资金额 (人民币)</label>
                <input 
                  type="number" 
                  value={calculatorData.equipmentCost}
                  onChange={(e) => setCalculatorData({...calculatorData, equipmentCost: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="calculation-results">
              <h3>预估优惠总额</h3>
              <div className="result-cards">
                <div className="result-card">
                  <span className="result-label">MDAG补贴</span>
                  <span className="result-value">¥{incentives.mdagGrant.toLocaleString()}</span>
                </div>
                <div className="result-card">
                  <span className="result-label">FIMI返还</span>
                  <span className="result-value">¥{incentives.fimiRebate.toLocaleString()}</span>
                </div>
                <div className="result-card">
                  <span className="result-label">MSC免税</span>
                  <span className="result-value">¥{incentives.mscTaxSaving.toLocaleString()}</span>
                </div>
                <div className="result-card">
                  <span className="result-label">设备抵扣</span>
                  <span className="result-value">¥{incentives.equipmentDeduction.toLocaleString()}</span>
                </div>
              </div>
              <div className="total-result">
                <div className="total-benefit">
                  <span>总优惠金额</span>
                  <strong>¥{incentives.totalBenefit.toLocaleString()}</strong>
                </div>
                <div className="net-cost">
                  <span>实际净成本</span>
                  <strong>¥{incentives.netCost.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="policy-tools">
              <h3>政策工具箱</h3>
              <div className="tools-grid">
                {policyTools.map((tool, index) => (
                  <div key={index} className="tool-card">
                    <div className="tool-header">
                      <span className="tool-name">{tool.name}</span>
                      <span className="tool-benefit">{tool.benefit}</span>
                    </div>
                    <span className="tool-fullname">{tool.fullName}</span>
                    <p className="tool-desc">{tool.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="strategy-section">
            <div className="section-header">
              <h2>东盟地缘战略</h2>
              <p>DEFA协议下的数字经济红利地图</p>
            </div>

            <div className="strategy-map">
              <div className="map-placeholder">
                <Globe size={64} />
                <p>东盟数字经济带</p>
                <span>6.5亿人口 · 3万亿美元GDP · 无限潜力</span>
              </div>
            </div>

            <div className="strategy-cards">
              <div className="strategy-card">
                <div className="strategy-icon">
                  <Building2 size={28} />
                </div>
                <h3>NAIO战略</h3>
                <p>马来西亚国家人工智能办公室</p>
                <span className="strategy-meta">2026-2030行动计划</span>
              </div>
              <div className="strategy-card">
                <div className="strategy-icon">
                  <TrendingUp size={28} />
                </div>
                <h3>DEFA协议</h3>
                <p>东盟数字经济框架协议</p>
                <span className="strategy-meta">2030年解锁2万亿美元</span>
              </div>
              <div className="strategy-card">
                <div className="strategy-icon">
                  <Shield size={28} />
                </div>
                <h3>数据本地化</h3>
                <p>规避合规成本150-200亿美元</p>
                <span className="strategy-meta">离岸部署优势</span>
              </div>
            </div>

            <div className="timeline-section">
              <h3>政策时间线</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <span className="year">2021-2023</span>
                  <span className="event">1150亿林吉特数据中心投资落地</span>
                </div>
                <div className="timeline-item">
                  <span className="year">2024-2025</span>
                  <span className="event">全球科技巨头百亿美元算力集群建设</span>
                </div>
                <div className="timeline-item">
                  <span className="year">2026</span>
                  <span className="event">国家AI行动计划启动，NAIO正式运营</span>
                </div>
                <div className="timeline-item highlight">
                  <span className="year">2030</span>
                  <span className="event">AI贡献GDP超600亿林吉特，DEFA全面落地</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 在线咨询弹窗 */}
      {showConsultModal && (
        <div className="modal-overlay" onClick={() => setShowConsultModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><MessageCircle size={24} /> 在线咨询</h3>
              <button className="close-btn" onClick={() => setShowConsultModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleConsultSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label><Users size={16} /> 姓名 *</label>
                  <input 
                    type="text" 
                    required
                    value={consultForm.name}
                    onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div className="form-group">
                  <label><Building2 size={16} /> 公司名称</label>
                  <input 
                    type="text"
                    value={consultForm.company}
                    onChange={(e) => setConsultForm({...consultForm, company: e.target.value})}
                    placeholder="请输入公司名称"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><Phone size={16} /> 联系电话 *</label>
                  <input 
                    type="tel" 
                    required
                    value={consultForm.phone}
                    onChange={(e) => setConsultForm({...consultForm, phone: e.target.value})}
                    placeholder="请输入联系电话"
                  />
                </div>
                <div className="form-group">
                  <label><Mail size={16} /> 电子邮箱</label>
                  <input 
                    type="email"
                    value={consultForm.email}
                    onChange={(e) => setConsultForm({...consultForm, email: e.target.value})}
                    placeholder="请输入邮箱地址"
                  />
                </div>
              </div>
              <div className="form-group">
                <label><FileText size={16} /> 咨询问题 *</label>
                <textarea 
                  required
                  rows={4}
                  value={consultForm.question}
                  onChange={(e) => setConsultForm({...consultForm, question: e.target.value})}
                  placeholder="请描述您的业务需求和咨询问题，我们的专家将在24小时内联系您..."
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowConsultModal(false)}>取消</button>
                <button type="submit" className="btn-primary">提交咨询</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 预约演示弹窗 */}
      {showDemoModal && (
        <div className="modal-overlay" onClick={() => setShowDemoModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Calendar size={24} /> 预约演示</h3>
              <button className="close-btn" onClick={() => setShowDemoModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleDemoSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label><Users size={16} /> 姓名 *</label>
                  <input 
                    type="text" 
                    required
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({...demoForm, name: e.target.value})}
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div className="form-group">
                  <label><Building2 size={16} /> 公司名称 *</label>
                  <input 
                    type="text" 
                    required
                    value={demoForm.company}
                    onChange={(e) => setDemoForm({...demoForm, company: e.target.value})}
                    placeholder="请输入公司名称"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><Phone size={16} /> 联系电话 *</label>
                  <input 
                    type="tel" 
                    required
                    value={demoForm.phone}
                    onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})}
                    placeholder="请输入联系电话"
                  />
                </div>
                <div className="form-group">
                  <label><Mail size={16} /> 电子邮箱 *</label>
                  <input 
                    type="email" 
                    required
                    value={demoForm.email}
                    onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                    placeholder="请输入邮箱地址"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><Calendar size={16} /> 期望日期 *</label>
                  <input 
                    type="date" 
                    required
                    value={demoForm.date}
                    onChange={(e) => setDemoForm({...demoForm, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label><Clock size={16} /> 期望时间 *</label>
                  <select 
                    required
                    value={demoForm.time}
                    onChange={(e) => setDemoForm({...demoForm, time: e.target.value})}
                  >
                    <option value="">请选择时间</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label><HardDrive size={16} /> 感兴趣的服务</label>
                <select
                  value={demoForm.interest}
                  onChange={(e) => setDemoForm({...demoForm, interest: e.target.value})}
                >
                  <option value="">请选择</option>
                  <option value="kl">吉隆坡数据中心</option>
                  <option value="sg">新加坡金融节点</option>
                  <option value="dxb">迪拜中东枢纽</option>
                  <option value="package">服务套餐</option>
                  <option value="policy">政策申请</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowDemoModal(false)}>取消</button>
                <button type="submit" className="btn-primary">确认预约</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default OffshoreHub

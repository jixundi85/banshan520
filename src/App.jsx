import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'

// Global Providers
import { ToastProvider } from './components/Toast'
import { ConfirmProvider } from './components/ConfirmDialog'

// 骨架屏 Loading 组件
function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">加载中...</p>
      </div>
    </div>
  )
}

// 404 页面
import NotFound from './pages/user/NotFound'

// 懒加载所有页面组件
const HomePage = lazy(() => import('./pages/user/HomePage'))
const TrainingPage = lazy(() => import('./pages/user/TrainingPage'))
const DemandPage = lazy(() => import('./pages/user/DemandPage'))
const CommunityPage = lazy(() => import('./pages/user/CommunityPage'))
const CreatorPage = lazy(() => import('./pages/user/CreatorPage'))
const Login = lazy(() => import('./pages/user/Login'))
const Register = lazy(() => import('./pages/user/Register'))
const ForgotPassword = lazy(() => import('./pages/user/ForgotPassword'))
const UserCenter = lazy(() => import('./pages/user/UserCenter'))
const Learning = lazy(() => import('./pages/user/Learning'))
const Orders = lazy(() => import('./pages/user/Orders'))
const Favorites = lazy(() => import('./pages/user/Favorites'))
const CreatorCenter = lazy(() => import('./pages/user/CreatorCenter'))
const Messages = lazy(() => import('./pages/user/Messages'))
const Settings = lazy(() => import('./pages/user/Settings'))
const Payment = lazy(() => import('./pages/user/Payment'))
const ChatRoom = lazy(() => import('./pages/user/ChatRoom'))
const H5HomePage = lazy(() => import('./pages/user/H5HomePage'))
const PointsCenter = lazy(() => import('./pages/user/PointsCenter'))
const Wallet = lazy(() => import('./pages/user/Wallet'))
const VIPCenter = lazy(() => import('./pages/user/VIPCenter'))
const Invite = lazy(() => import('./pages/user/Invite'))
const EarningsReport = lazy(() => import('./pages/user/EarningsReport'))

const TutorialDetail = lazy(() => import('./pages/user/TutorialDetail'))
const CaseStudyDetail = lazy(() => import('./pages/user/CaseStudyDetail'))
const PublishCase = lazy(() => import('./pages/user/PublishCase'))
const CreateTutorial = lazy(() => import('./pages/user/CreateTutorial'))
const CourseDetail = lazy(() => import('./pages/user/CourseDetail'))
const CampDetail = lazy(() => import('./pages/user/CampDetail'))
const CoursePlayer = lazy(() => import('./pages/user/CoursePlayer'))
const CreatorProfile = lazy(() => import('./pages/user/CreatorProfile'))
const EventForumPage = lazy(() => import('./pages/user/EventForumPage'))
const AIToolsPage = lazy(() => import('./pages/user/AIToolsPage'))
const MatchingDetail = lazy(() => import('./pages/user/MatchingDetail'))
const DemandPublisherCenter = lazy(() => import('./pages/user/DemandPublisherCenter'))
const SmartRecommend = lazy(() => import('./pages/user/SmartRecommend'))
const EnterpriseDiagnosis = lazy(() => import('./pages/user/EnterpriseDiagnosis'))
const DiagnosisResult = lazy(() => import('./pages/user/DiagnosisResult'))
const EnterpriseDemand = lazy(() => import('./pages/user/EnterpriseDemand'))
const ProjectWorkspace = lazy(() => import('./pages/user/ProjectWorkspace'))
const OffshoreHub = lazy(() => import('./pages/user/OffshoreHub'))
const MyProjects = lazy(() => import('./pages/user/MyProjects'))
const MyDemands = lazy(() => import('./pages/user/MyDemands'))

// OPC Pages
const OPCAssessment = lazy(() => import('./pages/opc/OPCAssessment'))
const OPCResult = lazy(() => import('./pages/opc/OPCResult'))
const OPCProfile = lazy(() => import('./pages/opc/OPCProfile'))
const CertificationCenter = lazy(() => import('./pages/opc/CertificationCenter'))
const OPCTraining = lazy(() => import('./pages/opc/OPCTraining'))
const OPCTrainingCamp = lazy(() => import('./pages/opc/OPCTrainingCamp'))
const CertificationApply = lazy(() => import('./pages/opc/CertificationApply'))
const OPCCertification = lazy(() => import('./pages/opc/OPCCertification'))

// Service Market & Trading
const ServiceMarket = lazy(() => import('./pages/market/ServiceMarket'))
const ServiceDetail = lazy(() => import('./pages/market/ServiceDetail'))
const CreatorOrders = lazy(() => import('./pages/orders/CreatorOrders'))
const CreatorEarnings = lazy(() => import('./pages/earnings/CreatorEarnings'))
const MessageCenter = lazy(() => import('./pages/messages/MessageCenter'))
const CreatorDashboard = lazy(() => import('./pages/creator/CreatorDashboard'))
const CreatorTools = lazy(() => import('./pages/creator/CreatorTools'))
const EnterpriseServiceHub = lazy(() => import('./pages/enterprise/EnterpriseServiceHub'))
const SmartMatchingEngine = lazy(() => import('./pages/match/SmartMatchingEngine'))
const AIAssistant = lazy(() => import('./pages/assistant/AIAssistant'))
const SurveyWithResume = lazy(() => import('./pages/diagnosis/SurveyWithResume'))
const CreditProfile = lazy(() => import('./pages/credit/CreditProfile'))

// Enterprise Pages
const BossAcademy = lazy(() => import('./pages/enterprise/BossAcademy'))
const BossCourseDetail = lazy(() => import('./pages/enterprise/BossCourseDetail'))
const EnterpriseProfile = lazy(() => import('./pages/enterprise/EnterpriseProfile'))
const LearningPath = lazy(() => import('./pages/enterprise/LearningPath'))
const PrivateClub = lazy(() => import('./pages/enterprise/PrivateClub'))
const EnterpriseLevel = lazy(() => import('./pages/enterprise/EnterpriseLevel'))

// Payment & Rating
const EscrowPayment = lazy(() => import('./pages/user/EscrowPayment'))
const RatingSystem = lazy(() => import('./pages/user/RatingSystem'))
const CreditSystem = lazy(() => import('./pages/user/CreditSystem'))
const KnowledgeBase = lazy(() => import('./pages/user/KnowledgeBase'))
const AwakeningGuide = lazy(() => import('./pages/user/AwakeningGuide'))
const EnterpriseGuide = lazy(() => import('./pages/user/EnterpriseGuide'))

// Community
const CommunityForum = lazy(() => import('./pages/user/CommunityForum'))
const CommunityLayout = lazy(() => import('./pages/user/Community/CommunityLayout'))
const RewardDetailPage = lazy(() => import('./pages/user/Community/RewardDetailPage'))
const RewardSubmitPage = lazy(() => import('./pages/user/Community/RewardSubmitPage'))
const PostEditorPage = lazy(() => import('./pages/user/Community/PostEditorPage'))



// Admin Data Dashboard
const DataDashboard = lazy(() => import('./pages/admin/DataDashboard'))

// Copyright Pages
const CopyrightPage = lazy(() => import('./pages/user/Copyright/CopyrightPage'))
const CopyrightListPage = lazy(() => import('./pages/user/Copyright/CopyrightListPage'))
const CopyrightDetailPage = lazy(() => import('./pages/user/Copyright/CopyrightDetailPage'))
const CopyrightSellPage = lazy(() => import('./pages/user/Copyright/CopyrightSellPage'))
const CopyrightMyAssetsPage = lazy(() => import('./pages/user/Copyright/CopyrightMyAssetsPage'))
const CopyrightMyOrdersPage = lazy(() => import('./pages/user/Copyright/CopyrightMyOrdersPage'))

// AI Assistant Admin
const AIAssistantAdmin = lazy(() => import('./components/admin/AdminPanel'))

// AI Workflow Pages
const AIWorkflowDashboard = lazy(() => import('./pages/user/AIWorkflowDashboard'))
const AIWorkflowCanvasFree = lazy(() => import('./pages/user/AIWorkflowCanvasFree'))
const AIWorkflowDrama = lazy(() => import('./pages/user/AIWorkflowDrama'))
const AIWorkflowAd = lazy(() => import('./pages/user/AIWorkflowAd'))
const AIWorkflowHumanClone = lazy(() => import('./pages/user/AIWorkflowHumanClone'))
const AIConfigPage = lazy(() => import('./pages/AIConfigPage/AIConfigPage'))

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminCourse = lazy(() => import('./pages/admin/Course'))
const AdminUser = lazy(() => import('./pages/admin/User'))
const AdminCreator = lazy(() => import('./pages/admin/Creator'))
const AdminDemand = lazy(() => import('./pages/admin/Demand'))
const AdminOrder = lazy(() => import('./pages/admin/Order'))
const AdminContent = lazy(() => import('./pages/admin/Content'))
const AdminCommunity = lazy(() => import('./pages/admin/CommunityContent'))
const AdminCopyright = lazy(() => import('./pages/admin/CopyrightAdmin'))

// Layouts
import UserLayout from './components/UserLayout'
import PageLayout from './components/PageLayout'
import AdminLayout from './components/AdminLayout'


import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'

// Auth Layout - 认证页面专用布局（固定Header + 简洁 Footer）
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* 固定顶部导航 */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <SiteHeader />
      </div>
      {/* 内容区域 */}
      <div className="pt-16 lg:pt-20">
        {children}
      </div>
      <SiteFooter />
    </div>
  )
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Auth Routes - 使用UserLayout与首页保持一致 */}
        <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
        <Route path="/register" element={<UserLayout><Register /></UserLayout>} />
        <Route path="/forgot-password" element={<UserLayout><ForgotPassword /></UserLayout>} />

        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />

          <Route path="training" element={<TrainingPage />} />
          <Route path="demand" element={<DemandPage />} />
          <Route path="event" element={<EventForumPage />} />
          <Route path="creator" element={<CreatorPage />} />
          <Route path="tools" element={<CreatorTools />} />
        </Route>

        {/* 碳硅交流社区 - 单页面布局 */}
        <Route path="/community" element={<CommunityLayout />} />
        
        {/* 经验分享模块 */}
        <Route path="/community/exchange" element={<CommunityLayout />} />
        
        {/* 帖子详情页 */}
        <Route path="/community/exchange/:id" element={<CommunityLayout />} />
        
        {/* 发布经验页 - 独立页面 */}
        <Route path="/community/publish" element={<PostEditorPage />} />
        
        {/* 悬赏任务详情页 - 独立页面 */}
        <Route path="/reward/:id" element={<PageLayout><RewardDetailPage /></PageLayout>} />
        <Route path="/reward/submit/:id" element={<PageLayout><RewardSubmitPage /></PageLayout>} />

        {/* Creator Profile Route */}
        <Route path="/creator-profile/:creatorId" element={<PageLayout><CreatorProfile /></PageLayout>} />

        {/* Tutorial Detail */}
        <Route path="/tutorial/:id" element={<PageLayout><TutorialDetail /></PageLayout>} />

        {/* Matching Center - 统一到 /demand 智配中心 */}
        <Route path="/matching-center" element={<Navigate to="/demand" replace />} />

        {/* Demand Center - 统一到 /demand 智配中心 */}
        <Route path="/demand-center" element={<Navigate to="/demand" replace />} />

        {/* Smart Recommend */}
        <Route path="/smart-recommend" element={<PageLayout><SmartRecommend /></PageLayout>} />

        {/* Matching Detail - 智配中心详情页 */}
        <Route path="/demand/:demandId" element={<PageLayout><MatchingDetail /></PageLayout>} />

        {/* Demand Publisher Center */}
        <Route path="/demand/publisher" element={<PageLayout><DemandPublisherCenter /></PageLayout>} />

        {/* Enterprise Diagnosis */}
        <Route path="/enterprise-diagnosis" element={<UserLayout><EnterpriseDiagnosis /></UserLayout>} />

        {/* Diagnosis Result */}
        <Route path="/diagnosis-result" element={<UserLayout><DiagnosisResult /></UserLayout>} />

        {/* Enterprise Demand - 统一到 /demand 智配中心 */}
        <Route path="/enterprise-demand" element={<Navigate to="/demand" replace />} />

        {/* Project Workspace */}
        <Route path="/project/:projectId" element={<PageLayout><ProjectWorkspace /></PageLayout>} />

        {/* Offshore Hub */}
        <Route path="/offshore-hub" element={<PageLayout><OffshoreHub /></PageLayout>} />

        {/* OPC Routes */}
        <Route path="/opc-assessment" element={<UserLayout><OPCAssessment /></UserLayout>} />
        <Route path="/opc-result" element={<PageLayout><OPCResult /></PageLayout>} />
        <Route path="/opc-profile" element={<PageLayout><OPCProfile /></PageLayout>} />
        <Route path="/certification" element={<PageLayout><CertificationCenter /></PageLayout>} />
        <Route path="/opc-training" element={<UserLayout><OPCTraining /></UserLayout>} />
        <Route path="/opc-training-camp" element={<PageLayout><OPCTrainingCamp /></PageLayout>} />
        <Route path="/opc-certification-apply" element={<PageLayout><CertificationApply /></PageLayout>} />
        <Route path="/opc-certification" element={<PageLayout><OPCCertification /></PageLayout>} />

        {/* Enterprise Routes */}
        <Route path="/boss-academy" element={<PageLayout><BossAcademy /></PageLayout>} />
        <Route path="/boss-course/:id" element={<PageLayout><BossCourseDetail /></PageLayout>} />
        <Route path="/enterprise-profile" element={<PageLayout><EnterpriseProfile /></PageLayout>} />
        <Route path="/learning-path" element={<PageLayout><LearningPath /></PageLayout>} />
        <Route path="/private-club" element={<PageLayout><PrivateClub /></PageLayout>} />
        <Route path="/enterprise-level" element={<PageLayout><EnterpriseLevel /></PageLayout>} />

        {/* Payment & Rating Routes */}
        <Route path="/escrow-payment/:projectId?" element={<PageLayout><EscrowPayment /></PageLayout>} />
        <Route path="/rating" element={<PageLayout><RatingSystem /></PageLayout>} />
        <Route path="/credit" element={<PageLayout><CreditSystem /></PageLayout>} />
        <Route path="/knowledge" element={<PageLayout><KnowledgeBase /></PageLayout>} />

        {/* Awakening Guide Route - 包裹在 UserLayout 中 */}
        <Route element={<UserLayout />}>
          <Route path="/awakening" element={<AwakeningGuide />} />
        </Route>

        {/* Enterprise Guide Route */}
        <Route path="/enterprise-guide" element={<UserLayout><EnterpriseGuide /></UserLayout>} />

        {/* Community Route */}
        <Route path="/community" element={<PageLayout><CommunityForum /></PageLayout>} />
        <Route path="/community-forum" element={<PageLayout><CommunityForum /></PageLayout>} />



        {/* Creator Tools - 合并到 /tools */}
        <Route path="/creator-tools" element={<Navigate to="/tools" replace />} />
        {/* 交流圈 - 使用 /community */}
        <Route path="/creator-circle" element={<Navigate to="/community" replace />} />
        {/* Enterprise Hub */}
        <Route path="/enterprise-hub" element={<PageLayout><EnterpriseServiceHub /></PageLayout>} />

        {/* Smart Matching */}
        <Route path="/smart-match" element={<PageLayout><SmartMatchingEngine /></PageLayout>} />

        {/* AI Workflow Routes */}
        <Route path="/ai-workflow" element={<AIWorkflowDashboard />} />
        <Route path="/ai-workflow/canvas-free" element={<AIWorkflowCanvasFree />} />
        <Route path="/ai-workflow/drama" element={<AIWorkflowDrama />} />
        <Route path="/ai-workflow/ad" element={<AIWorkflowAd />} />
        <Route path="/ai-workflow/human-clone" element={<AIWorkflowHumanClone />} />
        <Route path="/ai-workflow/config" element={<AIConfigPage />} />

        {/* AI Assistant */}
        <Route path="/ai-assistant" element={<PageLayout><AIAssistant /></PageLayout>} />

        {/* Survey & Credit */}
        <Route path="/survey-resume" element={<PageLayout><SurveyWithResume /></PageLayout>} />
        <Route path="/credit-profile" element={<PageLayout><CreditProfile /></PageLayout>} />
        <Route path="/service/:id" element={<PageLayout><ServiceDetail /></PageLayout>} />
        <Route path="/my-orders" element={<PageLayout><CreatorOrders /></PageLayout>} />
        <Route path="/earnings-center" element={<PageLayout><CreatorEarnings /></PageLayout>} />

        {/* Copyright Routes - 包裹在 UserLayout 中 */}
        <Route element={<UserLayout />}>
          <Route path="/copyright" element={<CopyrightPage />} />
          <Route path="/copyright/:type" element={<CopyrightListPage />} />
          <Route path="/copyright/detail/:id" element={<CopyrightDetailPage />} />
          <Route path="/copyright/sell" element={<CopyrightSellPage />} />
          <Route path="/copyright/my-assets" element={<CopyrightMyAssetsPage />} />
          <Route path="/copyright/my-orders" element={<CopyrightMyOrdersPage />} />
        </Route>
        <Route path="/messages" element={<PageLayout><MessageCenter /></PageLayout>} />
        
        {/* Creator Dashboard Route */}
        <Route path="/creator-dashboard" element={<PageLayout><CreatorDashboard /></PageLayout>} />

        {/* Case Study Detail */}
        <Route path="/training/case/:id" element={<PageLayout><CaseStudyDetail /></PageLayout>} />

        {/* Course Detail */}
        <Route path="/training/course/:courseId" element={<UserLayout><CourseDetail /></UserLayout>} />

        {/* Camp Detail - 特训营详情页 */}
        <Route path="/training/camp/:id" element={<CampDetail />} />

        {/* Course Player - 统一使用 CourseDetail */}
        <Route path="/course/:courseId" element={<UserLayout><CourseDetail /></UserLayout>} />

        {/* User Center Routes */}
        <Route path="/user" element={<UserCenter />}>
          <Route path="learning" element={<Learning />} />
          <Route path="orders" element={<Orders />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="points" element={<PointsCenter />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="vip" element={<VIPCenter />} />
          <Route path="invite" element={<Invite />} />
          <Route path="earnings" element={<EarningsReport />} />
          <Route path="creator" element={<CreatorCenter />} />
          <Route path="publish-case" element={<PublishCase />} />
          <Route path="create-tutorial" element={<CreateTutorial />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
          <Route path="projects" element={<MyProjects />} />
          <Route path="demands" element={<MyDemands />} />
        </Route>

        {/* Payment Route */}
        <Route path="/payment" element={<PageLayout><Payment /></PageLayout>} />

        {/* Chat Room Route */}
        <Route path="/chat" element={<PageLayout><ChatRoom /></PageLayout>} />

        {/* H5 Mobile Route */}
        <Route path="/h5" element={<H5HomePage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="course" element={<AdminCourse />} />
          <Route path="user" element={<AdminUser />} />
          <Route path="creator" element={<AdminCreator />} />
          <Route path="demand" element={<AdminDemand />} />
          <Route path="order" element={<AdminOrder />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="community" element={<AdminCommunity />} />
          <Route path="copyright" element={<AdminCopyright />} />
          <Route path="analytics" element={<DataDashboard />} />
          <Route path="ai-assistant" element={<AIAssistantAdmin />} />
        </Route>

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AppRoutes />
      </ConfirmProvider>
    </ToastProvider>
  )
}

export default App

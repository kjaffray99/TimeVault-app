// Type definitions for TimeVault application

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap?: number;
  volume_24h?: number;
  image: string;
  price?: number; // Legacy compatibility
  priceChange24h?: number; // Legacy compatibility
  marketCap?: number; // Legacy compatibility
  volume24h?: number; // Legacy compatibility
  icon?: string; // Legacy compatibility
  lastUpdated?: string;
}

export interface PreciousMetalPrice {
  metal: 'gold' | 'silver' | 'platinum' | 'palladium';
  price: number; // Price per troy ounce in USD
  unit: 'oz' | 'gram' | 'kg';
  lastUpdated?: string;
  change?: number;
}

export interface ConversionResult {
  inputAmount: number;
  inputAsset: CryptoAsset;
  goldOunces: number;
  silverOunces: number;
  timeEquivalent: {
    hours: number;
    days: number;
    weeks: number;
  };
  fiatValue: number;
}

export interface UserWage {
  hourlyRate: number;
  currency: string;
}

// Customer Experience Types
export interface CustomerExperienceMetrics {
  overallScore: number;
  npsScore: number;
  averageRating: number;
  responseTimeScore: number;
  engagementScore: number;
  totalFeedback: number;
  frictionPoints: FrictionPoint[];
  recommendedActions: string[];
}

export interface SupportTicket {
  id: string;
  userId: string;
  type: 'proactive' | 'feedback' | 'bug' | 'feature';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  title: string;
  description: string;
  frictionPoints?: FrictionPoint[];
  feedback?: UserFeedback;
  suggestedActions: string[];
  createdAt: number;
  updatedAt?: number;
  resolvedAt?: number;
}

export interface UserFeedback {
  userId: string;
  rating?: number; // 1-5 stars
  comment?: string;
  feature?: string;
  timestamp: number;
  processed: boolean;
  category?: 'ui' | 'performance' | 'feature' | 'bug' | 'general';
}

export interface UserJourney {
  userId: string;
  steps: JourneyStep[];
  startTime: number;
  lastActivity: number;
  completedConversions: string[];
  frictionPoints: FrictionPoint[];
}

export interface JourneyStep {
  action: string;
  timestamp: number;
  context?: any;
  responseTime: number;
  success: boolean;
}

export interface FrictionPoint {
  type: 'slow_response' | 'error' | 'abandonment' | 'confusion';
  action: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
  context?: any;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: 'btc' | 'eth' | 'nft' | 'blockchain' | 'defi';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: QuizQuestion[];
  rewardTokens: number; // TVLT tokens awarded for completion
  estimatedTime: number; // Minutes
  completed?: boolean;
  score?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export interface DailyTip {
  id: string;
  title: string;
  content: string;
  category: 'crypto' | 'trading' | 'defi' | 'nft' | 'security';
  readTime: number; // Minutes
  date: string;
  tags: string[];
  isRead?: boolean;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // Minutes
  steps: TutorialStep[];
  prerequisites: string[];
  nftBadgeId?: string; // Edu NFT badge minted upon completion
  completed?: boolean;
  progress?: number; // Percentage 0-100
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive' | 'quiz';
  completed?: boolean;
}

export interface EducationalContent {
  quizzes: Quiz[];
  dailyTips: DailyTip[];
  tutorials: Tutorial[];
}

export interface UserProfile {
  id: string;
  walletAddress?: string;
  isConnected: boolean;
  isPremium: boolean;
  streakDays: number;
  totalTokensEarned: number; // TVLT tokens
  nftBadges: string[]; // Array of NFT badge IDs
  completedQuizzes: string[];
  completedTutorials: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  darkMode: boolean;
  preferredCurrency: string;
  notifications: {
    dailyTips: boolean;
    quizzes: boolean;
    priceAlerts: boolean;
  };
  defaultWage: UserWage;
}

export interface WalletConnection {
  address: string;
  provider: string;
  chainId: number;
  balance?: string;
}

export interface NFTBadge {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  mintedAt?: string;
  tokenId?: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface TVLTToken {
  balance: number;
  earned: number;
  spent: number;
  pendingRewards: number;
}

export interface TimePassNFT {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  benefits: string[];
  price: number; // In TVLT tokens
  image: string;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  tier: 'basic' | 'premium' | 'enterprise';
  price: number; // USD per month
  features: string[];
  ctaText: string;
}

export interface AIInsight {
  id: string;
  title: string;
  content: string;
  type: 'market_analysis' | 'price_prediction' | 'portfolio_advice';
  confidence: number; // 0-100
  timestamp: string;
  sources: string[];
}

export interface ChartData {
  timestamp: string;
  value: number;
  volume?: number;
  marketCap?: number;
}

export interface PriceAlert {
  id: string;
  assetId: string;
  condition: 'above' | 'below';
  targetPrice: number;
  isActive: boolean;
  notificationSent?: boolean;
}

export interface AppTheme {
  mode: 'light' | 'dark';
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface CalculatorState extends LoadingState {
  selectedAsset?: CryptoAsset;
  amount: number;
  userWage: UserWage;
  result?: ConversionResult;
  cryptoPrices: CryptoAsset[];
  metalPrices: PreciousMetalPrice[];
}

export interface DashboardState extends LoadingState {
  activeTab: 'quizzes' | 'tips' | 'tutorials' | 'instructions';
  educationalContent: EducationalContent;
  userProgress: {
    quizzesCompleted: number;
    tutorialsCompleted: number;
    streakDays: number;
    tokensEarned: number;
  };
}

export interface PremiumState extends LoadingState {
  isAuthenticated: boolean;
  subscription?: {
    tier: string;
    expiresAt: string;
    features: string[];
  };
  aiInsights: AIInsight[];
  premiumFeatures: PremiumFeature[];
}

// Event types for analytics and tracking
export interface AnalyticsEvent {
  event: string;
  category: 'engagement' | 'conversion' | 'retention' | 'monetization';
  properties: Record<string, any>;
  timestamp: string;
  userId?: string;
}

// Future feature placeholders
export interface StreakReward {
  day: number;
  reward: {
    type: 'tokens' | 'nft' | 'discount';
    amount: number;
    description: string;
  };
}

export interface ABTestVariant {
  id: string;
  name: string;
  theme: Partial<AppTheme>;
  features: string[];
  trafficPercentage: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripeProductId?: string;
  ctaText: string;
  popular?: boolean;
}

// Minting and NFT Types
export interface MintableAsset {
  id: string;
  name: string;
  description: string;
  type: 'TVLT' | 'EDU_NFT' | 'TIMEPASS_NFT';
  category: 'reward' | 'badge' | 'premium' | 'utility';
  image: string;
  price?: {
    amount: number;
    currency: 'USD' | 'TVLT' | 'ETH' | 'XRP';
  };
  benefits: string[];
  requirements?: {
    minQuizScore?: number;
    streakDays?: number;
    premiumTier?: boolean;
    completedTutorials?: string[];
  };
  contractAddress?: string;
  chainId?: number;
  metadata?: Record<string, any>;
}

export interface MintTransaction {
  id: string;
  assetId: string;
  userAddress: string;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  transactionHash?: string;
  gasUsed?: string;
  gasFee?: string;
  timestamp: string;
  errorMessage?: string;
  blockNumber?: number;
  retryCount?: number;
}

export interface MintingState {
  isConnected: boolean;
  walletAddress?: string;
  chainId?: number;
  isLoading: boolean;
  selectedAsset?: MintableAsset;
  transaction?: MintTransaction;
  error?: string;
  availableAssets: MintableAsset[];
  userBalance: {
    tvlt: number;
    eth: string;
    xrp: string;
  };
}

export interface WalletState {
  address?: string;
  chainId?: number;
  isConnected: boolean;
  isConnecting: boolean;
  provider?: any;
  signer?: any;
  balance?: {
    formatted: string;
    value: string;
    symbol: string;
  };
}

export interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: MintableAsset;
  onMintSuccess: (transaction: MintTransaction) => void;
  onMintError: (error: string) => void;
}

export interface MintButtonProps {
  asset: MintableAsset;
  variant?: 'primary' | 'secondary' | 'premium';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface UseMintReturn {
  mint: (asset: MintableAsset, options?: MintOptions) => Promise<MintTransaction>;
  mintWithPreview: (asset: MintableAsset) => void;
  isLoading: boolean;
  error?: string;
  transaction?: MintTransaction;
  clearError: () => void;
  canMint: (asset: MintableAsset) => boolean;
  getMintRequirements: (asset: MintableAsset) => string[];
  estimateGasFee: (asset: MintableAsset) => Promise<string>;
}

export interface MintOptions {
  skipPreview?: boolean;
  customMetadata?: Record<string, any>;
  gasLimit?: string;
  gasPrice?: string;
  priority?: 'low' | 'standard' | 'high';
}

/**
 * Day 2: Affiliate System with Vercel Pro Edge Optimization
 * Real-time commission tracking and partner dashboard
 */

import { CheckCircle, Copy, DollarSign, Share2, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AffiliateStats {
    totalEarnings: number;
    currentMonth: number;
    referrals: number;
    conversionRate: number;
    pendingCommissions: number;
    paidCommissions: number;
}

interface ReferralLink {
    id: string;
    url: string;
    clicks: number;
    conversions: number;
    earnings: number;
    createdAt: string;
}

export const AffiliateSystem: React.FC = () => {
    const [stats, setStats] = useState<AffiliateStats>({
        totalEarnings: 0,
        currentMonth: 0,
        referrals: 0,
        conversionRate: 0,
        pendingCommissions: 0,
        paidCommissions: 0
    });

    const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [affiliateId, setAffiliateId] = useState('');
    const [copied, setCopied] = useState(false);

    // Initialize affiliate system with edge optimization
    useEffect(() => {
        initializeAffiliate();
        loadAffiliateStats();

        // Real-time updates every 30 seconds
        const interval = setInterval(loadAffiliateStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const initializeAffiliate = async () => {
        try {
            console.log('🚀 Initializing Vercel Pro Affiliate System...');

            const response = await fetch('/api/affiliate/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Edge-Optimized': 'true'
                },
                body: JSON.stringify({
                    timestamp: Date.now(),
                    source: 'timevault_affiliate'
                })
            });

            if (response.ok) {
                const data = await response.json();
                setAffiliateId(data.affiliateId);

                // Track affiliate signup
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'affiliate_signup', {
                        affiliate_id: data.affiliateId,
                        edge_optimized: true
                    });
                }

                console.log('✅ Affiliate initialized:', data.affiliateId);
            }
        } catch (error) {
            console.error('❌ Affiliate initialization failed:', error);
        }
    };

    const loadAffiliateStats = async () => {
        try {
            const response = await fetch('/api/affiliate/stats', {
                headers: {
                    'X-Affiliate-ID': affiliateId,
                    'X-Edge-Optimized': 'true'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
                setReferralLinks(data.referralLinks);
            }
        } catch (error) {
            console.error('❌ Failed to load affiliate stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateReferralLink = async () => {
        try {
            const response = await fetch('/api/affiliate/generate-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Affiliate-ID': affiliateId
                },
                body: JSON.stringify({
                    campaign: 'calculator_premium',
                    medium: 'affiliate',
                    timestamp: Date.now()
                })
            });

            if (response.ok) {
                const data = await response.json();
                setReferralLinks([data.referralLink, ...referralLinks]);

                // Track link generation
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'referral_link_generated', {
                        affiliate_id: affiliateId,
                        link_id: data.referralLink.id
                    });
                }
            }
        } catch (error) {
            console.error('❌ Failed to generate referral link:', error);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);

            // Track copy action
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'referral_link_copied', {
                    affiliate_id: affiliateId
                });
            }
        } catch (error) {
            console.error('❌ Failed to copy to clipboard:', error);
        }
    };

    const shareOnSocial = (platform: string, link: string) => {
        const message = "🚀 Check out TimeVault - Convert your crypto to precious metals and time! Amazing calculator with real-time prices.";
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(link)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
            reddit: `https://reddit.com/submit?url=${encodeURIComponent(link)}&title=${encodeURIComponent(message)}`
        };

        window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');

        // Track social share
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'social_share', {
                platform,
                affiliate_id: affiliateId,
                link
            });
        }
    };

    if (loading) {
        return (
            <div className="affiliate-loading">
                <div className="spinner"></div>
                <p>Loading affiliate dashboard...</p>
            </div>
        );
    }

    return (
        <div className="affiliate-system">
            <div className="affiliate-header">
                <h2>🤝 Affiliate Dashboard</h2>
                <p>Earn 30% commission on every referral that converts to premium</p>
                <div className="affiliate-id">
                    Affiliate ID: <span className="id-badge">{affiliateId}</span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card earnings">
                    <div className="stat-icon">
                        <DollarSign />
                    </div>
                    <div className="stat-content">
                        <h3>Total Earnings</h3>
                        <div className="stat-value">${stats.totalEarnings.toFixed(2)}</div>
                        <div className="stat-change">
                            This month: ${stats.currentMonth.toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="stat-card referrals">
                    <div className="stat-icon">
                        <Users />
                    </div>
                    <div className="stat-content">
                        <h3>Total Referrals</h3>
                        <div className="stat-value">{stats.referrals}</div>
                        <div className="stat-change">
                            Conversion: {(stats.conversionRate * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div className="stat-card pending">
                    <div className="stat-icon">
                        <TrendingUp />
                    </div>
                    <div className="stat-content">
                        <h3>Pending Commissions</h3>
                        <div className="stat-value">${stats.pendingCommissions.toFixed(2)}</div>
                        <div className="stat-change">
                            Paid: ${stats.paidCommissions.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Generate New Link */}
            <div className="generate-section">
                <button onClick={generateReferralLink} className="generate-button">
                    <Share2 className="button-icon" />
                    Generate New Referral Link
                </button>
            </div>

            {/* Referral Links */}
            <div className="links-section">
                <h3>Your Referral Links</h3>

                {referralLinks.length === 0 ? (
                    <div className="empty-state">
                        <p>No referral links yet. Generate your first link to start earning!</p>
                    </div>
                ) : (
                    <div className="links-list">
                        {referralLinks.map((link) => (
                            <div key={link.id} className="link-card">
                                <div className="link-stats">
                                    <div className="link-url">
                                        <code>{link.url}</code>
                                    </div>
                                    <div className="link-metrics">
                                        <span>👁️ {link.clicks} clicks</span>
                                        <span>💰 {link.conversions} conversions</span>
                                        <span>💵 ${link.earnings.toFixed(2)} earned</span>
                                    </div>
                                </div>

                                <div className="link-actions">
                                    <button
                                        onClick={() => copyToClipboard(link.url)}
                                        className="action-button copy"
                                    >
                                        {copied ? <CheckCircle /> : <Copy />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>

                                    <div className="social-share">
                                        <button onClick={() => shareOnSocial('twitter', link.url)}>🐦</button>
                                        <button onClick={() => shareOnSocial('facebook', link.url)}>📘</button>
                                        <button onClick={() => shareOnSocial('linkedin', link.url)}>💼</button>
                                        <button onClick={() => shareOnSocial('reddit', link.url)}>🔴</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Commission Structure */}
            <div className="commission-info">
                <h3>💰 Commission Structure</h3>
                <div className="commission-tiers">
                    <div className="tier">
                        <div className="tier-name">Standard</div>
                        <div className="tier-rate">30%</div>
                        <div className="tier-desc">On all premium subscriptions</div>
                    </div>
                    <div className="tier">
                        <div className="tier-name">Pro Trader</div>
                        <div className="tier-rate">35%</div>
                        <div className="tier-desc">On Pro Trader subscriptions</div>
                    </div>
                    <div className="tier">
                        <div className="tier-name">Annual</div>
                        <div className="tier-rate">40%</div>
                        <div className="tier-desc">On annual subscriptions</div>
                    </div>
                </div>

                <div className="payout-info">
                    <p><strong>Payout Terms:</strong></p>
                    <ul>
                        <li>Monthly payouts via PayPal or bank transfer</li>
                        <li>Minimum payout threshold: $50</li>
                        <li>90-day cookie duration for maximum earning potential</li>
                        <li>Real-time tracking and analytics</li>
                    </ul>
                </div>
            </div>

            <style jsx>{`
        .affiliate-system {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          color: #FFFFFF;
        }

        .affiliate-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .affiliate-header h2 {
          color: #D4AF37;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .affiliate-header p {
          font-size: 1.25rem;
          color: #C0C0C0;
          margin-bottom: 1rem;
        }

        .affiliate-id {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid #D4AF37;
          border-radius: 8px;
          padding: 1rem;
          display: inline-block;
        }

        .id-badge {
          background: #D4AF37;
          color: #001F3F;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-family: monospace;
          margin-left: 0.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-card.earnings {
          border-color: #10B981;
        }

        .stat-card.referrals {
          border-color: #3B82F6;
        }

        .stat-card.pending {
          border-color: #F59E0B;
        }

        .stat-icon {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon svg {
          width: 2rem;
          height: 2rem;
          color: #D4AF37;
        }

        .stat-content h3 {
          margin: 0 0 0.5rem 0;
          color: #C0C0C0;
          font-size: 1rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.25rem;
        }

        .stat-change {
          color: #10B981;
          font-size: 0.875rem;
        }

        .generate-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .generate-button {
          background: linear-gradient(135deg, #D4AF37, #B8941F);
          color: #001F3F;
          border: none;
          border-radius: 12px;
          padding: 1rem 2rem;
          font-size: 1.125rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .generate-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        }

        .button-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .links-section h3 {
          color: #D4AF37;
          margin-bottom: 1.5rem;
        }

        .links-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .link-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .link-url code {
          background: rgba(0, 0, 0, 0.3);
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          color: #10B981;
        }

        .link-metrics {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #C0C0C0;
        }

        .link-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .action-button {
          background: rgba(212, 175, 55, 0.2);
          color: #D4AF37;
          border: 1px solid #D4AF37;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .action-button:hover {
          background: rgba(212, 175, 55, 0.3);
        }

        .social-share {
          display: flex;
          gap: 0.5rem;
        }

        .social-share button {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .social-share button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .commission-info {
          margin-top: 3rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid #D4AF37;
          border-radius: 16px;
          padding: 2rem;
        }

        .commission-info h3 {
          color: #D4AF37;
          margin-bottom: 1.5rem;
        }

        .commission-tiers {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .tier {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid #D4AF37;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }

        .tier-name {
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
        }

        .tier-rate {
          font-size: 2rem;
          font-weight: 700;
          color: #D4AF37;
          margin-bottom: 0.5rem;
        }

        .tier-desc {
          color: #C0C0C0;
          font-size: 0.875rem;
        }

        .payout-info {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .payout-info p {
          color: #D4AF37;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .payout-info ul {
          color: #C0C0C0;
          margin: 0;
          padding-left: 1.5rem;
        }

        .payout-info li {
          margin-bottom: 0.5rem;
        }

        .affiliate-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: #C0C0C0;
        }

        .spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid transparent;
          border-top: 2px solid #D4AF37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #C0C0C0;
        }

        @media (max-width: 768px) {
          .affiliate-system {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .link-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .link-actions {
            width: 100%;
            justify-content: space-between;
          }

          .commission-tiers {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default AffiliateSystem;

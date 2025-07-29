/**
 * Launch Dashboard - Real-time revenue tracking and launch readiness
 */
import React, { useEffect, useState } from 'react';
import { LaunchChecklistService, RevenueAlertService, RevenueTrackingService } from '../services/revenueTracking';

interface LaunchDashboardProps {
    analyticsService?: any;
}

export const LaunchDashboard: React.FC<LaunchDashboardProps> = ({ analyticsService }) => {
    const [revenueService] = useState(() => new RevenueTrackingService(analyticsService));
    const [checklistService] = useState(() => new LaunchChecklistService());
    const [alertService] = useState(() => new RevenueAlertService());

    const [revenueStatus, setRevenueStatus] = useState<any>(null);
    const [checklistStatus, setChecklistStatus] = useState<any>(null);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            // Load revenue status
            const revenue = revenueService.getRevenueStatus();
            setRevenueStatus(revenue);

            // Load checklist status
            const checklist = checklistService.getChecklist();
            setChecklistStatus(checklist);

            // Generate alerts
            const generatedAlerts = alertService.generateAlerts(revenue.metrics, revenue.launchMetrics);
            setAlerts(generatedAlerts);

            setIsLoading(false);
        }, 1000);
    }, [revenueService, checklistService, alertService]);

    const handleTaskComplete = (taskId: string) => {
        checklistService.completeTask(taskId);
        const updatedChecklist = checklistService.getChecklist();
        setChecklistStatus(updatedChecklist);
    };

    if (isLoading) {
        return (
            <div className="launch-dashboard loading">
                <div className="loading-spinner">🚀</div>
                <div>Loading launch dashboard...</div>
            </div>
        );
    }

    return (
        <div className="launch-dashboard">
            <header className="dashboard-header">
                <h1>🚀 TimeVault Launch Command Center</h1>
                <div className="launch-status">
                    {checklistStatus.status.readyForLaunch ? (
                        <span className="status-ready">✅ READY FOR LAUNCH</span>
                    ) : (
                        <span className="status-pending">🔄 LAUNCH PREPARATION</span>
                    )}
                </div>
            </header>

            {/* Revenue Goals Section */}
            <section className="revenue-goals">
                <h2>💰 Revenue Goals & Progress</h2>
                <div className="goals-grid">
                    {revenueStatus.goals.map((goal: any, index: number) => (
                        <div key={index} className="goal-card">
                            <div className="goal-header">
                                <span className="goal-timeframe">{goal.timeframe}</span>
                                <span className="goal-target">${goal.target}</span>
                            </div>
                            <div className="goal-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${goal.progress}%` }}
                                    ></div>
                                </div>
                                <div className="progress-text">
                                    ${goal.achieved} / ${goal.target} ({goal.progress.toFixed(1)}%)
                                </div>
                            </div>
                            <div className="goal-strategies">
                                {goal.strategy.map((strategy: string, i: number) => (
                                    <span key={i} className="strategy-tag">{strategy}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Live Revenue Metrics */}
            <section className="revenue-metrics">
                <h2>📊 Live Revenue Metrics</h2>
                <div className="metrics-grid">
                    <div className="metric-card daily">
                        <div className="metric-value">${revenueStatus.metrics.dailyRevenue}</div>
                        <div className="metric-label">Today</div>
                    </div>
                    <div className="metric-card weekly">
                        <div className="metric-value">${revenueStatus.metrics.weeklyRevenue}</div>
                        <div className="metric-label">This Week</div>
                    </div>
                    <div className="metric-card monthly">
                        <div className="metric-value">${revenueStatus.keyMetrics.projectedMonthly.toFixed(0)}</div>
                        <div className="metric-label">Projected Monthly</div>
                    </div>
                    <div className="metric-card aov">
                        <div className="metric-value">${revenueStatus.metrics.averageOrderValue}</div>
                        <div className="metric-label">Avg Order Value</div>
                    </div>
                </div>

                <div className="revenue-breakdown">
                    <h3>Revenue Sources</h3>
                    <div className="breakdown-bars">
                        <div className="breakdown-item">
                            <span className="source-name">Subscriptions</span>
                            <div className="breakdown-bar">
                                <div
                                    className="breakdown-fill subscriptions"
                                    style={{ width: `${revenueStatus.keyMetrics.subscriptionShare}%` }}
                                ></div>
                            </div>
                            <span className="source-percentage">{revenueStatus.keyMetrics.subscriptionShare.toFixed(1)}%</span>
                        </div>
                        <div className="breakdown-item">
                            <span className="source-name">Affiliates</span>
                            <div className="breakdown-bar">
                                <div
                                    className="breakdown-fill affiliates"
                                    style={{ width: `${revenueStatus.keyMetrics.affiliateShare}%` }}
                                ></div>
                            </div>
                            <span className="source-percentage">{revenueStatus.keyMetrics.affiliateShare.toFixed(1)}%</span>
                        </div>
                        <div className="breakdown-item">
                            <span className="source-name">NFTs</span>
                            <div className="breakdown-bar">
                                <div
                                    className="breakdown-fill nfts"
                                    style={{ width: `${revenueStatus.keyMetrics.nftShare}%` }}
                                ></div>
                            </div>
                            <span className="source-percentage">{revenueStatus.keyMetrics.nftShare.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alerts Section */}
            <section className="alerts-section">
                <h2>🚨 Priority Alerts</h2>
                <div className="alerts-list">
                    {alerts.map((alert) => (
                        <div key={alert.id} className={`alert alert-${alert.type}`}>
                            <div className="alert-content">
                                <div className="alert-message">{alert.message}</div>
                                <div className="alert-action">{alert.action}</div>
                            </div>
                            <div className="alert-priority">P{alert.priority}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Launch Checklist */}
            <section className="launch-checklist">
                <h2>✅ Launch Readiness Checklist</h2>
                <div className="checklist-progress">
                    <div className="progress-overview">
                        <span>Overall Progress: {checklistStatus.status.completionPercentage.toFixed(1)}%</span>
                        <span>High Priority: {checklistStatus.status.highPriorityCompletion.toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar-large">
                        <div
                            className="progress-fill-large"
                            style={{ width: `${checklistStatus.status.completionPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="checklist-categories">
                    {checklistStatus.checklist.map((category: any, index: number) => (
                        <div key={index} className="category-section">
                            <h3>{category.category}</h3>
                            <div className="tasks-list">
                                {category.tasks.map((task: any) => (
                                    <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''} ${task.priority}`}>
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => handleTaskComplete(task.id)}
                                        />
                                        <span className="task-text">{task.task}</span>
                                        <span className="task-priority">{task.priority}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recommendations */}
            <section className="recommendations">
                <h2>💡 Optimization Recommendations</h2>
                <div className="recommendations-list">
                    {revenueStatus.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="recommendation-item">
                            <span className="rec-icon">💡</span>
                            <span className="rec-text">{rec}</span>
                        </div>
                    ))}
                </div>
            </section>

            <style jsx>{`
        .launch-dashboard {
          background: linear-gradient(135deg, #001F3F 0%, #1a365d 100%);
          color: #FFFFFF;
          padding: 2rem;
          border-radius: 16px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .launch-dashboard.loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
        }

        .loading-spinner {
          font-size: 4rem;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid rgba(212, 175, 55, 0.3);
        }

        .dashboard-header h1 {
          color: #D4AF37;
          margin: 0;
        }

        .status-ready {
          color: #10B981;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .status-pending {
          color: #F59E0B;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .revenue-goals {
          margin-bottom: 3rem;
        }

        .revenue-goals h2 {
          color: #D4AF37;
          margin-bottom: 1.5rem;
        }

        .goals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .goal-card {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .goal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .goal-timeframe {
          font-weight: bold;
          color: #D4AF37;
        }

        .goal-target {
          font-size: 1.2rem;
          color: #10B981;
          font-weight: bold;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10B981, #D4AF37);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.9rem;
          color: #FFFFFF;
          opacity: 0.8;
        }

        .goal-strategies {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .strategy-tag {
          background: rgba(212, 175, 55, 0.2);
          color: #D4AF37;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .revenue-metrics {
          margin-bottom: 3rem;
        }

        .revenue-metrics h2 {
          color: #D4AF37;
          margin-bottom: 1.5rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: #D4AF37;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          color: #FFFFFF;
          opacity: 0.8;
        }

        .revenue-breakdown h3 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .breakdown-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .source-name {
          width: 100px;
          text-align: left;
        }

        .breakdown-bar {
          flex: 1;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .breakdown-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .breakdown-fill.subscriptions {
          background: #10B981;
        }

        .breakdown-fill.affiliates {
          background: #3B82F6;
        }

        .breakdown-fill.nfts {
          background: #8B5CF6;
        }

        .source-percentage {
          width: 50px;
          text-align: right;
          font-weight: bold;
        }

        .alerts-section {
          margin-bottom: 3rem;
        }

        .alerts-section h2 {
          color: #D4AF37;
          margin-bottom: 1.5rem;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .alert {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid;
        }

        .alert-success {
          background: rgba(16, 185, 129, 0.1);
          border-left-color: #10B981;
        }

        .alert-warning {
          background: rgba(245, 158, 11, 0.1);
          border-left-color: #F59E0B;
        }

        .alert-opportunity {
          background: rgba(59, 130, 246, 0.1);
          border-left-color: #3B82F6;
        }

        .alert-message {
          font-weight: bold;
          margin-bottom: 0.25rem;
        }

        .alert-action {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .alert-priority {
          font-weight: bold;
          color: #D4AF37;
        }

        .launch-checklist {
          margin-bottom: 3rem;
        }

        .launch-checklist h2 {
          color: #D4AF37;
          margin-bottom: 1.5rem;
        }

        .checklist-progress {
          margin-bottom: 2rem;
        }

        .progress-overview {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .progress-bar-large {
          width: 100%;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill-large {
          height: 100%;
          background: linear-gradient(90deg, #10B981, #D4AF37);
          transition: width 0.3s ease;
        }

        .checklist-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .category-section h3 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .task-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          transition: background 0.2s ease;
        }

        .task-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .task-item.completed {
          opacity: 0.6;
          text-decoration: line-through;
        }

        .task-item.high {
          border-left: 3px solid #EF4444;
        }

        .task-item.medium {
          border-left: 3px solid #F59E0B;
        }

        .task-item.low {
          border-left: 3px solid #10B981;
        }

        .task-text {
          flex: 1;
        }

        .task-priority {
          font-size: 0.8rem;
          color: #D4AF37;
          text-transform: uppercase;
        }

        .recommendations {
          margin-bottom: 2rem;
        }

        .recommendations h2 {
          color: #D4AF37;
          margin-bottom: 1.5rem;
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .recommendation-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .rec-icon {
          font-size: 1.2rem;
        }

        .rec-text {
          flex: 1;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .checklist-categories {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

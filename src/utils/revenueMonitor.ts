
// Real-time Revenue Dashboard
export class RevenueMonitor {
  private static instance: RevenueMonitor;
  private revenueTarget = 1167; // Daily target
  private currentRevenue = 0;
  
  static getInstance() {
    if (!RevenueMonitor.instance) {
      RevenueMonitor.instance = new RevenueMonitor();
    }
    return RevenueMonitor.instance;
  }
  
  trackPayment(amount: number) {
    this.currentRevenue += amount;
    this.updateDashboard();
    this.checkTargets();
  }
  
  private updateDashboard() {
    const percentage = (this.currentRevenue / this.revenueTarget) * 100;
    
    // Update real-time dashboard
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('revenueUpdate', {
        detail: {
          current: this.currentRevenue,
          target: this.revenueTarget,
          percentage: percentage
        }
      }));
    }
  }
  
  private checkTargets() {
    const percentage = (this.currentRevenue / this.revenueTarget) * 100;
    
    if (percentage >= 100) {
      this.sendAlert('🎉 Daily revenue target achieved!');
    } else if (percentage >= 75) {
      this.sendAlert('🔥 75% of daily target reached!');
    } else if (percentage >= 50) {
      this.sendAlert('💪 Halfway to daily target!');
    }
  }
  
  private sendAlert(message: string) {
    console.log(message);
    
    // Send to monitoring webhook
    fetch('/api/alerts/revenue', {
      method: 'POST',
      body: JSON.stringify({
        message,
        current: this.currentRevenue,
        target: this.revenueTarget,
        timestamp: Date.now()
      })
    });
  }
}

export default RevenueMonitor;

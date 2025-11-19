// ES6 Class for managing notifications with callback pattern
class NotificationManager {
  constructor() {
    this.notifications = [];
    this.callbacks = [];
  }

  // Register callback to notify when notifications change
  onNotificationChange(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
  }

  // Notify all registered callbacks
  notifyCallbacks() {
    this.callbacks.forEach(callback => {
      callback(this.notifications);
    });
  }

  add(notification) {
    this.notifications.unshift(notification);
    this.notifyCallbacks();
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      this.remove(notification.id);
    }, 5000);
  }

  remove(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyCallbacks();
  }

  clear() {
    this.notifications = [];
    this.notifyCallbacks();
  }

  getRecent(count = 5) {
    return this.notifications.slice(0, count);
  }
}

export default new NotificationManager();


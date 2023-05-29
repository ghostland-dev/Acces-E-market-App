import 'App/Models/Alert'

class Context {
  private alerts: Alert[] = [];

  setAlerts(alerts: Alert[]) {
    this.alerts = alerts;
  }

  getAlerts() {
    return this.alerts;
  }
}

export default new Context();

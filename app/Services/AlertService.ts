import { Alert } from 'App/Models/Alert';

class AlertService {
  async getAllAlerts() {
    return await Alert.all();
  }
}

export default new AlertService();

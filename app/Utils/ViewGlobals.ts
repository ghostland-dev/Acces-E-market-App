import { Alert } from 'App/Models';

export async function fetchAlerts() {
  const alerts = await Alert.all();
  return {
    alerts,
  };
}

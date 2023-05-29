import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { fetchAlerts } from 'App/Utils/ViewGlobals';

export default class ViewProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // ...
  }

  public boot() {
    // Add `fetchAlerts` as a global view variable
    this.app.container.withBindings(['Adonis/Core/View'], (View) => {
      View.global('fetchAlerts', fetchAlerts);
    });
  }
}

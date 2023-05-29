import { IoC } from '@adonisjs/fold';
import AlertService from 'App/Services/AlertService';

export default class AppHooks {
  public static boot() {
    // ...

    // Bind the AlertService to the IoC container
    IoC.bind('App/Services/AlertService', () => AlertService);
  }
}

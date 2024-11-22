import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/services/services.component').then(
        (m) => m.ServicesComponent
      ),
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./components/user-services/user-services.component').then(
        (m) => m.UserServicesComponent
      ),
  },
  {
    path: 'track-service/:id',
    loadComponent: () =>
      import('./components/tracker/tracker.component').then(
        (m) => m.TrackerComponent
      ),
  },
];

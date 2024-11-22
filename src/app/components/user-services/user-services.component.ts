import { Component, signal, WritableSignal } from '@angular/core';
import { ServiceLocation } from '../../shared/modals/ServiceLocation';
import { LocarionService } from '../../shared/services/locarion.service';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-user-services',
  standalone: true,
  imports: [MatIconModule,LoadingComponent],
  templateUrl: './user-services.component.html',
  styleUrl: './user-services.component.scss',
})
export class UserServicesComponent {
  services: WritableSignal<ServiceLocation[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(true);
  constructor(
    private _LocarionService: LocarionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadServices();
  }
  loadServices(): void {
    this.isLoading.set(true);
    this._LocarionService.getUserServices().subscribe({
      next: (response) => {
        this.services.set(response);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching services:', err);
      },
    });
  }
  viewDetails(id: number) {
    this.router.navigateByUrl(`/track-service/${id}`);
  }
}

import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LocarionService } from '../../shared/services/locarion.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [MapComponent, NgClass, MatIconModule, RouterLink,LoadingComponent],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.scss',
})
export class TrackerComponent implements OnInit {
  mapLoading: WritableSignal<boolean> = signal(true);

  constructor(
    private _locationService: LocarionService,
    private _ActivatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  serviceId: WritableSignal<string> = signal('');
  statuses: WritableSignal<string[]> = signal([
    'pending',
    'on way',
    'delivered',
    'working',
    'completed',
  ]);

  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe((params) => {
      this.serviceId.set(params['id']);
      console.log('service id:', this.serviceId());
    });
  }

  cancelService() {
    this._locationService.deleteUserService(this.serviceId()).subscribe({
      next: (res) => {
        console.log('Service cancelled and removed');
        this.router.navigateByUrl(`/`);
      },
      error: (error) => {
        console.error('Error removing service:', error);
      },
    });
  }
  onMapLoaded() {
    this.mapLoading.set(false);
  }
}

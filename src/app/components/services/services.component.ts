import { Component, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { MatIconModule } from '@angular/material/icon';
import { ServiceLocation } from '../../shared/modals/ServiceLocation';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from '../dialog/dialog.component';
import { LoadingComponent } from '../loading/loading.component';
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    RouterLink,
    MapComponent,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    LoadingComponent
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  services: WritableSignal<ServiceLocation[]> = signal([]);
  markedAddress: WritableSignal<string> = signal('');
  mapLoading: WritableSignal<boolean> = signal(true);
  constructor(public dialog: MatDialog) {}
  ngOnInit() {}

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { services: this.services() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  onMarkedLocationChange(services_address: {
    address: string;
    services: ServiceLocation[];
  }) {
    this.services.set(services_address.services);
    this.markedAddress.set(services_address.address);
  }

  onMapLoaded() {
    this.mapLoading.set(false);
  }
}

import { Component, Inject, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ServiceLocation } from '../../shared/modals/ServiceLocation';
import { MatIconModule } from '@angular/material/icon';
import { LocarionService } from '../../shared/services/locarion.service';
import { DialogData } from '../../shared/modals/dialogData';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  services: WritableSignal<ServiceLocation[]> = signal([]);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _LocarionService: LocarionService
  ) {
    this.services.set(data.services);
    console.log(data);
  }

  onAddService(service: ServiceLocation): void {
    this._LocarionService.addUserService(service).subscribe(() => {
      this.removeServiceFromAvailableList(service.id);
    });
  }

  removeServiceFromAvailableList(serviceId: number): void {
    this.services.update((currentServices) =>
      currentServices.filter((s) => s.id !== serviceId)
    );
  }
}

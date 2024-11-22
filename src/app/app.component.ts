import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from './shared/services/flowbite-service.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  view: any;
  services: Array<{
    name: string;
    latitude: number;
    longitude: number;
  }> = [];
  markedLocation: { latitude: number; longitude: number } | null = null;

  constructor(private flowbiteService: FlowbiteService) {}
  ngOnInit() {
    this.flowbiteService.loadFlowbite((flowbite) => {
      console.log('Flowbite loaded', flowbite);
    });
  }
}

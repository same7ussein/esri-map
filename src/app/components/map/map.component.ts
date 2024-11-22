import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  Inject,
  Output,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { loadModules } from 'esri-loader';
import { ServiceLocation } from '../../shared/modals/ServiceLocation';
import { LocarionService } from '../../shared/services/locarion.service';
import { from, Observable } from 'rxjs';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  @Output() markedLocationChange = new EventEmitter<{
    address: string;
    services: ServiceLocation[];
  }>();
  @Output() mapLoaded = new EventEmitter<void>();

  view: any;
  services: WritableSignal<ServiceLocation[]> = signal([]);
  markedLocation = signal<{ latitude: number; longitude: number } | null>(null);
  radius = signal<number>(20);
  isLoading = signal<boolean>(true);

  servicesInArea = computed(() => {
    const location = this.markedLocation();
    const radiusValue = this.radius();
    if (!location) return [];

    return this.services().filter((service) => {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        service.latitude,
        service.longitude
      );
      console.log(distance);
      return distance <= radiusValue;
    });
  });
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private locationService: LocarionService
  ) {}
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
    }
    this.loadServices();
  }
  async initializeMap() {
    const [Map, MapView, Graphic, Locate, esriConfig, Locator] =
      await loadModules(
        [
          'esri/Map',
          'esri/views/MapView',
          'esri/Graphic',
          'esri/widgets/Locate',
          'esri/config',
          'esri/rest/locator',
        ],

        {
          css: true,
        }
      );

    esriConfig.apiKey =
      'AAPKe35a9f275e8f438c9cfab71d6a68c528PvRFJckQRStetsxj2KY-KZz7KBMLCpv-2ocDiJ7KM5zJUCIaLuCtM6T2mQUn_b7e';
    const map = new Map({
      basemap: 'arcgis-imagery',
    });

    this.view = new MapView({
      container: 'mapView',
      map: map,
      center: [12, 24],
      zoom: 4,
      constraints: {
        minZoom: 4,
      },
    });

    this.view.when(() => {
      this.isLoading.set(false);
      this.mapLoaded.emit();
    });

    const locateWidget = new Locate({
      view: this.view,
      useHeadingEnabled: false,
      goToOverride: (view: any, options: any) => {
        options.target.zoom = 15;
        return view.goTo(options.target);
      },
    });

    this.view.ui.add(locateWidget, {
      position: 'top-left',
    });
    this.view.on('click', async (event: any) => {
      const point = {
        type: 'point',
        longitude: event.mapPoint.longitude,
        latitude: event.mapPoint.latitude,
      };

      const markerSymbol = {
        type: 'text',
        color: '#22c55e',
        text: '\ue61d',
        font: {
          size: 20,
          family: 'CalciteWebCoreIcons',
        },
      };

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
      });

      this.view.graphics.removeAll();
      this.view.graphics.add(pointGraphic);
      this.markedLocation.set({
        latitude: point.latitude,
        longitude: point.longitude,
      });
      console.log(this.markedLocation());
      console.log(this.servicesInArea());
      this.reverseGeocode(point.latitude, point.longitude).subscribe(
        (areaName) => {
          console.log('address', areaName);
          this.markedLocationChange.emit({
            address: areaName,
            services: this.servicesInArea(),
          });
        }
      );
    });
  }

  reverseGeocode(latitude: number, longitude: number): Observable<string> {
    return from(
      (async () => {
        const [Locator, Point] = await loadModules([
          'esri/rest/locator',
          'esri/geometry/Point',
        ]);

        const geocodingServiceUrl =
          'https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer';

        const pt = new Point({
          latitude: latitude,
          longitude: longitude,
        });

        const params = {
          location: pt,
        };

        const response = await Locator.locationToAddress(
          geocodingServiceUrl,
          params
        );
        if (response) {
          return response.address || 'Unknown Area';
        } else {
          throw new Error('No address found.');
        }
      })()
    );
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private loadServices(): void {
    this.locationService.getServices().subscribe((data) => {
      this.services.set(data);
    });
  }

  ngOnDestroy() {
    if (this.view) {
      this.view.destroy();
    }
  }
}

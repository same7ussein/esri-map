import { Injectable } from '@angular/core';
import { ServiceLocation } from '../modals/ServiceLocation';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LocarionService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getServices(): Observable<ServiceLocation[]> {
    return this.http.get<ServiceLocation[]>(`${this.baseUrl}/services`);
  }

  addUserService(service: ServiceLocation): Observable<ServiceLocation> {
    return this.http.post<ServiceLocation>(
      `${this.baseUrl}/userServices`,
      service
    );
  }

  getUserServices(): Observable<ServiceLocation[]> {
    return this.http.get<ServiceLocation[]>(`${this.baseUrl}/userServices`);
  }

  deleteUserService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/userServices/${id}`);
  }
}

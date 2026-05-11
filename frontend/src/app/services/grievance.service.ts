import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrievanceService {
  api = 'http://localhost:5000/api/grievance';
  authApi = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {
    console.log("GRIEVANCE API =", this.api);
    console.log("AUTH API =", this.authApi);
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  submit(data: FormData): Observable<any> {
    console.log("SUBMIT URL =", `${this.api}/submit`);
    return this.http.post(`${this.api}/submit`, data, this.getHeaders());
  }

  getAll(): Observable<any> {
    console.log("GET ALL URL =", `${this.api}/all`);
    return this.http.get(`${this.api}/all`, this.getHeaders());
  }

  updateStatus(data: any): Observable<any> {
    console.log("STATUS URL =", `${this.api}/status`);
    return this.http.post(`${this.api}/status`, data, this.getHeaders());
  }

  changePassword(data: any): Observable<any> {
    console.log("CHANGE PASSWORD URL =", `${this.authApi}/change-password`);
    return this.http.post(`${this.authApi}/change-password`, data, this.getHeaders());
  }
}
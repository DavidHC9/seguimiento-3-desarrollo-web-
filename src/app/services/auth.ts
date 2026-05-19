import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:2026/api/usuario/login';

  constructor(private http: HttpClient) { }

  Login(email: string, password: string): Observable<LoginResponse> {
    let body = {
      email: email,
      password: password
    }

    return this.http.post<LoginResponse>(this.apiUrl, body);
  }

  Register(nombre: string, email: string, password: string): Observable<any> {
    let body = {
      nombre: nombre,
      email: email,
      password: password
    }

    // El endpoint de registro correcto en el backend es /api/usuario/registrar
    const registerUrl = 'http://localhost:2026/api/usuario/registrar';
    return this.http.post<any>(registerUrl, body);
  }

  guardarToken(token: string): void {
    sessionStorage.setItem('token_usuario', token);

  }

  obtenerToken(): string | null {
    return sessionStorage.getItem('token_usuario');
  }

  estaLogueado(): boolean {
    let token = this.obtenerToken();

    if (token) {
      return true;
    }
    else {
      return false;
    }
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('token_usuario');
  }
}

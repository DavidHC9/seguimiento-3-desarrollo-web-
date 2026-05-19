import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {

  formularioLogin = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private authService: Auth, private router: Router) { }

  // Estado para ocultar la visibilidad de la contraseña
  mostrarContrasena: boolean = false;

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  iniciarSesion(): void {
    let email = this.formularioLogin.value.email || '';
    let password = this.formularioLogin.value.password || '';

    this.authService.Login(email, password).subscribe({
      next: (respuesta: { token: string }) => {
        if (respuesta.token) {
          this.authService.guardarToken(respuesta.token);
          this.router.navigate(['/home']);
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
}

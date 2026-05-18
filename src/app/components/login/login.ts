import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {

  formularioLogin = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')

  });

  // State to toggle password visibility
  mostrarContrasena: boolean = false;

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  iniciarSesion(): void {
    let email = this.formularioLogin.value.email || '';
    let password = this.formularioLogin.value.password || '';

    this.authService.Login(email, password).subscribe(
      {
        next: respuesta => {
          if (respuesta.token) {
            this.authService.guardarToken(respuesta.token);
            this.router.navigate(['/home']);
          }
        },
        error: error => {
          console.error(error);
        }
      }
    )
  }

  /* iniciarSesion() {
    if (this.formularioLogin.valid) {
      console.log('Datos de inicio de sesión:', this.formularioLogin.value);
      alert(`Iniciando sesión con email: ${this.formularioLogin.value.email}`);
    } else {
      alert('Por favor, complete los campos correctamente.');
    }
  } */
}

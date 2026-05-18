import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

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
    password: new FormControl(''),
  });

  // Estado para alternar la visibilidad de la contraseña
  mostrarContrasena: boolean = false;

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  iniciarSesion() {
    if (this.formularioLogin.valid) {
      console.log('Datos de inicio de sesión:', this.formularioLogin.value);
      alert(`Iniciando sesión con email: ${this.formularioLogin.value.email}`);
    } else {
      alert('Por favor, complete los campos correctamente.');
    }
  }
}

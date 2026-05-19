import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: '../login/login.css',
})
export class Register {
  formularioRegistro = new FormGroup({
    nombre: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  mostrarContrasena: boolean = false;

  constructor(private authService: Auth, private router: Router) {}

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  registrarUsuario(): void {
    let nombre = this.formularioRegistro.value.nombre || '';
    let email = this.formularioRegistro.value.email || '';
    let password = this.formularioRegistro.value.password || '';

    this.authService.Register(nombre, email, password).subscribe({
      next: (respuesta: any) => {
        // Redirigir al login después del registro exitoso
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('Error al registrar usuario', error);
      }
    });
  }
}


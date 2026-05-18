import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Experiencia {
  empresa: string;
  cargo: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
}

interface Certificado {
  nombreCertificado: string;
  institucion: string;
  fecha: string;
  descripcion: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Estado de idioma ('ES' para Español, 'EN' para Inglés)
  idioma: 'ES' | 'EN' = 'ES';

  // Datos personales (MongoDB: colección 'infoPersonal')
  infoPersonal = {
    nombreCompleto: 'David Herrera',
    cargo: 'Ingeniero de Software',
    email: 'david@gmail.com',
    celular: '3001234567',
    resumen: 'Desarrollador Backend apasionado por la creación de soluciones escalables y eficientes. Especialista en la construcción de APIs REST robustas utilizando Node.js, Express y bases de datos relacionales y no relacionales como MongoDB.',
  };

  // Experiencia Laboral (MongoDB: colección 'experiencia')
  experiencias: Experiencia[] = [
    {
      empresa: 'Tech Corp',
      cargo: 'Desarrollador Backend',
      fechaInicio: '2023-01-01',
      fechaFin: '2024-01-01',
      descripcion: 'Diseño e implementación de microservicios con Node.js, optimización de consultas en bases de datos MongoDB y mantenimiento de pipelines de integración continua.',
    },
  ];

  // Certificados (MongoDB: colección 'certificado')
  certificados: Certificado[] = [
    {
      nombreCertificado: 'Curso de Node y MongoDB',
      institucion: 'Udemy',
      fecha: '2024-01-15',
      descripcion: 'Aprendizaje profundo sobre modelado de datos, agregaciones, seguridad y despliegue de bases de datos MongoDB y APIs en producción.',
    },
  ];

  constructor(private router: Router) {}

  // --- Métodos para la colección 'experiencia' ---
  agregarExperiencia() {
    this.experiencias.push({
      empresa: '',
      cargo: '',
      fechaInicio: '',
      fechaFin: '',
      descripcion: '',
    });
  }

  eliminarExperiencia(index: number) {
    if (this.experiencias.length > 1) {
      this.experiencias.splice(index, 1);
    } else {
      alert(this.idioma === 'ES' ? 'Debes mantener al menos una experiencia laboral.' : 'You must maintain at least one work experience.');
    }
  }

  // --- Métodos para la colección 'certificado' ---
  agregarCertificado() {
    this.certificados.push({
      nombreCertificado: '',
      institucion: '',
      fecha: '',
      descripcion: '',
    });
  }

  eliminarCertificado(index: number) {
    if (this.certificados.length > 1) {
      this.certificados.splice(index, 1);
    } else {
      alert(this.idioma === 'ES' ? 'Debes mantener al menos un certificado.' : 'You must maintain at least one certificate.');
    }
  }

  // --- Selección de Idioma ---
  cambiarIdioma(lang: 'ES' | 'EN') {
    this.idioma = lang;
  }

  // --- Descarga de PDF ---
  // Dispara el sistema de impresión del navegador, configurado en CSS para ocultar los formularios
  // y renderizar únicamente la hoja de vida A4 de manera impecable y vectorizada.
  descargarPDF() {
    window.print();
  }

  // --- Cierre de Sesión ---
  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}

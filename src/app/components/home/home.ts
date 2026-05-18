import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

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

interface CVData {
  infoPersonal: {
    nombreCompleto: string;
    cargo: string;
    email: string;
    celular: string;
    resumen: string;
  };
  experiencias: Experiencia[];
  certificados: Certificado[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Idioma activo ('ES' / 'EN')
  idioma: 'ES' | 'EN' = 'ES';

  // Control de ventana modal activa ('personal' | 'experience' | 'certificate' | null)
  activeModal: 'personal' | 'experience' | 'certificate' | null = null;

  // Variables vinculadas al formulario y a la hoja A4 en tiempo real
  infoPersonal = {
    nombreCompleto: '',
    cargo: '',
    email: '',
    celular: '',
    resumen: '',
  };

  experiencias: Experiencia[] = [];
  certificados: Certificado[] = [];

  // Almacén completo de datos en Español (MongoDB: infoPersonal, experiencia, certificado)
  private datosES: CVData = {
    infoPersonal: {
      nombreCompleto: 'David Herrera',
      cargo: 'Ingeniero de Software',
      email: 'david@gmail.com',
      celular: '3001234567',
      resumen: 'Desarrollador Backend apasionado por la creación de soluciones escalables y eficientes. Especialista en la construcción de APIs REST robustas utilizando Node.js, Express y bases de datos relacionales y no relacionales como MongoDB.',
    },
    experiencias: [
      {
        empresa: 'Tech Corp',
        cargo: 'Desarrollador Backend',
        fechaInicio: '2023-01-01',
        fechaFin: '2024-01-01',
        descripcion: 'Diseño e implementación de microservicios con Node.js, optimización de consultas en bases de datos MongoDB y mantenimiento de pipelines de integración continua.',
      },
    ],
    certificados: [
      {
        nombreCertificado: 'Curso de Node y MongoDB',
        institucion: 'Udemy',
        fecha: '2024-01-15',
        descripcion: 'Aprendizaje profundo sobre modelado de datos, agregaciones, seguridad y despliegue de bases de datos MongoDB y APIs en producción.',
      },
    ],
  };

  // Almacén completo de datos en Inglés (MongoDB: infoPersonal, experiencia, certificado)
  private datosEN: CVData = {
    infoPersonal: {
      nombreCompleto: 'David Herrera',
      cargo: 'Software Engineer',
      email: 'david@gmail.com',
      celular: '3001234567',
      resumen: 'Backend Developer passionate about building scalable and efficient solutions. Specialist in constructing robust REST APIs using Node.js, Express, and SQL/NoSQL databases like MongoDB.',
    },
    experiencias: [
      {
        empresa: 'Tech Corp',
        cargo: 'Backend Developer',
        fechaInicio: '2023-01-01',
        fechaFin: '2024-01-01',
        descripcion: 'Design and implementation of microservices with Node.js, optimization of queries in MongoDB databases, and maintenance of continuous integration pipelines.',
      },
    ],
    certificados: [
      {
        nombreCertificado: 'Node & MongoDB Certification',
        institucion: 'Udemy',
        fecha: '2024-01-15',
        descripcion: 'Deep learning on data modeling, aggregations, security, and deployment of MongoDB databases and APIs in production environments.',
      },
    ],
  };

  constructor(private authService: Auth, private router: Router) {
    // Inicializar cargando los datos en Español por defecto
    this.cargarDatos('ES');
  }

  // --- Manejo de Datos por Idioma ---
  private cargarDatos(lang: 'ES' | 'EN') {
    const origen = lang === 'ES' ? this.datosES : this.datosEN;
    
    // Clonación profunda para evitar referencias cruzadas
    this.infoPersonal = JSON.parse(JSON.stringify(origen.infoPersonal));
    this.experiencias = JSON.parse(JSON.stringify(origen.experiencias));
    this.certificados = JSON.parse(JSON.stringify(origen.certificados));
  }

  private guardarDatosActuales() {
    const destino = this.idioma === 'ES' ? this.datosES : this.datosEN;
    
    destino.infoPersonal = JSON.parse(JSON.stringify(this.infoPersonal));
    destino.experiencias = JSON.parse(JSON.stringify(this.experiencias));
    destino.certificados = JSON.parse(JSON.stringify(this.certificados));
  }

  cambiarIdioma(lang: 'ES' | 'EN') {
    if (this.idioma === lang) return;
    
    // Guardar los datos actuales modificados en el idioma viejo
    this.guardarDatosActuales();
    
    // Cambiar la bandera de idioma
    this.idioma = lang;
    
    // Cargar los datos del nuevo idioma
    this.cargarDatos(lang);
  }

  // --- Control de Modales ---
  abrirModal(seccion: 'personal' | 'experience' | 'certificate') {
    this.activeModal = seccion;
  }

  cerrarModal() {
    this.activeModal = null;
  }

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

  // --- Descarga de PDF ---
  descargarPDF() {
    window.print();
  }

  // --- Cierre de Sesión ---
  cerrarSesion() {
    // 1. Limpiar token de sesión para autorizar la navegación del Guard de login
    this.authService.cerrarSesion();
    
    // 2. Redirigir a login
    this.router.navigate(['/login']);
  }
}

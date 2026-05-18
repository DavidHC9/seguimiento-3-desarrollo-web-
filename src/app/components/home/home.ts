import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../services/auth';

interface Experiencia {
  _id?: string;
  empresa: string;
  cargo: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
}

interface Certificado {
  _id?: string;
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
export class Home implements OnInit {
  // Idioma activo ('ES' / 'EN')
  idioma: 'ES' | 'EN' = 'ES';

  // Control de ventana modal activa ('personal' | 'experience' | 'certificate' | null)
  activeModal: 'personal' | 'experience' | 'certificate' | null = null;

  // URL base del backend Express que se conecta a MongoDB (Puerto 2026)
  private apiUrl = 'http://localhost:2026/api';

  // ID del documento de información personal en MongoDB para actualizaciones
  infoPersonalId: string | null = null;

  // Variables reactivas vinculadas al formulario y a la hoja A4
  infoPersonal = {
    nombreCompleto: '',
    cargo: '',
    email: '',
    celular: '',
    resumen: '',
  };

  experiencias: Experiencia[] = [];
  certificados: Certificado[] = [];

  constructor(
    private http: HttpClient, 
    private authService: Auth, 
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarTodoDesdeDB();
  }

  // --- Carga de Datos desde MongoDB ---
  cargarTodoDesdeDB() {
    this.obtenerInfoPersonal();
    this.obtenerExperiencias();
    this.obtenerCertificados();
  }

  obtenerInfoPersonal() {
    this.http.get<any[]>(`${this.apiUrl}/info`).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.infoPersonal = res[0];
          this.infoPersonalId = res[0]._id;
        } else {
          // Si MongoDB está vacío, creamos una información por defecto mediante POST
          const defaultInfo = {
            nombreCompleto: 'David Herrera',
            cargo: 'Ingeniero de Software',
            email: 'david@gmail.com',
            celular: '3001234567',
            resumen: 'Desarrollador Backend apasionado por la creación de soluciones escalables y eficientes. Especialista en la construcción de APIs REST robustas utilizando Node.js, Express y bases de datos relacionales y no relacionales como MongoDB.',
          };
          this.http.post<any>(`${this.apiUrl}/info`, defaultInfo).subscribe({
            next: (created) => {
              if (created.info) {
                this.infoPersonal = created.info;
                this.infoPersonalId = created.info._id;
              }
            },
            error: (err) => console.error('Error creando InfoPersonal por defecto:', err)
          });
        }
      },
      error: (err) => console.error('Error consultando InfoPersonal:', err)
    });
  }

  obtenerExperiencias() {
    this.http.get<Experiencia[]>(`${this.apiUrl}/experiencia`).subscribe({
      next: (res) => {
        this.experiencias = res;
        if (!res || res.length === 0) {
          // Si no hay experiencias en MongoDB, añadimos la primera por defecto mediante POST
          const defaultExp = {
            empresa: 'Tech Corp',
            cargo: 'Desarrollador Backend',
            fechaInicio: '2023-01-01',
            fechaFin: '2024-01-01',
            descripcion: 'Diseño e implementación de microservicios con Node.js, optimización de consultas en bases de datos MongoDB y mantenimiento de pipelines de integración continua.',
          };
          this.http.post<any>(`${this.apiUrl}/experiencia`, defaultExp).subscribe({
            next: (created) => {
              if (created.experiencia) {
                this.experiencias.push(created.experiencia);
              }
            },
            error: (err) => console.error('Error creando experiencia por defecto:', err)
          });
        }
      },
      error: (err) => console.error('Error consultando experiencias:', err)
    });
  }

  obtenerCertificados() {
    this.http.get<Certificado[]>(`${this.apiUrl}/certificado`).subscribe({
      next: (res) => {
        this.certificados = res;
        if (!res || res.length === 0) {
          // Si no hay certificados en MongoDB, creamos uno por defecto mediante POST
          const defaultCert = {
            nombreCertificado: 'Curso de Node y MongoDB',
            institucion: 'Udemy',
            fecha: '2024-01-15',
            descripcion: 'Aprendizaje profundo sobre modelado de datos, agregaciones, seguridad y despliegue de bases de datos MongoDB y APIs en producción.',
          };
          this.http.post<any>(`${this.apiUrl}/certificado`, defaultCert).subscribe({
            next: (created) => {
              if (created.certificado) {
                this.certificados.push(created.certificado);
              }
            },
            error: (err) => console.error('Error creando certificado por defecto:', err)
          });
        }
      },
      error: (err) => console.error('Error consultando certificados:', err)
    });
  }

  // --- Cambio de Idioma ---
  cambiarIdioma(lang: 'ES' | 'EN') {
    this.idioma = lang;
    
    // Le informamos didácticamente al usuario que puede escribir directamente
    // en el idioma de su elección y guardarlo en la Base de Datos.
    if (lang === 'EN') {
      alert('You can now type your details in English directly in the forms and save them to MongoDB!');
    } else {
      alert('¡Ahora puedes escribir tus datos en español directamente en los formularios y guardarlos en MongoDB!');
    }
  }

  // --- Control de Modales ---
  abrirModal(seccion: 'personal' | 'experience' | 'certificate') {
    this.activeModal = seccion;
  }

  cerrarModal() {
    this.activeModal = null;
  }

  // --- Operaciones de Guardado (Se activan al hacer clic en "Guardar y Cerrar") ---
  guardarInfoPersonal() {
    if (this.infoPersonalId) {
      this.http.put(`${this.apiUrl}/info/${this.infoPersonalId}`, this.infoPersonal).subscribe({
        next: () => this.cerrarModal(),
        error: (err) => console.error('Error actualizando InfoPersonal en MongoDB:', err)
      });
    } else {
      this.http.post<any>(`${this.apiUrl}/info`, this.infoPersonal).subscribe({
        next: (created) => {
          if (created.info) {
            this.infoPersonal = created.info;
            this.infoPersonalId = created.info._id;
          }
          this.cerrarModal();
        },
        error: (err) => console.error('Error creando InfoPersonal en MongoDB:', err)
      });
    }
  }

  guardarCambiosExperiencia() {
    // Recorremos las experiencias de la pantalla y actualizamos cada una en MongoDB
    this.experiencias.forEach((exp) => {
      if (exp._id) {
        this.http.put(`${this.apiUrl}/experiencia/${exp._id}`, exp).subscribe({
          error: (err) => console.error(`Error actualizando experiencia ${exp._id}:`, err)
        });
      }
    });
    this.cerrarModal();
  }

  guardarCambiosCertificado() {
    // Recorremos los certificados de la pantalla y actualizamos cada uno en MongoDB
    this.certificados.forEach((cert) => {
      if (cert._id) {
        this.http.put(`${this.apiUrl}/certificado/${cert._id}`, cert).subscribe({
          error: (err) => console.error(`Error actualizando certificado ${cert._id}:`, err)
        });
      }
    });
    this.cerrarModal();
  }

  // --- Sincronización Interactiva en Tiempo Real ---
  agregarExperiencia() {
    const nueva = {
      empresa: this.idioma === 'ES' ? 'Nueva Empresa' : 'New Company',
      cargo: this.idioma === 'ES' ? 'Nuevo Cargo' : 'New Job Title',
      fechaInicio: '2024-01-01',
      fechaFin: this.idioma === 'ES' ? 'Presente' : 'Present',
      descripcion: '',
    };

    // Añadimos directamente a MongoDB y metemos el registro retornado (con su _id único)
    this.http.post<any>(`${this.apiUrl}/experiencia`, nueva).subscribe({
      next: (res) => {
        if (res.experiencia) {
          this.experiencias.push(res.experiencia);
        }
      },
      error: (err) => console.error('Error al agregar nueva experiencia:', err)
    });
  }

  eliminarExperiencia(index: number) {
    const exp = this.experiencias[index];
    if (exp && exp._id) {
      // Eliminamos físicamente de MongoDB
      this.http.delete(`${this.apiUrl}/experiencia/${exp._id}`).subscribe({
        next: () => {
          this.experiencias.splice(index, 1);
        },
        error: (err) => console.error('Error al eliminar experiencia en MongoDB:', err)
      });
    } else {
      this.experiencias.splice(index, 1);
    }
  }

  agregarCertificado() {
    const nuevo = {
      nombreCertificado: this.idioma === 'ES' ? 'Nueva Certificación' : 'New Certification',
      institucion: this.idioma === 'ES' ? 'Institución' : 'Institution',
      fecha: '2024-01-01',
      descripcion: '',
    };

    // Añadimos directamente a MongoDB y metemos el registro retornado (con su _id único)
    this.http.post<any>(`${this.apiUrl}/certificado`, nuevo).subscribe({
      next: (res) => {
        if (res.certificado) {
          this.certificados.push(res.certificado);
        }
      },
      error: (err) => console.error('Error al agregar nuevo certificado:', err)
    });
  }

  eliminarCertificado(index: number) {
    const cert = this.certificados[index];
    if (cert && cert._id) {
      // Eliminamos físicamente de MongoDB
      this.http.delete(`${this.apiUrl}/certificado/${cert._id}`).subscribe({
        next: () => {
          this.certificados.splice(index, 1);
        },
        error: (err) => console.error('Error al eliminar certificado en MongoDB:', err)
      });
    } else {
      this.certificados.splice(index, 1);
    }
  }

  // --- Descarga de PDF ---
  descargarPDF() {
    window.print();
  }

  // --- Cierre de Sesión ---
  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}

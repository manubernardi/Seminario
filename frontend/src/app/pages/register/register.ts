import { Component } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from "@angular/forms";
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';

export interface RegistroDto{
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    rol_id: number;
}
@Component({
  selector: 'register',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})



export class Register {
  registerForm: FormGroup;
  error = '';

  constructor(
    private usuarioService: UsuariosService,
    private fb: FormBuilder,
    private router: Router){
    this.registerForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    dni: [
    '',
    [Validators.required, Validators.minLength(7), Validators.maxLength(8)],
  ],
  telefono: [
    '',
    [Validators.required, Validators.pattern('^[0-9]{10,15}$')],
  ],
  rol_id: ['', Validators.required], 
});
  }

enviar(): void {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }
  const registroDto: RegistroDto = this.registerForm.value
  const payload: RegistroDto = {
    ...registroDto,
    rol_id: Number(registroDto.rol_id)  // ⭐ Conversión explícita
  };
  console.log(payload)
  this.usuarioService.nuevoUsuario(payload).subscribe({
    next: (response) => {
      alert('Usuario registrado correctamente');
      console.log('Respuesta del backend:', response);
      this.registerForm.reset();
    },
    error: (err) => {
      alert(err.message || 'Error al registrar usuario');
    }
  });
   this.router.navigate(['/home']);
  }
   
}

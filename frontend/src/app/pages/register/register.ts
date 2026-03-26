  import { Component } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from "@angular/forms";
  import { Router } from '@angular/router';
  import { UsuariosService } from '../../services/usuarios.service';

  export interface RegistroDto{
      nombre: string;
      apellido: string;
      dni: string;
      rol_id: number;
      password: string;
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
    mostrarPassword: boolean = false;

    constructor(
      private usuarioService: UsuariosService,
      private fb: FormBuilder,
      private router: Router){
      this.registerForm = this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
        rol_id: [null, Validators.required],
        password: ['']
        
      });
      
      this.registerForm.get('rol_id')?.valueChanges.subscribe(value => {
      const passwordControl = this.registerForm.get('contraseña');
      if (value === 1) {
        passwordControl?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
      } else {
        passwordControl?.clearValidators();
        passwordControl?.reset();
      }
      passwordControl?.updateValueAndValidity();
    });
  }

  get esSupervisor(): boolean {
    return this.registerForm.get('rol_id')?.value === 1;
  }

  

  enviar(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const registroDto: RegistroDto = this.registerForm.value
    console.log('Datos del form:', registroDto);
    console.log('Tipo de rol_id:', typeof registroDto.rol_id);


    this.usuarioService.nuevoUsuario(registroDto).subscribe({
      next: (response) => {
        this.registerForm.reset();
        this.router.navigate(['/home']);
      },
      error: (err) => { alert(err.message || 'Error al registrar usuario');}
    });
  }

  volver():void { 
    this.router.navigate(['/home']);
  }
  
}

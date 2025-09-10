import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from '@angular/router';

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
    private fb: FormBuilder,
    private router: Router){
    this.registerForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      seleccion: ['', Validators.required]

    });
  }

  enviar(){
    if (this.registerForm.invalid){
      this.error = 'Completa todos los campos correctamente.';
      return;
    }

    console.log(this.registerForm.value);

    this.router.navigate(['/home']);
    
  }
}

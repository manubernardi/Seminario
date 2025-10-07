import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from "@angular/forms";
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
      nombre: ['', [Validators.required]],
      apellido: ['',[Validators.required]],
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      telefono: ['',[Validators.required, Validators.pattern(/^\d{10}$/)]],
      rol: ['', Validators.required]

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

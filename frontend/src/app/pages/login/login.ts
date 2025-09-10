
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;
  error = '';

  constructor( 
    private fb: FormBuilder,
    private router: Router
  ){
      this.loginForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]]
      });
  }

  enviar(){
    if (this.loginForm.invalid) {
      this.error = 'Completa todos los campos correctamente.';
      return;
    }

    console.log(this.loginForm.value);

    this.router.navigate(['/home']);
  }
}

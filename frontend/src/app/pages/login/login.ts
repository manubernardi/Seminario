
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';



@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    FormsModule
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
        dni: ['', [Validators.required, 
                  Validators.minLength(7), 
                  Validators.maxLength(8),
                  Validators.pattern(/^\d+$/)]],
        supervisor: this.fb.group({
          enabled: [false],
          password:['']
        })
    });

    // si se marca el checkbox, agrego validadores al password
    this.loginForm.get('supervisor.enabled')?.valueChanges.subscribe(isSupervisor => {
      const passwordCtrl = this.loginForm.get('supervisor.password');
      if (isSupervisor) {
        passwordCtrl?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
      } else {
        passwordCtrl?.clearValidators();
      }
      passwordCtrl?.updateValueAndValidity();
    });
  }

  ngOnInit(){
    const esSupervisor = document.getElementById('supervisor-check');
    const formSupervisor = document.getElementById('supervisor');
    esSupervisor?.addEventListener('click', ()=>{
      console.log('obtiene el elemento')
      formSupervisor?.classList.toggle('unchecked');
    })
  }

  public enviar(){
    if (this.loginForm.invalid) {
      this.error = 'Completa todos los campos correctamente.';
      return;
    }

    console.log(this.loginForm.value);

    this.router.navigate(['/home']);
  }

}

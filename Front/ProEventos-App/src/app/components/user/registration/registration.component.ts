import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form!: FormGroup;

  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
    this.validation();
  }

  get fr(): any{
    return this.form.controls;
  }

  public validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('senha', 'confirmaSenha')
    };

    this.form = this.fb.group({
      primeiroNome:['', Validators.required],
      ultimoNome:['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      userName:['', Validators.required],
      senha:['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha:['', Validators.required],
    }, formOptions)
  }

  // public passwordVerification(): boolean {
  //   if(this.form.controls.senha.value === this.form.controls.confirmaSenha.value) return this.passwordMatch = true;
  //   else return this.passwordMatch = false;
  // }
}

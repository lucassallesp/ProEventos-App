import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  form!: FormGroup;

  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
    this.validation();
  }

  get fp(): any{
    return this.form.controls;
  }

  public validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('senha', 'confirmaSenha')
    };

    this.form = this.fb.group({
      titulo: ['', Validators.required],
      primeiroNome:['', Validators.required],
      ultimoNome:['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      telefone:['', Validators.required],
      funcao: ['', Validators.required],
      senha:['', [Validators.minLength(6), Validators.nullValidator]],
      confirmaSenha:['', Validators.nullValidator],
      descricao:['', Validators.required]
    }, formOptions)
  }

  onSubmit(): void {

    // Vai parar aqui se o form estiver inválido
    if (this.form.invalid) {
      return;
    }
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }
}

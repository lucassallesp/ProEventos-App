import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
  }

  onSubmit(): void {
    this.atualizarUsuario();
  }

  get fp(): any{
    return this.form.controls;
  }

  private carregarUsuario() {
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
        console.log(userRetorno);
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toaster.success('Usuário Carregado', 'Sucesso!')
      },
      (error) => {
        console.error(error);
        this.toaster.error('Usuário não Carregado', 'Erro');
        this.router.navigate(['/dashboard']);
      },
      () => this.spinner.hide()
    )
  }

  public validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmaPassword')
    };

    this.form = this.fb.group({
      userName: [''],
      titulo: ['NaoInformado', Validators.required],
      primeiroNome:['', Validators.required],
      ultimoNome:['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      phoneNumber:['', Validators.required],
      funcao: ['NaoInformado', Validators.required],
      password:['', [Validators.minLength(4), Validators.nullValidator]],
      confirmaPassword:['', Validators.nullValidator],
      descricao:['', Validators.required]
    }, formOptions)
  }


  public atualizarUsuario(): void {
    this.userUpdate = { ... this.form.value }
    this.spinner.show();

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => this.toaster.success('Usuário Atualizado!', 'Sucesso'),
      (error) => {
        this.toaster.error(error.error);
        console.error(error);
      },
      () => this.spinner.hide()
    )
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss']
})
export class PerfilDetalheComponent implements OnInit {
  @Output() changeFormValue = new EventEmitter();

  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    public palestranteService: PalestranteService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
    this.verificaForm();
  }

  onSubmit(): void {
    this.atualizarUsuario();
  }

  get fp(): any{
    return this.form.controls;
  }

  public verificaForm(): void {
    this.form.valueChanges
      .subscribe(() => this.changeFormValue.emit({ ... this.form.value}))
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
      imagemURL: [''],
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

    if(this.fp.funcao.value === 'Palestrante') {

      this.palestranteService.post().subscribe(
        () => this.toaster.success('Função Palestrante Ativada!', 'Sucesso'),
        (error) => {
          this.toaster.error('Função Palestrante não pode ser ativada!', 'Erro');
          console.error(error);
        }
      )
    }

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

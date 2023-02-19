import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { environment } from '@enviroments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario = {} as UserUpdate;
  public file: File;
  public imagemURL = '';

  constructor(
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
  }

  get isPalestrante(): boolean {
    return this.usuario.funcao === 'Palestrante';
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImage();
  }

  private uploadImage(): void {
    this.spinner.show();
    this.accountService.postUpload(this.file).subscribe(
      () => this.toaster.success('Imagem carregada com sucesso', 'Sucesso!'),
      () => this.toaster.error('Erro ao fazer upload de imagem', 'Erro!'),
      () => this.spinner.hide()
    )
  }

  public setFormValue(usuario: UserUpdate): void {
    this.usuario = usuario;

    if(this.usuario.imagemURL)
      this.imagemURL = environment.apiURL + `/resources/perfil/${this.usuario.imagemURL}`;
    else
      this.imagemURL = './assets/img/sem-imagem-perfil.png';
  }
}

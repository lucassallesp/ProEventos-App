import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  modalRef: BsModalRef
  eventoId: number;
  form!: FormGroup;
  event = {} as Evento;
  saveModeState: string = 'post';
  currentLote = {id: 0, name: '', index: 0}

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private eventoService: EventoService,
              private router: ActivatedRoute,
              private activeRouter: Router,
              private modalService: BsModalService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private loteService: LoteService
             )
  {
    this.localeService.use('pt-br')
  }

  public editMode(): boolean {
    if(this.saveModeState === 'put') return true  // edit mode
    return false;                            // add mode
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  get bsConfigLote(): any {
    return {
      adaptivePosition: true,
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  ngOnInit(): void {
    this.loadEvent();
    this.validation();
  }

  public loadEvent(): void {
    this.eventoId = +this.router.snapshot.paramMap.get('id');

    if(this.eventoId !== null && this.eventoId !== 0) {
      this.saveModeState = 'put';

      this.spinner.show();
      this.eventoService.getEventoById(this.eventoId).subscribe({
        next: (event: Evento) => {            //the returned value by getEventoById is the 'next' param
          this.event = {...event};       //using spread operator to set the variable content to a field
          this.form.patchValue(this.event);
          this.event.lotes.forEach(lote => {
            this.lotes.push(this.createLote(lote))
          });
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error("Erro ao tentar carregar o evento", "Erro!")
          console.error(error);
        },
        complete: () => this.spinner.hide(),
      })
    }
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
      lotes: this.fb.array([])
    })
  }

  public addLote(): void {
    this.lotes.push(this.createLote({id: 0} as Lote))
  }

  public createLote(lote: Lote): FormGroup {
    return this.fb.group({
      id:[lote.id],
      nome:[lote.nome, Validators.required],
      preco:[lote.preco, Validators.required],
      quantidade:[lote.quantidade, Validators.required],
      dataInicio:[lote.dataInicio],
      dataFim:[lote.dataFim]
    })
  }

  public returnLoteTitle(name: string): string {
    return name === null || name === '' ? 'Nome do Lote' : name;
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any{
    return {'is-invalid': campoForm.errors && campoForm.touched}
  }

  public saveEvento(): void {
    this.spinner.show();

    if(this.form.valid){
      this.event = (this.saveModeState === 'post')
                  ? {... this.form.value}
                  : {id: this.event.id, ... this.form.value};

      this.eventoService[this.saveModeState](this.event).subscribe({
        next: (eventReturned: Evento) => {
          this.toastr.success('Evento salvo com Sucesso!', 'Sucesso!');
          this.activeRouter.navigate([`eventos/detalhe/${eventReturned.id}`])
        },
        error: (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Erro ao salvar evento', 'Erro!')
        },
        complete: () => this.spinner.hide()
    });
    }
  }

  public saveLotes(): void {
    if(this.form.controls.lotes.valid) {
      this.spinner.show();
      this.loteService.saveLote(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success('Lotes salvos com sucesso!', 'Sucesso!');
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar salvar lotes.', 'Erro');
            console.error(error);
          }
        ).add(() => this.spinner.hide());
    }
  }

  public removeLote(index: number, template: TemplateRef<any>): void {
    this.currentLote.id = this.lotes.get(index + '.id').value;
    this.currentLote.name = this.lotes.get(index + '.nome').value;
    this.currentLote.index = index;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId, this.currentLote.id).subscribe(
      () => {
        this.toastr.success('Lote deletado com sucesso!', 'Sucesso!');
        this.lotes.removeAt(this.currentLote.index);
      },
      (error: any) => {
        this.toastr.error(`Erro ao deletar Lote ${this.currentLote.id}`, 'Erro!');
        console.error(error);
      }
    ).add(() => {this.spinner.hide()})
  }

  public declineDeleteLote(): void {
    this.modalRef.hide();
  }
}

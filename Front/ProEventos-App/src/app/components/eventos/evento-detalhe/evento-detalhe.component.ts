import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';


@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  form!: FormGroup;
  event = {} as Evento;
  saveModeState: string = 'post';

  constructor(private fb: FormBuilder,
              private localeService: BsLocaleService,
              private eventoService: EventoService,
              private router: ActivatedRoute,
              private routerActive: Router,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
             )
  {
    this.localeService.use('pt-br')
  }

  public loadEvent(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if(eventoIdParam !== null){
      this.saveModeState = 'put';

      this.spinner.show();
      this.eventoService.getEventoById(+eventoIdParam).subscribe({
        next: (event: Evento) => {            //the returned value by getEventoById is the 'next' param
          this.event = {...event};        //using spread operator to set the variable content to a field
          this.form.patchValue(this.event);
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

  ngOnInit(): void {
    this.loadEvent();
    this.validation();
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
    })
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any{
    return {'is-invalid': campoForm.errors && campoForm.touched}
  }

  public saveChanges(): void {
    this.spinner.show();

    if(this.form.valid){

      this.event = (this.saveModeState === 'post')
                  ? {... this.form.value}
                  : {id: this.event.id, ... this.form.value};

      this.eventoService[this.saveModeState](this.event).subscribe(
        () => this.toastr.success('Evento salvo com Sucesso!', 'Sucesso!'),
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Erro ao salvar evento', 'Erro!')
        },
        () => {
          this.routerActive.navigate([`eventos/lista`]);
          this.spinner.hide();
        }
      );
    }
  }
}

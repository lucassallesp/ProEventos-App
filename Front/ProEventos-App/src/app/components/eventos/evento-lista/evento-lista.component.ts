import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef = {} as BsModalRef;
  public events: Evento[] = [];
  public filteredEvents: Evento[] = [];
  public eventoId: number = 0;

  public widthValue = 150;
  public marginValue = 2;
  public isShowing = true;
  private listFiltered = '';

  public get listFilter(): string {
    return this.listFiltered;
  }

  public set listFilter(value: string) {
    this.listFiltered = value;
    this.filteredEvents = this.listFilter ? this.filterEvents(this.listFilter) : this.events;
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.loadEvents();
  }

  public filterEvents(filterBy: string): Evento[] {
    filterBy = filterBy.toLocaleLowerCase();

    return this.events.filter(
      event =>
        event.tema.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        event.local.toLocaleLowerCase().indexOf(filterBy) !== -1
        // event.lotes.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        // event.dataEvento.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }

  public changeImage() : void{
    this.isShowing = !this.isShowing;
  }

  public loadEvents() : void {
    this.eventoService.getEventos().subscribe({
      next: (eventsResp: Evento[]) => {
        this.events = eventsResp;
        this.filteredEvents = this.events;
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
      }
    }).add(() => this.spinner.hide());
  }

  public openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;      //stop page propagation. stays on the same page after click
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (result: any) => {
        if(result.message === 'Deletado'){
          this.toastr.success('O Evento foi deletado com sucesso!', 'Deletado!');
          this.loadEvents();
        }
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`, 'Erro');
      }
    }).add(() => this.spinner.hide());
  }

  public decline(): void {
    this.modalRef.hide();
  }

  public detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}

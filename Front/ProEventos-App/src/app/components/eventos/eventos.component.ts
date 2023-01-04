import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Evento } from '../../models/Evento';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  modalRef = {} as BsModalRef;
  public events: Evento[] = [];
  public filteredEvents: Evento[] = [];

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
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
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

  public getEventos() : void {
    this.eventoService.getEventos().subscribe({
      next: (eventsResp: Evento[]) => {
        this.events = eventsResp;
        this.filteredEvents = this.events;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
      },
      complete: () => this.spinner.hide()
    });
  }

  public openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public confirm(): void {
    this.modalRef.hide();
    this.toastr.success('O Evento foi deletado com sucesso!', 'Deletado!');
  }

  public decline(): void {
    this.modalRef.hide();
  }
}

import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@enviroments/environment';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef = {} as BsModalRef;
  public events: Evento[] = [];
  public eventoId: number = 0;
  public pagination = {} as Pagination;

  public heightValue = 100;
  public widthValue = 150;
  public marginValue = 2;
  public isShowing = true;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pagination = {currentPage: 1, itemsPerPage: 3, totalItems: 2} as Pagination;
    this.loadEvents();
  }

  public filterEvents(evt: any): void {
    if(this.termoBuscaChanged.observers.length === 0){
      this.termoBuscaChanged.pipe(debounceTime(1500)).subscribe(
        filterBy => {
          this.spinner.show()
          this.eventoService.getEventos(
          this.pagination.currentPage,
          this.pagination.itemsPerPage,
          evt.value
        ).subscribe(
          (paginatedResult: PaginatedResult<Evento[]>) => {
            this.events = paginatedResult.result;
            this.pagination = paginatedResult.pagination;
          },
          (error: any) => {
            this.spinner.hide();
            this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
          }
        ).add(() => this.spinner.hide());
        }
      )
    }
    this.termoBuscaChanged.next(evt.value);
  }

  public changeImage() : void{
    this.isShowing = !this.isShowing;
  }

  public loadEvents() : void {
    this.spinner.show();

    this.eventoService.getEventos(this.pagination.currentPage,
                                  this.pagination.itemsPerPage).subscribe(
      (paginatedResult: PaginatedResult<Evento[]>) => {
        this.events = paginatedResult.result;
        this.pagination = paginatedResult.pagination;
      },
      (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
      }
    ).add(() => this.spinner.hide());
  }

  public openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;      //stop page propagation. stays on the same page after click
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public pageChanged(event): void {
    this.pagination.currentPage = event.page
    this.loadEvents();
  }

  public confirm(): void {
    this.modalRef.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        if(result.message === 'Deletado'){
          this.toastr.success('O Evento foi deletado com sucesso!', 'Deletado!');
          this.loadEvents();
        }
      },
      (error: any) => {
        console.error(error);
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`, 'Erro');
      }
    ).add(() => this.spinner.hide());
  }

  public decline(): void {
    this.modalRef.hide();
  }

  public detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  public showImage(imagemURL: string): string {
    return (imagemURL !== '')
      ? `${environment.apiURL}/resources/images/${imagemURL}`
      : 'assets/img/semImagem.jpg';
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { environment } from '@enviroments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss']
})
export class PalestranteListaComponent implements OnInit {
  public palestrantes: Palestrante[] = [];
  public palestranteId: number = 0;
  public pagination = {} as Pagination;

  constructor(
    private palestranteService: PalestranteService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  termoBuscaChanged: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 2
    } as Pagination;

    this.carregarPalestrantes();
  }

  public carregarPalestrantes() : void {
    this.spinner.show();

    this.palestranteService.getPalestrantes(this.pagination.currentPage,
                                  this.pagination.itemsPerPage).subscribe(
      (paginatedResult: PaginatedResult<Palestrante[]>) => {
        this.palestrantes = paginatedResult.result;
        this.pagination = paginatedResult.pagination;
      },
      (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao Carregar os palestrantes', 'Erro!');
      }
    ).add(() => this.spinner.hide());
  }

  public getImageName(imageName: string): string {
    if(imageName)
      return imageName = environment.apiURL + `/resources/perfil/${imageName}`;
    else
      return imageName = './assets/img/sem-imagem-perfil.png';
  }

  public filtrarPalestrante(evt: any): void {
    if(this.termoBuscaChanged.observers.length === 0){
      this.termoBuscaChanged.pipe(debounceTime(1500)).subscribe(
        filterBy => {
          this.spinner.show()
          this.palestranteService.getPalestrantes(
          this.pagination.currentPage,
          this.pagination.itemsPerPage,
          evt.value
        ).subscribe(
          (paginatedResult: PaginatedResult<Palestrante[]>) => {
            this.palestrantes = paginatedResult.result;
            this.pagination = paginatedResult.pagination;
          },
          (error: any) => {
            this.spinner.hide();
            this.toastr.error('Erro ao Carregar os palestrantes', 'Erro!');
          }
        ).add(() => this.spinner.hide());
        }
      )
    }
    this.termoBuscaChanged.next(evt.value);
  }

}

import { HttpClient } from '@angular/common/http';
import { INT_TYPE } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public events: any = [];
  public filteredEvents: any = [];
  widthValue: number = 150;
  marginValue: number = 2;
  isShowing: boolean = true;
  private _listFilter: string = '';

  public get listFilter(): string {
    return this._listFilter;
  }

  public set listFilter(value: string) {
    this._listFilter = value;
    this.filteredEvents = this.listFilter ? this.filterEvents(this.listFilter) : this.events;
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getEventos();
  }

  filterEvents(filterBy: string): any {
    filterBy = filterBy.toLocaleLowerCase();

    return this.events.filter(
      (event: any) =>
        event.tema.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        event.local.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        event.lote.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        event.dataEvento.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }

  changeImage() {
    this.isShowing = !this.isShowing;
  }

  public getEventos() : void {
    this.http.get('https://localhost:5001/api/eventos').subscribe(
      response => {
        this.events = response;
        this.filteredEvents = this.events;
      },
      error => console.log(error)
    );
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})
export class TituloComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() subtitulo: string = 'Desde 2021';
  @Input() iconClass = 'fa fa-user';
  @Input() isBtnShowing = false;

  constructor(private routes: Router) { }

  ngOnInit() {
  }

  public listar(): void {
    this.routes.navigate([`/${this.titulo.toLowerCase()}/lista`]);
  }
}

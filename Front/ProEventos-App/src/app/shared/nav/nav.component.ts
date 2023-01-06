import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isCollapsed: boolean = true;
  constructor(private router: Router) { }

  collapseNav() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit() {
  }

  showMenu(): boolean {
    return this.router.url !== '/user/login';
  }
}

import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AccountService } from '@app/services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public isCollapsed = true;
  public usuarioLogado = false;

  constructor(private router: Router,
              public accountService: AccountService) {}

  ngOnInit() {
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/user/login')
  }

  collapseNav() {
    this.isCollapsed = !this.isCollapsed;
  }

  showMenu(): boolean {
    return this.router.url !== '/user/login';
  }
}

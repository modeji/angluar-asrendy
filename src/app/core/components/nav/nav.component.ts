import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { MatSidenav } from '@angular/material';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'auth';
// import { AuthOktaService } from 'auth-okta';
// import { Auth0AuthService } from 'auth-auth0';

import { SidenavService } from 'serendipity-components';
import { MockDashboardService, ToolPaletteItem } from 'dashboard';



import { LoggerService } from 'utils';

interface ROUTE {
  icon?: string;
  route?: string;
  title?: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  @ViewChild('commandbarSidenav', {static: true})
  public sidenav: MatSidenav;

  myWorkRoutes: ROUTE[] = [
    {
      icon: 'assignment',
      route: 'sales/activities',
      title: 'Activities',
    }, {
      icon: 'dashboard',
      route: 'sales/dashboards',
      title: 'Dashboards',
    }
  ];

  customerRoutes: ROUTE[] = [
    {
      icon: 'contacts',
      route: 'accounts',        // sales/accounts
      title: 'Accounts',
    }, {
      icon: 'people',
      route: 'sales/contacts',
      title: 'Contacts',
    }, {
      icon: 'settings_phone',
      route: 'leads',           // sales/leads
      title: 'Leads',
    }, {
      icon: 'account_box',
      route: 'opportunities',   // sales/opportunities
      title: 'Opportunities',
    }
  ];

  public toolPaletteItems: ToolPaletteItem[];

  protected subscription: Subscription;

  constructor(// private elementRef: ElementRef,
              // private renderer: Renderer2,
              private commandBarSidenavService: SidenavService,
              private dashboardService: MockDashboardService,
              private authService: AuthService,
              private translate: TranslateService,
              private logger: LoggerService) {}

  public ngOnInit(): void {

    this.logger.info('NavComponent: ngOnInit()');

    this.commandBarSidenavService.setSidenav(this.sidenav);

    // myWorkRoutes

    this.translate.get('ACTIVITIES_HEADER').subscribe(value => {
      this.myWorkRoutes[0].title = value;
    });

    this.translate.get('DASHBOARDS_HEADER').subscribe(value => {
      this.myWorkRoutes[1].title = value;
    });

    // customerRoutes

    this.translate.get('ACCOUNTS_HEADER').subscribe(value => {
      this.customerRoutes[0].title = value;
    });

    this.translate.get('CONTACTS_HEADER').subscribe(value => {
      this.customerRoutes[1].title = value;
    });

    this.translate.get('LEADS_HEADER').subscribe(value => {
      this.customerRoutes[2].title = value;
    });

    this.translate.get('OPPORTUNITIES_HEADER').subscribe(value => {
      this.customerRoutes[3].title = value;
    });

    this.subscribe();
  }

  protected subscribe() {

    this.logger.info('NavComponent: subscribe()');

    this.subscription = this.dashboardService.getToolPaletteItems().subscribe(data => {
      this.toolPaletteItems = data;
    });

  }

  protected unsubscribe() {

    this.logger.info('DashboardComponent: unsubscribe()');

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  public onDragStart(event, identifier) {

    this.logger.info('NavComponent: onDragStart()');

    event.dataTransfer.setData('widgetIdentifier', identifier);

    event.dataTransfer.setData('text/plain', 'Drag Me Button');
    event.dataTransfer.dropEffect = 'move';
  }

  public ngOnDestroy() {

    this.logger.info('NavComponent: ngOnDestroy()');

    this.unsubscribe();
  }

}

// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.html
// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.ts

// this.logger.info('toolPaletteItems: ' + JSON.stringify(this.toolPaletteItems));

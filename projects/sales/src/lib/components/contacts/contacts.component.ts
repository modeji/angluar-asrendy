import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { MatSort, MatTableDataSource } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Subscription} from 'rxjs';

import { ContactsService } from '../../services/contacts/contacts.service';
import { ColumnDef, Contact } from '../../shared/models';

import { CollectionComponent } from '../abstract/collection.component';

import {
  ALPHABET,
  CONTACT_COLUMNS_DESKTOP,
  CONTACT_COLUMNS_MOBILE,
  MAT_XSMALL,
  MARGIN_DESKTOP,
  MARGIN_MOBILE,
  TOOLBAR_HEIGHT_DESKTOP,
  TOOLBAR_HEIGHT_MOBILE
} from '../../shared/constants';

@Component({
  selector: 'sales-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent extends CollectionComponent implements AfterViewInit, OnInit {

  public containerWidth: number;
  public containerHeight: number;

  public items: Array<Contact>;

  public dataSource: MatTableDataSource<Contact>;
  public displayedColumns: string[];

  public alphabet = ALPHABET;

  public columnDefs: ColumnDef[] = [
    {
      name: 'displayName',
      displayName: 'FULL NAME',
      class: 'anchor'
    },
    {
      name: 'email',
      displayName: 'EMAIL',
      class: ''
    },
    {
      name: 'organisation.name',
      displayName: 'COMPANY NAME',
      class: 'anchor'
    },
    {
      name: 'organisation.phoneNumber',
      displayName: 'BUSINESS PHONE',
      class: ''
    }
  ];

  public selectedFooterItemId = 'All';

  protected subscription: Subscription;

  @ViewChild('contentContainer')
  private tableContainer: ElementRef;

  @ViewChild(MatSort)
  private sort: MatSort;

  private toolbarHeight = TOOLBAR_HEIGHT_DESKTOP;
  private margin = MARGIN_DESKTOP;

  constructor(private breakpointObserver: BreakpointObserver,
              private contactsService: ContactsService) {
    super();
  }

  public ngOnInit() {

    super.ngOnInit();

    // this.logger.info('ContactsPage: ngOnInit()');

    // Evaluate against the current viewport

    if (this.breakpointObserver.isMatched(MAT_XSMALL)) {

      this.toolbarHeight = TOOLBAR_HEIGHT_MOBILE;
      this.margin = MARGIN_MOBILE;

      this.displayedColumns = CONTACT_COLUMNS_MOBILE;
    } else {

      this.toolbarHeight = TOOLBAR_HEIGHT_DESKTOP;
      this.margin = MARGIN_DESKTOP;

      this.displayedColumns = CONTACT_COLUMNS_DESKTOP;
    }

    this.containerWidth = this.tableContainer.nativeElement.offsetWidth - (this.margin + this.margin);
    this.containerHeight = this.tableContainer.nativeElement.offsetHeight - (this.toolbarHeight * 2 + this.margin);
  }

  // (window:resize)="onResize($event)
  public onResize(event) {

    this.containerWidth = event.target.innerWidth - (this.margin + this.margin);
    this.containerHeight = event.target.innerHeight - (this.toolbarHeight * 2 + this.margin);
  }

  // https://blog.angular-university.io/angular-debugging/

  public ngAfterViewInit() {

    // this.logger.info('ContactsPage: ngAfterViewInit()');

    // React to changes to the viewport

    this.breakpointObserver.observe([ Breakpoints.HandsetPortrait ]).subscribe(result => {

      if (result.matches) {
        this.toolbarHeight = TOOLBAR_HEIGHT_MOBILE;
        this.margin = MARGIN_MOBILE;

        this.displayedColumns = CONTACT_COLUMNS_MOBILE;

      } else {
        this.toolbarHeight = TOOLBAR_HEIGHT_DESKTOP;
        this.margin = MARGIN_DESKTOP;

        this.displayedColumns = CONTACT_COLUMNS_DESKTOP;
      }

    });
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding

  protected subscribe() {

    this.logger.info('ContactsPage: subscribe()');

    this.subscription = this.contactsService.list().subscribe(data => {

      data.map(a => {
        a.id = btoa(a.id);
        return { ...a };
       });

      this.items = data;

      this.dataSource = new MatTableDataSource(this.items);
      this.dataSource.data = this.items;
      this.dataSource.sortingDataAccessor = pathDataAccessor;
      this.dataSource.sort = this.sort;
    });

  }

  public refresh() {
    this.logger.info('ContactsPage: refresh()');
    // console.log(JSON.stringify(this.items));
  }

  public onClickFilterButton(id: string) {

    this.logger.info('ContactsPage: onClickFilterButton()');

    this.logger.info('Button Id: ' + id);

    this.selectedFooterItemId = id;
  }

}

// https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects

function pathDataAccessor(item: any, path: string): any {
  return path.split('.')
  .reduce((accumulator: any, key: string) => {
    return accumulator ? accumulator[key] : undefined;
  }, item);
}

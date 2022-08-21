import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Subscription } from 'rxjs';

import { AuthService } from 'auth';
import { DynamicFormControlCustomEvent, DynamicFormModel, DynamicFormService } from 'dynamic-forms';
import { DialogService, SnackBarComponent } from 'serendipity-components';
import { LoggerService } from 'utils';

import { PROFILE_GENERAL_INFORMATION_GROUP } from '../../models/form-ids';

@Component({
  selector: 'crm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public containerHeight: number;

  public generalInformationModel: DynamicFormModel;
  public generalInformationGroup: UntypedFormGroup;

  public item: any;

  protected subscriptions: Subscription[] = [];

  @ViewChild('contentContainer', {static: true})
  private itemContainer: ElementRef;

  constructor(private authService: AuthService,
              private breakpointObserver: BreakpointObserver,
              private dialogService: DialogService,
              private dynamicFormService: DynamicFormService,
              private logger: LoggerService,

              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) {}

  public ngOnInit() {

    this.logger.info('ProfileComponent: ngOnInit()');

    // this.containerHeight = this.itemContainer.nativeElement.offsetHeight -
    //   (NAVIGATION_BAR_HEIGHT_DESKTOP + COMMAND_BAR_HEIGHT_DESKTOP + VIEW_BAR_HEIGHT_DESKTOP + MARGIN_DESKTOP);

    this.subscribe();
  }

  protected async subscribe() {

    this.generalInformationModel = await this.dynamicFormService.getFormMetadata(PROFILE_GENERAL_INFORMATION_GROUP);
    this.generalInformationGroup = this.dynamicFormService.createGroup(this.generalInformationModel);

    this.item = this.authService.getCurrentUser();

    this.dynamicFormService.initGroup(this.generalInformationGroup, this.item);
  }

  /*

  public ngAfterViewInit() {

    this.logger.info('ProfileComponent: ngAfterViewInit()');

    // React to changes to the viewport

    this.breakpointObserver.observe([ Breakpoints.HandsetPortrait ]).subscribe(result => {

      if (result.matches) {

        this.containerHeight = this.itemContainer.nativeElement.offsetHeight -
          (NAVIGATION_BAR_HEIGHT_MOBILE + COMMAND_BAR_HEIGHT_MOBILE + VIEW_BAR_HEIGHT_MOBILE + MARGIN_MOBILE);

      } else {

        this.containerHeight = this.itemContainer.nativeElement.offsetHeight -
          (NAVIGATION_BAR_HEIGHT_DESKTOP + COMMAND_BAR_HEIGHT_DESKTOP + VIEW_BAR_HEIGHT_DESKTOP + MARGIN_DESKTOP);
      }

    });

  }

  */

  protected unsubscribe(): void {

    this.logger.info('ProfileComponent: unsubscribe()');

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public ngOnDestroy() {

    this.logger.info('ProfileComponent: ngOnDestroy()');
    this.unsubscribe();
  }

  //
  // Validation
  //

  public isDirty() {

    // this.logger.info('ProfileComponent - isDirty()');

    let dirty = false;

    if (this.generalInformationGroup && this.generalInformationGroup.dirty) {
      dirty = true;
    }

    return dirty;
  }

  public isValid() {

    // this.logger.info('ProfileComponent - isValid()');

    let valid = false;

    if (this.generalInformationGroup && this.generalInformationGroup.valid) {

      valid = true;

    }

    return valid;
  }

  public markAsPristine() {

    // this.logger.info('ProfileComponent - markAsPristine()');

    if (this.generalInformationGroup) {
      this.generalInformationGroup.markAsPristine();
    }

  }

  //
  // Command Bar events
  //

  public onClose() {

    this.logger.info('ProfileComponent: onClose()');

    this.router.navigate(['/']);
  }

  public onCustomEvent(event: DynamicFormControlCustomEvent) {

    this.logger.info('ProfileComponent: onCustomEvent()');

    this.dialogService.openAlert({
      title: 'Alert',
      message: JSON.stringify(event),
      closeButton: 'CLOSE'
    });

    // this.logger.info('event: ' + JSON.stringify(event, null, 2));
  }

  public onChangePassword() {

    this.logger.info('ProfileComponent: onResetPassword()');

    window.open('http://localhost:10001/auth/realms/development/account/password/', '_blank');
  }

  public onSave() {

    this.logger.info('ProfileComponent: onSave()');

    this.update();
  }

  public onSaveAndClose() {

    this.logger.info('ProfileComponent: onSaveAndClose()');

    this.onSave();
    this.onClose();
  }

  //
  // Misc
  //

  private openSnackBar() {

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Profile updated'
      },
      duration: 500,
      panelClass: 'crm-snack-bar'
    });

  }

  private update() {

    this.logger.info('ProfileComponent: update()');

    this.markAsPristine();
  }

}

/*

import { ProfileService } from '../../services/profile/profile.service';

private profileService: ProfileService,

this.profileService.resetPassword(this.item.id, 'NoMoreSecrets');

import {
  NAVIGATION_BAR_HEIGHT_DESKTOP,
  NAVIGATION_BAR_HEIGHT_MOBILE,
  COMMAND_BAR_HEIGHT_DESKTOP,
  COMMAND_BAR_HEIGHT_MOBILE,
  VIEW_BAR_HEIGHT_DESKTOP,
  VIEW_BAR_HEIGHT_MOBILE,
  MARGIN_DESKTOP,
  MARGIN_MOBILE,
  DialogService,
  SnackBarComponent
} from 'serendipity-components';

*/

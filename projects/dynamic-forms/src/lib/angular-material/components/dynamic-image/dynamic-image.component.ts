import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';

import { LoggerService } from 'utils';

@Component({
  selector: 'dynamic-image',
  template: `
    <img [src]="formGroup.controls[model.id].value" [alt]="model.label">
  `,
  styles: []
})
export class DynamicImageComponent implements OnInit {

  @Input() formGroup: UntypedFormGroup;
  @Input() model: DynamicFormControlModel;

  @HostBinding('class') elementClass;

  constructor(private logger: LoggerService) {

  }

  public ngOnInit() {

    this.elementClass = this.model.gridItemClass;
  }

}

// mat-card-image

/*

  <img src="assets/images/photos/male.svg" alt="Avatar">

*/

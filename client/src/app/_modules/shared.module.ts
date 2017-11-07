import { NgModule, ModuleWithProviders  } from '@angular/core';
import { CommonModule } from '@angular/common';

// services
import { AuthService } from '../_services/auth.service';
import { CMSService } from '../_services/cms.service';

// Modules
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { DateFnsModule } from 'ngx-date-fns';


// Guards
import { AuthGuard } from '../_guards/auth.guard';



@NgModule({
  declarations: [
  ],
  exports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    DateFnsModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AuthService,
        CMSService,
        AuthGuard
      ],
    };
  }
}
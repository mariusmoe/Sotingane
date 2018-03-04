import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

// services
import {
	AuthService,
	CMSService,
	InterceptorService,
	SteamService,
	MobileService,
	TokenService,
	AdminService
} from '@app/services';

// Modules
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

// Guards
import { AuthGuard, AdminGuard, LoginGuard, DeactivateGuard } from '@app/guards';

// Pipes
import { TimeAgo } from '@app/pipes';

// Components
import { ModalComponent } from './modals/modal.component';
import { SectionWrapperComponent } from './sectionwrapper-component/sectionwrapper.component';
import { SectionComponent } from './section-component/section.component';

@NgModule({
	imports: [
		CommonModule,
		MaterialModule
	],
	exports: [
		CommonModule,
		MaterialModule,
		ReactiveFormsModule,
		RouterModule,
		HttpClientModule,
		TimeAgo,
		SectionWrapperComponent,
		SectionComponent
	],
	declarations: [
		TimeAgo,
		ModalComponent,
		SectionWrapperComponent,
		SectionComponent
	],
	entryComponents: [
		ModalComponent
	]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: [
				{
					provide: HTTP_INTERCEPTORS,
					useClass: InterceptorService,
					multi: true
				},
				// Services
				AuthService,
				CMSService,
				SteamService,
				MobileService,
				TokenService,
				AdminService,
				// Guards
				AuthGuard,
				AdminGuard,
				LoginGuard,
				DeactivateGuard
			]
		};
	}
}
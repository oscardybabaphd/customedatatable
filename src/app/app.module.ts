import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './nav/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { HttpErrorHandler } from './ErrorHandler/http-error-handler';
import { PopUpModalComponent } from './modal/pop-up-modal/pop-up-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PopUpModalComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSmartModalModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorHandler,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './nav/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { PopupmodalComponent } from './modal/popupmodal/popupmodal.component';
import { Handler } from './errorhandler/handler';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PopupmodalComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSmartModalModule.forRoot(),
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot()
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: Handler,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

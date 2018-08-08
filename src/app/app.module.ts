import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MenuModule } from './modules/menu/menu.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MetadatareportComponent } from './metadatareport/metadatareport.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    MetadatareportComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    MenuModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: 'metadatareport',
        component: MetadatareportComponent
      },
      {
        path: '',
        component: HomeComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

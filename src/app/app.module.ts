import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MenuModule } from './modules/menu/menu.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MetadatareportComponent } from './metadatareport/metadatareport.component';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {CustomService} from './custom.service';


const appRoutes: Routes = [
  {
    path: 'metadatareport',
    component: MetadatareportComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MetadatareportComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    MenuModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [CustomService],
  bootstrap: [AppComponent]
})
export class AppModule { }

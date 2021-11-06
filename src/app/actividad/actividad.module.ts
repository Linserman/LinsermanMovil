import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActividadPageRoutingModule } from './actividad-routing.module';

import { ActividadPage } from './actividad.page';
import { BrowserModule } from '@angular/platform-browser';
import { LocalComponent } from './local/local.component';
import { CloudComponent } from './cloud/cloud.component';
import { Routes } from '@angular/router';


const routes: Routes =[
  {
    path:'',
    component: ActividadPage,
    children:[
      {
        path: 'local',
        loadChildren: '../local/local.component#LocalComponent'
      },
      {
        path: 'cloud',
        loadChildren: '../cloud/cloud.component#CloudComponent'
      }, {
        path: '',
        redirectTo: '/actividad',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActividadPageRoutingModule
  ],
  declarations: [ActividadPage,LocalComponent,CloudComponent]
})
export class ActividadPageModule {}

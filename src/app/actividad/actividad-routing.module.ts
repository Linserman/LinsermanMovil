import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { ActividadPage } from './actividad.page';
import { CloudComponent } from './cloud/cloud.component';
import { LocalComponent } from './local/local.component';

const routes: Routes = [
  {
    path: '',
    component: ActividadPage
  },
  {
    path: 'local',
  
    component: LocalComponent, canLoad: [AuthGuard]
  },
  {
    path: 'cloud',
    component: CloudComponent, canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [CommonModule,RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActividadPageRoutingModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canLoad: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'sector/:id',
    loadChildren: () => import('./contratos/contratos.module').then( m => m.ContratosPageModule), canLoad: [AuthGuard]
  },
  {
    path: 'actividad/:id',
    loadChildren: () => import('./actividad/actividad.module').then( m => m.ActividadPageModule), canLoad: [AuthGuard]
  },
  {
    path: 'contrato/:id',
    loadChildren: () => import('./contrato/contrato.module').then( m => m.ContratoPageModule), canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

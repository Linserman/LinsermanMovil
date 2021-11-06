import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, RouteReuseStrategy } from '@angular/router';
import { firebaseConfig } from '../environments/environment';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ContratoPage } from './contrato/contrato.page';
import { ActividadPageModule } from './actividad/actividad.module';
import * as firebase from 'firebase';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { ActividadPage } from './actividad/actividad.page';
import { LocalComponent } from './actividad/local/local.component';
import { CloudComponent } from './actividad/cloud/cloud.component';

firebase.initializeApp(firebaseConfig);
@NgModule({
declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,CommonModule,IonicModule.forRoot(), AppRoutingModule, 
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,            // imports firebase/database, only needed for database features
    AngularFireAuthModule,
    AngularFireStorageModule,
    ActividadPageModule,
    HttpClientModule
  ],  
  providers: [ 
    Geolocation,ImagePicker,File,Crop,HttpClientModule,HttpClient, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

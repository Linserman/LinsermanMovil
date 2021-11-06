import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { NavController, NavParams, ToastController } from '@ionic/angular';
import { PhotoService } from '../services/photo.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  photos:any;
  CameraPhoto;
  contratoCollection: AngularFirestoreCollection<any>;
  contrato: Observable<any[]>
  contratos:any[]=[  ]
  lsContratos:any=[]
  empresa:any;
  constructor(public photoService: PhotoService, public toastController: ToastController,private router:Router, public firestore: AngularFirestore,public authService:AuthService, private appcom:AppComponent) {
    // this.contratoCollection=firestore.collection(`/contratos`);//.collection('hist')doc('1')
    // console.log(this.contratoCollection)
    // this.contratoCollection.valueChanges().subscribe((contrato:any)=>{
    //   contrato.forEach(contra => {      this.contratos.push(contra)   });
    // })
    // console.log(this.contratos)
   // this.getContratos();  
    //this.authService.user.id
    //this.lsContratos.filter((el:any)=> el.usuarios.id==2)
  }
  ngOnInit(){
    this.getContratos();
    this.empresa=localStorage.getItem('empresa');
  }
  ionViewWillEnter(){
    this.empresa=localStorage.getItem('empresa');
  }
  doRefresh(event){
    setTimeout(() => {
      this.getContratos();
      event.target.complete();
    }, 1500); 
  }
  getContratos(){
    var userId=localStorage.getItem("userId");
    var userType=localStorage.getItem("tipoUsuario")
    this.lsContratos=[];
    this.authService.getContratosBy(userId,userType).then((res:any)=>{
      this.lsContratos=res.data;
      console.log("lscontratos",this.lsContratos)
    })    
  }

  addPhotoToGallery() {
    this.photoService.agregarFoto();
    this.photoService.loadSaved();
  }
  openContrato(contrato){
    localStorage.setItem("EmpresaContratoName",contrato.empresa.nombre_empresa);
    localStorage.setItem("contrato",contrato.id_contrato);
    localStorage.setItem("EmpresaContrato",contrato.empresa.id_empresa);
    this.router.navigate([`contrato/`+contrato.id_contrato]);
  }
  async presentGreeting() {
    const toast = await this.toastController.create({
      message: "Carga exitosa!",
      position: "top",
      duration: 2000,
      color: "success",
    });
    toast.present();
  }
  // addPosition(id:string,location:string){
  //   var ref=this.firestore.doc(`posicion/${id}`);
  //   ref.get().subscribe(doc =>{
  //     if(doc.exists){
  //       ref.update({
  //           location: location ,
  //           id: id,
  //           from: this.authService.nombre,
  //           type: 'client',
  //           createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //         })
  //     }else{
  //       ref.set({ location: location , id:id,
  //         from: this.authService.nombre,
  //         createdAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
  //     }
  //   })
     
  // }

  
}

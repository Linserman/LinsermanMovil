import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user:any={
    nombres:null,
    apellidos:null,
    tipo_usuario:null,
    token:null
  };
  public token:any;
  constructor(
    public http: HttpClient,private firestore: AngularFirestore,private modalCtrl:ModalController
  ) { }
  login(credentials){
    console.log(credentials);
    localStorage.setItem('empresa',"");
    // console.log(JSON.stringify(credentials));
    return new Promise((resolve, reject) => {
         let headers = new HttpHeaders();
         //headers.set('Access-Control-Allow-Origin','*').set('content-type','application/json'); 
         var formData: any = new FormData();
        formData.append("correo", credentials.correo);
        formData.append("password", credentials.password);
         this.http.post('https://linserman.pythonanywhere.com/api/login', formData, {headers: headers}) 
          .subscribe((res:any)=> {
             let data = JSON.parse(JSON.stringify(res.data));
             this.user=res.data;
             localStorage.setItem('userInfo',JSON.stringify(res.data));
             localStorage.setItem('tipoUsuario',res.data.tipo_usuario);
             localStorage.setItem('userId',res.data.id);
             localStorage.setItem('empresa',res.data.empresa.nombre_empresa);
             var p=JSON.stringify(res.data)
             p=p.slice(1,p.length-1)
             localStorage.setItem('token',JSON.stringify(res.data.token));
             this.token = "Token "+res.data.token;
             console.log(this.token)
             //console.log("ID del Usuario logueado ",this.id);
             resolve("ok");
          }, (err) => {
            console.log(err);
            resolve("bad");
          });  
    });
  
  }
  getContratos(){
    return new Promise((resolve, reject) => {
      var p=localStorage.getItem('token');
      p=p.slice(1,p.length-1)
      let headers = new HttpHeaders();
      headers=headers.set('Authorization','Token '+p)
      console.log(p)
      console.log(headers)
         //.set('Access-Control-Allow-Origin','*')
         //headers.set('Access-Control-Allow-Origin','*').set('content-type','application/json'); 
      this.http.get('https://linserman.pythonanywhere.com/api/contratos/', {headers: headers}) 
        .subscribe((res:any) => {
          resolve(res);
        }, (err) => {
          console.log(err);
          resolve(null);
        });  
    });
  
  }
  getContratosBy(userId,userType){
    return new Promise((resolve, reject) => {
      var p=localStorage.getItem('token');
      p=p.slice(1,p.length-1)
      let headers = new HttpHeaders();
      headers=headers.set('Authorization','Token '+p)
      console.log(p)
      console.log(headers)
         //.set('Access-Control-Allow-Origin','*')
         //headers.set('Access-Control-Allow-Origin','*').set('content-type','application/json'); 
      this.http.get(`https://linserman.pythonanywhere.com/api/obtener_contratos/?id_usuario=${userId}&tipo_usuario=${userType}`, {headers: headers}) 
        .subscribe((res:any) => {
          resolve(res);
        }, (err) => {
          console.log(err);
          resolve(null);
        });  
    });
  
  }

  testLogin(credentials){
    
  }
  
}

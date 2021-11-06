import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class MediaServiceService {
  storageRef: any;
  picture: any;
  format:any;
  constructor(private toastCtrl:ToastController) {
    this.storageRef= firebase.storage().ref()
   }
   async takePicture() {
    var resp={
      base64: "",
      type:""
    }
    try {
      const profilePicture = await Camera.getPhoto({
        quality: 90,        allowEditing: false,        resultType: CameraResultType.Base64,
      });
      resp.base64= profilePicture.base64String;
      resp.type=profilePicture.format;
      this.picture = profilePicture.base64String;
      this.format = profilePicture.format;
     // console.log(profilePicture);
      // return profilePicture.base64String;
      return resp;
    } catch (error) {
      this.showToast(error)
      return null;
    }
  }
  async takePicturebase64() {
    var resp={
      base64: "",
      type:""
    }
    try {
      const profilePicture = await Camera.getPhoto({
        quality: 70,        allowEditing: false,        resultType: CameraResultType.Base64,
      });
      resp.base64= profilePicture.base64String;
      resp.type=profilePicture.format;
      this.picture = profilePicture.base64String;
      this.format = profilePicture.format;
     // console.log(profilePicture);
      // return profilePicture.base64String;
      return resp.base64;
    } catch (error) {
      this.showToast(error)
      return null;
    }
  }
  async upload(photo64){
    var bool=true;    console.log(this.format);
    var metadata:any;
    if(this.format=="png") metadata={  contentType: 'image/png' }
    else if(this.format=="jpg")   metadata={  contentType: 'image/jpg' }
    else if(this.format=="jpeg")  metadata={  contentType: 'image/jpeg' }
    else{      this.showToast("Formato de Archivo no valido");      bool=false;    }
    const random=Math.random().toString(36).substring(2,8);
    if(bool){
      var task=this.storageRef.child(`pruebas/${random}.${this.format}`).putString(photo64, 'base64',metadata);
      
      task.on('state_changed', function(snap){
        this.uploadProgress = (snap.bytesTransferred / snap.totalBytes) * 100;
        console.log('Upload is ' + this.uploadProgress + '% done');
        switch (snap.state) {
          case firebase.storage.TaskState.ERROR: // or 'paused'
            console.log('Upload is wee');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        this.showToast(error);
       }
      ,function() {});
        task.snapshot.ref.getDownloadURL().then((downloadURL)=>{       console.log(downloadURL)    }); 

    }
    
    // his.showToast("No se ha subido nada")
  }
  // cortarImagen(){
  //   this.crop.crop(this.picture.webPath, {quality: 75})
  //   .then(
  //     newImage => this.picture=newImage,
  //     error => console.error('Error cortando image', error)
  //   );
  // }
  

  crop:any;
  async showToast(msg:any){
    const toast = await this.toastCtrl.create({
      duration: 2000,
      message: msg
    });
    toast.present();
  }
}

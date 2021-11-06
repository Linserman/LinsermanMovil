import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { MediaServiceService } from '../services/media-service.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop, CropOptions } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.page.html',
  styleUrls: ['./actividad.page.scss'],
})
export class ActividadPage implements OnInit {
  croppedImagepath = "";
  files:any[]=[];
  cloudFiles:any[]=[];
  base64Files:any[]=[];
  uploadProgress=0;
  sectorId;
  contratoId;
  actividadId;
  tipoUsuario;
  fechaFoto:any;
  date:any;
  empresa:any;
  dateFlag:any=false;
  nombreCompleto:any;
  fechaInicial: any;
  fechaFinal: any;
  empresaContrato:any;
  empresaContratoName:any;
  constructor(private route: ActivatedRoute, private router: Router,
     private mediaService: MediaServiceService, private fStorage: AngularFireStorage
     ,private toastController: ToastController,private crop:Crop,
     private imagePicker:ImagePicker,public file:File,private authService:AuthService,
     private loadingCtrl:LoadingController) { }
  
  ngOnInit() {
    this.contratoId=localStorage.getItem('contrato');
    this.sectorId=localStorage.getItem('sector');
    this.tipoUsuario=localStorage.getItem('tipoUsuario');
    this.empresaContrato=localStorage.getItem("EmpresaContrato");
    this.empresaContratoName=localStorage.getItem("EmpresaContratoName");
    this.fechaFoto=new Date();
    var date=new Date(this.fechaFoto)
    var d=date.toLocaleDateString().split("/");
    var dia=d[0];    var mes=d[1];    var anio=d[2];
    if(Number(d[0])<10){        dia='0'+d[0]      }
    if(Number(d[1])<10){       mes='0'+d[1]      }
    this.date=d[2]+"-"+mes+"-"+dia;
    console.log(this.date)
    this.route.paramMap.subscribe((data:any)=>{
      if(data.params.id !=null) this.actividadId=data.params.id ;
      console.log(data);
      console.log(this.actividadId);
      this.empresa=localStorage.getItem('empresa')
      this.getAllImages(1);
    })
    console.log(this.fechaFoto)
    var nombres=JSON.parse(localStorage.getItem("userInfo"));
    this.nombreCompleto=nombres.nombres+" "+nombres.apellidos;
    console.log(nombres.nombres+" "+nombres.apellidos);
    
  }
  ionViewWillEnter(){
    this.empresa=localStorage.getItem('empresa');
     //empresaContrato:any;
     this.contratoId=localStorage.getItem('contrato');
     this.empresaContrato=localStorage.getItem("EmpresaContrato");
     this.empresaContratoName=localStorage.getItem("EmpresaContratoName");
  }
  showDate(){
    if(this.fechaFoto!=null){
      this.dateFlag=true;
      var date=new Date(this.fechaFoto)
      var d=date.toLocaleDateString().split("/");
      var dia=d[0];
      var mes=d[1];
      var anio=d[2];
      if(Number(d[0])<10){        dia='0'+d[0]      }
      if(Number(d[1])<10){       mes='0'+d[1]      }
      this.date=anio+"-"+mes+"-"+dia;
      console.log(        this.date      )
      //console.log(date.getDay()+"-"+date.getMonth()+"-"+date.getFullYear())
    }
    //console.log(this.fechaFoto)
  } 
  pickImages(){
    this.imagePicker.getPictures({maximumImagesCount:10, outputType:1,quality:70}
      ).then(res=>{
        for (var i = 0; i < res.length; i++) {
          let base64="data:image/png;base64,"
          +res[i]
          this.files.push(base64)
          this.base64Files.push(res[i])
          //this.cropImage(res[i]);
          
        }
        console.log("base64files",this.base64Files);
        console.log("files",this.files);
    },(err)=>{
      this.showToast("Ocurrio un error","danger")
    }
    )
    console.log(this.files)
  }
  loading:any;
  async showLoading(){
    this.loading=await this.loadingCtrl.create({
      message:"Espere..."
    })
    return this.loading.present();
  }
  async stopLoading(){
    setTimeout(() => {
      this.loading.dismiss();
    }, 200);
  }
  async uploadPicture(i){
    var type:any={  contentType: 'image/png' }
    var metada:any= { customMetadata: { 
      "usuario":this.nombreCompleto,
      "user":localStorage.getItem("userId"),
      "fecha":this.date
      }
    }
    var d:any=this.fechaFoto;
    
    const random=Math.random().toString(36).substring(2,4);
    var photo:any= this.base64Files[i];
    //const file=  await new Blob(photo, type);
    var name=d+"-"+random;
    var metada:any= { customMetadata: { 
      "usuario":this.nombreCompleto,
      "user":localStorage.getItem("userId"),
      "fecha":this.date,
      "idFoto":name
      }
    }
    if(this.contratoId!=null && this.sectorId!=null){
      //const task=this.fStorage.upload(`contratos/${this.contratoId}/${name}`,file);
      //${this.empresaContrato}/contratos/       ${this.contratoId}   
      var task=this.fStorage.ref(`${this.empresaContratoName}/contratos/`).child(`${this.contratoId}/${this.sectorId}/${this.actividadId}/${name}.png`).putString(photo, 'base64',type);
      //task.metadata={}
      this.showLoading();
      task.percentageChanges().subscribe(c=>{
        1-100
        this.uploadProgress=c
      },(error)=>{          this.showToast(error,"danger")        }
      )
      
      task.then(async res=>{
        console.log(res)
        res.ref.updateMetadata(metada).then((res)=>{          console.log(res)        })
        this.showToast("Subido Correctamente!", "success");
        this.files.splice(i,1);
        this.base64Files.splice(i,1);
        this.stopLoading()
      },(error)=>{        this.showToast(error, "danger")      })
    }
    else{      this.showToast("No has seleccionado un contrato!", "danger")    }
  }

  async deleteCloudPhoto(){
    
  }
  async showOnceOpcionesImagen(f){
    console.log(this.tipoUsuario==3)
    if( this.tipoUsuario==3 || this.tipoUsuario==1){
      this.toastController.dismiss().then((obj)=>{
      }).catch(()=>{
      }).finally(()=>{
          this.opcionesImagen(f);
      });
    }
    else{
      this.showToast("No tienes permiso", "danger")
    }
  }
  async opcionesImagen(i) {
    const toast = await this.toastController.create({
      header: '',
      message: '',
      position: 'middle',
      color:"primary",
      buttons: [
        {

          side: 'start',
          icon: 'cloud-outline',
          text: 'Subir',
          handler:async  () => {
            await this.uploadPicture(i);
            
          }
        }, {
          cssClass: 'eliminarbtn',
          text: 'Eliminar',
          role: 'cancel',
          handler: () => {
            this.showToast("Se ha eliminado la foto", "danger")
            this.files.splice(i,1);
            this.base64Files.splice(i,1);
            console.log(this.base64Files)
          }
        }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  async showOnceOpcionesCloud(f){
    if( this.tipoUsuario==3 ||  this.tipoUsuario==1){
      this.toastController.dismiss().then((obj)=>{
      }).catch(()=>{
      }).finally(()=>{
          this.opcionesCloudImagen(f);
            // this.getAllImages(1);
      });
    }
  }
  async opcionesCloudImagen(f) {
    if(this.authService.user!=null){
      var header=''
      if(f.metadata!=null){
        header= "Subida por: "+f.metadata.usuario+"\n"
        "Id: "+f.metadata.idFoto
      }

      const toast = await this.toastController.create({
        header: header,
        message: 'Deseas Eliminar esta imagen?',
        position: 'middle',
        color:'primary',
        cssClass:'toastAct',
        buttons: [
          {
            side: 'start',
            icon: '',
            text: 'Si',
            handler:async  () => {
              this.eliminarCloudFoto(f)
              this.showToast("Se ha eliminado la foto", "danger")
            }
          }, {
            cssClass: 'eliminarbtn',
            text: 'No',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      await toast.present();
  
      const { role } = await toast.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    }
    //cloud-outline
   
  }
  async eliminarCloudFoto(f){
    f.ref.delete().then((res)=>{
      console.log(res)
    })
  }
  async uploadPhoto(){
    
    var d=new Date();
    const random=Math.random().toString(36).substring(2,4);
    var photo:any= await this.mediaService.takePicture();
    var type:any= await this.getType(photo.type);
    const file=  await new Blob(photo.base64, type);
    var name=d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear()+"-"+random;
    if(this.contratoId!=null){
      const task=this.fStorage.upload(`contratos/${this.contratoId}/${name}`,file);
      task.percentageChanges().subscribe(c=>{
        1-100
        this.uploadProgress=c})
      task.then(async res=>{
        this.showToast("Subido Correctamente!","success")
      })
    }
    else{
      this.showToast("No hay un contrato!","danger")
    }
    
  }
  getType(format){
    if(format=="png") return {  contentType: 'image/png' }
    else if(format=="jpg")   return {  contentType: 'image/jpg' }
    else if(format=="jpeg")  return {  contentType: 'image/jpeg' }
  }
  getAllImages(id){
    console.log("de firebase")
    //`${this.empresaContrato}/contratos/${this.contratoId}/${this.sectorId
    this.fStorage.ref(`${this.empresaContratoName}/contratos/${this.contratoId}/${this.sectorId}/${this.actividadId}`).listAll().subscribe((res)=>{
      console.log(res);
      res.items.forEach(element => {
        element.getMetadata().then(data=>  {
          let metaData: any = {}
          metaData = data.customMetadata
          element.getDownloadURL().then(url=>    this.cloudFiles.push({ref: element,img: url, metadata:metaData,hidden:false}))
        })
      })
      console.log(this.cloudFiles);    
    });
  }
  filtrarPorFechas(){
    console.log(this.cloudFiles)
    let startDate = "2021-08-18";
    let endDate = "2021-08-29";

    this.cloudFiles.forEach((element: any)  => {
      if(!(new Date(element.datos.fecha) >= new Date(this.fechaInicial) && new Date(element.datos.fecha) <= new Date(this.fechaFinal))){
        element.hidden = true
      }
    })

  }

  limpiarFechas(){
    this.fechaInicial = null;    this.fechaFinal = null
    this.cloudFiles.forEach((element: any)  => {      element.hidden = false    })
  }
  async showToast(msg:any, color){
    const toast = await this.toastController.create({
      duration: 2000,
      message: msg,
      color: color
    });
    toast.present();
  }

  async takePhoto(){
    var photo= await this.mediaService.takePicturebase64();
    if(photo!=null){
      this.base64Files.push(photo);
      let base64="data:image/png;base64,"+photo;
      this.files.push(base64)
    }
    console.log("desde actividad",photo);
    //this.mediaService.upload(photo);
  }
  doRefresh(event){
    this.cloudFiles=[];
    setTimeout(() => {
      event.target.complete();
      this.getAllImages(1);
    }, 1000); 
    
  }
  

  // cropImage(path){
  //   this.crop.crop(path, {quality:75})
  //   .then(
  //     newPath => {
  //       this.showCroppedImage(newPath.split('?')[0])
  //     },
  //     error => {
  //       alert('Error cropping image' + error);
  //     }
  //   );
  // }
  // showCroppedImage(ImagePath) {
  //   var copyPath = ImagePath;
  //   var splitPath = copyPath.split('/');
  //   var imageName = splitPath[splitPath.length - 1];
  //   var filePath = ImagePath.split(imageName)[0];

  //   this.file.readAsDataURL(filePath, imageName).then(base64 => {
  //     this.croppedImagepath = base64;
  //     this.files.push(base64)
  //   }, error => {
  //     alert('Error in showing image' + error);
  //   });
  // }
}

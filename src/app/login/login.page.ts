import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correo_electronico: string;
  contrasenia: string;
  showPassword = false;
  passwordIcon = "eye";


  constructor(
    private router: Router,
    public toastController: ToastController,
  public authService:AuthService,public appcom: AppComponent
  ) {}

  
  iconPassword() {
    this.showPassword = !this.showPassword;
    if (this.passwordIcon == "eye") {
      this.passwordIcon = "eye-off";
    } else {
      this.passwordIcon = "eye";
    }
  }
  login(){
    let credentials = {
      correo: this.correo_electronico,
      password: this.contrasenia,
    };
    localStorage.setItem("correo", credentials.correo);
    localStorage.setItem("password", credentials.password);
    localStorage.setItem('autenticado','1');
    this.authService.login(credentials).then((result) => {
      if (result == "ok") {
        this.appcom.user=this.authService.user
        this.router.navigate(["home"]);
      } else {
        this.presentToast("Algo ha salido mal!","danger");
      }
    });
   
    // this.router.navigateByUrl('home')
  }
  loguinAutomatico() {
    let credentials = {
      username: localStorage.getItem("correo"),
      password: localStorage.getItem("password"),
    };

    localStorage.setItem("correo", credentials.username);
    localStorage.setItem("password", credentials.password);
    this.authService.login(credentials).then((result) => {
      //console.log(result)
      //console.log(this.authService.token);
      if (result == "ok") {
        this.appcom.user = this.authService.user;
        this.router.navigate(["home"]);
      } else {
        this.presentToast("Algo ha salido mal!","danger");
      }
    });
  }


  ngOnInit() {
    if (localStorage.getItem("token")) {
      this.loguinAutomatico();
    }else{
      this.correo_electronico=localStorage.getItem("correo");
    }
  }
  // loguinAutomatico() {
  //   let credentials = {
  //     username: localStorage.getItem("correo"),
  //     password: localStorage.getItem("password"),
  //   };

  //   localStorage.setItem("correo", credentials.username);
  //   localStorage.setItem("password", credentials.password);
  //   this.authService.login(credentials).then((result) => {
  //     //console.log(result)
  //     //console.log(this.authService.token);
  //     if (result == "ok") {
  //       if (this.authService.deviceToken != null) {
  //         this.authService.sendDeviceToken();
  //       }
  //       this.appcom.username = this.authService.nombre;

  //       this.router.navigate(["home"]);
  //     } else {
  //       this.presentToastFeedback();
  //     }
  //   });
  // }
  async presentToast(msg,color) {
    const toast = await this.toastController.create({
      message: msg,
      position: "top",
      duration: 2000,
      color: color,
    });
    toast.present();
  }
}

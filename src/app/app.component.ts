import { Component } from '@angular/core';
import { auth } from 'firebase';
import { AuthService } from './services/auth.service';
import { interval, Observable } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  public user: any = {
    nombres: null,
    apellidos: null,
    tipo_usuario: null
  };
  public empresa:any;
  constructor(public authService: AuthService, public router: Router) {
    this.user = authService.user;
    if (localStorage.length > 0) {
      if (localStorage.getItem("userInfo")) {
        this.user= JSON.parse(localStorage.getItem("userInfo"));
        console.log(this.user)
        this.empresa=localStorage.getItem('empresa')
      }
    }else{
      this.user.nombres="Invitado"
    }

  }
  ngOnInit() {
    var i = 0;
    if (localStorage.length > 0) {
      if (localStorage.getItem("userInfo")) {
        this.user= JSON.parse(localStorage.getItem("userInfo"));
        console.log(this.user)
      }
    }else{
      this.user.nombres="Invitado"
    }
  }
  logout() {
    localStorage.removeItem('password');
    localStorage.removeItem('token');
    localStorage.removeItem('userinfo');
    localStorage.removeItem('empresa');
    this.user.nombres = "Invitado"
    this.router.navigateByUrl("login")
  }
  ionViewWillEnter() {
    this.user = this.authService.user;
    console.log("will enter", this.user)
  }
}

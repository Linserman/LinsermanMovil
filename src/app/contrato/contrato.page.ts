import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController,ToastController,NavParams, NavController} from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.page.html',
  styleUrls: ['./contrato.page.scss'],
})
export class ContratoPage implements OnInit {
  contratoId;
  sectoresContrato;
  constructor(private route: ActivatedRoute, private router: Router, private authService:AuthService) { }
  lsContratos:any[]=[];
  sectores:any[]=[];
  empresa:any;
  empresaContrato:any;
  sectoresD:any[]=[
    { idSector:1, idContrato:1, observacion:'Banos',nombre:"Sector 1", tipoLimpieza:'Superficial', actividades:[], lugar:'Garzota' },
    { idSector:1, idContrato:2, observacion:'Trampas',nombre:"Sector 1", tipoLimpieza:'Profunda', actividades:[], lugar:'Samanes' },
    { idSector:2, idContrato:2, observacion:'Vereda',nombre:"Sector 1", tipoLimpieza:'Superficial', actividades:[], lugar:'Garzota' },
  ]
  ngOnInit() {
    
    this.route.paramMap.subscribe((data:any)=>{
      if(data.params.id !=null) this.contratoId=data.params.id ;
      console.log(data);
      console.log(this.contratoId);
      this.empresa=localStorage.getItem('empresa')
       //empresaContrato:any;
      this.empresaContrato=localStorage.getItem("EmpresaContrato");
      // this.sectores=this.sectoresD.filter(el=>el.idContrato==this.contratoId);
    })
    this.getContratos();

  }
  ionViewWillEnter(){
    this.empresa=localStorage.getItem('empresa');
    //empresaContrato:any;
    this.empresaContrato=localStorage.getItem("EmpresaContrato");
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
      console.log
      this.lsContratos=this.lsContratos.filter(el=>el.id_contrato==Number(this.contratoId))
      this.sectores=this.lsContratos[0].sectores;
      console.log("lscontratos",this.lsContratos)
      console.log("sectores",this.sectores)
    })    
  }
  openSector(id){
    localStorage.setItem("sector",id);
    console.log(id);
    this.router.navigate([`sector/`+id]);
  }

}

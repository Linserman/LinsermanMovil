import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.scss'],
})
export class SectorComponent implements OnInit {
  contratoId;
  sectorId;
  lsContratos:any[]=[];
  sectores:any[]=[];
  sectoresD:any[]=[ ]
  empresa:any;
  empresaContrato:any;
  constructor(private authService:AuthService,private route: ActivatedRoute,
     private router: Router,private toastController: ToastController) { }
    
  ngOnInit() {
    this.route.paramMap.subscribe((data:any)=>{
      if(data.params.id !=null) this.contratoId=data.params.id ;
      this.sectorId=localStorage.getItem('sector')
      this.getContratos()
      console.log(data);
      console.log(this.contratoId);
      this.empresa=localStorage.getItem('empresa')
       //empresaContrato:any;
      this.empresaContrato=localStorage.getItem("EmpresaContrato");
      //this.sectoresD=this.sectoresD.filter(el=>el.idSector==this.contratoId);
    })
  }
  getContratos(){
    var userId=localStorage.getItem("userId");
    var userType=localStorage.getItem("tipoUsuario")
    this.lsContratos=[];
    this.authService.getContratosBy(userId,userType).then((res:any)=>{
      this.lsContratos=res.data;  
      this.lsContratos=this.lsContratos.filter(el=>(el.id_contrato==Number(this.contratoId)&& el.contratoActivo==true))
      this.sectores=this.lsContratos[0].sectores;
      console.log("lscontratos",this.lsContratos)
      console.log("sectores",this.sectores)
    })    
  }
  openActividad(id){
    console.log(id);
    this.router.navigate([`actividad/`+id]);
  }
}

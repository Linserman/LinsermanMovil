import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.page.html',
  styleUrls: ['./contratos.page.scss'],
})
export class ContratosPage implements OnInit {
  contratoId;
  sectorId;
  sectoresContrato;
  constructor(private route: ActivatedRoute, private router: Router, private authService:AuthService) { }
  lsContratos:any[]=[];
  sectores:any[]=[];
  actividades:any[]=[];
  empresa:any;
  ngOnInit() {
    this.contratoId=localStorage.getItem('contrato')
    this.route.paramMap.subscribe((data:any)=>{
      if(data.params.id !=null) this.sectorId=data.params.id ;
      console.log(data);
      console.log(this.sectorId);
      this.empresa=localStorage.getItem('empresa')
      // this.sectores=this.sectoresD.filter(el=>el.idContrato==this.contratoId);
    })
    this.getContratos();

  }
  doRefresh(event){
    setTimeout(() => {
      this.getContratos();
      event.target.complete();
    }, 1500); 
    
  }
  getContratos(){
    this.lsContratos=[];
    this.authService.getContratos().then((res:any)=>{
      this.lsContratos=res.data;
      this.lsContratos=this.lsContratos.filter(el=>el.id==Number(this.contratoId))
      this.sectores=this.lsContratos[0].sectores;
      this.actividades=this.sectores.filter(el=>el.id==Number(this.sectorId))[0].actividades;
      console.log("lscontratos",this.lsContratos)
      console.log("sectores",this.sectores)
      console.log("actividades",this.actividades)
    })    
  }
  openActividad(id){
    localStorage.setItem("actividad",id);
    console.log(id);
    this.router.navigate([`actividad/`+id]);
  }

}


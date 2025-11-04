import { Component } from '@angular/core';
import { ProveedoresService} from '../../services/proveedores.service';
@Component({
  selector: 'app-proveedores',
  imports: [],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css'
})
export class Proveedores {
  constructor(private proveedoresService: ProveedoresService) {  }

  ngOnInit() {
    this.proveedoresService.getProveedores().subscribe(data => {
      console.log(data);
    });
  }   

}

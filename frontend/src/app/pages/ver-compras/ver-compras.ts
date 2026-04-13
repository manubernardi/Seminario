import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ver-compras',
  imports: [RouterLink],
  templateUrl: './ver-compras.html',
  styleUrl: './ver-compras.css'
})
export class VerCompras {
  compras: any[] = [];
}

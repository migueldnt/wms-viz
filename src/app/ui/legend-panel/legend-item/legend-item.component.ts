import { Component, OnInit, Input } from '@angular/core';
import { LegendItem } from '../legend-item';

@Component({
  selector: 'app-legend-item',
  templateUrl: './legend-item.component.html',
  styleUrls: ['./legend-item.component.scss']
})
export class LegendItemComponent implements OnInit {

  @Input() legend_item:LegendItem=LegendItem.getSimpleInstance();
  titulo:string=""


  constructor() { }

  ngOnInit() {
    this.titulo=this.legend_item.layer_title
  }

}

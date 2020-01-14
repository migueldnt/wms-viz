import { Component, OnInit, Input } from '@angular/core';
import { LegendItem } from './legend-item';
import { DntLayerCreator } from "../../abstract/dnt-layer-creator"

@Component({
  selector: 'app-legend-panel',
  templateUrl: './legend-panel.component.html',
  styleUrls: ['./legend-panel.component.scss']
})
export class LegendPanelComponent implements OnInit {

  constructor() { }

  
  @Input() legends:LegendItem[]=[];

  ngOnInit() {

  }

}

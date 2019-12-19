import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayerListComponent } from './ui/layer-list/layer-list.component';
import { LegendPanelComponent } from './ui/legend-panel/legend-panel.component';
import { LegendItemComponent } from './ui/legend-panel/legend-item/legend-item.component';
import { ToolbarComponent } from './ui/toolbar/toolbar.component';
import { MapaComponent } from './ui/mapa/mapa.component';
import {SimpleRequestService} from "./services/simple-request.service";
import {LayerRefreshService } from "./services/layer-refresh.service";
import { HttpClientModule } from '@angular/common/http';

import { MatTreeModule } from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon'; 
import {MatButtonModule, MatCheckboxModule, MatDialog, MatDialogModule, MatFormFieldModule, MatSelectModule, MatToolbarModule} from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LayerListComponent,
    LegendPanelComponent,
    LegendItemComponent,
    ToolbarComponent,
    MapaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTreeModule,MatIconModule,MatButtonModule,
    MatCheckboxModule,MatDialogModule,MatFormFieldModule,MatSelectModule,FormsModule, MatToolbarModule
  ],
  providers: [SimpleRequestService,LayerRefreshService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-data-info',
  templateUrl: './dialog-data-info.component.html',
  styleUrls: ['./dialog-data-info.component.scss']
})

export class DialogDataInfoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogDataInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DataInfoData) { }

  ngOnInit() {
  }

  onOKClick(){
    alert("ok")
  }
}

export interface DataInfoData{
  datos:any,
  titulo:string
}

import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})

export class EditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: editSuspectinfo
  ) {}

  confirmEdit(): void {
    console.log(this.data);
    this.data.status=true;
    this.dialogRef.close(this.data);
  }

  cancelEdit(): void {
    this.dialogRef.close(this.data); 
  }
}
export interface editSuspectinfo {
  id:number;
  name:string;
  reason:string;
  location:string;
  status:boolean;
  latitude:number;
  longitude:number;
}
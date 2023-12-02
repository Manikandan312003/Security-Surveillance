import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-imagedialog',
  templateUrl: './imagedialog.component.html',
  styleUrls: ['./imagedialog.component.css']
})
export class ImagedialogComponent {
  imageUrl: string;

  constructor(
    public dialogRef: MatDialogRef<ImagedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.imageUrl = data.imageUrl;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

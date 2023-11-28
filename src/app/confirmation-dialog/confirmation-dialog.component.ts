import { Component ,Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';

export interface deleteSuspectinfo {
  id: number;
  name: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: deleteSuspectinfo
  ) {}

  confirmDeletion(): void {
    this.dialogRef.close(true);
  }

  cancelDeletion(): void {
    this.dialogRef.close(false); 
  }
}

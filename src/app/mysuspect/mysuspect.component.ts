import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Inject } from '@angular/core';
import {  DomSanitizer } from '@angular/platform-browser';
import { ServiceService } from '../services/service.service';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-mysuspect',
  templateUrl: './mysuspect.component.html',
  styleUrls: ['./mysuspect.component.css']
})
export class MysuspectComponent {

  suspects: any[] = [];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer,private service:ServiceService,public dialog:MatDialog,private toast:ToastrService) { }

  ngOnInit() {
    this.getSuspects();
  }

  deleteSuspect(id:number,name:string){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{data:{id:id,name:name}});

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
              const url = this.service.backendUrl+'/deletesuspect?suspectid='+id+'&userid='+this.service.loggedInUserId;
      this.http.get<{status:any}>(url).subscribe((response)=>{
        if(response.status=="success"){
          this.getSuspects();
          this.toast.success('Suspect Id:'+id+' Deleted',"Deleted Successfully");

        }});
}});}

 areObjectsEqual(obj1: any, obj2: any): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

    

    editsuspect(id:number,name:string,reason:string,userid:string,location:string,latitude:number,longitude:number){
      const  argument = {id:id,name:name,reason:reason,location:location,latitude:latitude,longitude:longitude,status:false};
      const argCopy = JSON.parse(JSON.stringify(argument));
      const dialogRef = this.dialog.open(EditDialogComponent,{data:argCopy,panelClass: 'custom-modalbox',width:'30%'});
      dialogRef.afterClosed().subscribe((response)=>{
        argument.status=true
        if((response.status==true)  && (!this.areObjectsEqual(argument,response))){
          const url = 'http://127.0.0.1:5000/editsuspect?suspectid='+response.id+'&name='+response.name+'&reason='+response.reason+'&location='+response.location+'&userid='+userid+"&latitude="+response.latitude+"&longitude="+response.longitude;
          this.http.get<{status:any}>(url).subscribe((response)=>{
            if(response.status=="success"){
          this.getSuspects();
          this.toast.success("Successfully Updated");
            }
            else{
              this.toast.error(response.status);
            }
          })

        }
      })
    }
  

  getSuspects() {

    const url = 'http://127.0.0.1:5000/getmysuspect'+'?userid='+this.service.loggedInUserId;

    this.http.get<{ suspects: any[] }>(url).subscribe((response) => {
      this.suspects = response.suspects;
      console.log(this.suspects)

      this.suspects.forEach((suspect) => {
        suspect[1] = 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(suspect[1]) as any).changingThisBreaksApplicationSecurity;

      });
    },
    (error)=>{this.toast.warning("Please try later","Error")}
    
    );
  }



}


//Confirmation
export interface deleteSuspectinfo {
  id: number;
  name: string;
}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: "./mysuspect.deletdialog.html",
  styleUrls: ['./mysuspect.component.css'],
  standalone:true,
  imports:[MatButtonModule]
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

//Edit
export interface editSuspectinfo {
  id:number;
  name:string;
  reason:string;
  location:string;
  status:boolean;
  latitude:number;
  longitude:number;
}

@Component({
  selector: 'edit-dialog',
  templateUrl: "./mysuspect.editDialog.html",
  styleUrls: ['./mysuspect.component.css'],
  standalone:true,
  imports:[MatButtonModule,MatInputModule,
    MatFormFieldModule,FormsModule,MatCardModule]
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

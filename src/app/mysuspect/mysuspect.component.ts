import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {  DomSanitizer } from '@angular/platform-browser';
import { ServiceService } from '../services/service.service';
import { MatDialog } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-mysuspect',
  templateUrl: './mysuspect.component.html',
  styleUrls: ['./mysuspect.component.css']
})
export class MysuspectComponent {

  suspects: any[] = [];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer,private service:ServiceService,public dialog:MatDialog,private toast:ToastrService) {
      
    

    
   }

  ngOnInit() {
    this.getSuspects();
  }

  deleteSuspect(id:number,name:string){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{data:{id:id,name:name}});

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
              const url = this.service.backendUrl+'deletesuspect?suspectid='+id+'&userid='+this.service.loggedInUserId;
      this.http.get<{status:any}>(url).subscribe((response)=>{
        if(response.status=="success"){
          this.getSuspects();
          this.toast.success('Suspect Id:'+id+' Deleted',"Deleted Successfully");

        }});
}});
}

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
      const dialogRef = this.dialog.open(EditDialogComponent,{data:argCopy,
        panelClass: 'custom-modalbox' ,
        maxHeight:'90vh'
        
      
      });
      dialogRef.afterClosed().subscribe((response)=>{
        argument.status=true
        if((response.status==true)  && (!this.areObjectsEqual(argument,response))){
          const url = this.service.backendUrl+'editsuspect?suspectid='+response.id+'&name='+response.name+'&reason='+response.reason+'&location='+response.location+'&userid='+userid+"&latitude="+response.latitude+"&longitude="+response.longitude;
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

    const url = this.service.backendUrl+'getmysuspect'+'?userid='+this.service.loggedInUserId;

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


import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceService } from '../services/service.service';
import { ToastrService } from 'ngx-toastr';
import { timeInterval, timeout } from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileuploadComponent {
    constructor(private http:HttpClient,private service:ServiceService,private toast:ToastrService){}

    uploading:boolean=false;
    photo:File|undefined;
    // photoname:string='';
    name:string="";
    reason:string=""

    onFileSelected(event:any) {
      if((event.target.files[0]?.type.startsWith('image'))){
        this.photo = event.target.files[0];
      }
      else{
        this.toast.error("Please choose Photo")
        // this.photo=undefined;
        // this.photoname=''
      }
      console.log(this.photo?.type)
    }

    createObjectURL(file: File): string {
      return URL.createObjectURL(file);
    }


    freeVariable(){
      this.photo=undefined
      // photoname:string='';
      this.name=""
      this.reason=""
    }
    
    

    upload(){
      this.uploading=true;
      
      const uploadSuspect=new FormData();
      console.log(uploadSuspect.get('suspect'))
      if(this.photo){
      uploadSuspect.append('suspect',this.photo);
      }
      else{
        this.toast.error("Upload Photo","Suspect")
        this.uploading=false
        return
      }
      uploadSuspect.append("name",this.name);
      uploadSuspect.append("reason",this.reason);
      uploadSuspect.append('userid',''+this.service.loggedInUserId)
      var url = this.service.backendUrl+"uploadsuspect";
      this.http.post<{status:any}>(url,uploadSuspect).subscribe(
        (response)=>{
          if(response.status=='success'){
            // alert("Suspect Details Uploaded");
            this.toast.success("<a href='/suspect'>Uploaded Successfully</a>",response.status,{
              enableHtml:true,
              closeButton:true,
              disableTimeOut:true
            })

            
            this.freeVariable()
            
          }
          else{
            this.toast.error(response.status)
            // alert("Not able to process try again later");
          }
          setTimeout(() => {
            this.uploading=false;
          }, 2000);

        }
      )
      
    }
}

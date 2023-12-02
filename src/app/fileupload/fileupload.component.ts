import { Component ,HostListener} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceService } from '../services/service.service';
import { ToastrService } from 'ngx-toastr';
import { timeInterval, timeout } from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImagedialogComponent } from '../imagedialog/imagedialog.component';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileuploadComponent {
    constructor(private http:HttpClient,private service:ServiceService,public toast:ToastrService,public dialog: MatDialog){

      this.onDragOver = this.onDragOver.bind(this);
      this.onDragLeave = this.onDragLeave.bind(this);
      this.onFileDropped = this.onFileDropped.bind(this);
    }

    uploading:boolean=false;
    photo:File|undefined;
    // photoname:string='';
    name:string="";
    reason:string=""
    isDragOver:boolean=false
    
    onFileSelected(event: Event): void {
      const selectedFile = (event.target as HTMLInputElement).files?.[0];
      this.handleFile(selectedFile);
    }
    @HostListener('drop', ['$event'])
    onFileDropped(event: DragEvent): void {
      event.preventDefault();
      const droppedFile = event.dataTransfer?.files?.[0];
      this.handleFile(droppedFile);
      this.isDragOver=false
    }
    
    onDragOver( event: DragEvent): void {
      event.preventDefault();
      this.isDragOver=true
      
    }
    
    onDragLeave( event: DragEvent): void {
      event.preventDefault();
      this.isDragOver=false
    }
  
    
     handleFile(file: File | undefined): void {
      if (file) {
        if (file.type.startsWith('image')) {
          this.photo = file;
          
        } else {
          
          this.toast.error("Please choose Photo")
        }
        console.log(this.photo)
      }
    }

    openImageDialog(imageUrl: string): void {
      const dialogRef = this.dialog.open(ImagedialogComponent, {
        width: 'auto',
        data: { imageUrl: imageUrl }
      });

      
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


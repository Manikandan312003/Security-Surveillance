import { ServiceService } from '../services/service.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-suspectdetails',
  templateUrl: './suspectdetails.component.html',
  styleUrls: ['./suspectdetails.component.css'],
})
export class SuspectdetailsComponent {
  suspectId=0;
  suspectDetails=[];
  noOfDetails=0;
  constructor(private route: ActivatedRoute,private service:ServiceService, private http:HttpClient,private router:Router,private toast:ToastrService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.suspectId = params['id'];
      
      if(!this.suspectId){
        this.route.params.subscribe(params=>{
          this.suspectId =params['id'];
          
        })
      }
      if(this.suspectId){
        this.getSuspectDetails();
      }
    });
}

    onSearch(query: number): void {
      this.suspectId = query;
    }

    getChangedSuspect(id:number){
      this.router.navigate(['suspectdetail'], { queryParams: { id: id}});
    }
    getSuspectDetails(){
      
        const url = this.service.backendUrl+'getsuspectdetails'+'?suspectid='+this.suspectId;
        this.http.get<{status:string,suspectdetails:any}>(url).subscribe(
          (res)=>{
            if(res.status=='success'){
              this.suspectDetails = res.suspectdetails;
              if (this.suspectDetails) {
                const styleElement = document.createElement('style');
                var css=''
                
                for (let i = 0; i < (this.suspectDetails?.length || 0); i++) {

                    css+='.container:nth-child('+(i+1)+'){animation-delay: '+(i*0.5)+'s; }'
                  

                }
                css+="\n.timeline::after{content: '';position: absolute;width: 6px;height: 100%;background: #fff;top: 0;margin-top: 1%;margin-bottom: 1%;left: 50%;margin-left: -3px;z-index: 2;animation: moveline "+(this.suspectDetails.length*0.5)+"s linear forwards;}  @keyframes moveline {0%{height: 0;}100%{height: 100%;}}"
                styleElement.textContent=css
                document.head.appendChild(styleElement)
              }
              
              
              
            }
            else{
              this.toast.error(res.status,'Error',{
                positionClass:'toast-top-center',
              })
              this.suspectDetails=[]
              // alert(res.status)
            }
            
        })
    }
}
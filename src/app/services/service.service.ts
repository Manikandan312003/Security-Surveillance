import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor() { 
    console.log(JSON.stringify(localStorage.getItem("userId")))
    var userid=localStorage.getItem('userId')
    if(userid!=null){
      this.loggedInUserId=parseInt(userid);
      
      this.userLoggedIn=true;
    }
    else{
      this.userLoggedIn=false
       
    }
  }
  ngOnInit() {
   
      console.log('service',this.loggedInUserId)
  }

   userLoggedIn:boolean=false;
   loggedInUserId:number=0;
  //  backendUrl="http://127.0.0.1:5000/";
   backendUrl="https://flask-production-bd59.up.railway.app/";
    // backendUrl="https://flask-delta-one.vercel.app/";

   
}

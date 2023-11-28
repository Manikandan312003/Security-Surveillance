import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { ServiceService } from '../services/service.service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private service:ServiceService,private http:HttpClient,private route:Router,private toast:ToastrService){  }

  ngOnInit(){
    
      console.log('login',this.service.userLoggedIn)
      if(this.service.userLoggedIn==true){
        this.route.navigateByUrl('home')
        this.toast.success(''+localStorage.getItem('username'),"Welcome back ")
      }
    }

    username:string="";
    password:string='';
  verify(){
    // console.log('username',this.username,'\n\npassword',this.password)
    var url=this.service.backendUrl+'check?useremail='+this.username+'&password='+this.password;
    this.http.get<{
      [x: string]: any;status:any
}>(url).subscribe((response)=>{
      if(response.status=='success'){
        console.log(response) 
        localStorage.setItem("userId",response?.['userid'])
        localStorage.setItem("username",response?.['username'])
        localStorage.setItem("useremail",response?.['useremail'])
        this.service.userLoggedIn=true
        console.log(response?.['userid'])
        this.service.loggedInUserId=response?.['userid']
        this.route.navigateByUrl('home')
        this.toast.success("Login successfully","Welcome "+response?.['username'])
      }
      else{console.log(response)
        this.toast.error(response.status)
      }
    })

  }

}

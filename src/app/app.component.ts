
import { Component } from '@angular/core';
import { ServiceService } from './services/service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  
})
export class AppComponent {


    

  title = 'SuspectTracker';
  constructor(private service:ServiceService,private router:Router){
    console.log(window.location.pathname)
    console.log(service.loggedInUserId,service.userLoggedIn)
    if(!service.userLoggedIn){
      router.navigateByUrl("login")
    }
    else{
      if(window.location.pathname=="/"){
        router.navigateByUrl("home")
      }
    }
    
  }
  ngOnInit(){
    console.log(this.service.userLoggedIn)
    console.log('userid',localStorage.getItem('userId'))

    // this.router.navigateByUrl('\login')
    if(localStorage.getItem('userId')==null){
        this.router.navigateByUrl('\login')
    }
  }

  logout() {
        this.service.loggedInUserId=0;
        this.service.userLoggedIn=false;
        localStorage.clear()
        this.router.navigateByUrl('\login')
        location.reload();
        
  }
}

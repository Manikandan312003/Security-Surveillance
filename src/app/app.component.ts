import { MatSidenav } from '@angular/material/sidenav';
import { Component,ViewChild } from '@angular/core';
import { ServiceService } from './services/service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  
})
export class AppComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;
logout() {
    
}

shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
  title = 'SuspectTracker';
  constructor(service:ServiceService,router:Router){
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

}

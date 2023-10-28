import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-allsuspect',
  // templateUrl: './allsuspect.component.html',
  templateUrl: './allsuspect.component.html',
  styleUrls: ['./allsuspect.component.css']
})


export class AllsuspectComponent implements OnInit {
  suspects: any[] = [];
  gridColumns=3;
  

  constructor(private service:ServiceService,private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getSuspects();
  }

  getSuspects() {
    const url = this.service.backendUrl+'getallsuspect';
    console.log(url)

    this.http.get<{ suspects: any[] }>(url).subscribe((response) => {
      this.suspects = response.suspects;

      // Iterate over suspects and convert the binary data to Base64
      this.suspects.forEach((suspect) => {
        // suspect[1] = 'data:image/jpeg;base64,' + btoa(suspect[1]);
        suspect[1] = 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(suspect[1]) as any).changingThisBreaksApplicationSecurity;
        // this.currVerifiedLoanOfficerPhoto = 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(suspect[1]) as any).changingThisBreaksApplicationSecurity;

      });
    });
  }
}

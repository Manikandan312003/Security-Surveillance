import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MysuspectComponent } from './mysuspect/mysuspect.component';
import { AllsuspectComponent } from './allsuspect/allsuspect.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { SuspectdetailsComponent } from './suspectdetails/suspectdetails.component';
// import { suspectdetailComponent } from './suspectdetail/suspectdetail.component';

const routes: Routes = [
  {path:"",redirectTo:'/login',pathMatch:'full',title:'Login'},
  {path:"login",component:LoginComponent,title:'login'},
  {path:'mysuspect',component:MysuspectComponent,title:'mysuspect'},
  {path:'suspect',component:AllsuspectComponent,title:'suspect'},
  {path:'upload',component:FileuploadComponent,title:'upload'},
  {path:'home',component:FileuploadComponent,title:'home'},
  {path:'suspect/:id',component:SuspectdetailsComponent,title:'SuspectDetails'},
  {path:'suspectdetail',component:SuspectdetailsComponent,title:'SuspectDetails'},
  // {path: '**', redirectTo: '/login', pathMatch: 'full' ,title:'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MysuspectComponent } from './mysuspect/mysuspect.component';
import { AllsuspectComponent } from './allsuspect/allsuspect.component';
import { FileuploadComponent } from './fileupload/fileupload.component';

const routes: Routes = [
  {path:"",redirectTo:'/login',pathMatch:'full'},
  {path:"login",component:LoginComponent},
  {path:'mysuspect',component:MysuspectComponent},
  {path:'suspect',component:AllsuspectComponent},
  {path:'upload',component:FileuploadComponent},
  {path:'home',component:FileuploadComponent},
  {path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

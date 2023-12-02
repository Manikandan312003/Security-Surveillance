import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { MysuspectComponent } from './mysuspect/mysuspect.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MatIconModule} from '@angular/material/icon';
// import {MatTool} from '@angular/material'
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import { AllsuspectComponent } from './allsuspect/allsuspect.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {FormsModule} from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
// import { MatFileUploadModule } from 'angular-material-fileupload';

import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import { MatToolbarModule } from "@angular/material/toolbar";

import { FlexLayoutModule } from "@angular/flex-layout";

import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSliderModule} from '@angular/material/slider';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import {MatRippleModule} from '@angular/material/core';
import { SuspectdetailsComponent } from './suspectdetails/suspectdetails.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { ImagedialogComponent } from './imagedialog/imagedialog.component';

// import { suspectdetailComponent } from './suspectdetail/suspectdetail.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FileuploadComponent,
    MysuspectComponent,
    AllsuspectComponent,
    SuspectdetailsComponent,
    ConfirmationDialogComponent,
    EditDialogComponent,
    ImagedialogComponent,
    // suspectdetailComponent
  ],
  imports: [
    MatSliderModule,MatSidenavModule,MatListModule,MatRippleModule,
    BrowserModule,MatFormFieldModule,MatInputModule,MatCardModule,MatTooltipModule,MatDividerModule,FlexLayoutModule,MatToolbarModule,
    AppRoutingModule,MatButtonModule,MatGridListModule,HttpClientModule,MatIconModule,MatDialogModule,BrowserAnimationsModule,FormsModule,
    ToastrModule.forRoot(
      {positionClass:'toast-top-center',
      maxOpened:3,
    
  }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

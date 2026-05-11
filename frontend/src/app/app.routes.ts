import {Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ReportComponent} from './report/report.component';
import {TrackComponent} from './track/track.component';

import {AuthGuard} from './guards/auth.guard';
import {AdminGuard} from './guards/admin.guard';

export const routes:Routes=[

 {path:"",component:LoginComponent},
 {path:"login",component:LoginComponent},
 {path:"register",component:RegisterComponent},

 {path:"dashboard",
  component:DashboardComponent,
  canActivate:[AuthGuard]
 },

 {path:"report",
  component:ReportComponent,
  canActivate:[AuthGuard]
 },

 {path:"track",
 component:TrackComponent,
 canActivate:[AuthGuard]
}

];
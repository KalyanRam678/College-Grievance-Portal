import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
 selector:'app-login',
 standalone:true,
 imports:[CommonModule,FormsModule],
 templateUrl:'./login.component.html'
})
export class LoginComponent{

 email="";
 password="";
 role="student";
 show=false;

 constructor(private auth:AuthService,
             private router:Router){}

 toggle(){
  this.show=!this.show;
 }

 goRegister(){
  this.router.navigate(['/register']);
 }

 login(){

  const data={
   email:this.email,
   password:this.password,
   role:this.role
  };

  this.auth.login(data).subscribe({

   next:(res:any)=>{
    localStorage.setItem("token",res.token);
    localStorage.setItem("user",JSON.stringify(res.user));
    this.router.navigate(['/dashboard']);
   },

   error:()=>{
    alert("Wrong Email or Password");
   }

  });

 }
}
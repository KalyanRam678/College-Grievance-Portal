import {Component} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
 selector:'app-register',
 standalone:true,
 imports:[CommonModule,FormsModule],
 templateUrl:'./register.component.html'
})
export class RegisterComponent{

 name="";
 email="";
 password="";
 idNumber="";
 role="student";
 show=false;

 constructor(private auth:AuthService,
             private router:Router){}

 toggle(){
  this.show=!this.show;
 }

 goLogin(){
  this.router.navigate(['/login']);
 }

 register(){

 this.auth.register({
  name:this.name,
  email:this.email,
  password:this.password,
  role:this.role,
  idNumber:this.idNumber
 })
 .subscribe({
  next:()=>{
   alert("Registered successfully");
  },
  error:()=>{
   alert("Registration failed");
  }
 });

}
}
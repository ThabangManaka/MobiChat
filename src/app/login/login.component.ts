import { ChatsService } from './../service/chats.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../service/auth.service';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  nickname = '';
   ref = firebase.default.database().ref('users/');
  matcher = new MyErrorStateMatcher();
   userDetail: any;
  constructor( private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private auth: AuthService,
     
    private router: Router, private formBuilder: FormBuilder) { }

    ngOnInit() {
      if (localStorage.getItem('nickname')) {
        this.router.navigate(['/roomlist']);
      }
      this.loginForm = this.formBuilder.group({
        'email' : [null, Validators.required],
          'password' : [null, Validators.required]
      });
    }
    onSubmit(form: any) {
      this.auth.login(form).then(x  => {
        this.auth.getUserbyEmail(login.email).subscribe(res => {
          this.userDetail = res
    console.log(res[0].email)

          localStorage.setItem('nickname', res[0].nickname);
          localStorage.setItem('uid', res[0].key);
        })
      })
 

    const login = form;
 
    this.router.navigate(['/roomlist']);
    // this.ref.orderByChild('email').equalTo(login.email).once('value', snapshot => {

    //   if (snapshot.exists()) {
    //     localStorage.setItem('nickname', login.email);
    //     this.router.navigate(['/roomlist']);
    //   }
      //  else {
      //   const newUser = firebase.default.database().ref('users/').push();
      //   newUser.set(login);
      //   localStorage.setItem('nickname', login.nickname);
      //   this.router.navigate(['/roomlist']);
      // }
   // });
  }

}

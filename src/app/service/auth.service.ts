import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
//import {AngularFireDatabase, FirebaseListObservable} from  'angularfire2/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Login } from '../models/ILogin';
import { Register } from '../models/IRegister';
import * as firebase from 'firebase';
import { AngularFireDatabase} from '@angular/fire/database';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestore : AngularFirestore,
    private afAuth: AngularFireAuth,public router:  Router,
    private db: AngularFireDatabase ) { }

    async login(login : Login) {
      var result = await this.afAuth.signInWithEmailAndPassword(login.email,login.password)
      //this.router.navigate(['product-list']);
    }
register(register :Register) {

   this.afAuth.createUserWithEmailAndPassword(register.email, register.password).then(res => {
     console.log(res.user.uid)

   
     this.addUser(res.user.uid,register)
   })
   this.router.navigate(['login']);

 }

 addUser(uid: string , data : Register){
  ///firebase.default.database().ref('users/').push(data);

    this.db.list('/users').push(data);
 }
 logout() {

  localStorage.removeItem("uid");
  localStorage.removeItem("nickname");
  this.router.navigate(['login']);
 }

getUserbyEmail(email){

    return this.db.list('/users', ref => ref.orderByChild("email")
    .equalTo(email)).snapshotChanges()
    .pipe(map(actions => actions.map(a => {

     const key = a.payload.key;
    
     let obj:any = a.payload.val()

     return {key, ...obj};
    })
    ));
     }
}


import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {AngularFirestore} from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('chatcontent') chatcontent: ElementRef;
  scrolltop: number = null;

  name;
  nickname = '';
  chatForm: FormGroup;
  rooms = [];
  isLoadingResults = true;
uid;
o_uid;
public chats = [];
textMsg;
matcher = new MyErrorStateMatcher();

  constructor(private route: ActivatedRoute, private router: Router, public datepipe: DatePipe,
    private firestore : AngularFirestore,
    private formBuilder: FormBuilder,
 ) {
      this.name = sessionStorage.getItem("name");
      console.log(this.name);
      this.uid = sessionStorage.getItem("uid");
       console.log(this.uid)
      this.o_uid = localStorage.getItem("uid");






    }
  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
    this.firestore.collection("chats").doc(this.uid).collection(this.o_uid).snapshotChanges().forEach(child=> {
      child.map(a => {
        const data = a.payload.doc.data();

          //this. chats = [];
        this.chats.push(data);


        console.log(this.chats)
        });

    });
    console.log(this.chats)
  }



  onFormSubmit(form: any) {
    const chat = form;


    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    chat.uid =  this.uid;
    //const newMessage = firebase.default.database().ref('chats/').push();
    // newMessage.set(chat);
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });

    this.firestore.collection("chats").doc(this.uid).collection(this.o_uid).add({
      chat
    });
  }

}

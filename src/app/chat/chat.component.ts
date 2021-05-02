import { ChatsService } from './../service/chats.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {AngularFirestore} from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { AngularFireDatabase} from '@angular/fire/database';

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
receiverId;
public chats = [];
textMsg;
matcher = new MyErrorStateMatcher();
public Sendchats: any = [];
  constructor(private route: ActivatedRoute, private router: Router, public datepipe: DatePipe,
    private firestore : AngularFirestore,
    private formBuilder: FormBuilder,
    private chatsService : ChatsService,
    private db: AngularFireDatabase
 ) {
      this.nickname = localStorage.getItem("nickname");
    
      this.uid = localStorage.getItem("uid");
    

    }
  ngOnInit(): void {
    this.receiverId= this.route.snapshot.paramMap.get("id")
    console.log(this.receiverId)
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });



  this.chatsService.getChats().subscribe(x  =>{
    
    this.Sendchats = x
    console.log(this.Sendchats)
  }
  )
  }


  onFormSubmit(form: any) {

    const chat = form;

    console.log(chat)

    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    chat.receiverId=  this.receiverId;
    chat.senderId = this.uid;
    chat.nickname = this.nickname;

    //const newMessage = firebase.default.database().ref('chats/').push();
    // newMessage.set(chat);
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
   this.db.list("privateChats/").push(chat)
  
  }

  goback() {
    this.router.navigate(['/roomlist']);
  }
 
}

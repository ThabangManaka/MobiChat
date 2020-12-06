import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

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
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.css']
})
export class RoomlistComponent implements OnInit {
username;
  nickname = '';
  displayedColumns: string[] = ['roomname'];
  rooms = [];
  isLoadingResults = true;
uid;
chatuser = [];
  constructor(private route: ActivatedRoute, private router: Router, public datepipe: DatePipe,
    private firestore : AngularFirestore) {
    this.nickname = localStorage.getItem('nickname');
    firebase.default.database().ref('rooms/').on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
      this.isLoadingResults = false;
    });
    this.uid = localStorage.getItem('key');

    const newUser = firebase.default.database().ref('users/').on('value', (resp: any) => {
     let chatuser = snapshotToArray(resp);

       for (let user of Object.values(chatuser)){
        if (user['nickname'] ==  this.nickname){
       // localStorage.setItem('nickname', login.nickname);
      this.uid = localStorage.setItem('uid',user.key);
          console.log(user.key);
        }
       if (user['nickname'] !==  this.nickname){
        this.chatuser.push(user);

       // console.log(this.chatuser);
       }
       }

      //  Object.keys(chatuser).forEach(function (key) {
      //   //console.log(this.nickname);
      //  //  console.log(chatuser[key] );

      //  });


    });
    console.log( newUser);
  }

  ngOnInit(): void {
  }

  enterChatRoom(roomname: string) {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${this.nickname} enter the room`;
    chat.type = 'join';
    const newMessage = firebase.default.database().ref('chats/').push();
    newMessage.set(chat);

    firebase.default.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.default.database().ref('roomusers/' + user.key);
        userRef.update({status: 'online'});
      } else {
        const newroomuser = { roomname: '', nickname: '', status: '' };
        newroomuser.roomname = roomname;
        newroomuser.nickname = this.nickname;
        newroomuser.status = 'online';
        const newRoomUser = firebase.default.database().ref('roomusers/').push();
        newRoomUser.set(newroomuser);
      }
    });



    this.router.navigate(['/chatroom', roomname]);
  }
  gotoChat(nickname,key) {
  
    sessionStorage.setItem("uid",key);
    sessionStorage.setItem("name", nickname);

    this.router.navigate(['/chat']);
  }
  logout(): void {
    localStorage.removeItem('nickname');
    this.router.navigate(['/login']);
  }

}

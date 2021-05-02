import { Injectable } from '@angular/core';
import { AngularFireDatabase} from '@angular/fire/database';
@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(  private db: AngularFireDatabase) { }


  getChats() {
   return this.db.list('/privateChats').valueChanges();
  }
}

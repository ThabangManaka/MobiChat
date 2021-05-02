import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomlistComponent } from './roomlist/roomlist.component';
import { AddroomComponent } from './addroom/addroom.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ChatComponent } from './chat/chat.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  {path: 'register', component: RegisterComponent},
{path: 'login', component: LoginComponent},
{ path: 'roomlist', component: RoomlistComponent },
{ path: 'addroom', component: AddroomComponent },
{ path: 'chatroom/:roomname', component: ChatroomComponent },
{path: 'chat/:id', component: ChatComponent},
{ path: '',
  redirectTo: '/register',
  pathMatch: 'full'
}
]
;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

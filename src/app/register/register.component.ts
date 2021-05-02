import { AuthService } from './../service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _auth : AuthService) { }

  ngOnInit(): void {
  }
  onSubmit(form :any) {

    //this._auth.addUser(form);
   // this.router.navigate(['login']);
  this._auth.register(form);

  }

}

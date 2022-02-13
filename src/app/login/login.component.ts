import { Component} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData = {
    UserName: '',
    Password: '',
  };

  constructor(private service: AuthService, private router: Router) {}

  login() {
    this.service.login(this.loginData).subscribe(
      (data: any) => {
        localStorage.setItem('userName', data.userName);
        localStorage.setItem('token_value', data.token);
        this.router.navigate(['/entries']);
      },
      (error) => alert(error.error.Message)
    );
  }
}

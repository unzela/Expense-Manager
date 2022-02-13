import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(public fb: FormBuilder, private service: AuthService) {
    this.registerForm = fb.group(
      {
        UserName: ['', Validators.required],
        Password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.matchingFields('password', 'confirmPassword') }
    );
  }

  onSubmit() {
    delete this.registerForm.value.confirmPassword;
    this.service.register(this.registerForm.value).subscribe((data) => {
    });
  }
  matchingFields(field1: any, field2: any) {
    return (form: { controls: { [x: string]: { value: any; }; }; }) => {
      if (form.controls[field1].value !== form.controls[field2].value)
        return { matchingFields: true };
    };
  }
}

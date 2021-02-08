import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private alertController: AlertController
  ) {}

  public userForm: FormGroup;
  user = this.api.getCurrentUser();
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    console.log(
      'Login form submitted',
      this.userForm.value.username,
      this.userForm.value.password
    );
    this.api
      .signIn(this.userForm.value.username, this.userForm.value.password)
      .subscribe(
        (res) => {
          console.log('Login success', res);
        },
        async (err) => {
          console.log('Loginfailed', err);
          const alert = await this.alertController.create({
            header: 'Login failed',
            subHeader: 'Erreur: ' + err.error.data.status,
            buttons: ['OK'],
          });
        }
      );
  }

  logout(){
    this.api.logout();
  }
}

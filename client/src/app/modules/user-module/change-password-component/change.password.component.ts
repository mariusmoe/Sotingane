import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '@app/services';
import { User, UpdatePasswordUser, ModalData } from '@app/models';

import { ModalComponent } from '@app/modules/base-module/modals/modal.component';

@Component({
  selector: 'app-change-password-component',
  templateUrl: './change.password.component.html',
  styleUrls: ['./change.password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService) {
    this.changePasswordForm = fb.group({
      'currentPassword' : ['', Validators.required],
      'password': ['', Validators.required],
      'confirm': ['', Validators.required]
    }, { validator: this.matchingPasswords.bind(this) });
  }

  /**
   * Submits the changePasswordForm
   */
  submitForm() {
    const user: UpdatePasswordUser = this.changePasswordForm.value;
    const sub = this.authService.updatePassword(user).subscribe(
      result => {
        sub.unsubscribe();

        const data: ModalData = {
          headerText: 'Password updated!',
          bodyText: 'Your password was successfully updated.',

          proceedColor: 'primary',
          proceedText: 'Okay',

          includeCancel: false,

          proceed: () => {}
        };
        if (result) {
          this.changePasswordForm.reset();
          this.changePasswordForm.markAsUntouched();
          this.router.navigateByUrl('/');
          this.dialog.open(ModalComponent, <MatDialogConfig>{ data: data });
          return;
        }
        data.headerText = 'Failure';
        data.bodyText = 'Could not update your password.';
        this.dialog.open(ModalComponent, <MatDialogConfig>{ data: data });
      },
      error => {
        sub.unsubscribe();
      },
    );
  }


  /**
   * Compares the password and confirm fields and returns true if they match
   * @param  {FormGroup} group the form group upon which the check is done
   * @return {boolean}         if the fields match
   */
  private matchingPasswords(group: FormGroup) {
    // if they do not match, then we return that matchingPasswords is true (in that it is an error)
    if (group.get('password').value !== group.get('confirm').value) {
      return { matchingPasswords: true };
    }
    return null;
  }
}
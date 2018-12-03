export class CustomValidator {
  static matchingConfirmPasswords(passwordKey: any) {
    const passwordInput = passwordKey['value'];
    if (passwordInput.password === passwordInput.cfPassword) {
      return null;
    } else {
      return passwordKey.controls['cfPassword'].setErrors({passwordNotEquivalent: true});
    }
  }

}

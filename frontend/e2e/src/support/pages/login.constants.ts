export const LoginPage = {
  loginButton: 'button[type="submit"]',
  loginInput: 'input[name="username"]',
  passwordInput: 'input[name="password"]',
  visit: () => cy.visit('/auth/login'),
  fillForm: (login: string, password: string) => {
    cy.get(LoginPage.loginInput).type(login);
    cy.get(LoginPage.passwordInput).type(password);
  },
  submit: () => cy.get(LoginPage.loginButton).click(),
} as const;

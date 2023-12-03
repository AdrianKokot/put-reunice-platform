import { LoginPage } from './pages/login.constants';

export enum E2EUser {
  MAIN_ADMIN,
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(user: E2EUser): void;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', (user: E2EUser) => {
  cy.clearAllCookies();
  LoginPage.visit();

  switch (user) {
    case E2EUser.MAIN_ADMIN:
      LoginPage.fillForm('admin', '51D7k4F8');
      break;
    default:
      throw new Error(`Unknown user ${user}`);
  }

  cy.get(LoginPage.loginButton).click();
  cy.url().should('contain', '/universities');
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

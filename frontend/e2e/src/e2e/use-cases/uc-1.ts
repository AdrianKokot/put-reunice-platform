import { E2EUser, login, LoginPage, waitForResponse } from '../../support';

/**
 * UC-1. System login
 */
export const uc1 = () => {
  describe('UC-1. System login', () => {
    it('Should display invalid credentials error', () => {
      cy.clearAllCookies();
      LoginPage.visit();

      cy.intercept('POST', '/api/login').as('login');
      LoginPage.fillForm('E2E_ADMIN_INVALID', 'e2e_ADMIN1@_invalid');

      cy.get(LoginPage.loginButton).click();

      waitForResponse('@login', 400);

      cy.get('form')
        .find('tui-error')
        .should('exist')
        .should('contain.text', 'Wrong username or password');
    });

    it('Should login successfully', () => {
      login(E2EUser.MAIN_ADMIN);
    });
  });
};

import { LoginPage } from './pages/login.constants';

export const waitForResponse = (alias: string, code: number) => {
  cy.wait(alias)
    .should('have.property', 'response')
    .and('have.property', 'statusCode', code);
  // Wait for animation to finish
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
};

export const goToConsole = () => {
  cy.visit('/');
  cy.scrollTo('top');
  cy.get('eunice-ui-top-bar [data-test="user-menu-button"]').click();
  cy.get(
    'tui-root tui-dropdown-host tui-data-list a[data-test="user-menu-console-button"]',
  ).click({ force: true });

  cy.url().should('contain', '/admin');
};

export const TILES = {
  Universities: 'UNIVERSITIES',
  Users: 'USERS',
  Pages: 'PAGES',
  Resources: 'RESOURCES',
  Tickets: 'TICKETS',
} as const;

export const clickOnTile = (tileName: string) => {
  cy.get(`[data-test="dashboard-tile-${tileName.toUpperCase()}"]`).click();
  cy.url().should('contain', `/admin/${tileName.toLowerCase()}`);
};

export const goToTile = (tileName: string) => {
  cy.visit(`/admin/${tileName.toLowerCase()}`);
  cy.url().should('contain', `/admin/${tileName.toLowerCase()}`);
};

export enum E2EUser {
  MAIN_ADMIN,
}

export const loginWith = (username: string, password: string) => {
  cy.clearAllCookies();
  LoginPage.visit();
  const testAlias = `login${Date.now()}`;
  cy.intercept('POST', '/api/login').as(testAlias);
  LoginPage.fillForm(username, password);
  cy.get(LoginPage.loginButton).click();
  waitForResponse(`@${testAlias}`, 200);
};

export const login = (user: E2EUser) => {
  switch (user) {
    case E2EUser.MAIN_ADMIN:
      loginWith('E2E_ADMIN', 'e2e_ADMIN1@');
      break;
    default:
      throw new Error(`Unknown user ${user}`);
  }
};

export const rememberLogin = (loginFn: () => void) => {
  let appCookies: Cypress.Cookie[];

  before(() => {
    loginFn();
    cy.getAllCookies().then((cookies) => {
      appCookies = cookies.filter((cookie) => cookie.name !== 'XSRF-TOKEN');
    });
  });

  beforeEach(() => {
    cy.clearAllCookies();
    appCookies.forEach((cookie) => cy.setCookie(cookie.name, cookie.value));
  });
};

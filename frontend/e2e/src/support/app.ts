export const waitForResponse = (alias: string, code: number) => {
  cy.wait(alias)
    .should('have.property', 'response')
    .and('have.property', 'statusCode', code);
};

export const goToConsole = () => {
  cy.visit('/');
  cy.scrollTo('top');
  cy.get('reunice-ui-top-bar [data-test="user-menu-button"]').click();
  cy.get(
    'tui-root tui-dropdown-host tui-data-list a[data-test="user-menu-console-button"]',
  ).click({ force: true });

  cy.url().should('contain', '/admin');
};

export const TILES = {
  Universities: 'UNIVERSITIES',
} as const;

export const clickOnTile = (tileName: string) => {
  cy.get(`[data-test="dashboard-tile-${tileName.toUpperCase()}"]`).click();
  cy.url().should('contain', '/admin/' + tileName.toLowerCase());
};

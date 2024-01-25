import { PublicPage, waitForResponse } from '../../support';

export const ucan1 = () => {
  it('UC-AN1. Browse generic system information', () => {
    cy.intercept('GET', '/api/global-pages/main*').as('getPage');
    cy.visit('/');
    waitForResponse('@getPage', 200);
  });
};

export const ucan2 = () => {
  it('UC-AN2. Browse participating universities', () => {
    cy.intercept('GET', '/api/pages/main*').as('getPages');
    cy.visit('/universities');
    waitForResponse('@getPages', 200);

    cy.intercept('GET', '/api/pages/*').as('getPage');
    cy.get('.universities-grid .tui-island').first().click();
    waitForResponse('@getPage', 200);
  });
};

const goToPageBySearch = (search: string) => {
  cy.intercept('GET', '/api/search/pages*').as('searchPages');

  cy.get('[data-test="app-search"]').type(search);

  waitForResponse('@searchPages', 200);

  cy.intercept('GET', '/api/pages/*').as('getPage');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.get('[data-test="app-search-options"]')
    .should('be.visible')
    .wait(300)
    .find('a div')
    .first()
    .then((btn) => btn.trigger('click'));

  cy.url().should('match', /\/university\/\d+\/page\/\d+/);
  waitForResponse('@getPage', 200);
};

export const ucan3 = (testTimestamp: string) => {
  it('UC-AN3. Search for keywords', () => {
    goToPageBySearch(testTimestamp);
    cy.get('reunice-page-details').should('contain.text', testTimestamp);
  });
};

export const ucan4 = (testTimestamp: string) => {
  it('UC-AN4. Downloading files', () => {
    goToPageBySearch(`${testTimestamp} University User Page`);
    cy.get('reunice-page-details').should('contain.text', testTimestamp);
    cy.get('reunice-page-resources-list tui-file').should(
      'contain.text',
      testTimestamp,
    );
    cy.get('reunice-page-resources-list tui-file a').click();
  });
};

export const ucan5 = (testTimestamp: string) => {
  it('UC-AN5. Requesting contact', () => {
    goToPageBySearch(`${testTimestamp} University User Page`);
    PublicPage.fillContactForm(
      testTimestamp,
      'examplecontactrequest@eunice.com',
      `Test ${testTimestamp} Contact Request`,
    );
  });
};

import {
  clickOnTile,
  Dialog,
  Form,
  goToConsole,
  goToTile,
  PagePage,
  Resource,
  TILES,
  UserPage,
  waitForResponse,
} from '../../support';

export const ucuu1 = (testTimestamp: string) => {
  it('UC-UU1. Create new page', () => {
    goToConsole();
    clickOnTile(TILES.Pages);

    cy.intercept('POST', '/api/pages').as('createPage');

    Resource.new();

    PagePage.fillForm({
      title: `Test ${testTimestamp} University User Page`,
      description: `Test ${testTimestamp} University User Page Description`,
    });

    Form.submit();
    Dialog.confirm();
    waitForResponse('@createPage', 201);

    cy.url().should('match', /pages\/\d+/);
  });
};

export const ucuu2 = () => {
  it('UC-UU2. Open page in edit mode', () => {
    goToTile(TILES.Pages);

    Resource.edit();
  });
};

export const ucuu3 = (testTimestamp: string) => {
  it('UC-UU3. Edit page', () => {
    cy.intercept('PUT', '/api/pages/*').as('editPage');
    cy.intercept('GET', '/api/pages/*').as('getPage');

    goToTile(TILES.Pages);
    Resource.search(`Test ${testTimestamp} University User Page`);
    Resource.edit();

    waitForResponse('@getPage', 200);

    PagePage.fillForm({
      title: `Edited Test ${testTimestamp} University User Page`,
      description: `Edited Test ${testTimestamp} University User Page Description`,
      content: `Edited Test ${testTimestamp} University User Page Content`,
    });

    PagePage.setVisibility('visible');

    Form.submit();
    Dialog.confirm();
    waitForResponse('@editPage', 204);

    cy.url().should('match', /pages\/\d+/);
    cy.get('label .t-content')
      .should(
        'contain.text',
        `Edited Test ${testTimestamp} University User Page`,
      )
      .should(
        'contain.text',
        `Edited Test ${testTimestamp} University User Page Description`,
      )
      .should('contain.text', 'Visible');
  });
};

export const ucuu4 = (testTimestamp: string) => {
  it('UC-UU4. Hide page', () => {
    cy.intercept('PUT', '/api/pages/*').as('editPage');
    cy.intercept('GET', '/api/pages/*').as('getPage');
    goToTile(TILES.Pages);
    Resource.search(`Test ${testTimestamp} University User Page`);
    Resource.edit();

    waitForResponse('@getPage', 200);

    PagePage.setVisibility('hidden');
    Form.submit();
    Dialog.confirm();
    waitForResponse('@editPage', 204);

    cy.url().should('match', /pages\/\d+/);
    cy.get('label .t-content').should('contain.text', 'Hidden');
  });
};
export const ucuu5 = (testTimestamp: string) => {
  it('UC-UU5. Show page', () => {
    cy.intercept('PUT', '/api/pages/*').as('editPage');
    cy.intercept('GET', '/api/pages/*').as('getPage');
    goToTile(TILES.Pages);
    Resource.search(`Test ${testTimestamp} University User Page`);
    Resource.edit();

    waitForResponse('@getPage', 200);

    PagePage.setVisibility('visible');
    Form.submit();
    Dialog.confirm();
    waitForResponse('@editPage', 204);

    cy.url().should('match', /pages\/\d+/);

    waitForResponse('@getPage', 200);

    cy.get('label .t-content').should('contain.text', 'Visible');
  });
};
export const ucuu7 = (testTimestamp: string) => {
  it('UC-UU7. Bind contact persons', () => {
    cy.intercept('PUT', '/api/pages/*').as('editPage');
    cy.intercept('GET', '/api/pages/*').as('getPage');
    goToTile(TILES.Pages);
    Resource.search(`Test ${testTimestamp} University User Page`);
    Resource.edit();

    waitForResponse('@getPage', 200);

    PagePage.selectCRH(`ua_user${testTimestamp}`);

    Form.submit();
    waitForResponse('@editPage', 204);

    cy.url().should('match', /pages\/\d+/);

    waitForResponse('@getPage', 200);

    PagePage.tabs.responsibility();

    cy.get('table tr td:nth-child(3)').should(
      'contain.text',
      `ua_user${testTimestamp}@reunice.com`,
    );
  });
};

export const ucuu12 = (testTimestamp: string) => {
  describe('UC-UU12. Generate responsibility report', () => {
    it('Page vs CRHs mode', () => {
      cy.intercept('GET', '/api/pages/*').as('getPage');
      goToTile(TILES.Pages);
      Resource.search(`Test ${testTimestamp} University User Page`);
      Resource.details();

      waitForResponse('@getPage', 200);

      PagePage.tabs.responsibility();

      cy.get('table tr td:nth-child(3)').should(
        'contain.text',
        `ua_user${testTimestamp}@reunice.com`,
      );
    });

    it('User vs Pages mode', () => {
      cy.intercept('GET', '/api/users/*').as('getUser');
      goToTile(TILES.Users);
      Resource.search(`ua_user${testTimestamp}@reunice.com`);
      Resource.details();

      waitForResponse('@getUser', 200);

      UserPage.tabs.responsibility();

      cy.get('table tr td:nth-child(1)').should(
        'contain.text',
        `Test ${testTimestamp} University User Page`,
      );
    });
  });
};

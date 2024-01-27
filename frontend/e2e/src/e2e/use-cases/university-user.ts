import {
  clickOnTile,
  Dialog,
  Form,
  goToConsole,
  goToTile,
  PagePage,
  Resource,
  ResourcePage,
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
    PagePage.selectResource(testTimestamp);

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

export const ucuu6 = (testTimestamp: string) => {
  it('UC-UU6. Delete page', () => {
    cy.intercept('GET', '/api/pages/*').as('getPage');
    cy.intercept('DELETE', '/api/pages/*').as('deletePage');

    goToTile(TILES.Pages);
    Resource.search(`${testTimestamp} University User`);
    Resource.details();
    Resource.delete();
    Dialog.confirm();
    //
    // // Second confirm for deleting resources too
    // // eslint-disable-next-line cypress/no-unnecessary-waiting
    // cy.wait(300);
    // Dialog.confirm();

    waitForResponse('@deletePage', 204);
    cy.url().should('match', /pages/);
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
      `ua_user${testTimestamp}@eunice.com`,
    );
  });
};

export const ucuu8 = () => {
  it('UC-UU8. View resources list', () => {
    cy.intercept('GET', '/api/resources*').as('getResources');

    goToTile(TILES.Resources);

    waitForResponse('@getResources', 200);
  });
};

export const ucuu9 = (testTimestamp: string) => {
  it('UC-UU9. Upload resource', () => {
    goToTile(TILES.Resources);
    cy.intercept('POST', '/api/resources').as('createResource');
    cy.intercept('GET', '/api/resources/*').as('getResource');

    Resource.new();

    ResourcePage.fillForm({
      name: `Test ${testTimestamp} Resource`,
      description: `Test ${testTimestamp} Resource Description`,
    });

    ResourcePage.setFile();

    Form.submit();
    Dialog.confirm();

    waitForResponse('@createResource', 200);
    waitForResponse('@getResource', 200);
    cy.url().should('match', /resources\/\d+/);
    cy.get('label .t-content')
      .should('contain.text', `Test ${testTimestamp} Resource`)
      .should('contain.text', `Test ${testTimestamp} Resource Description`);
  });

  it('UC-UU9. Upload resource -- link', () => {
    goToTile(TILES.Resources);
    cy.intercept('POST', '/api/resources').as('createResource');
    cy.intercept('GET', '/api/resources/*').as('getResource');

    Resource.new();

    ResourcePage.setResourceType('link');

    ResourcePage.fillForm({
      name: `Test ${testTimestamp} Link`,
      description: `Test ${testTimestamp} Link Description`,
      url: 'https://google.com',
    });

    Form.submit();
    Dialog.confirm();

    waitForResponse('@createResource', 200);
    waitForResponse('@getResource', 200);
    cy.url().should('match', /resources\/\d+/);
    cy.get('label .t-content')
      .should('contain.text', `Test ${testTimestamp} Link`)
      .should('contain.text', `Test ${testTimestamp} Link Description`)
      .should('contain.text', 'https://google.com');
  });
};

export const ucuu10 = (testTimestamp: string) => {
  it('UC-UU10. Delete resource', () => {
    goToTile(TILES.Resources);
    cy.intercept('GET', '/api/resources/*').as('getResource');
    cy.intercept('DELETE', '/api/resources/*').as('deleteResource');

    Resource.search(`Test ${testTimestamp} Link`);
    Resource.details();

    waitForResponse('@getResource', 200);

    Resource.delete();
    Dialog.confirm();

    waitForResponse('@deleteResource', 204);
    cy.url().should('match', /resources/);
  });
};

export const ucuu11 = (testTimestamp: string) => {
  it('UC-UU11. Update resource', () => {
    goToTile(TILES.Resources);
    cy.intercept('GET', '/api/resources/*').as('getResource');
    cy.intercept('PUT', '/api/resources/*').as('updateResource');
    cy.intercept('DELETE', '/api/resources/*').as('deleteResource');

    Resource.search(`Test ${testTimestamp} Resource`);
    Resource.edit();

    waitForResponse('@getResource', 200);

    ResourcePage.fillForm({
      name: `Edited Test ${testTimestamp} Resource`,
      description: `Edited Test ${testTimestamp} Resource Description`,
    });

    Form.submit();
    Dialog.confirm();

    waitForResponse('@updateResource', 204);
    waitForResponse('@getResource', 200);
    cy.get('label .t-content')
      .should('contain.text', `Edited Test ${testTimestamp} Resource`)
      .should(
        'contain.text',
        `Edited Test ${testTimestamp} Resource Description`,
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
        `ua_user${testTimestamp}@eunice.com`,
      );
    });

    it('User vs Pages mode', () => {
      cy.intercept('GET', '/api/users/*').as('getUser');
      goToTile(TILES.Users);
      Resource.search(`ua_user${testTimestamp}@eunice.com`);
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

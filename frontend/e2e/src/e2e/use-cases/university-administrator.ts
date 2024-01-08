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

export const ucua1 = (testTimestamp: string) => {
  it('UC-UA1. Edit university landing page', () => {
    cy.intercept('GET', '/api/pages?*').as('getPages');
    cy.intercept('GET', '/api/pages/*').as('getPage');
    cy.intercept('PUT', '/api/pages/*').as('editPage');
    goToTile(TILES.Pages);

    waitForResponse('@getPages', 200);
    Resource.edit();
    waitForResponse('@getPage', 200);

    PagePage.fillForm({
      title: `Test ${testTimestamp} Landing Page`,
      description: `Test ${testTimestamp} Landing Page Description`,
      content: `Test ${testTimestamp} Landing Page Content`,
    });

    PagePage.setVisibility('visible');

    Form.submit();
    Dialog.confirm();

    waitForResponse('@editPage', 204);

    cy.url().should('match', /pages\/\d+/);

    waitForResponse('@getPage', 200);

    cy.get('label .t-content')
      .should('contain.text', `Test ${testTimestamp} Landing Page`)
      .should('contain.text', `Test ${testTimestamp} Landing Page Description`);
  });
};

export const ucua2 = (testTimestamp: string) => {
  it('UC-UA2. View users list', () => {
    goToConsole();
    clickOnTile(TILES.Users);
    Resource.details();

    cy.get('label .t-content').should(
      'contain.text',
      `Test University ${testTimestamp}`,
    );
  });
};

export const ucua3 = (testTimestamp: string) => {
  it('UC-UA3. Create user', () => {
    goToTile(TILES.Users);
    Resource.new();

    cy.url().should('match', /users\/new/);

    cy.intercept('POST', '/api/users').as('createUser');
    cy.intercept('GET', '/api/users/*').as('getUser');

    UserPage.fillForm({
      firstName: `UA_Test_${testTimestamp}`,
      lastName: 'UA_User',
      email: `ua_user${testTimestamp}@reunice.com`,
      username: `ua_user${testTimestamp}`,
    });

    UserPage.setRole('user');

    Form.submit();

    waitForResponse('@createUser', 201);

    cy.url().should('match', /users\/\d+/);
    waitForResponse('@getUser', 200);

    cy.get('label .t-content').should(
      'contain.text',
      `Test University ${testTimestamp}`,
    );
  });
};

export const ucua5 = (testTimestamp: string) => {
  it('UC-UA5. Edit user', () => {
    goToTile(TILES.Users);
    cy.intercept('GET', '/api/users/*').as('getUser');
    cy.intercept('PUT', '/api/users/*').as('editUser');

    Resource.search(`ua_user${testTimestamp}`);
    Resource.edit();

    UserPage.fillForm({
      firstName: `Edited_UA_Test_${testTimestamp}`,
      lastName: 'Edited_UA_User',
      email: `edited_ua_user${testTimestamp}@reunice.com`,
      username: `edited_ua_user${testTimestamp}`,
    });

    Form.submit();
    waitForResponse('@editUser', 200);
    cy.url().should('match', /users\/\d+/);

    cy.get('label .t-content')
      .should('contain.text', `Edited_UA_Test_${testTimestamp}`)
      .should('contain.text', 'Edited_UA_User')
      .should('contain.text', `edited_ua_user${testTimestamp}@reunice.com`)
      .should('contain.text', `edited_ua_user${testTimestamp}`);
  });
};
const setUserState = (state: 'enabled' | 'disabled', testTimestamp: string) => {
  goToTile(TILES.Users);
  cy.intercept('GET', '/api/users/*').as('getUser');
  cy.intercept('PUT', '/api/users/*').as('editUser');

  Resource.search(`ua_user${testTimestamp}`);
  Resource.edit();

  waitForResponse('@getUser', 200);

  UserPage.setState(state);

  Form.submit();
  Dialog.confirm();
  waitForResponse('@editUser', 200);
  cy.url().should('match', /users\/\d+/);

  cy.get('label .t-content').should(
    'contain.text',
    state[0].toUpperCase() + state.slice(1),
  );
};

export const ucua6 = (testTimestamp: string) => {
  it('UC-UA6. Disable user', () => {
    setUserState('disabled', testTimestamp);
  });
};

export const ucua7 = (testTimestamp: string) => {
  it('UC-UA7. Enable user', () => {
    setUserState('enabled', testTimestamp);
  });
};

export const ucua4 = (testTimestamp: string) => {
  it('UC-UA4. Delete user', () => {
    cy.intercept('GET', '/api/pages?*').as('getPages');
    setUserState('disabled', testTimestamp);

    cy.intercept('GET', '/api/pages/*').as('getPage');
    cy.intercept('DELETE', '/api/pages/*').as('deletePage');
    cy.intercept('DELETE', '/api/users/*').as('deleteUser');
    cy.intercept('GET', '/api/users/*').as('getUserDetails');
    UserPage.tabs.pages();
    let userUrl = '';
    cy.url().then((u) => (userUrl = u));
    waitForResponse('@getPages', 200);

    Resource.edit('table');
    waitForResponse('@getPage', 200);

    PagePage.setVisibility('hidden');

    Form.submit();
    Dialog.confirm();

    waitForResponse('@getPage', 200);

    Resource.delete();

    waitForResponse('@deletePage', 204);

    cy.then(() => cy.visit(userUrl));

    waitForResponse('@getUserDetails', 200);

    Resource.delete();

    waitForResponse('@deleteUser', 204);
    cy.url().should('match', /users$/);
  });
};

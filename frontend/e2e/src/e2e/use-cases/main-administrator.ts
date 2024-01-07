import {
  clickOnTile,
  Dialog,
  Form,
  goToConsole,
  goToTile,
  LoginPage,
  Resource,
  TILES,
  UniversityPage,
  UserPage,
  waitForResponse,
} from '../../support';

/**
 * UC-A12. Delete university
 */
export const uca12 = (testTimestamp: string) => {
  it('UC-A12. Delete university', () => {
    goToTile(TILES.Universities);
    Resource.search(testTimestamp);
    Resource.edit();

    UniversityPage.setVisibility('hidden');
    Form.submit();
    Dialog.confirm();

    cy.intercept('DELETE', '/api/universities/*').as('deleteUniversity');
    Resource.delete();

    waitForResponse('@deleteUniversity', 204);
  });
};

/**
 * UC-A10. Create university
 */
export const uca10 = (testTimestamp: string) => {
  it('UC-A10. Create university', () => {
    goToConsole();
    clickOnTile(TILES.Universities);

    cy.intercept('POST', '/api/universities').as('createUniversity');
    Resource.new();
    UniversityPage.fillForm({
      name: `TestUniversity_${testTimestamp}`,
      shortName: `TU${testTimestamp}`,
    });
    Form.submit();
    Dialog.confirm();

    waitForResponse('@createUniversity', 201);

    cy.url().should('match', /universities\/\d+/);
  });
};

/**
 * UC-A11. Manage university
 */
export const uca11 = (testTimestamp: string) => {
  it('UC-A11. Manage university', () => {
    goToTile(TILES.Universities);

    cy.intercept('GET', '/api/universities/*').as('getUniversity');
    cy.intercept('PUT', '/api/universities/*').as('editUniversity');
    Resource.search(testTimestamp.toString());
    Resource.edit();
    waitForResponse('@getUniversity', 200);
    UniversityPage.fillForm({
      name: `Test University ${testTimestamp}`,
      shortName: `TU${testTimestamp}`,
      description: `Test University ${testTimestamp} Description`,
      address: 'Test University Address',
      website: 'testuniversity.com',
    });
    UniversityPage.setVisibility('visible');
    Form.submit();
    Dialog.confirm();
    waitForResponse('@editUniversity', 200);

    cy.url().should('match', /universities\/\d+/);
    waitForResponse('@getUniversity', 200);

    cy.get('.t-label')
      .contains('Visibility')
      .parents('label')
      .find('.t-content')
      .should('contain.text', 'Visible');

    cy.get('label .t-content')
      .should('contain.text', `Test University ${testTimestamp}`)
      .should('contain.text', `TU${testTimestamp}`)
      .should('contain.text', `Test University ${testTimestamp} Description`)
      .should('contain.text', 'Test University Address')
      .should('contain.text', 'testuniversity.com');
  });
};

export const uca5 = (testTimestamp: string) => {
  describe('UC-A5. Create single user', () => {
    it('Should create University User', () => {
      goToTile(TILES.Universities);

      Resource.search(testTimestamp);
      Resource.details();
      UniversityPage.buttons.createUser().click();

      cy.url().should('match', /users\/new/);

      cy.intercept('POST', '/api/users').as('createUser');

      UserPage.fillForm({
        firstName: `Test_${testTimestamp}`,
        lastName: 'User',
        email: `user${testTimestamp}@reunice.com`,
        username: `user${testTimestamp}`,
      });

      UserPage.setRole('user');

      Form.submit();

      waitForResponse('@createUser', 201);

      cy.url().should('match', /users\/\d+/);
    });

    it('Should create University Administrator', () => {
      cy.visit('/admin/users/new');

      cy.intercept('POST', '/api/users').as('createUser');

      UserPage.fillForm({
        firstName: `Test_${testTimestamp}`,
        lastName: 'Moderator',
        email: `moderator${testTimestamp}@reunice.com`,
        username: `moderator${testTimestamp}`,
      });

      UserPage.setRole('moderator');
      UserPage.setUniversity(testTimestamp);

      Form.submit();

      waitForResponse('@createUser', 201);

      cy.url().should('match', /users\/\d+/);
    });

    it('Should display error message when creating user with existing username', () => {
      cy.visit('/admin/users/new');

      cy.intercept('POST', '/api/users').as('createUser');

      UserPage.fillForm({
        username: `user${testTimestamp}`,
      });
      UserPage.setUniversity(testTimestamp);

      Form.submit();

      waitForResponse('@createUser', 400);

      cy.get('tui-error').should(
        'contain.text',
        'User with this username already exists',
      );
    });
  });
};

const setUserState = (
  state: 'enabled' | 'disabled',
  testTimestamp: string,
  username = 'user',
) => {
  goToTile(TILES.Users);
  cy.intercept('GET', '/api/users/*').as('getUser');
  cy.intercept('PUT', '/api/users/*').as('editUser');

  Resource.search(`${username}${testTimestamp}`);
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

export const uca_7_8_9 = (testTimestamp: string) => {
  describe('UC-A7, UC-A8, UC-A9. Edit user', () => {
    it('UC-A7. Edit user', () => {
      goToTile(TILES.Users);
      cy.intercept('GET', '/api/users/*').as('getUser');
      cy.intercept('PUT', '/api/users/*').as('editUser');

      Resource.search(`user${testTimestamp}`);
      Resource.edit();

      UserPage.fillForm({
        firstName: `Edited_Test_${testTimestamp}`,
        lastName: 'Edited_User',
        email: `edited_user${testTimestamp}@reunice.com`,
        username: `edited_user${testTimestamp}`,
      });

      Form.submit();
      waitForResponse('@editUser', 200);
      cy.url().should('match', /users\/\d+/);

      cy.get('label .t-content')
        .should('contain.text', `edited_user${testTimestamp}@reunice.com`)
        .should('contain.text', `Edited_Test_${testTimestamp}`)
        .should('contain.text', 'Edited_User')
        .should('contain.text', `edited_user${testTimestamp}`);
    });

    describe('UC-A8, UC-A9. Change user state', () => {
      it('UC-A8. Disable user', () => {
        setUserState('disabled', testTimestamp);
      });

      it('Disabled user should not be able to login', () => {
        cy.clearAllCookies();
        LoginPage.visit();
        LoginPage.fillForm(
          `edited_user${testTimestamp}`,
          UserPage.defaultFormValue.password,
        );

        cy.get(LoginPage.loginButton).click();
        cy.get('form')
          .find('tui-error')
          .should('exist')
          .should('contain.text', 'Your account has been disabled');
      });

      it('UC-A9. Enable user', () => {
        setUserState('enabled', testTimestamp);
      });

      it('Delete user', () => {
        setUserState('disabled', testTimestamp);
        cy.intercept('DELETE', '/api/users/*').as('deleteUser');

        Resource.delete();
        waitForResponse('@deleteUser', 204);

        cy.url().should('match', /\/admin\/users$/);
      });
    });
  });
};

export const deleteUser = (testTimestamp: string) => {
  it('Delete user', () => {
    setUserState('disabled', testTimestamp, 'moderator');

    cy.intercept('DELETE', '/api/users/*').as('deleteUser');
    Resource.delete();

    waitForResponse('@deleteUser', 204);

    cy.url().should('match', /users$/);
  });
};

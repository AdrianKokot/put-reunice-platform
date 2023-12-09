import { E2EUser } from '../support/commands';
import { Dialog, Form, Resource } from '../support/pages/common.constants';
import { AdminUniversityPage } from '../support/pages/university.constants';
import {
  clickOnTile,
  goToConsole,
  TILES,
  waitForResponse,
} from '../support/app';

const testTimestamp = Date.now();

describe('Main Administrator', () => {
  beforeEach(() => {
    cy.login(E2EUser.MAIN_ADMIN);
  });

  it('UC-A10. Create university', () => {
    goToConsole();
    clickOnTile(TILES.Universities);

    cy.intercept('POST', '/api/universities').as('createUniversity');
    Resource.new();
    AdminUniversityPage.fillForm({
      name: `TestUniversity_${testTimestamp}`,
      shortName: `TU_${testTimestamp}`,
    });
    Form.submit();
    Dialog.confirm();

    waitForResponse('@createUniversity', 201);

    cy.url().should('match', /universities\/\d+/);
  });

  it('UC-A12. Delete university', () => {
    cy.intercept('GET', '/api/universities?*').as('getUniversities');

    goToConsole();
    clickOnTile(TILES.Universities);

    waitForResponse('@getUniversities', 200);

    cy.get(Resource.input.search).type(`TestUniversity_${testTimestamp}`);

    waitForResponse('@getUniversities', 200);

    Resource.details();

    cy.intercept('DELETE', '/api/universities/*').as('deleteUniversity');
    Resource.delete();

    waitForResponse('@deleteUniversity', 204);
  });
});

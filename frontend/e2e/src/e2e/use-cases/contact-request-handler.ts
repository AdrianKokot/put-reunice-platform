import { TicketPage } from '../../support/pages/ticket.constants';
import { Resource, TILES, goToConsole, goToTile } from '../../support';

export const uccrh1 = (testTimestamp: string) => {
  it('UC-CRH1. View contact request', () => {
    goToConsole();
    goToTile(TILES.Tickets);

    Resource.search(`${testTimestamp} - Resolve`);
    Resource.details();

    cy.get(TicketPage.title).should(
      'contain.text',
      `${testTimestamp} - Resolve`,
    );
  });
};

export const uccrh2 = (testTimestamp: string) => {
  it('UC-CRH2. Respond to contact request', () => {
    goToConsole();
    goToTile(TILES.Tickets);

    Resource.search(`${testTimestamp} - Resolve`);
    Resource.details();

    cy.get(TicketPage.title).should(
      'contain.text',
      `${testTimestamp} - Resolve`,
    );

    cy.get(TicketPage.inputs.content).clear();
    cy.get(TicketPage.inputs.content).type('This ticket will be resolved.');

    cy.get(TicketPage.inputs.resolve).click();

    cy.get(TicketPage.status).should('contain.text', 'Resolved');
  });
};

export const uccrh3 = (testTimestamp: string) => {
  it('UC-CRH3. Marking request as irrelevant', () => {
    goToConsole();
    goToTile(TILES.Tickets);

    Resource.search(`${testTimestamp} - Irrelevant`);
    Resource.details();

    cy.get(TicketPage.title).should(
      'contain.text',
      `${testTimestamp} - Irrelevant`,
    );

    cy.get(TicketPage.inputs.irrelevant).click();
    cy.get(TicketPage.status).should('contain.text', 'Irrelevant');

    cy.get(TicketPage.inputs.delete).click();
    cy.get(TicketPage.status).should('contain.text', 'Deleted');
  });
};

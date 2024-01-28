import { waitForResponse } from '../app';

export const Form = {
  submit: () => cy.get('button[type="submit"]').click(),
} as const;

export const Dialog = {
  buttons: {
    confirm: 'tui-dialog-host .t-buttons button:last-of-type',
  },
  confirm() {
    cy.get(Dialog.buttons.confirm).last().click();
  },
};
export const Resource = {
  buttons: {
    delete: '[data-test="delete-button"]',
    new: '[data-test="new-button"]',
    details: '[data-test="details-button"]',
    edit: '[data-test="edit-button"]',
  },
  input: {
    search: 'input[name="search"]',
  },
  delete() {
    cy.get(Resource.buttons.delete).click();
    Dialog.confirm();
  },
  new() {
    cy.get(Resource.buttons.new).click();
    cy.url().should('contain', '/new');
  },
  edit(nestedSelector = '') {
    if (nestedSelector.length > 0) {
      cy.get(nestedSelector).find(Resource.buttons.edit).first().click();
    } else {
      cy.get(Resource.buttons.edit).first().click();
    }
    cy.url().should('contain', '/edit');
  },
  details(nestedSelector = '') {
    if (nestedSelector.length > 0) {
      cy.get(nestedSelector).find(Resource.buttons.details).first().click();
    } else {
      cy.get(Resource.buttons.details).first().click();
    }
    cy.url().should('match', /\/(\d+|.+-.+)$/);
  },
  search(value: string) {
    const searchAlias = `search_${Date.now()}`;
    cy.intercept('GET', `/api/*?*${value.replaceAll(' ', '%20')}*`).as(
      searchAlias,
    );
    cy.get(Resource.input.search).type(value);
    waitForResponse(`@${searchAlias}`, 500);
  },
} as const;

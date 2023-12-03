export const Form = {
  submit: () => cy.get('button[type="submit"]').click(),
} as const;

export const Dialog = {
  buttons: {
    confirm: 'tui-dialog-host .t-buttons button:last-of-type',
  },
  confirm() {
    cy.get(Dialog.buttons.confirm).click();
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
  edit() {
    cy.get(Resource.buttons.edit).first().click();
    cy.url().should('contain', '/edit');
  },
  details() {
    cy.get(Resource.buttons.details).first().click();
    cy.url().should('match', /\/\d+$/);
  },
} as const;

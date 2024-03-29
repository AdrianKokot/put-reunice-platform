import { Page } from '@eunice/modules/shared/data-access';
import { waitForResponse } from '../app';

type PageForm = Pick<Page, 'title' | 'description' | 'content'>;

export const PublicPage = {
  fillContactForm: (subject: string, email: string, message: string) => {
    cy.get('eunice-page-contact-form input[name="title"]').type(subject);
    cy.get('eunice-page-contact-form input[name="email"]').type(email);
    cy.get('eunice-page-contact-form textarea').type(message);

    cy.intercept('POST', '/api/tickets').as('createContactRequest');
    cy.get('eunice-page-contact-form form').submit();
    waitForResponse('@createContactRequest', 200);
  },
};

export const PagePage = {
  inputs: {
    title: 'input[name="title"]',
    description: 'textarea',

    visibility: '[data-test="visibility-select"]',
    visibilityOptions: {
      container: '[data-test="visibility-select-options"]',
      visible: '[data-test="visibility-visible"]',
      hidden: '[data-test="visibility-hidden"]',
    },

    content: 'tui-editor [contenteditable="true"]',

    contactRequestHandlers: '[data-test="contact-request-handlers-select"]',
    contactRequestHandlersOptions: {
      container: '[data-test="contact-request-handlers-select-options"]',
    },

    resources: '[data-test="resources-select"]',
    resourcesOptions: {
      container: '[data-test="resources-select-options"]',
    },
  },
  tabs: {
    responsibility() {
      cy.get('[data-test="responsibility-tab"]').click();
    },
  },
  defaultFormValue: {
    title: 'TestPage',
    description: 'Test Page Description',
    content: '',
  },
  fillForm: (page: Partial<PageForm>) => {
    const form: PageForm = {
      ...PagePage.defaultFormValue,
      ...page,
    };
    if (form.title.length > 0) {
      cy.get(PagePage.inputs.title).clear();
      cy.get(PagePage.inputs.title).type(form.title);
    }
    if (form.description.length > 0) {
      cy.get(PagePage.inputs.description).clear();
      cy.get(PagePage.inputs.description).type(form.description);
    }
    if (form.content.length > 0) {
      cy.get(PagePage.inputs.content).clear();
      cy.get(PagePage.inputs.content).type(form.content);
    }
  },
  setVisibility(visibility: 'visible' | 'hidden') {
    cy.get(PagePage.inputs.visibility).click();
    cy.get(PagePage.inputs.visibilityOptions.container)
      .should('be.visible')
      .find(PagePage.inputs.visibilityOptions[visibility])
      .should('be.visible')
      .find('tui-select-option')
      .then((btn) => btn.click());
  },
  selectCRH(search: string) {
    const searchAlias = `search_${Date.now()}`;
    cy.intercept('GET', `/api/*?*${search.replaceAll(' ', '%20')}*`).as(
      searchAlias,
    );
    cy.get(PagePage.inputs.contactRequestHandlers)
      .should('be.visible')
      .type(search);
    waitForResponse(`@${searchAlias}`, 200);
    cy.get(PagePage.inputs.contactRequestHandlersOptions.container)
      .should('be.visible')
      .find('tui-multi-select-option')
      .first()
      .then((btn) => btn.click());
  },
  selectResource(search: string) {
    const searchAlias = `search_${Date.now()}`;
    cy.intercept('GET', `/api/*?*${search.replaceAll(' ', '%20')}*`).as(
      searchAlias,
    );
    cy.get(PagePage.inputs.resources).should('be.visible').type(search);
    waitForResponse(`@${searchAlias}`, 200);
    cy.get(PagePage.inputs.resourcesOptions.container)
      .should('be.visible')
      .find('tui-multi-select-option')
      .first()
      .then((btn) => btn.click());
  },
} as const;

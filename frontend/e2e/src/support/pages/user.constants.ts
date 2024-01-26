import { User } from '@eunice/modules/shared/data-access';
import { waitForResponse } from '../app';

type UserForm = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'username' | 'password'
>;

export const UserPage = {
  inputs: {
    firstName: 'input[name="firstName"]',
    lastName: 'input[name="lastName"]',
    email: 'input[name="email"]',
    phoneNumber: 'input[name="phoneNumber"]',
    username: 'input[name="username"]',
    password: 'input[name="password"]',
    role: '[data-test="role-select"]',
    roleOptions: {
      container: '[data-test="role-select-options"]',
      user: '[data-test="role-user"]',
      moderator: '[data-test="role-moderator"]',
      admin: '[data-test="role-admin"]',
    },
    state: '[data-test="state-select"]',
    stateOptions: {
      container: '[data-test="state-select-options"]',
      enabled: '[data-test="state-enabled"]',
      disabled: '[data-test="state-disabled"]',
    },
    universtiy: '[data-test="university-select"]',
    universityOptions: {
      container: '[data-test="university-select-options"]',
    },
  },
  defaultFormValue: {
    firstName: 'Firstname',
    lastName: 'Lastname',
    email: 'firstnamelastname@domain.com',
    phoneNumber: '123456789',
    username: 'username',
    password: 'P@ssw0rd333',
  },
  tabs: {
    responsibility() {
      cy.get('[data-test="responsibility-tab"]').click();
    },
    pages() {
      cy.get('[data-test="pages-tab"]').click();
    },
  },
  fillForm: (user: Partial<UserForm>) => {
    const form: UserForm = {
      ...UserPage.defaultFormValue,
      ...user,
    };

    if (form.firstName.length > 0) {
      cy.get(UserPage.inputs.firstName).clear();
      cy.get(UserPage.inputs.firstName).type(form.firstName);
    }
    if (form.lastName.length > 0) {
      cy.get(UserPage.inputs.lastName).clear();
      cy.get(UserPage.inputs.lastName).type(form.lastName);
    }
    if (form.email.length > 0) {
      cy.get(UserPage.inputs.email).clear();
      cy.get(UserPage.inputs.email).type(form.email);
    }
    if (form.phoneNumber.length > 0) {
      cy.get(UserPage.inputs.phoneNumber).clear();
      cy.get(UserPage.inputs.phoneNumber).type(form.phoneNumber);
    }
    if (form.username.length > 0) {
      cy.get(UserPage.inputs.username).clear();
      cy.get(UserPage.inputs.username).type(form.username);
    }
    if (form.password.length > 0) {
      cy.get(UserPage.inputs.password).clear();
      cy.get(UserPage.inputs.password).type(form.password);
    }
  },
  setRole(role: 'user' | 'moderator' | 'admin') {
    cy.get(UserPage.inputs.role).click();
    cy.get(UserPage.inputs.roleOptions.container)
      .should('be.visible')
      .find(UserPage.inputs.roleOptions[role])
      .should('be.visible')
      .find('tui-select-option')
      .then((btn) => btn.click());
  },
  setUniversity(search: string) {
    const searchAlias = `search_${Date.now()}`;
    cy.intercept('GET', `/api/*?*${search.replaceAll(' ', '%20')}*`).as(
      searchAlias,
    );
    cy.get(UserPage.inputs.universtiy).should('be.visible').type(search);
    waitForResponse(`@${searchAlias}`, 200);
    cy.get(UserPage.inputs.universityOptions.container)
      .should('be.visible')
      .find('tui-select-option')
      .first()
      .then((btn) => btn.click());
  },
  setState(state: 'enabled' | 'disabled') {
    cy.get(UserPage.inputs.state).click();
    cy.get(UserPage.inputs.stateOptions.container)
      .should('be.visible')
      .find(UserPage.inputs.stateOptions[state])
      .should('be.visible')
      .find('tui-select-option')
      .then((btn) => btn.click());
  },
} as const;

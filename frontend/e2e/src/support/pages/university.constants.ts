import { University } from '@eunice/modules/shared/data-access';

type UniversityForm = Pick<
  University,
  'name' | 'shortName' | 'description' | 'address' | 'website'
>;

export const UniversityPage = {
  inputs: {
    name: 'input[name="name"]',
    shortName: 'input[name="shortName"]',
    description: 'textarea',
    address: 'input[name="address"]',
    website: 'input[name="website"]',
    visibility: '[data-test="visibility-select"]',
    visibilityOptions: {
      container: '[data-test="visibility-options"]',
      visible: '[data-test="visibility-visible"]',
      hidden: '[data-test="visibility-hidden"]',
    },
  },
  buttons: {
    createUser() {
      return cy.get('[data-test="create-university-user-button"]');
    },
  },
  defaultFormValue: {
    name: 'TestUniversity',
    shortName: 'TU',
    description: 'Test University Description',
    address: '',
    website: '',
  },
  fillForm: (university: Partial<UniversityForm>) => {
    const form: UniversityForm = {
      ...UniversityPage.defaultFormValue,
      ...university,
    };
    if (form.name.length > 0) {
      cy.get(UniversityPage.inputs.name).clear();
      cy.get(UniversityPage.inputs.name).type(form.name);
    }
    if (form.shortName.length > 0) {
      cy.get(UniversityPage.inputs.shortName).clear();
      cy.get(UniversityPage.inputs.shortName).type(form.shortName);
    }
    if (form.description.length > 0) {
      cy.get(UniversityPage.inputs.description).clear();
      cy.get(UniversityPage.inputs.description).type(form.description);
    }
    if (form.address.length > 0) {
      cy.get(UniversityPage.inputs.address).clear();
      cy.get(UniversityPage.inputs.address).type(form.address);
    }
    if (form.website.length > 0) {
      cy.get(UniversityPage.inputs.website).clear();
      cy.get(UniversityPage.inputs.website).type(form.website);
    }
  },
  setVisibility(visibility: 'visible' | 'hidden') {
    cy.get(UniversityPage.inputs.visibility).click();
    cy.get(UniversityPage.inputs.visibilityOptions.container)
      .should('be.visible')
      .find(UniversityPage.inputs.visibilityOptions[visibility])
      .should('be.visible')
      .find('tui-select-option')
      .then((btn) => btn.click());
  },
} as const;

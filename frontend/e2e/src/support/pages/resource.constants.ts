import { Resource } from '@eunice/modules/shared/data-access';

type ResourceForm = Pick<Resource, 'name' | 'description'> & { url: string };

export const ResourcePage = {
  inputs: {
    name: 'input[name="name"]',
    description: 'textarea',

    resourceType: '[data-test="resourceType-select"]',
    resourceTypeOptions: {
      container: '[data-test="resourceType-options"]',
      link: '[data-test="resourceType-link"]',
      file: '[data-test="resourceType-file"]',
    },

    url: 'input[name="url"]',
    file: 'tui-input-files input[type="file"]',
  },
  defaultFormValue: {
    name: 'TestResource',
    description: 'Test Resource Description',
    url: '',
  },
  fillForm: (partialForm: Partial<ResourceForm>) => {
    const form: ResourceForm = {
      ...ResourcePage.defaultFormValue,
      ...partialForm,
    };

    if (form.name.length > 0) {
      cy.get(ResourcePage.inputs.name).clear();
      cy.get(ResourcePage.inputs.name).type(form.name);
    }
    if (form.description.length > 0) {
      cy.get(ResourcePage.inputs.description).clear();
      cy.get(ResourcePage.inputs.description).type(form.description);
    }
    if (form.url.length > 0) {
      cy.get(ResourcePage.inputs.url).clear();
      cy.get(ResourcePage.inputs.url).type(form.url);
    }
  },
  setResourceType(type: 'link' | 'file') {
    cy.get(ResourcePage.inputs.resourceType).click();
    cy.get(ResourcePage.inputs.resourceTypeOptions.container)
      .should('be.visible')
      .find(ResourcePage.inputs.resourceTypeOptions[type])
      .should('be.visible')
      .find('tui-select-option')
      .then((btn) => btn.click());
  },
  setFile() {
    cy.get(ResourcePage.inputs.file).selectFile('src/fixtures/file.txt');
  },
} as const;

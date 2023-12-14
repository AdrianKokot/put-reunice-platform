import { University } from '@reunice/modules/shared/data-access';

type UniversityForm = Pick<
  University,
  'name' | 'shortName' | 'description' | 'address' | 'website'
>;

export const AdminUniversityPage = {
  inputs: {
    name: 'input[name="name"]',
    shortName: 'input[name="shortName"]',
    description: 'textarea',
    address: 'input[name="address"]',
    website: 'input[name="website"]',
  },
  defaultFormValue: {
    name: 'TestUniversity',
    shortName: 'TU',
    description: 'Test University Description',
    address: 'Test University Address',
    website: '',
  },
  fillForm: (university: Partial<UniversityForm>) => {
    const form: UniversityForm = {
      ...AdminUniversityPage.defaultFormValue,
      ...university,
    };
    cy.get(AdminUniversityPage.inputs.name).type(form.name);
    cy.get(AdminUniversityPage.inputs.shortName).type(form.shortName);
    cy.get(AdminUniversityPage.inputs.description).type(form.description);
    cy.get(AdminUniversityPage.inputs.address).type(form.address);
  },
} as const;

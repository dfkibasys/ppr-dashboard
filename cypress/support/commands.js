// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
Cypress.Commands.add('interceptProcessDefinition', () => {
  cy.intercept(
    'GET',
    '/engine-rest/process-definition/ReviewInvoice:1:9414c509-7ad3-11ec-8d34-0242ac170002',
    {
      fixture: 'processDefinitionReviewInvoice.json',
    }
  );
  cy.intercept(
    'GET',
    '/engine-rest/history/process-instance?processDefinitionId=ReviewInvoice:1:9414c509-7ad3-11ec-8d34-0242ac170002&unfinished=true',
    {
      fixture: 'processInstanceReviewInvoice.json',
    }
  );
  cy.intercept(
    'GET',
    '/engine-rest/history/activity-instance?processDefinitionId=ReviewInvoice:1:9414c509-7ad3-11ec-8d34-0242ac170002&sortBy=startTime&sortOrder=asc',
    {
      fixture: 'activityInstanceReviewInvoice.json',
    }
  );
  cy.intercept(
    'GET',
    '/engine-rest/history/activity-instance?processDefinitionId=ReviewInvoice:1:9414c509-7ad3-11ec-8d34-0242ac170002&unfinished=true',
    {
      fixture: 'activityInstanceReviewInvoiceUnfinished2.json',
    }
  );
  cy.intercept('GET', '/engine-rest/process-definition?key=ReviewInvoice', {
    fixture: 'processDefinitionKeyReviewInvoice.json',
  });
  cy.intercept(
    'GET',
    '/engine-rest/process-definition/ReviewInvoice:1:9414c509-7ad3-11ec-8d34-0242ac170002/xml',
    {
      fixture: 'reviewInvoiceXML.json',
    }
  );
  cy.intercept(
    'GET',
    '/engine-rest/process-instance/count?processDefinitionId=ReviewInvoice:1:9414c509-7ad3-11ec-8d34-0242ac170002',
    { count: 2 }
  );
  cy.intercept(
    'GET',
    '/engine-rest/history/incident?processDefinitionId=ReviewInvoice:1:9414c509-7ad3-11ec-8d34-0242ac170002&open=true',
    []
  );

  cy.intercept(
    'DELETE',
    '/engine-rest/process-instance/95418540-7ad3-11ec-8d34-0242ac170002',
    (req) => {
      req.reply({
        statusCode: 204,
      });
    }
  );
  cy.intercept(
    'POST',
    '/engine-rest/process-definition/ReviewInvoice:1:9414c509-7ad3-11ec-8d34-0242ac170002/start',
    (req) => {
      req.reply({
        statusCode: 200,
        body: {
          links: [
            {
              method: 'GET',
              href: 'http://basys-lnv-1.mrk40.dfki.lan:9080/engine-rest/process-instance/819a0b85-a547-11ec-bb2e-0242ac170002',
              rel: 'self',
            },
          ],
          id: '819a0b85-a547-11ec-bb2e-0242ac170002',
          definitionId: 'ReviewInvoice:1:9414c509-7ad3-11ec-8d34-0242ac170002',
          businessKey: 'randomTestKey',
          caseInstanceId: null,
          ended: false,
          suspended: false,
          tenantId: null,
        },
      });
    }
  );
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

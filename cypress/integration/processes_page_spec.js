describe('The processes page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/engine-rest/process-definition?latestVersion=true', {
      fixture: 'processDefinition.json',
    }).as('processDefinition');

    cy.intercept('GET', '/engine-rest/process-definition/count*', { count: 1 });
    cy.intercept('GET', '/engine-rest/decision-definition/count', { count: 2 });
    cy.intercept('GET', '/engine-rest/case-definition/count*', { count: 3 });
    cy.intercept('GET', '/engine-rest/deployment/count*', { count: 4 });
    cy.intercept('GET', '/engine-rest/process-instance/count?processDefinitionKey=Process_0b', {
      count: 5,
    });
    cy.intercept('GET', '/engine-rest/process-instance/count?processDefinitionKey=ReviewInvoice', {
      count: 6,
    });
    cy.intercept('GET', '/engine-rest/process-instance/count?processDefinitionKey=TestDrone', {
      count: 7,
    });
    cy.intercept('GET', '/engine-rest/process-instance/count?processDefinitionKey=invoice', {
      count: 8,
    });
  });

  it('loads content', () => {
    cy.visit('/#/processes');

    // Url correctly updated
    cy.url().should('include', '/processes');

    // Heading display correct amount of definitions
    cy.contains('Process Definition').siblings('h3').should('contain', 1);
    cy.contains('Decision Definitions').siblings('h3').should('contain', 2);
    cy.contains('Case Definitions').siblings('h3').should('contain', 3);
    cy.contains('Deployments').siblings('h3').should('contain', 4);

    // Table displays correct amount of instances
    cy.contains('Process_0b').siblings('td').first().should('contain', 5);
    cy.contains('ReviewInvoice').siblings('td').first().should('contain', 6);
    cy.contains('TestDrone').siblings('td').first().should('contain', 7);
    cy.contains('invoice').siblings('td').first().should('contain', 8);
  });

  it('allows pluralization based on count', () => {
    // override intercepts from beforeEach hook
    cy.intercept('GET', '/engine-rest/process-definition/count*', { count: 2 });
    cy.intercept('GET', '/engine-rest/deployment/count*', { count: 1 });

    cy.visit('/#/processes');

    // Definition changed to Definitions
    cy.contains('Process Definitions').siblings('h3').should('contain', 2);
    // Deployments changed to Deployment
    cy.contains('Deployment').siblings('h3').should('contain', 1);
  });
});

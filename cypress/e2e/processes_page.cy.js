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

  it('loads process definition', () => {
    cy.interceptProcessDefinition();

    cy.contains('ReviewInvoice').click();
    cy.url().should('include', '/processes/ReviewInvoice:1:9414c509-7ad3-11ec-8d34-0242ac170002');

    // leftDetails should be loaded
    cy.contains('Definition ID')
      .siblings('p')
      .should('contain', 'ReviewInvoice:1:9414c509-7ad3-11ec-8d34-0242ac170002');
    cy.contains('Deployment ID')
      .siblings('p')
      .should('contain', '94024e73-7ad3-11ec-8d34-0242ac170002');
    cy.contains('Instances Running').siblings('p').should('contain', '2');

    // XML Badge should contain correct amount
    cy.get('[data-container-id="assignReviewer"]').should('contain', '2');

    // Process instances table should be loaded
    cy.get('.tab-pane.active').should('contain', 'randomKey');

    // Audit log table should be loaded
    cy.contains('Audit Log').click();
    cy.get('.tab-pane.active').should('contain', 'assignReviewer');

    // Go back to previous tab
    cy.contains('Process Instances').click();
  });

  it('allows process instance deletion', () => {
    cy.interceptProcessDefinition();

    cy.get('.tab-pane.active').contains('Delete').click();

    // Override server response (containing 1 unfinished instance)
    cy.intercept(
      'GET',
      '/engine-rest/history/activity-instance?processDefinitionId=ReviewInvoice:1:9414c509-7ad3-11ec-8d34-0242ac170002&unfinished=true',
      {
        fixture: 'activityInstanceReviewInvoiceUnfinished1.json',
      }
    ).as('getActivityHistory');

    // XML Badge should contain correct amount
    cy.wait('@getActivityHistory')
      .get('[data-container-id="assignReviewer"]')
      .should('contain', '1');

    // Left details should containt correct amount
    cy.contains('Instances Running').siblings('p').should('contain', '1');
  });

  it('allows process instance creation', () => {
    cy.interceptProcessDefinition();

    cy.get('button').contains('Create').click();

    cy.get('#businessKeyInput').type('randomKey');

    cy.get('.modal-footer').contains('Create').click();

    // TODO: Technically it just reloads the previously deleted instance
    // Left details should containt correct amount
    cy.contains('Instances Running').siblings('p').should('contain', '2');

    // XML Badge should contain correct amount
    cy.get('[data-container-id="assignReviewer"]').should('contain', '2');
  });

  it('warns before deleting a deployment with running instances', () => {
    cy.interceptProcessDefinition();

    cy.contains('Instances Running').siblings('p').should('contain', '2');

    // Try to delete deployment
    cy.get('.leftDetails').contains('Delete').click();

    // Modal should appear
    cy.get('#modal-warning').should('contain', 'Are you sure?');

    // Cancel deletion
    cy.get('#modal-warning').contains('Cancel').click();
  });

  it('allows deleting a deployment without running instances directly', () => {
    cy.interceptProcessDefinition();

    cy.contains('Instances Running').siblings('p').should('contain', '2');

    // Delete two existing process instances first
    cy.get('.tab-pane.active').contains('Delete').click();
    cy.wait('@deleteInstance1').get('.tab-pane.active').contains('Delete').click();
    cy.wait('@deleteInstance2');

    cy.contains('Instances Running').siblings('p').should('contain', '0');

    // Delete deployment without warning
    cy.get('.leftDetails').contains('Delete').click();

    // Should be navigating back to overview page
    cy.wait('@deleteDeployment').url().should('include', '/processes');
    cy.get('.container').should('contain', 'Deployed');
  });
});

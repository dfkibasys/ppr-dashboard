describe('The assets page', () => {
  beforeEach(() => {
    // stub ID submodels requests
    cy.intercept('GET', '/shells/*/aas/submodels/Identification/submodel', {
      fixture: 'id-submodel-1.json',
    }).as('getIdSubmodel');

    // stub registry request
    cy.fixture('registry.json').then((data) => {
      cy.intercept('POST', '/registry/shell-descriptors/search', (req) => {
        const body = req.body;

        // check if search was triggered
        const resStatusCode =
          body.query.value === '[a-zA-Z0-9_]*ax[a-zA-Z0-9_]*'
            ? data['searchAX'].statusCode
            : data['page' + body.page.index + body.sortBy.direction].statusCode;

        const resBody =
          body.query.value === '[a-zA-Z0-9_]*ax[a-zA-Z0-9_]*'
            ? data['searchAX'].body
            : data['page' + body.page.index + body.sortBy.direction].body;

        req.reply({
          statusCode: resStatusCode,
          body: resBody,
        });
      }).as('getAssets');
    });

    cy.visit('/');
    cy.wait(['@getAssets', '@getIdSubmodel']);
  });

  it('loads', () => {
    // Url correctly updated
    cy.url().should('include', '/assets');

    // Sorting field exists
    cy.get('.dropdown-item.active').should('contain', 'Ascending ID Short');

    // Search field exists
    cy.get('.form-control').invoke('attr', 'placeholder').should('contain', 'Search');
  });

  it('loads assets', () => {
    // Correct amount of loaded assets
    cy.get('.cardContainer').children().should('have.length', 8);

    // Check content of single card
    let firstCard = cy.get('.card').first();

    // (Alphabetically) first ID short gets rendered
    firstCard.get('.card-title').should('contain', 'aio_1_aas');

    // Type gets rendered
    firstCard.get('.properties').should('contain', 'AIO ROBOTGUIDANCE');

    // Producer name gets rendered
    firstCard.get('.properties').should('contain', 'EngRoTec Solutions');

    // Serial number gets rendered
    firstCard.get('.properties').should('contain', 'sn123');
  });

  it('loads more items when scrolling down', () => {
    // Scroll down to trigger reload
    cy.get('#scroll-container').scrollTo('bottom');
    cy.wait('@getAssets').its('request.body.page.index').should('eq', 1);

    // Scroll down to trigger reload
    cy.get('#scroll-container').scrollTo('bottom');
    cy.wait('@getAssets').its('request.body.page.index').should('eq', 2);

    // Last card should contain (alphabetically) last asset
    let lastCard = cy.get('.card').last();
    lastCard.get('.card-title').should('contain', 'yumi_2_aas');

    // Load button should be hidden after last page
    cy.get('button').contains('Load more').should('not.exist');
  });

  it('loads more items when pressing load button', () => {
    // Click load button without triggering load-on-scroll
    cy.get('button').contains('Load more').click({ scrollBehavior: false, force: true });
    cy.wait('@getAssets').its('request.body.page.index').should('eq', 1);

    // Click load button without triggering load-on-scroll
    cy.get('button').contains('Load more').click({ scrollBehavior: false, force: true });
    cy.wait('@getAssets').its('request.body.page.index').should('eq', 2);

    // Last card should contain (alphabetically) last asset
    let lastCard = cy.get('.card').last();
    lastCard.get('.card-title').should('contain', 'yumi_2_aas');

    // Load button should be hidden after last page
    cy.get('button').contains('Load more').should('not.exist');
  });

  it('loads descending order when using sort field', () => {
    // Select descending order from dropdown
    cy.get('.btn.dropdown-toggle').click();
    cy.get('.dropdown-item').contains('Descending ID Short').click();
    cy.wait(['@getAssets', '@getIdSubmodel']);

    // First card should contain (alphabetically) last asset
    let firstCard = cy.get('.card').first();
    firstCard.get('.card-title').should('contain', 'yumi_2_aas');
  });

  it('searches for assets', () => {
    // Search for 'Baxter' assets
    cy.get('.form-control').type('ax');
    cy.wait(['@getAssets', '@getIdSubmodel']);

    // Correct amount of loaded assets
    cy.get('.cardContainer').children().should('have.length', 2);
  });

  it('logs out and logs in admin', () => {
    // logout
    cy.get('.nav-link.dropdown-toggle').click();
    cy.get('.dropdown-item').contains('Logout').click();

    // login
    cy.get('button').contains('Login').click();
    cy.get('#input-username').type('admin');
    cy.get('#input-password').type('admin');
    cy.get('button.btn-primary').contains('Login').click();

    // admin is logged in
    cy.get('.nav-link.dropdown-toggle').should('contain', 'admin');
  });
});

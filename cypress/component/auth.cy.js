describe('Sistema de Autenticación', () => {
  beforeEach(() => {
    // Antes de cada test, visitamos la página principal
    cy.visit('/');
  });

  it('debe redirigir a /login desde /', () => {
    // Comprobamos que la URL actual sea /login
    cy.url().should('include', '/login');
  });

  it('debe redirigir a / al ingresar credenciales correctas', () => {
    // Interceptamos la navegación para evitar el "Detached Callback" error
    cy.intercept('/').as('home');

    // Ingresamos el nombre de usuario y la contraseña correctos
    cy.get('input[placeholder="Username"]').type('admin');
    cy.get('input[placeholder="Password"]').type('admin');
    cy.get('button[type="submit"]').click();

    // Esperamos a que la navegación a / se complete
    cy.wait('@home').then(() => {
      // Comprobamos que la URL actual sea /
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    // Opcional: Podemos añadir una comprobación de que el usuario está logueado
    // Por ejemplo, verificando la presencia de un elemento específico en la página principal
    cy.contains('Dashboard').should('be.visible'); // Asumiendo que tienes un texto "Dashboard" en tu página principal
  });

  it('debe permanecer en /login al ingresar credenciales incorrectas y mostrar un error', () => {
    // Ingresamos credenciales incorrectas
    cy.get('input[placeholder="Username"]').type('usuario_incorrecto');
    cy.get('input[placeholder="Password"]').type('contraseña_incorrecta');
    cy.get('button[type="submit"]').click();

    // Comprobamos que la URL actual siga siendo /login
    cy.url().should('include', '/login');

    // Comprobamos que se muestre el mensaje de error (adaptar el selector si es necesario)
    cy.get('div[role="alert"]').should('contain', 'Credenciales inválidas'); // Asumiendo que el mensaje de error está en un div con role "alert"
  });
});
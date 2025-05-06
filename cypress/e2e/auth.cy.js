import translations from '../../src/styles/translations'; 

describe('Sistema de Autenticación', () => {
  console.log('Objeto de traducciones:', translations);
  console.log('Objeto translations.en:', translations.en);
  console.log('Valor de translations.en.login:', translations.en ? translations.en.login : 'translations.en es undefined');
  beforeEach(() => {
    cy.visit('/login');
  });

  it('debe estar en la página de /login y mostrar el título', () => {
    cy.url().should('eq', 'http://localhost:5173/login');
    
    console.log('Objeto de traducciones:', translations);
    console.log('Objeto translations.en:', translations.en);
    console.log('Valor de translations.en.login:', translations.en ? translations.en.login : 'translations.en es undefined');
    cy.get('h2').should('contain.text', translations.en.login);
  });
  it('debe redirigir a / al ingresar credenciales correctas', () => {
    cy.intercept('/').as('home');

    // Utilizamos las traducciones para los placeholders (aunque los seleccionamos por tipo)
    cy.get('input[type="text"]').type('admin');
    cy.get('input[type="password"]').type('admin');
    cy.get('button[type="submit"]').contains(translations.en.signIn).click();

    // Espera a que un elemento único de la página principal (Dashboard) 
    cy.contains(translations.en.dashboard, { timeout: 8000 }).should('be.visible');
    cy.url().should('eq', 'http://localhost:5173/');
  });

  it('debe permanecer en /login al ingresar credenciales incorrectas y mostrar un error', () => {
    cy.get('input[type="text"]').type('usuario_incorrecto');
    cy.get('input[type="password"]').type('contraseña_incorrecta');
    cy.get('button[type="submit"]').contains(translations.en.signIn).click();

    cy.url().should('eq', 'http://localhost:5173/login');

    cy.get('div').contains(translations.en.invalidCredentials).should('be.visible');
  });
});
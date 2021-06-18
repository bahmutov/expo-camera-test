/// <reference types="cypress" />

describe('Expo camera', () => {
  it('shows blocked permission message', () => {
    let camera

    cy.visit('/', {
      onBeforeLoad(win) {
        Object.defineProperty(win, '__Camera', {
          set(c) {
            console.log('got camera object')
            camera = c
            // let's block the camera when it asks
            // https://on.cypress.io/stub
            cy.stub(camera, 'requestPermissionsAsync')
              .resolves('blocked')
              // give the stub an alias so the test can confirm
              // the method was called
              .as('requestPermissionsAsync')
          },
          get() {
            return camera
          },
        })
      },
    })
    cy.get('@requestPermissionsAsync').should('have.been.calledOnce')
    // the application should display the message
    cy.get('[data-testid=camera-blocked]').should('be.visible')
  })

  it('shows info message while getting the permission', () => {
    let camera

    cy.visit('/', {
      onBeforeLoad(win) {
        Object.defineProperty(win, '__Camera', {
          set(c) {
            console.log('got camera object')
            camera = c
            // let's deny camera permission after a delay
            // using Bluebird bundled under Cypress.Promise
            // https://on.cypress.io/promise
            cy.stub(camera, 'requestPermissionsAsync')
              .resolves(Cypress.Promise.resolve('blocked').delay(1000))
              // give the stub an alias so the test can confirm
              // the method was called
              .as('requestPermissionsAsync')
          },
          get() {
            return camera
          },
        })
      },
    })
    // first the app shows the "could not get permission"
    cy.get('[data-testid=no-camera-permission]').should('be.visible')
    // then switches to blocked message
    cy.get('[data-testid=camera-blocked]').should('be.visible')
    // and the initial message goes away
    cy.get('[data-testid=no-camera-permission]').should('not.exist')

    // for completeness, confirm our stub was used
    cy.get('@requestPermissionsAsync').should('have.been.calledOnce')
  })
})

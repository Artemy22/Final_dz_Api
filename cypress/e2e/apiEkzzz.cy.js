///<reference types="cypress"/>

import { faker } from "@faker-js/faker"

let contentType = 'application/json; charset=utf-8'
let email = faker.internet.email()
let name = faker.internet.userName()





describe('Api final dz', () => {

  it('Task 1. Get all posts. Verify HTTP response status code and content type.', () => {
    cy.request('GET', '/posts')
      .then(response => {
        expect(response.headers['content-type']).to.have.string(contentType)
        expect(response.isOkStatusCode).to.be.true
      })
  })

  it('Task 2. Get only first 10 posts. Verify HTTP response status code. Verify that only first posts are returned', () => {
    cy.request('GET', 'posts?_limit=10')
      .then(response => {
        expect((response.body).length).to.equal(10)
        expect(response.body[0].title).to.have.string('json-server 1')
        expect(response.body[9].title).to.have.string('json-server 10')
      })
  })

  it('Task 3. Get posts with id = 5 and id = 11. Verify HTTP response status code. Verify id values of returned records', () => {
    cy.request('GET', 'posts?id=5&id=11')
      .then(response => {
        expect(response.status).to.be.equal(200)
        expect(response.body[0].id).to.eq(5)
        expect(response.body[1].id).to.eq(11)
      })
  })

  it('Task 4. Create a post. Verify HTTP response status code 401', () => {
    cy.request({
      method: 'POST',
      url: '664/posts',
      failOnStatusCode: false
    })
      .then(response => {
        expect(response.status).to.be.equal(401)
      })
  })

  it('Task 5. Create post with adding access token in header. Verify HTTP response status code. Verify post is created1', () => {
    cy.request({
      method: 'POST',
      url: 'register',
      body: {
        "email": email,
        "password": "bestPassw0rd"
      }
    }).then(response => {
      cy.request({
        method: 'POST',
        url: '664/posts',
        headers: {
          "Authorization": `Bearer ${response.body.accessToken}`
        }
      })
        .then(response => {
          expect(response.status).to.be.equal(201)
          expect(response.body.id).to.be.exist
        })
    })
  })

  it('Task 6. Create post entity and verify that the entity is created. Verify HTTP response status code. Use JSON in body', () => {
    cy.request({
      method: 'POST',
      url: 'register',
      body: {
        "email": `${email}x`,
        "password": "bestPassw0rd"
      }
    }).then(response => {
      cy.request({
        method: 'POST',
        url: '664/posts',
        headers: {
          "Authorization": `Bearer ${response.body.accessToken}`
        },
        body: {
          "qa": "art"
        }
      })
        .then(response => {
          expect(response.status).to.be.equal(201)
          expect(response.body.qa).to.be.equal('art')
        })
    })
  })

  it('Task 7. Update non-existing entity. Verify HTTP response status code', () => {
    cy.request({
      method: 'PUT',
      url: 'posts/789',
      failOnStatusCode: false
    })
      .then(response => {
        expect(response.status).to.be.equal(404)
      })
  })




  it('Task 8. Create post entity and update the created entity. Verify HTTP response status code and verify that the entity is updated', () => {

    cy.request({
      method: 'POST',
      url: 'register',
      body: {
        "email": `${email}z`,
        "password": "bestPassw0rd"
      }
    }).then(response => {
      cy.request({
        method: 'POST',
        url: '664/posts',
        headers: {
          "Authorization": `Bearer ${response.body.accessToken}`
        },
        body: {
          "qa": "art before"
        }
      })
        .then(response => {
          expect(response.status).to.be.equal(201)
          expect(response.body.qa).to.be.equal('art before')

          cy.request({
            method: 'PUT',
            url: `posts/${response.body.id}`,
            failOnStatusCode: false,
            body: {
              "qa": "art after"
            }
          })
            .then(response => {
              expect(response.status).to.be.equal(200)
              expect(response.body.qa).to.be.equal('art after')
            })
        })
    })
  })

  it('Task 9. Delete non-existing post entity. Verify HTTP response status code', () => {
    cy.request({
      method: 'DELETE',
      url: 'posts/789',
      failOnStatusCode: false
    })
      .then(response => {
        expect(response.status).to.be.equal(404)
      })
  })




  it('Task 10. Create post entity, update the created entity, and delete the entity. Verify HTTP response status code and verify that the entity is deleted', () => {

    cy.request({
      method: 'POST',
      url: 'register',
      body: {
        "email": `${email}c`,
        "password": "bestPassw0rd"
      }
    }).then(response => {
      cy.request({
        method: 'POST',
        url: '664/posts',
        headers: {
          "Authorization": `Bearer ${response.body.accessToken}`
        },
        body: {
          "qa": "art before"
        }
      })
        .then(response => {
          expect(response.status).to.be.equal(201)
          expect(response.body.qa).to.be.equal('art before')

          cy.request({
            method: 'PUT',
            url: `posts/${response.body.id}`,
            failOnStatusCode: false,
            body: {
              "qa": "art after"
            }
          })
            .then(response1 => {
              expect(response1.status).to.be.equal(200)
              expect(response1.body.qa).to.be.equal('art after')

              cy.request({
                method: 'DELETE',
                url: `posts/${response1.body.id}`,
                failOnStatusCode: false
              })
                .then(response => {
                  expect(response.status).to.be.equal(200)

                  cy.request({
                    method: 'GET',
                    url: `posts/${response1.body.id}`,
                    failOnStatusCode: false
                  })
                    .then(response => {
                      expect(response.status).to.be.equal(404)
                    })
                })
            })
        })
    })
  })
})

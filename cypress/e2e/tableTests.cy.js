import { Given } from "cypress-cucumber-preprocessor/steps";

describe("I visit the absence app", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/"); // We always want to return to local host
  });
  it("verifies that headers are correct", () => {
    cy.get('[data-cy="Expand Employee Details"]').contains(
      "Expand Employee Details"
    );
    cy.get('[data-cy="Employee Name"]').contains("Employee Name");
    cy.get('[data-cy="Start Date"]').contains("Start Date");
    cy.get('[data-cy="End Date"]').contains("End Date");
    cy.get('[data-cy="Approval"]').contains("Approval");
  });
});

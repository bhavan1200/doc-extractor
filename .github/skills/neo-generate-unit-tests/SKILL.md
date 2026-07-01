---
name: neo-generate-unit-tests
description: Generate comprehensive unit tests for functions, methods, and classes. USE FOR creating test files with happy paths, edge cases, error conditions, and boundary conditions using any framework (Jest, Vitest, xUnit, pytest, JUnit). Trigger phrases include "generate tests", "write unit tests", "create test file", "test this function", "add tests for".
---

# Generate Unit Tests

## Purpose

Automatically generates comprehensive unit tests for source code, including happy paths, edge cases, error conditions, and boundary conditions. Ensures consistent test coverage and reduces manual test writing effort.

## When to Use

- After implementing new functions or classes
- When tests are missing for existing code
- During refactoring to ensure behavior preservation
- To establish baseline test coverage
- When standardizing test patterns across a codebase

## Prerequisites

- Source code file to test
- Testing framework installed (Jest, Mocha, pytest, JUnit, etc.)
- Understanding of the function/class responsibilities
- Mock/stub strategy for external dependencies

## Inputs

### target_file
- **Type**: string
- **Required**: Yes
- **Description**: Path to the source file containing code to test
- **Example**: `src/utils/date-formatter.js`

### test_framework
- **Type**: string
- **Required**: No
- **Default**: auto-detect (based on project configuration)
- **Description**: Testing framework to use for generating tests
- **Example**: `jest`, `mocha`, `pytest`, `junit`, `rspec`, `xunit`

### coverage_goal
- **Type**: number
- **Required**: No
- **Default**: 80
- **Description**: Target percentage of code coverage (0-100)
- **Example**: `90` for critical code, `70` for less critical

## Implementation Steps

1. **Analyze the source code**
   - Parse the source file to identify all functions, methods, and classes
   - Extract function signatures, parameters, and return types
   - Identify dependencies and external calls
   - Analyze control flow and decision points

2. **Identify test scenarios**
   - **Happy path**: Normal operation with valid inputs
   - **Edge cases**: Empty strings, null, undefined, zero, empty arrays
   - **Boundary conditions**: Min/max values, limits
   - **Error conditions**: Invalid inputs, exceptions
   - **State transitions**: For classes with state
   - **Integration points**: External dependencies

3. **Determine mocking strategy**
   - Identify external dependencies (APIs, databases, file system)
   - Plan mocks/stubs for dependencies
   - Consider spy usage for verifying calls

4. **Generate test structure**
   - Create test file with appropriate naming convention
   - Set up test framework boilerplate
   - Import necessary testing utilities
   - Create describe/context blocks for organization

5. **Generate test cases**
   For each function/method:

   **a. Happy path tests**

   ```javascript
   test('should return formatted date string for valid input', () => {
     const result = formatDate('2026-02-10');
     expect(result).toBe('February 10, 2026');
   });
   ```

   **b. Edge case tests**

   ```javascript
   test('should handle null input', () => {
     expect(() => formatDate(null)).toThrow('Invalid date');
   });
   
   test('should handle empty string', () => {
     expect(() => formatDate('')).toThrow('Invalid date');
   });
   ```

   **c. Boundary tests**

   ```javascript
   test('should handle leap year date', () => {
     const result = formatDate('2024-02-29');
     expect(result).toBe('February 29, 2024');
   });
   ```

   **d. Error handling tests**

   ```javascript
   test('should throw error for invalid date format', () => {
     expect(() => formatDate('invalid')).toThrow();
   });
   ```

6. **Add setup and teardown**
   - Create beforeEach/afterEach hooks if needed
   - Initialize test data
   - Clean up after tests

7. **Add test utilities**
   - Helper functions for common test data
   - Custom matchers if needed
   - Mock factories

8. **Verify coverage**
   - Check that all branches are covered
   - Ensure all functions have tests
   - Verify coverage_goal is met

## Test Patterns

### Arrange-Act-Assert (AAA)
```javascript
test('should calculate discount correctly', () => {
  // Arrange
  const cart = new ShoppingCart();
  cart.addItem({ price: 100 });
  
  // Act
  const discount = cart.applyDiscount(0.1);
  
  // Assert
  expect(discount).toBe(10);
  expect(cart.getTotal()).toBe(90);
});
```

### Given-When-Then (BDD)
```javascript
describe('ShoppingCart', () => {
  describe('when applying a discount', () => {
    it('should reduce the total price', () => {
      // Given a cart with items
      const cart = new ShoppingCart();
      cart.addItem({ price: 100 });
      
      // When a discount is applied
      cart.applyDiscount(0.1);
      
      // Then the total should be reduced
      expect(cart.getTotal()).toBe(90);
    });
  });
});
```

## Notes

- Generated tests are a starting point; review and refine them
- Add assertions that verify business logic, not just syntax
- Mock external dependencies to keep tests fast and isolated
- Consider property-based testing for complex logic
- Update tests when refactoring code
- Use descriptive test names that explain what is being tested

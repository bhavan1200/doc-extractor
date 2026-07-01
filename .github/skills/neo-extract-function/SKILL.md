---
name: neo-extract-function
description: Extract duplicate or complex code into reusable functions or methods. USE FOR refactoring long methods, removing duplicated code blocks, flattening deep nesting, applying Single Responsibility Principle, and improving testability. Trigger phrases include "extract function", "refactor this", "too long", "duplicate code", "extract method".
---

# Extract Function

## Purpose

Refactors code by extracting duplicate logic or complex code blocks into well-named, reusable functions. Improves code maintainability, testability, and reduces duplication.

## When to Use

- Code block is duplicated in multiple places
- Function or method is too long (>50 lines)
- Complex logic needs a descriptive name
- Code has deep nesting that could be flattened
- Logic should be testable in isolation
- Following the Single Responsibility Principle

## Prerequisites

- Source code file to refactor
- Understanding of the code's purpose and context
- Existing tests to verify behavior is preserved
- Ability to identify dependencies and side effects

## Inputs

### source_file
- **Type**: string
- **Required**: Yes
- **Description**: Path to the source file containing code to extract
- **Example**: `src/services/order-processor.js`

### target_code
- **Type**: string
- **Required**: Yes
- **Description**: The specific code block to extract, either as line range or code snippet
- **Example**: `lines 45-67` or the actual code block

### function_name
- **Type**: string
- **Required**: No (will suggest if not provided)
- **Description**: Name for the extracted function. Should be descriptive and follow naming conventions
- **Example**: `calculateOrderTotal`, `validateAddress`, `formatUserName`

## Implementation Steps

1. **Analyze target code**
   - Identify the exact code block to extract
   - Determine the code's purpose
   - Check for side effects or dependencies

2. **Identify inputs and outputs**
   - Find all variables read by the code (parameters)
   - Identify variables modified or created (return values)
   - Note any global state accessed

3. **Determine function signature**
   ```javascript
   // Inputs become parameters
   // Outputs become return value
   function extractedFunction(input1, input2, input3) {
     // logic here
     return output;
   }
   ```

4. **Choose appropriate function name**
   - Use descriptive, action-oriented names
   - Follow project naming conventions
   - Be specific about what the function does
   - Good: `calculateTotalWithTax`, `validateEmailFormat`
   - Bad: `doStuff`, `process`, `handle`

5. **Extract the function**
   - Create new function with identified parameters
   - Move code block into function body
   - Return appropriate value(s)
   - Handle edge cases and errors

6. **Replace original code with function call**
   - Replace extracted code with function call
   - Pass correct arguments
   - Use return value appropriately
   - Maintain same behavior

7. **Check for other occurrences**
   - Search for similar or duplicate code
   - Replace with calls to new function
   - Adjust parameters as needed for each call site

8. **Update tests**
   - Run existing tests to verify behavior preserved
   - Add specific tests for extracted function
   - Test edge cases and error conditions

9. **Optimize placement**
   - Place function in logical location (top of file, separate module)
   - Consider if function should be exported
   - Group with related functions

## Best Practices

- **Naming**: Use verbs for functions that perform actions
- **Size**: Extracted functions should be 5-20 lines ideally
- **Parameters**: Keep to 3-4 parameters max; use objects for more
- **Single Purpose**: Each function should do one thing well
- **Side Effects**: Minimize or clearly document side effects
- **Return Values**: Return meaningful values; avoid modifying parameters

## Notes

- Always run tests before and after extraction
- Extract smallest meaningful unit first
- Consider extracting to separate file for reusability
- Use linter to catch issues after refactoring
- Commit extraction as separate change from other modifications

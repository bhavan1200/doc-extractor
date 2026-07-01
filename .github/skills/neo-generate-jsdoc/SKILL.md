---
name: neo-generate-jsdoc
description: Generate JSDoc, docstring, or inline documentation comments for functions and classes. USE FOR adding JSDoc to JavaScript/TypeScript, docstrings to Python, Javadoc to Java, or XML doc comments to C#. Supports minimal, standard, and comprehensive completeness levels. Trigger phrases include "generate jsdoc", "add documentation", "document this function", "write docstrings", "add comments".
---

# Generate JSDoc

## Purpose

Automatically generates comprehensive documentation comments (JSDoc, docstrings, etc.) for functions, methods, classes, and modules. Improves code maintainability and enables automatic API documentation generation.

## When to Use

- Adding documentation to undocumented code
- Standardizing documentation across a codebase
- Preparing code for API documentation generation
- During code review when documentation is missing
- After refactoring to update documentation
- When establishing documentation standards

## Prerequisites

- Source code file to document
- Understanding of function/class purposes
- Knowledge of documentation style guidelines
- Type information (if using TypeScript or type hints)

## Inputs

### source_file
- **Type**: string
- **Required**: Yes
- **Description**: Path to source file that needs documentation
- **Example**: `src/services/auth-service.js`

### doc_style
- **Type**: string
- **Required**: No
- **Default**: auto-detect (based on file extension)
- **Description**: Documentation format to use
- **Options**:
  - `jsdoc` - JavaScript/TypeScript JSDoc format
  - `python-docstring` - Python docstrings (Google, NumPy, or Sphinx style)
  - `javadoc` - Java Javadoc format
  - `xmldoc` - C# XML documentation
- **Example**: `jsdoc`

### completeness_level
- **Type**: string
- **Required**: No
- **Default**: `standard`
- **Description**: How detailed the documentation should be
- **Options**:
  - `minimal` - Just description and parameters
  - `standard` - Description, parameters, returns, throws
  - `comprehensive` - Standard + examples, see-also, notes
- **Example**: `comprehensive`

## Implementation Steps

1. **Parse source file**
   - Read and analyze the source code
   - Identify all functions, methods, and classes
   - Extract existing documentation (if any)
   - Determine language and convention

2. **Analyze code elements**
   For each undocumented item:
   - Extract function/method signature
   - Identify parameters and types
   - Determine return type
   - Find thrown exceptions/errors
   - Analyze usage context

3. **Generate documentation structure**
   Based on doc_style:
   
   **JSDoc (JavaScript/TypeScript)**
   ```javascript
   /**
    * Description
    * @param {Type} paramName - Parameter description
    * @returns {Type} Return value description
    * @throws {ErrorType} Error condition description
    * @example
    * // Usage example
    */
   ```
   
   **Python Docstring (Google style)**
   ```python
   """Description.
   
   Args:
       param_name (Type): Parameter description
       
   Returns:
       Type: Return value description
       
   Raises:
       ErrorType: Error condition description
   """
   ```

4. **Write descriptions**
   - **Function description**: What it does (not how)
   - Be concise but informative
   - Use imperative mood ("Calculate total" not "Calculates total")
   - Describe purpose and behavior
   - Note any side effects

5. **Document parameters**
   - List each parameter with type
   - Describe what it represents
   - Note if optional and default value
   - Mention valid ranges or constraints

6. **Document return values**
   - Specify return type
   - Describe what is returned
   - Note special return values (null, undefined, empty)

7. **Document exceptions/errors**
   - List all thrown exceptions
   - Describe conditions that trigger each
   - Provide recovery guidance if applicable

8. **Add examples (for comprehensive level)**
   - Show typical usage
   - Include edge cases if relevant
   - Use realistic data
   - Keep examples concise

9. **Format and insert documentation**
    - Apply proper indentation
    - Follow style guide conventions
    - Insert above function/class definition
    - Preserve existing comments

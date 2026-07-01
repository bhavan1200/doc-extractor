---
name: neo-analyze-complexity
description: Calculate cyclomatic complexity and other code complexity metrics. USE FOR identifying overly complex functions before refactoring, code quality audits, complexity budgets, and prioritizing simplification work. Trigger phrases include "analyze complexity", "cyclomatic complexity", "complexity metrics", "too complex", "hard to maintain".
---

# Analyze Complexity

## Purpose

Calculates cyclomatic complexity and other code complexity metrics to identify difficult-to-maintain code. Helps teams prioritize refactoring efforts and maintain code quality standards.

## When to Use

- Before refactoring to identify problematic areas
- During code review to assess maintainability
- As part of regular code quality audits
- When establishing complexity budgets
- To track complexity trends over time

## Prerequisites

- Access to source code files
- Understanding of complexity metrics (cyclomatic, cognitive, Halstead)
- Baseline complexity thresholds for your project

## Inputs

### file_path
- **Type**: string
- **Required**: Yes
- **Description**: Path to the file or directory to analyze for complexity metrics
- **Example**: `src/utils/validator.js` or `src/`

### threshold
- **Type**: number
- **Required**: No
- **Default**: 10
- **Description**: Maximum acceptable cyclomatic complexity. Functions above this are flagged for refactoring.
- **Example**: `15` (more lenient) or `5` (very strict)

## Implementation Steps

1. **Parse source code**
   - Read and tokenize the source file(s)
   - Build Abstract Syntax Tree (AST)
   - Identify all functions, methods, and code blocks

2. **Calculate Cyclomatic Complexity**
   - Count decision points in each function:
     - if/else statements
     - switch/case statements
     - loops (for, while, do-while)
     - logical operators (&&, ||)
     - ternary operators
     - catch blocks
   - Formula: CC = E - N + 2P
     - E = number of edges in control flow graph
     - N = number of nodes
     - P = number of connected components

3. **Calculate Cognitive Complexity** (optional)
   - Measure how difficult code is to understand
   - Penalize nested structures more heavily
   - Consider breaks in linear flow

4. **Calculate additional metrics**
   - Lines of Code (LOC)
   - Number of parameters
   - Nesting depth
   - Number of return statements

5. **Compare against thresholds**
   - Flag functions exceeding complexity threshold
   - Categorize by severity:
     - 1-10: Low complexity (good)
     - 11-20: Moderate complexity (watch)
     - 21-50: High complexity (refactor soon)
     - 50+: Very high complexity (refactor now)

6. **Generate recommendations**
   - Suggest specific refactoring strategies:
     - Extract method for nested logic
     - Use guard clauses to reduce nesting
     - Replace complex conditionals with polymorphism
     - Break down large functions

7. **Create summary report**
   - Overall file/project complexity
   - Distribution of complexity across functions
   - Priority list for refactoring

## Complexity Guidelines

### Interpretation
- **1-10**: Simple, easy to test and maintain
- **11-20**: Moderate, may need simplification
- **21-50**: Complex, should be refactored
- **50+**: Very complex, refactor immediately

### Target Thresholds by Code Type
- **Business Logic**: 10
- **Algorithms**: 15
- **Utilities**: 8
- **Security Code**: 5
- **UI Components**: 12

## Notes

- Complexity is a guide, not an absolute rule
- Domain complexity may justify higher code complexity
- Consider cognitive complexity for nested structures
- Track complexity trends over time
- Balance complexity reduction with code clarity

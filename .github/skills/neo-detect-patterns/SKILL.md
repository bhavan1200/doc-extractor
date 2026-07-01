---
name: neo-detect-patterns
description: Identify common code patterns, anti-patterns, and design patterns in source code. USE FOR code review pattern analysis, identifying God Objects, Spaghetti Code, magic numbers, duplicate code, tight coupling, and validating design pattern adherence. Trigger phrases include "detect patterns", "find anti-patterns", "code smells", "analyze code structure", "identify design patterns".
---

# Detect Patterns

## Purpose

Analyzes source code to identify design patterns, anti-patterns, code smells, and common coding patterns. Helps developers understand code structure and identify opportunities for improvement or refactoring.

## When to Use

- During code review to identify potential issues
- Before refactoring to understand current code structure
- When analyzing unfamiliar codebases
- To validate adherence to design patterns
- Before planning architectural changes

## Prerequisites

- Access to source code files
- Understanding of common design patterns and anti-patterns
- Context about the programming language and framework being used

## Inputs

### file_path
- **Type**: string
- **Required**: Yes
- **Description**: The path to the file or directory to analyze. Can be a single file or a directory for recursive analysis.
- **Example**: `src/services/auth.js` or `src/components/`

### pattern_types
- **Type**: array
- **Required**: No
- **Default**: `["all"]`
- **Description**: Specifies which types of patterns to detect. Options: design-patterns, anti-patterns, code-smells, all
- **Example**: `["anti-patterns", "code-smells"]`

## Implementation Steps

1. **Parse the source code**
   - Read the specified file(s)
   - Parse into AST (Abstract Syntax Tree) if needed
   - Identify code structure (classes, functions, modules)

2. **Detect design patterns**
   - Look for common patterns: Singleton, Factory, Observer, Strategy, etc.
   - Identify pattern implementations
   - Note pattern locations and usage

3. **Identify anti-patterns**
   - God Object/Class: Classes with too many responsibilities
   - Spaghetti Code: Tangled control flow
   - Magic Numbers: Hard-coded values without explanation
   - Copy-Paste Programming: Duplicated code blocks
   - Callback Hell: Deep nesting of callbacks/promises
   - Tight Coupling: Excessive dependencies between modules

4. **Detect code smells**
   - Long methods (>50 lines)
   - Large classes (>300 lines)
   - Long parameter lists (>5 parameters)
   - Duplicate code
   - Dead code (unused variables, functions)
   - Complex conditionals
   - Excessive comments (may indicate unclear code)

5. **Analyze severity and impact**
   - Categorize findings by severity (low, medium, high, critical)
   - Consider maintainability impact
   - Assess performance implications

6. **Generate recommendations**
   - For each anti-pattern or code smell, provide specific refactoring suggestions
   - Prioritize based on severity and impact
   - Include references to better patterns or practices

7. **Format and return results**
   - Organize patterns by category and file
   - Include line numbers and code snippets
   - Provide actionable next steps

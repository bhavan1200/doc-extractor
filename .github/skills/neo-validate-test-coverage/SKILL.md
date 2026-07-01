---
name: neo-validate-test-coverage
description: Analyze test coverage and identify untested code paths. USE FOR validating coverage thresholds before merging, identifying uncovered branches and lines, enforcing CI/CD quality gates, and generating coverage gap reports. Trigger phrases include "check coverage", "validate test coverage", "coverage report", "coverage threshold", "untested code".
---

# Validate Test Coverage

## Purpose

Analyzes test coverage metrics to ensure code is adequately tested. Identifies untested code paths, validates coverage thresholds, and helps maintain quality standards.

## When to Use

- Before merging code to verify adequate testing
- As part of CI/CD quality gates
- During code review to identify testing gaps
- When establishing or enforcing coverage policies
- After refactoring to ensure test completeness

## Prerequisites

- Test suite exists for the code
- Coverage tool installed (Jest, Istanbul, Coverage.py, JaCoCo, etc.)
- Tests can be executed successfully
- Coverage reporting configured

## Inputs

### source_path
- **Type**: string
- **Required**: Yes
- **Description**: Path to source code file or directory to validate coverage for
- **Example**: `src/services/` or `src/utils/auth.js`

### minimum_coverage
- **Type**: number
- **Required**: No
- **Default**: 80
- **Description**: Minimum acceptable coverage percentage (0-100)
- **Example**: `90` for critical code, `70` for less critical

### coverage_type
- **Type**: string
- **Required**: No
- **Default**: `all`
- **Description**: Type of coverage to validate: line, branch, function, statement, or all
- **Example**: `branch` (most stringent), `line` (common baseline)

## Implementation Steps

1. **Run test suite with coverage**
   ```bash
   # JavaScript/Jest
   npm test -- --coverage
   
   # Python
   pytest --cov=src --cov-report=json
   
   # Java
   mvn test jacoco:report
   ```

2. **Parse coverage report**
   - Load coverage data (typically JSON, LCOV, or XML format)
   - Extract metrics by file and overall
   - Identify coverage types available

3. **Calculate coverage metrics**
   - **Line coverage**: % of executable lines executed by tests
   - **Branch coverage**: % of conditional branches taken
   - **Function coverage**: % of functions called
   - **Statement coverage**: % of statements executed

4. **Compare against thresholds**
   - Check overall coverage vs. minimum_coverage
   - Identify files below threshold
   - Flag critical files with low coverage

5. **Identify uncovered code**
   - Extract line numbers with zero coverage
   - Identify untested branches (if/else, switch cases)
   - Find untested functions
   - Highlight critical paths without coverage

6. **Categorize gaps by priority**
   - **Critical**: Error handling, security, data validation
   - **High**: Main business logic flows
   - **Medium**: Helper functions, utilities
   - **Low**: Trivial getters/setters, constants

7. **Generate actionable report**
   - List files below threshold
   - Show specific uncovered lines with context
   - Suggest test cases to add
   - Provide coverage trends (if historical data available)

8. **Set exit code based on threshold**
   - Return success if coverage meets minimum
   - Return failure if coverage is below threshold
   - Useful for CI/CD gates

## Coverage Guidelines

### Minimum Coverage Targets by Code Type
- **Security/Authentication**: 95%+
- **Payment/Financial**: 95%+
- **Business Logic**: 85-90%
- **API Endpoints**: 85%+
- **Utilities**: 80%+
- **UI Components**: 70-80%
- **Configuration**: 60-70%

### Coverage Types Importance
1. **Branch Coverage** - Most important (tests decision paths)
2. **Line Coverage** - Good baseline metric
3. **Function Coverage** - Ensures all functions are called
4. **Statement Coverage** - Similar to line coverage

### When 100% Coverage Isn't Practical
- Trivial getters/setters
- Generated code
- Third-party library wrappers
- Platform-specific code
- Defensive programming checks

#!/usr/bin/env pwsh
# Setup implementation plan for a feature

[CmdletBinding()]
param(
    [switch]$Json,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

# Show help if requested
if ($Help) {
    Write-Output "Usage: ./setup-plan.ps1 [-Json] [-Help]"
    Write-Output "  -Json     Output results in JSON format"
    Write-Output "  -Help     Show this help message"
    exit 0
}

# Load common functions
. "$PSScriptRoot/common.ps1"

# Get all paths and variables from common functions
$paths = Get-FeaturePathsEnv

# Check if we're on a proper feature branch (only for git repos)
if (-not (Test-FeatureBranch -Branch $paths.CURRENT_BRANCH -HasGit $paths.HAS_GIT)) { 
    exit 1 
}

# Ensure the feature directory exists
New-Item -ItemType Directory -Path $paths.FEATURE_DIR -Force | Out-Null

# Copy or generate plan template if it exists, otherwise note it or create empty file
$templateCandidates = @(
    (Join-Path $paths.REPO_ROOT '.neo/templates/neo.plan.hbs'),
    (Join-Path $paths.REPO_ROOT 'templates/neo.plan.hbs'),
    (Join-Path $paths.REPO_ROOT '.specify/templates/plan-template.md')
)
$template = $templateCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (Test-Path $template) { 
    if ([IO.Path]::GetExtension($template) -eq '.hbs') {
        $featureBranchPrefixPattern = '^[0-9]{3}-'
        $featureName = ($paths.CURRENT_BRANCH -replace $featureBranchPrefixPattern, '') -replace '-', ' '
        if ([string]::IsNullOrWhiteSpace($featureName)) {
            $featureName = $paths.CURRENT_BRANCH
        }
        $planContent = Get-Content -Path $template -Raw
        $planContent = $planContent.Replace('{{featureName}}', $featureName)
        $planContent = $planContent.Replace('{{featureId}}', $paths.CURRENT_BRANCH)
        $planContent = $planContent.Replace('{{date}}', (Get-Date -Format 'yyyy-MM-dd'))
        $planContent = $planContent.Replace('{{architectureOverview}}', 'Describe the proposed architecture and key design decisions.')
        $planContent = $planContent.Replace('{{fileStructure}}', '# Add expected files and directories')
        # Basic token substitution for the canonical neo.plan.hbs structure.
        $planContent = $planContent -replace '\{\{#each [^}]+\}\}\r?\n?', ''
        $planContent = $planContent -replace '\{\{\/each\}\}\r?\n?', ''
        $planContent = $planContent -replace '\{\{[^}]+\}\}', 'TBD'
        Set-Content -Path $paths.IMPL_PLAN -Value $planContent -Encoding UTF8
        Write-Output "Generated plan template to $($paths.IMPL_PLAN)"
    } else {
        Copy-Item $template $paths.IMPL_PLAN -Force
        Write-Output "Copied plan template to $($paths.IMPL_PLAN)"
    }
} else {
    Write-Warning "Plan template not found at $template"
    # Create a basic plan file if template doesn't exist
    New-Item -ItemType File -Path $paths.IMPL_PLAN -Force | Out-Null
}

# Output results
if ($Json) {
    $result = [PSCustomObject]@{ 
        FEATURE_SPEC = $paths.FEATURE_SPEC
        IMPL_PLAN = $paths.IMPL_PLAN
        SPECS_DIR = $paths.FEATURE_DIR
        BRANCH = $paths.CURRENT_BRANCH
        HAS_GIT = $paths.HAS_GIT
    }
    $result | ConvertTo-Json -Compress
} else {
    Write-Output "FEATURE_SPEC: $($paths.FEATURE_SPEC)"
    Write-Output "IMPL_PLAN: $($paths.IMPL_PLAN)"
    Write-Output "SPECS_DIR: $($paths.FEATURE_DIR)"
    Write-Output "BRANCH: $($paths.CURRENT_BRANCH)"
    Write-Output "HAS_GIT: $($paths.HAS_GIT)"
}

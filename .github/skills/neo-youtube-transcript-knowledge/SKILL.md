---
name: neo-youtube-transcript-knowledge
description: Download YouTube video transcripts and extract key insights, patterns, and technical concepts for project knowledge. USE FOR downloading transcripts via yt-dlp, analyzing technical talks and tutorials, and storing extracted knowledge in .neo/memory/video-knowledge/. Trigger phrases include "youtube transcript", "extract from video", "analyze this talk", "download transcript", "video knowledge".
---

# YouTube Transcript Knowledge Extractor

## Purpose

Downloads transcripts from YouTube videos using yt-dlp and analyzes them to extract key technical insights, architectural patterns, and important concepts. Stores the analyzed knowledge in `.neo/memory/video-knowledge/` for agents to reference when implementing features.

## When to Use

- User provides a YouTube link to a technical tutorial or talk
- Learning about architectural patterns (e.g., sub-agent architecture, microservices)
- Extracting best practices from coding tutorials
- Documenting design patterns explained in videos
- Building project knowledge base from educational content
- Understanding framework-specific patterns and conventions

## Prerequisites

- **Terminal access/execution capability** — This skill requires the ability to run shell commands
- yt-dlp installed (will attempt automatic installation if missing)
- Python 3 for post-processing transcript deduplication
- Internet connection for downloading transcripts
- Optional: Whisper for videos without captions (requires user confirmation)

## Inputs

### video_url
- **Type**: string
- **Required**: Yes
- **Description**: Full YouTube video URL
- **Example**: `https://www.youtube.com/watch?v=VIDEO_ID`

### analysis_focus
- **Type**: array
- **Required**: No
- **Default**: `["all"]`
- **Description**: Specific aspects to focus on. Options: `architecture`, `patterns`, `best-practices`, `concepts`, `all`

### output_location
- **Type**: string
- **Required**: No
- **Default**: `.neo/memory/video-knowledge`
- **Description**: Directory where analyzed knowledge will be stored

## Implementation Steps

### Step 1: Check and Install yt-dlp

```bash
which yt-dlp || command -v yt-dlp
```

If not installed, attempt automatic installation:

```bash
# macOS (Homebrew)
if command -v brew &> /dev/null; then
    brew install yt-dlp
# Linux (apt/Debian/Ubuntu)
elif command -v apt &> /dev/null; then
    sudo apt update && sudo apt install -y yt-dlp
# Alternative (pip - works on all systems)
else
    pip3 install yt-dlp
fi
```

### Step 2: Extract Video ID and Check Available Subtitles

```bash
VIDEO_URL="https://www.youtube.com/watch?v=VIDEO_ID"
VIDEO_ID=$(echo "$VIDEO_URL" | sed -n 's/.*[?&]v=\([^&]*\).*/\1/p')
yt-dlp --list-subs "$VIDEO_URL"
```

### Step 3: Download Transcript (Priority Order)

**Option 1: Manual Subtitles (Preferred)**
```bash
yt-dlp --write-sub --skip-download --output "transcript_temp" "$VIDEO_URL"
```

**Option 2: Auto-Generated Subtitles (Fallback)**
```bash
yt-dlp --write-auto-sub --skip-download --output "transcript_temp" "$VIDEO_URL"
```

**Option 3: Whisper Transcription (Last Resort — requires user confirmation)**

Only use if both subtitle types are unavailable. Get user confirmation before downloading audio.

### Step 4: Convert to Plain Text (Deduplicate VTT)

YouTube's auto-generated VTT files contain duplicate lines. Always deduplicate:

```bash
VTT_FILE=$(ls transcript_temp*.vtt 2>/dev/null | head -n 1)

python3 -c "
import sys, re
seen = set()
with open('$VTT_FILE', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('WEBVTT') and not line.startswith('Kind:') and not line.startswith('Language:') and '-->' not in line:
            clean = re.sub('<[^>]*>', '', line)
            clean = clean.replace('&amp;', '&').replace('&gt;', '>').replace('&lt;', '<')
            if clean and clean not in seen:
                print(clean)
                seen.add(clean)
" > "${VIDEO_ID}-transcript.txt"

rm "$VTT_FILE"
```

### Step 5: Move Transcript to Knowledge Directory

```bash
mkdir -p .neo/memory/video-knowledge
mv "${VIDEO_ID}-transcript.txt" ".neo/memory/video-knowledge/"
```

### Step 6: Analyze Transcript and Extract Knowledge

Read the transcript and analyze based on `analysis_focus`. Produce a structured markdown file at `.neo/memory/video-knowledge/${VIDEO_ID}-${VIDEO_TITLE}.md` with:

- **Key Concepts** — main ideas, patterns, and architectural decisions
- **Technical Details** — specific tools, frameworks, commands
- **Best Practices** — recommended approaches highlighted in the video
- **Quotes** — verbatim excerpts for important points
- **Application to Project** — how insights apply to the current codebase

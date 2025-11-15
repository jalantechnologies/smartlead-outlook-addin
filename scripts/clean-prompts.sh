#!/bin/bash

# Clean Iterative Improvements from Prompt Files
# This script removes "--- ITERATIVE IMPROVEMENTS ---" sections from files

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Prompt Cleanup Tool ===${NC}"
echo ""

# Default to current directory if no path provided
SEARCH_PATH="${1:-.}"

# Find files containing ITERATIVE IMPROVEMENTS
echo -e "${YELLOW}Searching for files with ITERATIVE IMPROVEMENTS...${NC}"
files_with_improvements=$(grep -rl "ITERATIVE IMPROVEMENTS" "$SEARCH_PATH" 2>/dev/null || true)

if [ -z "$files_with_improvements" ]; then
    echo -e "${GREEN}No files found with ITERATIVE IMPROVEMENTS sections.${NC}"
    exit 0
fi

echo "Files found:"
echo "$files_with_improvements"
echo ""

# Ask for confirmation
read -p "Do you want to clean these files? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Create backup directory
backup_dir="./backups/prompts_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"
echo -e "${YELLOW}Creating backups in: $backup_dir${NC}"

# Process each file
cleaned_count=0
while IFS= read -r file; do
    if [ -f "$file" ]; then
        echo -e "Processing: ${YELLOW}$file${NC}"

        # Create backup
        cp "$file" "$backup_dir/$(basename "$file")"

        # Remove ITERATIVE IMPROVEMENTS sections
        # This removes from "--- ITERATIVE IMPROVEMENTS" to the next "---" or end of file
        sed -i.tmp '/^---.*ITERATIVE IMPROVEMENTS/,/^---[^-]/d' "$file"

        # Also handle case where it's the last section (no closing ---)
        sed -i.tmp '/^---.*ITERATIVE IMPROVEMENTS/,$d' "$file"

        # Remove temporary file
        rm -f "${file}.tmp"

        echo -e "${GREEN}✓ Cleaned${NC}"
        ((cleaned_count++))
    fi
done <<< "$files_with_improvements"

echo ""
echo -e "${GREEN}=== Cleanup Complete ===${NC}"
echo "Files cleaned: $cleaned_count"
echo "Backups saved to: $backup_dir"
echo ""
echo "To restore a file, run:"
echo "  cp $backup_dir/filename original/path/filename"

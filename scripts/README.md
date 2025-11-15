# Utility Scripts

## Clean Prompts

Removes "ITERATIVE IMPROVEMENTS" sections from prompt files while preserving core content.

### Usage

**Using npm script (recommended):**
```bash
npm run clean-prompts
```

**Using Node.js directly:**
```bash
node scripts/clean-prompts.js [path]
```

**Using bash script:**
```bash
./scripts/clean-prompts.sh [path]
```

### What it does

1. Searches for files containing "ITERATIVE IMPROVEMENTS" sections
2. Creates backups in `./backups/prompts_[timestamp]/`
3. Removes all sections matching:
   - `--- ITERATIVE IMPROVEMENTS (Iteration X) ---`
   - Everything until the next `---` separator or end of file
4. Preserves the original core prompt content

### Example

**Before:**
```
Your main prompt content here...

--- ITERATIVE IMPROVEMENTS (Iteration 1) ---
- Enhancement 1
- Enhancement 2

--- ITERATIVE IMPROVEMENTS (Iteration 2) ---
- More enhancements
```

**After:**
```
Your main prompt content here...
```

### Restoring backups

If you need to restore a cleaned file:

```bash
cp backups/prompts_[timestamp]/filename original/path/filename
```

### Options

- **No arguments**: Searches current directory and subdirectories
- **With path**: `npm run clean-prompts /path/to/prompts`

### Safety

- Always creates backups before modifying files
- Requires confirmation before cleaning
- Preserves original file permissions

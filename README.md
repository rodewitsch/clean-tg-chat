# Clean TG Chat

A lightweight CLI tool for cleaning exported Telegram chats. Removes unnecessary data while preserving the essential structure for analysis.

## Features

- 🔥 Reduces JSON file size by 3-10x
- 📊 Preserves conversation structure (message replies)
- 😀 Saves reactions with user information
- 🎯 Keeps only essential fields for analysis
- 🚀 Simple CLI interface
- 📦 Zero dependencies

## Installation

### Global installation (recommended)
```bash
npm install -g clean-tg-chat
```

### Local installation
```bash
npm install clean-tg-chat
```

### Direct usage (no installation)
```bash
npx clean-tg-chat <input.json> [output.json]
```

## Usage

### Basic usage
```bash
clean-tg-chat result.json
```
Creates `clean_chat.json` in the current directory.

### With custom output file
```bash
clean-tg-chat result.json cleaned.json
```

### Using as a Node.js module
```javascript
const { cleanChat } = require('clean-tg-chat');

// Synchronous cleaning
const cleanedData = cleanChat('result.json', 'cleaned.json');
console.log(`Processed ${cleanedData.messages.length} messages`);

// Asynchronous cleaning (Promise-based)
await cleanChat.async('result.json', 'cleaned.json');
```

## What Gets Preserved

After processing, only these essential fields remain:

### For each message:
- **`id`** - unique message identifier
- **`date`** - timestamp (ISO string)
- **`from`** - sender name
- **`text`** - message text (extracted from all formats)
- **`reply_to_message_id`** - ID of replied message (if applicable)
- **`reactions`** - message reactions (if any)

### Reactions format:
```json
{
  "emoji": "😁",
  "users": [
    {
      "name": "Username",
      "id": "user123456789",
      "date": "2026-01-12T19:52:39"
    }
  ]
}
```

## Example Output

```bash
clean-tg-chat result.json

✅ Done!
📁 Saved to: clean_chat.json
💬 Messages: 145
👥 Participants: 2
↪️  Replies: 32
😀 Reactions: 15 (12 with user info)

Example reactions:
  😁: John
  👍: Mark
```

## Data Preparation

### How to export a chat from Telegram:
1. Open the desired chat in Telegram Desktop
2. Click ⋮ (three dots) → Export chat history
3. Select format: **JSON**
4. Uncheck Media (photos, videos, etc.)
5. Export and get the `result.json` file

## API Reference

### `cleanChat(inputPath: string, outputPath?: string): object`

Synchronously cleans a Telegram chat export.

**Parameters:**
- `inputPath`: Path to the input JSON file
- `outputPath`: Optional output path (default: `'clean_chat.json'`)

**Returns:** The cleaned data object

### `cleanChat.async(inputPath: string, outputPath?: string): Promise<object>`

Asynchronously cleans a Telegram chat export.

## License

MIT

## Support

Found a bug or have suggestions?
- [Create an issue on GitHub](https://github.com/rodewitsch/clean-tg-chat/issues)

## Compatibility

- Node.js 12+
- Telegram Desktop JSON exports
- All operating systems (Windows, macOS, Linux)

---

<div align="center">
Made with ❤️ for Telegram power users
</div>
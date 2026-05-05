# MC Bot - HimeshMc

A professional Minecraft bot built with Mineflayer for version 1.21+

## Features

- ✅ Automatic server connection to play.arctixmc.net:25565
- ✅ Auto-registration with credentials (username: hello22, password: hello22)
- ✅ Auto-login after registration
- ✅ Server and warp navigation (/server survival, /warp afk)
- ✅ Connection logging and error handling
- ✅ Automatic reconnection on disconnection

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## Installation

```bash
npm install
```

## Configuration

Edit `src/config.js` to customize bot settings:

```javascript
module_exports = {
  bot: {
    username: 'HimeshMc',
    host: 'play.arctixmc.net',
    port: 25565,
    version: '1.21'
  },
  auth: {
    password: 'hello22'
  },
  commands: {
    server: 'survival',
    warp: 'afk'
  }
};
```

## Usage

### Start the bot

```bash
npm start
```

### Development mode with auto-reload

```bash
npm run dev
```

## Bot Workflow

1. **Connection**: Connects to play.arctixmc.net:25565
2. **Registration**: Executes `/register hello22 hello22`
3. **Login**: Executes `/login hello22`
4. **Navigation**: Executes `/server survival`
5. **AFK Mode**: Executes `/warp afk`

## Logs

Bot activities are logged to console with timestamps. All major events are recorded:
- Connection status
- Chat messages
- Command execution
- Errors and disconnections

## Architecture

- `src/bot.js` - Main bot logic and connection management
- `src/config.js` - Configuration file
- `src/events.js` - Event handlers
- `src/commands.js` - Command execution module

## Troubleshooting

**Connection Failed**: Verify server IP and port are correct
**Auth Failed**: Check username and password in config.js
**Commands Not Executing**: Ensure bot has proper permissions on the server

## License

MIT

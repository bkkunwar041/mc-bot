/**
 * Event Handler Module
 * Manages bot events and lifecycle
 */

const config = require('./config');

class EventHandler {
  constructor(bot, commandHandler) {
    this.bot = bot;
    this.commandHandler = commandHandler;
    this.botState = {
      isLoggedIn: false,
      isRegistered: false,
      hasSpawned: false,
      onAFK: false
    };
  }

  /**
   * Register all event listeners
   */
  registerEvents() {
    // Spawn Event
    this.bot.on('spawn', () => {
      console.log(`[${this.getTimestamp()}] ✨ Bot spawned in the world!`);
      this.botState.hasSpawned = true;
      this.onSpawn();
    });

    // Chat Event
    this.bot.on('chat', (username, message) => {
      if (username === this.bot.username) return; // Ignore own messages
      console.log(`[${this.getTimestamp()}] 💬 ${username}: ${message}`);
      this.handleChatMessage(username, message);
    });

    // End Event (Disconnect)
    this.bot.on('end', () => {
      console.log(`[${this.getTimestamp()}] ❌ Connection ended`);
      this.botState.isLoggedIn = false;
      this.botState.hasSpawned = false;
    });

    // Error Event
    this.bot.on('error', (err) => {
      console.error(`[${this.getTimestamp()}] ⚠️ Bot Error: ${err.message}`);
    });

    // Kicked Event
    this.bot.on('kicked', (reason) => {
      console.log(`[${this.getTimestamp()}] 🚫 Bot kicked from server: ${reason}`);
      this.botState.isLoggedIn = false;
    });

    // Health Change Event
    this.bot.on('health', () => {
      if (config.behavior.verbose) {
        console.log(`[${this.getTimestamp()}] ❤️ Health: ${this.bot.health}/20`);
      }
    });

    // Movement Event
    this.bot.on('move', () => {
      if (config.behavior.verbose) {
        const pos = this.bot.entity.position;
        console.log(`[${this.getTimestamp()}] 📍 Position: X:${pos.x.toFixed(2)}, Y:${pos.y.toFixed(2)}, Z:${pos.z.toFixed(2)}`);
      }
    });
  }

  /**
   * Handle spawn event
   */
  async onSpawn() {
    console.log(`[${this.getTimestamp()}] 🔐 Attempting to register...`);
    await this.commandHandler.queueCommand(config.commands.register, 500);
    
    // Wait for login
    await this.sleep(config.delays.afterLogin);
    console.log(`[${this.getTimestamp()}] 🔓 Attempting to login...`);
    await this.commandHandler.queueCommand(config.commands.login, 500);
    
    // Wait before server selection
    await this.sleep(config.delays.afterLogin);
    console.log(`[${this.getTimestamp()}] 🎮 Joining ${config.commands.server.split(' ')[1]} server...`);
    await this.commandHandler.queueCommand(config.commands.server, 500);
    
    // Wait before warping
    await this.sleep(config.delays.afterLogin);
    console.log(`[${this.getTimestamp()}] 🌍 Warping to AFK location...`);
    await this.commandHandler.queueCommand(config.commands.warp, 500);
    
    this.botState.isLoggedIn = true;
    this.botState.onAFK = true;
    console.log(`[${this.getTimestamp()}] ✅ Bot is now in AFK mode!`);
  }

  /**
   * Handle chat messages
   */
  handleChatMessage(username, message) {
    if (message.toLowerCase().includes('login')) {
      this.botState.isLoggedIn = true;
      console.log(`[${this.getTimestamp()}] ✅ Bot successfully logged in!`);
    }
    if (message.toLowerCase().includes('register')) {
      this.botState.isRegistered = true;
      console.log(`[${this.getTimestamp()}] ✅ Bot successfully registered!`);
    }
  }

  /**
   * Get current timestamp
   */
  getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Helper: Sleep for specified milliseconds
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get bot state
   */
  getState() {
    return this.botState;
  }
}

module.exports = EventHandler;

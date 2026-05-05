/**
 * Bot Configuration
 * Centralized configuration for the Minecraft bot
 */

module.exports = {
  // Server Connection Settings
  server: {
    host: 'play.arctixmc.net',
    port: 25565,
    version: '1.21',
    kickTimeout: 5000
  },

  // Bot Identity
  bot: {
    username: 'HimeshMc'
  },

  // Authentication Credentials
  auth: {
    password: 'hello22'
  },

  // Commands to Execute After Joining
  commands: {
    // Registration command (first join only)
    register: '/register hello22 hello22',
    // Login command (after registration)
    login: '/login hello22',
    // Server selection
    server: '/server survival',
    // Warp to AFK location
    warp: '/warp afk'
  },

  // Delays between commands (in milliseconds)
  delays: {
    afterLogin: 2000,      // Wait after login before executing next command
    betweenCommands: 1500, // Delay between consecutive commands
    reconnectDelay: 10000  // Delay before attempting to reconnect
  },

  // Bot Behavior
  behavior: {
    autoReconnect: true,
    reconnectAttempts: 5,
    verbose: true // Log all activities
  }
};

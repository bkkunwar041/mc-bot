#!/usr/bin/env node

/**
 * Minecraft AFK Bot - Main Entry Point
 * Bot Username: HimeshMc
 * Server: play.arctixmc.net:25565
 * Version: 1.12.2
 */

var mineflayer = require('mineflayer');
var config = require('./config');
var CommandHandler = require('./commands');
var EventHandler = require('./events');

var bot = null;
var commandHandler = null;
var eventHandler = null;
var reconnectAttempts = 0;

/**
 * Create and start the bot
 */
function startBot() {
  try {
    console.log('\n[' + getTimestamp() + '] 🚀 Starting Minecraft Bot...');
    console.log('[' + getTimestamp() + '] 📌 Bot Username: ' + config.bot.username);
    console.log('[' + getTimestamp() + '] 🌐 Server: ' + config.server.host + ':' + config.server.port);
    console.log('[' + getTimestamp() + '] 📦 Version: ' + config.server.version + '\n');

    // Create bot instance
    bot = mineflayer.createBot({
      host: config.server.host,
      port: config.server.port,
      username: config.bot.username,
      version: config.server.version,
      keepAlive: true,
      viewDistance: 'tiny'
    });

    // Initialize handlers
    commandHandler = new CommandHandler(bot);
    eventHandler = new EventHandler(bot, commandHandler);

    // Handle successful login
    bot.on('login', function() {
      console.log('[' + getTimestamp() + '] ✅ Successfully logged in to the server!');
      reconnectAttempts = 0; // Reset reconnect counter on successful login
    });

    // Register all event listeners
    eventHandler.registerEvents();

    // Handle errors
    bot.on('error', function(err) {
      console.error('[' + getTimestamp() + '] ❌ Error: ' + err.message);
    });

    // Handle disconnection
    bot.on('end', function() {
      console.log('[' + getTimestamp() + '] 🔌 Bot disconnected from server');
      
      // Attempt to reconnect
      if (config.behavior.autoReconnect && reconnectAttempts < config.behavior.reconnectAttempts) {
        reconnectAttempts++;
        console.log('[' + getTimestamp() + '] 🔄 Reconnecting... (Attempt ' + reconnectAttempts + '/' + config.behavior.reconnectAttempts + ')');
        setTimeout(function() {
          startBot();
        }, config.delays.reconnectDelay);
      } else {
        console.log('[' + getTimestamp() + '] ❌ Max reconnection attempts reached. Bot shutting down.');
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('[' + getTimestamp() + '] ❌ Failed to start bot:', error.message);
    process.exit(1);
  }
}

/**
 * Get formatted timestamp
 */
function getTimestamp() {
  var now = new Date();
  var h = ('0' + now.getHours()).slice(-2);
  var m = ('0' + now.getMinutes()).slice(-2);
  var s = ('0' + now.getSeconds()).slice(-2);
  return h + ':' + m + ':' + s;
}

/**
 * Handle graceful shutdown
 */
process.on('SIGINT', function() {
  console.log('\n[' + getTimestamp() + '] 🛑 Shutting down bot gracefully...');
  if (bot) {
    bot.quit();
  }
  setTimeout(function() {
    console.log('[' + getTimestamp() + '] ✅ Bot has been shut down.');
    process.exit(0);
  }, 1000);
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', function(error) {
  console.error('[' + getTimestamp() + '] 💥 Uncaught Exception:', error);
  process.exit(1);
});

/**
 * Start the bot
 */
startBot();

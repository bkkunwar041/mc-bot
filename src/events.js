/**
 * Event Handler Module
 * Manages bot events and lifecycle
 */

var config = require('./config');

function EventHandler(bot, commandHandler) {
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
EventHandler.prototype.registerEvents = function() {
  var self = this;

  // Spawn Event
  this.bot.on('spawn', function() {
    console.log('[' + self.getTimestamp() + '] ✨ Bot spawned in the world!');
    self.botState.hasSpawned = true;
    self.onSpawn();
  });

  // Chat Event
  this.bot.on('chat', function(username, message) {
    if (username === self.bot.username) return; // Ignore own messages
    console.log('[' + self.getTimestamp() + '] 💬 ' + username + ': ' + message);
    self.handleChatMessage(username, message);
  });

  // End Event (Disconnect)
  this.bot.on('end', function() {
    console.log('[' + self.getTimestamp() + '] ❌ Connection ended');
    self.botState.isLoggedIn = false;
    self.botState.hasSpawned = false;
  });

  // Error Event
  this.bot.on('error', function(err) {
    console.error('[' + self.getTimestamp() + '] ⚠️ Bot Error: ' + err.message);
  });

  // Kicked Event
  this.bot.on('kicked', function(reason) {
    console.log('[' + self.getTimestamp() + '] 🚫 Bot kicked from server: ' + reason);
    self.botState.isLoggedIn = false;
  });

  // Health Change Event
  this.bot.on('health', function() {
    if (config.behavior.verbose) {
      console.log('[' + self.getTimestamp() + '] ❤️ Health: ' + self.bot.health + '/20');
    }
  });

  // Movement Event
  this.bot.on('move', function() {
    if (config.behavior.verbose) {
      var pos = self.bot.entity.position;
      console.log('[' + self.getTimestamp() + '] 📍 Position: X:' + pos.x.toFixed(2) + ', Y:' + pos.y.toFixed(2) + ', Z:' + pos.z.toFixed(2));
    }
  });
};

/**
 * Handle spawn event
 */
EventHandler.prototype.onSpawn = function() {
  var self = this;
  
  console.log('[' + this.getTimestamp() + '] 🔐 Attempting to register...');
  this.commandHandler.queueCommand(config.commands.register, 500).then(function() {
    return self.sleep(config.delays.afterLogin);
  }).then(function() {
    console.log('[' + self.getTimestamp() + '] 🔓 Attempting to login...');
    return self.commandHandler.queueCommand(config.commands.login, 500);
  }).then(function() {
    return self.sleep(config.delays.afterLogin);
  }).then(function() {
    var serverName = config.commands.server.split(' ')[1];
    console.log('[' + self.getTimestamp() + '] 🎮 Joining ' + serverName + ' server...');
    return self.commandHandler.queueCommand(config.commands.server, 500);
  }).then(function() {
    return self.sleep(config.delays.afterLogin);
  }).then(function() {
    console.log('[' + self.getTimestamp() + '] 🌍 Warping to AFK location...');
    return self.commandHandler.queueCommand(config.commands.warp, 500);
  }).then(function() {
    self.botState.isLoggedIn = true;
    self.botState.onAFK = true;
    console.log('[' + self.getTimestamp() + '] ✅ Bot is now in AFK mode!');
  }).catch(function(err) {
    console.error('[ERROR] Spawn sequence failed:', err);
  });
};

/**
 * Handle chat messages
 */
EventHandler.prototype.handleChatMessage = function(username, message) {
  if (message.toLowerCase().indexOf('login') !== -1) {
    this.botState.isLoggedIn = true;
    console.log('[' + this.getTimestamp() + '] ✅ Bot successfully logged in!');
  }
  if (message.toLowerCase().indexOf('register') !== -1) {
    this.botState.isRegistered = true;
    console.log('[' + this.getTimestamp() + '] ✅ Bot successfully registered!');
  }
};

/**
 * Get current timestamp
 */
EventHandler.prototype.getTimestamp = function() {
  var now = new Date();
  var h = ('0' + now.getHours()).slice(-2);
  var m = ('0' + now.getMinutes()).slice(-2);
  var s = ('0' + now.getSeconds()).slice(-2);
  return h + ':' + m + ':' + s;
};

/**
 * Helper: Sleep for specified milliseconds
 */
EventHandler.prototype.sleep = function(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
};

/**
 * Get bot state
 */
EventHandler.prototype.getState = function() {
  return this.botState;
};

module.exports = EventHandler;

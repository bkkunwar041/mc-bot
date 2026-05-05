/**
 * Command Handler Module
 * Handles execution of chat commands
 */

var config = require('./config');

function CommandHandler(bot) {
  this.bot = bot;
  this.commandQueue = [];
  this.isProcessing = false;
}

/**
 * Queue a command for execution
 * @param {string} command - The command to execute
 * @param {number} delay - Delay before executing (optional)
 */
CommandHandler.prototype.queueCommand = function(command, delay) {
  var self = this;
  delay = delay || 0;
  
  return new Promise(function(resolve) {
    self.commandQueue.push({ command: command, delay: delay, resolve: resolve });
    self.processQueue();
  });
};

/**
 * Process queued commands sequentially
 */
CommandHandler.prototype.processQueue = function() {
  var self = this;
  
  if (this.isProcessing || this.commandQueue.length === 0) return;

  this.isProcessing = true;

  var processNext = function() {
    if (self.commandQueue.length === 0) {
      self.isProcessing = false;
      return;
    }

    var item = self.commandQueue.shift();
    var command = item.command;
    var delay = item.delay;
    var resolve = item.resolve;

    setTimeout(function() {
      try {
        self.executeCommand(command);
        setTimeout(function() {
          resolve(true);
          processNext();
        }, config.delays.betweenCommands);
      } catch (error) {
        console.error('[ERROR] Failed to execute command: ' + command);
        console.error(error);
        resolve(false);
        processNext();
      }
    }, delay);
  };

  processNext();
};

/**
 * Execute a single command
 * @param {string} command - The command to execute
 */
CommandHandler.prototype.executeCommand = function(command) {
  if (!this.bot || !this.bot.chat) {
    console.error('[ERROR] Bot not ready for chat');
    return;
  }

  console.log('[COMMAND] Executing: ' + command);
  this.bot.chat(command);
};

module.exports = CommandHandler;

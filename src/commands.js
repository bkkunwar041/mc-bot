/**
 * Command Handler Module
 * Handles execution of chat commands
 */

const config = require('./config');

class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandQueue = [];
    this.isProcessing = false;
  }

  /**
   * Queue a command for execution
   * @param {string} command - The command to execute
   * @param {number} delay - Delay before executing (optional)
   */
  async queueCommand(command, delay = 0) {
    return new Promise((resolve) => {
      this.commandQueue.push({ command, delay, resolve });
      this.processQueue();
    });
  }

  /**
   * Process queued commands sequentially
   */
  async processQueue() {
    if (this.isProcessing || this.commandQueue.length === 0) return;

    this.isProcessing = true;

    while (this.commandQueue.length > 0) {
      const { command, delay, resolve } = this.commandQueue.shift();

      if (delay > 0) {
        await this.sleep(delay);
      }

      try {
        this.executeCommand(command);
        await this.sleep(config.delays.betweenCommands);
        resolve(true);
      } catch (error) {
        console.error(`[ERROR] Failed to execute command: ${command}`);
        console.error(error);
        resolve(false);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Execute a single command
   * @param {string} command - The command to execute
   */
  executeCommand(command) {
    if (!this.bot || !this.bot.chat) {
      console.error('[ERROR] Bot not ready for chat');
      return;
    }

    console.log(`[COMMAND] Executing: ${command}`);
    this.bot.chat(command);
  }

  /**
   * Helper: Sleep for specified milliseconds
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Clear the command queue
   */
  clearQueue() {
    this.commandQueue = [];
    this.isProcessing = false;
  }
}

module.exports = CommandHandler;

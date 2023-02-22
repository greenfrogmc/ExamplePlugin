/**
 * ░██████╗░██████╗░███████╗███████╗███╗░░██╗███████╗██████╗░░█████╗░░██████╗░
 * ██╔════╝░██╔══██╗██╔════╝██╔════╝████╗░██║██╔════╝██╔══██╗██╔══██╗██╔════╝░
 * ██║░░██╗░██████╔╝█████╗░░█████╗░░██╔██╗██║█████╗░░██████╔╝██║░░██║██║░░██╗░
 * ██║░░╚██╗██╔══██╗██╔══╝░░██╔══╝░░██║╚████║██╔══╝░░██╔══██╗██║░░██║██║░░╚██╗
 * ╚██████╔╝██║░░██║███████╗███████╗██║░╚███║██║░░░░░██║░░██║╚█████╔╝╚██████╔╝
 * ░╚═════╝░╚═╝░░╚═╝╚══════╝╚══════╝╚═╝░░╚══╝╚═╝░░░░░╚═╝░░╚═╝░╚════╝░░╚═════╝░
 *
 *
 * Copyright 2023 andriycraft
 * Github: https://github.com/andriycraft/GreenFrogMCBE
 */
/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
const CommandManager = require("../../src/player/CommandManager");
const ToastManager = require("../../src/player/Toast");
const ShutdownAPI = require("../../src/server/ShutdownAPI");
const GameMode = require("../../src/player/GameMode");

const Logger = require("../../src/server/Logger");
const Title = require("../../src/player/Title");
const Form = require("../../src/player/Form");
const Colors = require("../../src/player/Colors");
const FormTypes = require("../../src/player/FormTypes");
const Titles = require("../../src/network/packets/types/Titles");

// This is a simple plugin that tests the GreenFrog's API
// Another example: https://github.com/greenfrogmc/DonationsPlugin

// REMEMBER: You can just remove events that you don't use

module.exports = {
  onLoad() {
    Logger.log(`Example > Hello, world`);
  },

  onShutdown() {
    Logger.log(`Example > Bye, world`);
  },

  PlayerJoinEvent(server, player, event) {
    Logger.log(`Player joined: ${player.username}`);
  },

  PlayerLeaveEvent(server, player, event) {
    Logger.log(`Player left: ${player.username}`);
  },

  PlayerHasNoResourcePacksInstalledEvent(server, player, event) { },
  onResourcePacksRefused(server, player, event) { },
  onPlayerHaveAllPacks(server, player, event) { },
  onResourcePacksCompleted(server, player, event) { },

  PlayerKickEvent(server, player, msg, event) {
    Logger.log(`Player got kicked! ${player.username}`);
  },

  PlayerSpawnEvent(server, player, event) {
    Logger.log(`Player spawned! ${player.username}`);
    // Registers a command
    const cmdmanager = new CommandManager();
    cmdmanager.addCommand(player, "testcommand", "This is my first command!");
    cmdmanager.addCommand(player, "kickmepls", "Kicks you!");
    cmdmanager.addCommand(
      player,
      "stopserver",
      "Stop server command that is registered by the example plugin"
    );
    // addCommand syntax: ("name", "description")

    // This code executes when player is spawned (this event executes after onJoin() event)
  },

  PlayerChatEvent(server, player, message, event) {
    Logger.log(`${player.username} said "${message}"`);
    player.sendMessage(player, "You just sent a chat message: " + message);
  },

  PlayerCommandExecuteEvent(server, player, command, event) {
    Logger.log(`Command executed by ${player.username}: ${command}`);
    switch (command.toLowerCase()) {
      case "/testcommand":
        // player.username returns the player's username
        // player.ip returns the player's ip without port
        // player.port returns the player's port
        // player.fullip returns player's ip and port
        // player.gamemode returns player's gamemode
        // player.offline checks if the player is online or not
        // player.op returns the player's op status
        // player.permlevel returns the player's permission level
        player.sendMessage(`Hi ${player.username}. Your IP is: ${player.ip}`); // This code sends message TO player
        player.sendMessage(Colors.red + "This message is red");
        player.chat(`This message was sent by example plugin`); // This code sends message AS A player
        player.setGamemode(GameMode.CREATIVE); // This updates the player gamemode. Valid gamemodes are: "creative", "survival", "adventure", "spectator" or "fallback"

        const Toast = new ToastManager();
        Toast.title = "Hello, world";
        Toast.message = "This is an example of a Toast";
        Toast.send(player);

        const titlepk = new Title()
        titlepk.setFadeinTime(10)
        titlepk.setFadeoutTime(10)
        titlepk.setStayTime(10)
        titlepk.setText("Title!")
        titlepk.setType(Titles.TITLE)
        titlepk.send(player)

        const subtitle = new Title()
        subtitle.setText("Subtitle!")
        subtitle.setType(Titles.SUBTITLE)
        subtitle.send(player)

        const actionbar = new Title()
        actionbar.setText("Actionbar!")
        actionbar.setType(Titles.ACTIONBAR)
        actionbar.send(player)

        // Create a new form
        const form = new Form();

        // Set form properties
        form.type = FormTypes.CUSTOMFORM; // Form types: CUSTOMFORM, FORM
        form.title = "Title"; // Must be a string
        form.id = 0; // Must be a number
        form.buttons = [{ text: "Button" }]; // Must be a JSON object
        // form.actions = "content" Sets the text for the form. (must be a string) | WARNING >>> works only for FORM type (not CUSTOMFORM). If you want to use custom form see the code below 

        // Add form inputs | WARNING >>> (works ONLY for CUSTOMFORM type)
        form.addInput("Hello, world", "Placeholder"); // text and placeholder
        form.addText("text"); // text only
        form.addDropdown("dropdown", ["Option 1", "Option 2", "Option 3"]); // dropdown label and options array
        form.addToggle("Toggle"); // toggle label
        form.addSlider("slider", 0, 100, 50); // slider label, (min, max, and step)

        // Send the form to a player/client
        form.send(player);

        player.setTime(17000); // Updates the player time

        setTimeout(() => {
          if (!player.offline) {
            // Make sure to check if the player is still online after doing setTimeout() that uses player API in production plugins
            player.transfer("127.0.0.1", 19132); // Moves player to another server
            //              ^ ip         ^ port
          }
        }, 30000);

        // ADVANCED API
        // player.write(packet_name, json_packet_data)
        // player.disconnect("reason") // force disconnect the player - may break other plugins
        break;
      case "/stopserver":
        player.sendMessage("Stopping server...");
        ShutdownAPI.shutdownServer();
        break;
      case "/kickmepls":
        player.kick("You were disconnected");
        break;
    }
  },

  ServerConsoleCommandExecutedEvent(server, command, event) {
    Logger.log(`Console executed command: ${command}`);
    // This code executes when console executes a command
  },

  ServerInternalServerErrorEvent(server, player, error, event) {
    Logger.log(`Server error: ${error}`);
    // This code executes when there is an server error
  },

  PlayerMoveEvent(server, player, location, event) {
    Logger.log(`Player moved to ${location}`);
    // This code executes when player moves
  },

  PlayerGamemodeChangeEvent(server, player, gamemode, event) {
    Logger.log(`Gamemode changed to ${gamemode}`);
    // This code executes when player changes his own gamemode
  },

  ServerToClientChat(server, player, msg, event) {
    Logger.log(`Server to client message: ${msg}`);
    // This code executes when the server sends a chat message to player
  },

  ServerToastRequest(player, server, title, msg, event) {
    Logger.log(`Toast: ${title}:${msg}`);
    // This code executes when the server sends toast to player
  },

  PlayerTransferEvent(player, server, address, port, event) {
    Logger.log(`Player transfered to ${address}:${port}`);
    // This code executes when player transfers to another server
    // WARNING: Functions like player.sendMessage(), player.transfer() will not work anymore on that player
  },

  PlayerFormResponseEvent(server, player, packet, event) {
    Logger.log(`Form response from ${player.username}`);
    player.sendMessage("Response: " + JSON.stringify(packet).toString());
    // This code executes when:
    // a) Player clicks a button in a form
    // b) Player closes a form
    // c) Player inputs text into form
    // d) Player selects an option in a form
  },
};

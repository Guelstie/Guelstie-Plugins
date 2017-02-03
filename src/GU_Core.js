
//  @file Guelstie Core is a utility plugin for RPG Maker MV.
//  @author Guelstie Project
//  @version 0.0.1

// =============================================================================
// GU_Core.js
// =============================================================================
/*:
 @plugindesc v 0.0.1 Guesltie Project core plugin.

 @author Guelstie Project

 @param ================
 @param  Reoslution Options
 @param ================

 @param Screen Width
 @desc Adjusts the resoltuion (width) of the screen.
 Default: 816
 @default 816

 @param Screen Height
 @desc Adjusts the resoltuion (height) of the screen.
 Default: 624
 @default 624

 @param Tile Size
 @desc The size of the tiles you want to use in game.
 Default: 48
 @default 48

 @param Start Full Screen
 @desc Start the game in full screen mode.
 Default: false
 @default false

 @param Re-scale Backgrounds
 @desc This will scale backgrounds to new resolution.
 Default: title:false, gameover:false, battle:false
 @default title:false, gameover:false, battle:false

 @param Re-position Battlers
 @desc This will re-position the battlers to new reolution.
 Default: false
 @default false

 @param ================
 @param  Debug Options
 @param ================

 @param Skip Title
 @desc Skip the title screen
 @default false

 @param Print Debug
 @desc Prints the name and version of this plugin and RPG Maker MV Version.
 @default false

 @param Open Console
 @desc Open Console on bootup.
 @default false

 @param Show FPS
 @desc Open FPS window on bootup.
 @default false
 */

'use strict'

/** @namespace GUCore - Will contain all plugin aliases parameters and exports */
const GUCore = {}

/** @namespace GU - A shorter version of GUCore, for easier access */
const GU = GUCore

;(function ($) {
  /** @property Core - Will contain all aliases, parameters for this core plugin */
  GU.Core = GU.Core || {}

  /** @property Core - Will contain all aliases for this core plugin */
  GU.Core.Alias = GU.Core.Alias || {}

  /** @property VERSION - The current version of GUCore */
  GU.Core.VERSION = '0.1.0'

  /** @property Plugins - Will contain all plugins registered with GUCore */
  const Plugins = {}

  GU.Core.Parameters = PluginManager.parameters(PluginManager._scripts[0])
  GU.Core.Param = GU.Core.Param || {}

  const Parameters = GU.Core.Parameters
  const Param = GU.Core.Param

  /* Resolution Setting */
  Param.screenWidth = Number(Parameters['Screen Width'] || 816)
  Param.screenHeight = Number(Parameters['Screen Height'] || 624)
  Param.tileSize = Number(Parameters['Tile Size'] || 48)
  Param.scaleBacks = String(Parameters['Re-scale Backgrounds'])
  Param.reposBattlers = Boolean(Parameters['Re-position Battlers'] === 'true' || false)
  Param.startFullScreen = Boolean(Parameters['Start Full Screen'] === 'true' || false)

  /* Debug Setting */
  Param.openConsole = Boolean(Parameters['Open Console'] === 'true' || false)
  Param.printDebugInfo = Boolean(Parameters['Print Debug'] === 'true' || false)
  Param.skipTitle = Boolean(Parameters['Skip Title'] === 'true' || false)
  Param.fpsStart = Boolean(Parameters['Show FPS'] === 'true' || false)

  /**
   * Print the namespace module version to console.
   */
  if (Param.printDebugInfo) {
    const coreArgs = ['\n %c %c %c GUCore.js ' + GU.VERSION + ' %c ' + ' \n\n', 'background: #092496; padding:5px 0;', 'background: #092496; padding:5px 0;', 'color: #3cb4a6; background: #0b0b14; padding:5px 0;', 'background: #092496; padding:5px 0;']
    const mvArgs = ['\n %c %c %c MV ' + Utils.RPGMAKER_VERSION + ' %c ' + ' \n\n', 'background: #092496; padding:5px 0;', 'background: #092496; padding:5px 0;', 'color: #3cb4a6; background: #0b0b14; padding:5px 0;', 'background: #092496; padding:5px 0;']
    window.console.log.apply(console, coreArgs)
    window.console.log.apply(console, mvArgs)
  }

  /**
   * A class containing basic and commonly used functions and methods
   *
   * @class Utilities
   */
  class Utilities {
    constructor () {
      throw new Error('This is a static class')
    }

 /**
     * Checks the type to see if it's an object
     *
     * @param {any} type - The object or type you want to check as an object.
     * @returns {Boolean} Return true if the type is an object.
     *
     * @memberOf Utilities
     */
    static isObject (type) {
      return type && Object.prototype.toString.call(type) === '[object Object]'
    }

    /**
     * Checks the type to see if it's a function
     *
     * @param {any} type - The object or type you want to check as a function.
     * @returns {Boolean} Return true if the type is a function.
     *
     * @memberOf Utilities
     */
    static isFunction (type) {
      return type && Object.prototype.toString.call(type) === '[object Function]'
    }

    /**
     * Checks the type to see if it's an array
     *
     * @param {any} type - The object or type you want to check as an array.
     * @returns {Boolean} Return true if the type is an array.
     *
     * @memberOf Utilities
     */
    static isArray (type) {
      return type && Object.prototype.toString.call(type) === '[object Array]'
    }

    /**
     * Checks if an object is defined by comparing to 'undefined' and checking existence in the window object
     *
     * @param {any} obj - The object to check
     * @returns {Boolean} Return true if the object is defined
     *
     * @memberOf Utilities
     */
    static isDefined (obj) {
      return typeof obj !== 'undefined' || [obj] in window
    }

    /**
     * Checks if an object is empty and has no properties
     * @param {any} obj - The object to check for properties
     * @returns {Boolean} Return false if the object has a property
     *
     * @memberOf Utilities
     */
    // * TODO - Allow for checking arrays.
    static isEmpty (obj) {
      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false
        }
      }
      return true
    }

    /**
     * Converts strings to objects. Strings must have format 'foo: bar, bar: foo'
     *
     * @param {any} type - The type to convert to an object
     * @returns {Object} Return an object, if string it outer whitespace
     *
     * @memberOf Utilities
     */
    static toObj (type) {
      const obj = {}
      if (typeof type === 'string') {
        const cleanStr = type.trim()
        const properties = cleanStr.split(', ')
        properties.forEach((property) => {
          const tup = property.split(':')
          obj[tup[0]] = !isNaN(tup[1]) ? parseInt(tup[1], 10) : tup[1].trim()
        })
        return obj
      }
    }

    /**
     * Converts an object or string into an array
     *
     * @static
     * @param {any} type - The object or string to convert to an array.
     * @returns {Array} Returns an array of the object or string assigned
     *
     * @memberOf Utilities
     */
    static toArray (type) {
      const newArr = []
      if (typeof type === 'object') {
        return Array.prototype.slice.call(type)
      }
      if (typeof type === 'string') {
        const cleanStr = type.trim()
        const strArr = cleanStr.includes(',') ? cleanStr.split(',') : cleanStr.split(' ')
        for (let i = 0; i < strArr.length; i++) {
          const index = !isNaN(strArr[i]) ? parseInt(strArr[i], 10) : strArr[i].trim()
          newArr.push(index)
        }
        return newArr
      }
    }

    /**
     * Converts a string to a boolean. String must contain one of the following...
     * true, yes, enable, false, no, disable
     *
     * @static
     * @param {String} string - The string you want to convert to a boolean
     * @returns {Array} Returns a true if string matches critera.
     *
     * @memberOf Utilities
     */
    static toBool (string) {
      switch (string.toLowerCase()) {
        case 'true':
          return true
        case 'false':
          return false
        case 'yes':
          return true
        case 'no':
          return false
        case 'enable':
          return true
        case 'disable':
          return false
        default:
          throw new Error('GU Core: Cannot parse string to boolean')
      }
    }

    /**
     * Converts an object to a string.
     *
     * @param {Object} obj - The object to convert to a string
     * @returns {String} Returns a string in this format 'property::value'
     *
     * @memberOf Utilities
     */
    static toString (obj) {
      let str = ''
      for (const p in obj) {
        if (obj.hasOwnProperty(p)) {
          str += p + '::' + obj[p] + '\n'
        }
      }
      return str
    }

    /**
     * An eval with try error method, it will try to eval and throw error if not succesful.
     *
     * @param {Object} text - The string/expression to evaluate
     * @returns {Result} The result of the evaulated string/expression.
     *
     * @memberOf Utilities
     */
    static tryEval (text) {
      try {
        return eval(text) // eslint-disable-line no-eval
      } catch (e) {
        throw new Error('There was a problem evaulting your code', e)
      }
    }

    /**
     * Will check if a plugin is registered with GUCore plugin container.
     *
     * @static
     * @param {String} plugin - The name of the plugin.
     * @returns Return true if plugin is registered in GU.Plugins.
     *
     * @memberOf Utilities
     */
    static isPluginRegistered (plugin) {
      if (typeof Plugins[plugin] !== 'undefined') {
        return true
      }
      return false
    }

    /**
     * Registers the plugin with GU.Plugins object and checks the required plugins required for the plugin to work.
     *
     * @param  {string} name - A string of name of the plugin being registered.
     * @param  {string} version - A string of the version of plugin being registered.
     * @param  {string} author - A string for the name of the author of the plugin.
     * @param  {array}  required - An array of required plugins for the plugin being registered
     * @returns {none}
     *
     * @memberOf Utilities
     */
    static registerPlugin (name, version, author, required) {
      if (!name) {
        throw new Error('No name for registration of plugin! Please ensure you entered a name')
      }
      if (this.isPluginRegistered(name)) {
        throw new Error('Plugin already registered with PluginManager. Please use a unique name')
      }

      Plugins[name] = {}

      Plugins[name].Alias = {}
      Plugins[name].Version = version
      Plugins[name].Author = author
      Plugins[name].Required = required
      // Check required plugins if needed.
      if (required) {
        Plugins[name].Required.forEach((plugin) => {
          if (!PluginManager.isPlugin(plugin) && !this.isPluginRegistered(plugin)) {
            throw new Error('You need to have the required plugin ' + plugin + ' for ' + name + ' to work correctly.')
          }
        })
      }
    }

    /**
     * Retieves plugins namespace module for access to aliases, and exported objects/functions.
     *
     * @static
     * @param {Object} name - The utility to aquire, if you only need one..
     * @param {Boollean} all - Aquire all plugins?
     * @returns {Boolean} Return the plugins namepsace/module
     *
     * @memberOf Uti  lities
     */
    static requirePlugin (all, name) {
      if (all) {
        return Plugins
      }
      if (!this.isPluginRegistered(name)) {
        throw new Error('Unable to find a registered plugin by the name: ' + name)
      }
      return Plugins[name]
    }

    /**
     * Retieves a registered plugins aliased methods.
     *
     * @static
     * @param {String} pluginName
     * @param {Boolean} all
     * @param {String} aliasName
     * @returns {Boolean} Return the plugins aliased methods.
     *
     * @memberOf Utilities
     */
    static requireAlias (pluginName, all, aliasName) {
      if (!this.isPluginRegistered(pluginName)) {
        throw new Error('Unable to find a registered plugin by the name: ' + pluginName)
      }
      if (all) {
        return Plugins[pluginName].Alias
      } else if (aliasName) {
        return Plugins[pluginName].Alias[aliasName]
      }
    }
    /* End Of Utilities Class */
  }

/** -=-=-=-=-=-=-=-=-=-=-=-==--=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=---=-=-==--=-==-
 * RPG Maker MV Functionality And Improvments
 *
 * -=-=-=-=-=-=-=-=-=-=-=-==--=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=---=-=-==--=-==- */

/** -----------------------------------------------------------------------
 * DataManager >>
 *
 ------------------------------------------------------------------------ */
/**
 * @module DataManager
 * @desc This closure function adds and overwrites the functionality of the DataManager class
 *
 */
  (function (DM, Alias) {
    // saveData global for all save contents.
    const saveData = {}

    /**
     * Will add the data you want to save to an object which will later be added to
     * DataManager save contents and saved to a save file. Use before game starts or after plugin
     * registration.
     *
     * @param {String} name - The name of the data to save.
     * @param {Object} data - The data you want to save.
     */
    DM.addToSaveContents = function (name, data) {
      saveData[name] = { name: name, data: data }
    }

    /**
     * Aliased method for addding in save data for LTN Plugins.
     *
     * @memberof module:DataManager
     *
     */
    Alias.DataManager_makeSaveContents = $.makeSaveContents

    DM.makeSaveContents = function () {
      const contents = Alias.DataManager_makeSaveContents.call(this)
      if (Utilities.isEmpty(saveData)) {
        for (const name in saveData) {
          if (saveData.hasOwnProperty(name)) {
            contents[name] = saveData[name].data
          }
        }
      }
      return contents
    }

    /**
     * Aliased method for extracting save data for GU Plugins.
     *
     * @memberof module:DataManager
     *
     */
    const DataManager_extractSaveContents = $.extractSaveContents

    DM.extractSaveContents = function (contents) {
      DataManager_extractSaveContents.call(this, contents)
      if (Utilities.isEmpty(saveData)) {
        for (const name in saveData) {
          if (saveData.hasOwnProperty(name)) {
            saveData[name].data = contents[name]
          }
        }
      }
    }
  })(DataManager, GU.Core.Alias);


/** -----------------------------------------------------------------------
 * SceneManager >>
 *
 ------------------------------------------------------------------------ */
/**
 * @module SceneManager
 * @desc This closure function adds and overwrites the functionality of the SceneManager class
 *
 */
  (function (SM) {
    SceneManager._screenWidth = Number(GU.Core.Param.screenWidth)
    SceneManager._screenHeight = Number(GU.Core.Param.screenHeight)
    SceneManager._boxWidth = Number(GU.Core.Param.screenWidth)
    SceneManager._boxHeight = Number(GU.Core.Param.screenHeight)

    const Alias_SceneManager_run = SM.run
    SM.run = function (sceneClass) {
      Alias_SceneManager_run.call(this, sceneClass)
      SM.resizeToResolution()
      SM.openDebugTools()
      if (GU.Core.Param.startFullScreen) { Graphics._requestFullScreen() }
    }

    /**
     * NEW Method
     * Resizes the window to fit the resolution set in parameters
     * @memberOf SceneManager
     */
    SM.resizeToResolution = function () {
      const resizeWidth = Graphics.boxWidth - window.innerWidth
      const resizeHeight = Graphics.boxHeight - window.innerHeight

      window.moveBy(-1 * resizeWidth / 2, -1 * resizeHeight / 2)
      window.resizeBy(resizeWidth, resizeHeight)
    }

   /**
    * NEW Method
    * Activates the fps meter and console on bootup.
    * @memberOf SceneManager
    */
    SM.openDebugTools = function () {
      if (GU.Core.Param.openConsole && (Utils.isNwjs() && Utils.isOptionValid('test'))) {
        const _debugWindow = require('nw.gui').Window.get().showDevTools()
        _debugWindow.moveTo(0.1, 0.5)
        window.focus()
        if (GU.Core.Param.fpsStart) { Graphics._fpsMeter.show() }
      }
    }

    /**
     * NEW Method
     * Chekcs if the current scene is equal to the scene argument given
     *
     * @param {String} sceneClass - The Scenes constructor name
     * @return {Boolean} Returns true if it's the current scene
     *
     * @memberOf SceneManager
    */
    SM.isScene = function (sceneClass) {
      return SceneManager._scene.constructor === sceneClass
    }

    /**
     * NEW Method
     * Chekcs if the current scene is an instance of the scene argument given
     *
     * @param {String} sceneClass - The Scenes constructor name
     * @return {Boolean} Returns true if ithe current scene is an instance of the argument given
     *
     * @memberOf SceneManager
    */
    SM.isSceneOf = function (sceneClass) {
      return SceneManager._scene instanceof sceneClass
    }
  })(SceneManager)

    /** -----------------------------------------------------------------------
     * Scene_Boot >>
     *
     ------------------------------------------------------------------------ */
    /**
     * @module Scene_Boot
     * @desc This closure function extends the functionality of RMMV's Scene_Boot class
     */
    ; (function (SB) {
      /** * Skip title on boot. */
      const alias_Scene_Boot_start = SB.start
      SB.start = function () {
        if (GU.Core.Param.skipTitle) {
          SoundManager.preloadImportantSounds()
          if (DataManager.isBattleTest()) {
            DataManager.setupBattleTest()
            SceneManager.goto(Scene_Battle)
          } else if (DataManager.isEventTest()) {
            DataManager.setupEventTest()
            SceneManager.goto(Scene_Map)
          } else {
            this.checkPlayerLocation()
            DataManager.setupNewGame()
            SceneManager.goto(Scene_Map)
          }
          this.updateDocumentTitle()
        } else {
          alias_Scene_Boot_start.call(this)
        }
      }
    })(Scene_Boot.prototype)

  /** -----------------------------------------------------------------------
   * PluginManager >>
   *
   ------------------------------------------------------------------------ */
   /**
    * @module PluginManager
    * @desc This closure function extends the functionality of RMMV's PluginManager
    */
    ;(function (PM) {
      /* globals $plugins */

      /**
       * Will get the plugin ID in the plugin description instead of the plugin filename.
       *
       * @author Lavra
       * @static
       * @param {String} plugin - The name of the plugin.
       * @returns {Boolean} Return the plugins aliased methods.
       *
       * @memberOf PluginManager
       */
      PM.getParameters = function (plugin) {
        return $plugins.filter((p) => p.description.contains('<' + plugin + '>'))[0].parameters
      }

      /**
       * Will check if a plugin is in the manager and contains the name in description.
       *
       * @author Lavra
       * @static
       * @param {String} plugin - The name of the plugin.
       * @returns {Boolean} Return true if the plugin name exists in the pluign description
       *
       * @memberOf PluginManager
       */
      PM.isPlugin = function (plugin) {
        const pluginRegistered = $plugins.filter((p) => p.description.contains('<' + plugin + '>'))
        if (pluginRegistered.length <= -1) {
          return false
        }
        return true
      }
    })(PluginManager)

  /* -------------- Exports -------------- */
  // GU.Utilities
  $.Utilities = Utilities
})(GU)


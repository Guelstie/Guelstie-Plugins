/**
 * @file Guelstie Core is a utility plugin for RPG Maker MV.
 * @author Guelstie Project
 * @version 0.0.1
 */
// =============================================================================
// GU_Core.js
// =============================================================================
/*:
 @plugindesc v 0.0.1 Guesltie Project core plugin.

 @author Guesltie Project

 @param ================
 @param  Resolution Options
 @param ================

 @param Screen Width
 @desc Adjusts the resoltuion (width) of the screen.
 Default: 816
 @default 816

 @param Screen Height
 @desc Adjusts the resoltuion (height) of the screen.
 Default: 624
 @default 624
 */

'use strict';

/** @namespace GU - Will contain all plugin aliases parameters and exports */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GU = {};(function ($) {
  /** @property Core - Will contain all aliases, parameters for this core plugin */
  var Core = {};

  /** @property Plugins - Will contain all plugins registered by the GU core plugin */
  var Plugins = {};

  /**
   * A class containing basic and commonly used functions and methods
   *
   * @class Utilities
   */

  var Utilities = function () {
    function Utilities() {
      _classCallCheck(this, Utilities);

      throw new Error('This is a static class');
    }

    /**
        * Checks the type to see if it's an object
        *
        * @param {any} type - The object or type you want to check as an object.
        * @returns {Boolean} Return true if the type is an object.
        *
        * @memberOf Utilities
        */


    _createClass(Utilities, null, [{
      key: 'isObject',
      value: function isObject(type) {
        return type && Object.prototype.toString.call(type) === '[object Object]';
      }

      /**
       * Checks the type to see if it's a function
       *
       * @param {any} type - The object or type you want to check as a function.
       * @returns {Boolean} Return true if the type is a function.
       *
       * @memberOf Utilities
       */

    }, {
      key: 'isFunction',
      value: function isFunction(type) {
        return type && Object.prototype.toString.call(type) === '[object Function]';
      }

      /**
       * Checks the type to see if it's an array
       *
       * @param {any} type - The object or type you want to check as an array.
       * @returns {Boolean} Return true if the type is an array.
       *
       * @memberOf Utilities
       */

    }, {
      key: 'isArray',
      value: function isArray(type) {
        return type && Object.prototype.toString.call(type) === '[object Array]';
      }

      /**
       * Checks if an object is defined by comparing to 'undefined' and checking existence in the window object
       *
       * @param {any} obj - The object to check
       * @returns {Boolean} Return true if the object is defined
       *
       * @memberOf Utilities
       */

    }, {
      key: 'isDefined',
      value: function isDefined(obj) {
        return typeof obj !== 'undefined' || [obj] in window;
      }

      /**
       * Checks if an object is empty and has no properties
       * @param {any} obj - The object to check for properties
       * @returns {Boolean} Return false if the object has a property
       *
       * @memberOf Utilities
       */
      // * TODO - Allow for checking arrays.

    }, {
      key: 'isEmpty',
      value: function isEmpty(obj) {
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            return false;
          }
        }
        return true;
      }

      /**
       * Converts strings to objects. Strings must have format 'foo: bar, bar: foo'
       *
       * @param {any} type - The type to convert to an object
       * @returns {Object} Return an object, if string it outer whitespace
       *
       * @memberOf Utilities
       */

    }, {
      key: 'toObj',
      value: function toObj(type) {
        var obj = {};
        if (typeof type === 'string') {
          var cleanStr = type.trim();
          var properties = cleanStr.split(', ');
          properties.forEach(function (property) {
            var tup = property.split(':');
            obj[tup[0]] = !isNaN(tup[1]) ? parseInt(tup[1], 10) : tup[1].trim();
          });
          return obj;
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

    }, {
      key: 'toArray',
      value: function toArray(type) {
        var newArr = [];
        if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
          return Array.prototype.slice.call(type);
        }
        if (typeof type === 'string') {
          var cleanStr = type.trim();
          var strArr = cleanStr.includes(',') ? cleanStr.split(',') : cleanStr.split(' ');
          for (var i = 0; i < strArr.length; i++) {
            var index = !isNaN(strArr[i]) ? parseInt(strArr[i], 10) : strArr[i].trim();
            newArr.push(index);
          }
          return newArr;
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

    }, {
      key: 'toBool',
      value: function toBool(string) {
        switch (string.toLowerCase()) {
          case 'true':
            return true;
          case 'false':
            return false;
          case 'yes':
            return true;
          case 'no':
            return false;
          case 'enable':
            return true;
          case 'disable':
            return false;
          default:
            throw new Error('GU Core: Cannot parse string to boolean');
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

    }, {
      key: 'toString',
      value: function toString(obj) {
        var str = '';
        for (var p in obj) {
          if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
          }
        }
        return str;
      }

      /**
       * An eval with try error method, it will try to eval and throw error if not succesful.
       *
       * @param {Object} text - The string/expression to evaluate
       * @returns {Result} The result of the evaulated string/expression.
       *
       * @memberOf Utilities
       */

    }, {
      key: 'tryEval',
      value: function tryEval(text) {
        try {
          return eval(text); // eslint-disable-line no-eval
        } catch (e) {
          throw new Error('There was a problem evaulting your code', e);
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

    }, {
      key: 'isPluginRegistered',
      value: function isPluginRegistered(plugin) {
        if (typeof Plugins[plugin] !== 'undefined') {
          return true;
        }
        return false;
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

    }, {
      key: 'registerPlugin',
      value: function registerPlugin(name, version, author, required) {
        var _this = this;

        if (!name) {
          throw new Error('No name for registration of plugin! Please ensure you entered a name');
        }
        if (this.isPluginRegistered(name)) {
          throw new Error('Plugin already registered with PluginManager. Please use a unique name');
        }

        Plugins[name] = {};

        Plugins[name].Alias = {};
        Plugins[name].Version = version;
        Plugins[name].Author = author;
        Plugins[name].Required = required;
        // Check required plugins if needed.
        if (required) {
          Plugins[name].Required.forEach(function (plugin) {
            if (!PluginManager.isPlugin(plugin) && !_this.isPluginRegistered(plugin)) {
              throw new Error('You need to have the required plugin ' + plugin + ' for ' + name + ' to work correctly.');
            }
          });
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
       * @memberOf Utilities
       */

    }, {
      key: 'requirePlugin',
      value: function requirePlugin(all, name) {
        if (all) {
          return Plugins;
        }
        if (!this.isPluginRegistered(name)) {
          throw new Error('Unable to find a registered plugin by the name: ' + name);
        }
        return Plugins[name];
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

    }, {
      key: 'requireAlias',
      value: function requireAlias(pluginName, all, aliasName) {
        if (!this.isPluginRegistered(pluginName)) {
          throw new Error('Unable to find a registered plugin by the name: ' + pluginName);
        }
        if (all) {
          return Plugins[pluginName].Alias;
        } else if (aliasName) {
          return Plugins[pluginName].Alias[aliasName];
        }
      }
      /* End Of Utilities Class */

    }]);

    return Utilities;
  }();

  /* -------------- Exports -------------- */


  $.Utilities = Utilities;
})(GU);
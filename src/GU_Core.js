/**
 * @file LTN Core is a utility plugin for RPG Maker MV.
 * @author LTN Games
 * @version 0.0.1
 */
// =============================================================================
// LTN_Core.js
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

'use strict'

/** @namespace GU - Will contain all plugin aliases parameters and exports */
const GU = {}

;(function ($) {
  /** @property Core - Will contain all aliases, parameters for this core plugin */
  const Core = {}

  /** @property Plugins - Will contain all plugins registered by the GU core plugin */
  const Plugins = {}

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
          throw new Error('LTN Core: Cannot parse string to boolean')
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
    /* End Of Utilities Class */
  }

  /* -------------- Exports -------------- */
  $.Utilities = Utilities
})(GU)


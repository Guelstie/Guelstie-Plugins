/**
 * @file Guelstie Ad-Sense core.
 * @author Guelstie Project
 * @version 0.1.2
 */
// =============================================================================
// GU_AdCore.js
// =============================================================================
/*:
 @plugindesc v 0.1.2 Guesltie Project Ad-Sense Core plugin.
 <GU_AdCore>

 @author Guesltie Project

 @param Ad Tag
 @desc The ad tag provided to you through your AdSense account.
 Default:
 @default

 @param Ad Locale
 @desc The language the Ads should be displayed in
 Default: en-us
 @default en-us

 @param Common Event Callback
 @desc The common event to run when an ad has succesfully finished.
 Default: 0
 @default 0

 ================================================================================
▼ TERMS OF USE
================================================================================

===============================================================================
▼ DEPENDENCIES
===============================================================================
 Requires GU Core.

===============================================================================
▼ INFORMATION
===============================================================================

 ============================================================================
 ▼ DONATIONS
 ============================================================================

===============================================================================
▼ INSTRUCTIONS
===============================================================================

 */

/* Google IMA SDK DOCS:
https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/
*/

/* PROTOTYPE, Test Build */

'use strict'
if (typeof GU === 'undefined') {
  const strA = 'You need to install the GU Core plugin'
  const strB = 'in order for this plugin to work! Please visit'
  const strC = '\n https://github.com/Guelstie/Guelstie-Plugins'
  const strD = ' to download the latest verison.'
  throw new Error(strA + strB + strC + strD)
} else {
  GU.Utilities.registerPlugin('AdCore', '0.1.2', 'LTNGames')
}

/**
 * Things To-Do / Information
 *
 * Will need to include the script tag for Google's IMA SDK script in the index.html, or it may cause bugs
 * Create check internet connectivity function for GU_Core
 * create countdown timer for ads
 * Add callbacks when an add has completed
 *
 */

(function ($) {
  $.Parameter = PluginManager.getParameters('GU_AdCore')
  $.Param = $.Param || {}

  $.Param.adTagUrl = $.Parameter['Ad Tag'] || null
  $.Param.locale = $.Parameter['Ad Locale']
  $.Param.commonEvent = $.Parameter['Common Event Callback']

  /** @property {Object} - IMA - Google's IMA SDK3 Framework for AdSense */
  let IMA = null

  /** @property {Object} - ADS - Will contain the AdsManager instance */
  let ADS = null

  /** Check if Google's IMA SDK is available */
  if (typeof google === 'undefined') {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = '//imasdk.googleapis.com/js/sdkloader/ima3.js'
    document.body.appendChild(script)
    script.onload = () => {
      IMA = google.ima
    }
    /* Add style.css to DOM */
    const css = document.createElement('link')
    css.type = 'text/css'
    css.src = '/style.css'
    document.body.appendChild(css)
  } else {
    IMA = google.ima
  }
  /**
   * Based on the Advanced example of the IMA SDK
   *
   * @class AdsManager
   */
  class AdsManager {
    constructor (videoPlayer) {
      this._videoPlayer = videoPlayer
      this._customClick = null
      this._contentComplete = false
      this._adDisplayContainer = null
      this._adsLoader = null
      this._adsManager = null
      this.initialize()
    }

    initialize () {
      const locale = $.Param.locale

      IMA.settings.setVpaidMode(IMA.ImaSdkSettings.VpaidMode.ENABLED)
      IMA.settings.setLocale(locale)
      this.createAdsDisplayContainer()
      this.addEventListeners()
    }

    createAdsDisplayContainer () {
      const adContainer = this._videoPlayer.adsContainer
      const contentPlayer = this._videoPlayer.video
      const customClick = this._videoPlayer.customClick
      this._customClick = customClick

      this._adDisplayContainer = new IMA.AdDisplayContainer(adContainer, contentPlayer, customClick)
      this._adsLoader = new IMA.AdsLoader(this._adDisplayContainer)
    }

    addEventListeners () {
      const loadedEvent = IMA.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED
      const errorEvent = IMA.AdErrorEvent.Type.AD_ERROR

      this._adsLoader.addEventListener(loadedEvent, this.onAdsManagerLoaded, false, this)
      this._adsLoader.addEventListener(errorEvent, this.onAdError, false, this)
    }

    initialUserAction () {
      this._adDisplayContainer.initialize()
      this._videoPlayer.video.load()
    }

    requestAds (adTagUrl) {
      const adsRequest = new IMA.AdsRequest()

      adsRequest.adTagUrl = adTagUrl
      adsRequest.linearAdSlotWidth = this._videoPlayer.width
      adsRequest.linearAdSlotHeight = this._videoPlayer.height
      adsRequest.nonLinearAdSlotWidth = this._videoPlayer.width
      adsRequest.nonLinearAdSlotHeight = this._videoPlayer.height
      this._adsLoader.requestAds(adsRequest)
    }

    onAdsManagerLoaded (adsLoadedEvent) {
      const contentPlayer = this._videoPlayer.video
      const adsRenderingSettings = new IMA.AdsRenderingSettings()

      adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true
      this._adsManager = adsLoadedEvent.getAdsManager(contentPlayer, adsRenderingSettings)
      this.processAdsManager(this._adsManager)
    }

    processAdsManager (adsManager) {
      let initWidth = 0
      let initHeight = 0
      const contentPauseEvent = IMA.AdEvent.Type.CONTENT_PAUSE_REQUESTED
      const contentResumeEvent = IMA.AdEvent.Type.CONTENT_RESUME_REQUESTED
      const errorEvent = IMA.AdErrorEvent.Type.AD_ERROR
      if (adsManager.isCustomClickTrackingUsed()) {
        this._customClick.style.display = 'table'
      }
      // Attach the pause/resume events.
      adsManager.addEventListener(contentPauseEvent, this.onAdPaused, false, this)
      adsManager.addEventListener(contentResumeEvent, this.onAdResume, false, this)
      // Handle errors.
      adsManager.addEventListener(errorEvent, this.onAdError, false, this)
      // Handle all ad length events, midpoint, first quartile, etc
      this.addEventsForAdsManager(adsManager)

      initWidth = this._videoPlayer._width
      initHeight = this._videoPlayer._height
      adsManager.init(initWidth, initHeight, IMA.ViewMode.NORMAL)
      adsManager.start()
    }

    /**
     * Handle all ad length events, midpoint, first quartile, etc
     *
     * @param {any} adsManager
     *
     * @memberOf AdsManager
     */
    addEventsForAdsManager (adsManager) {
      const events = [
        IMA.AdEvent.Type.ALL_ADS_COMPLETED, IMA.AdEvent.Type.CLICK,
        IMA.AdEvent.Type.COMPLETE, IMA.AdEvent.Type.FIRST_QUARTILE,
        IMA.AdEvent.Type.LOADED, IMA.AdEvent.Type.MIDPOINT, IMA.AdEvent.Type.PAUSED,
        IMA.AdEvent.Type.STARTED, IMA.AdEvent.Type.THIRD_QUARTILE
      ]

      for (const index in events) {
        if (events.hasOwnProperty(index)) {
          adsManager.addEventListener(events[index], this.onAdEvent, false, this)
        }
      }
    }

    pauseAd () {
      if (this._adsManager) {
        this._adsManager.pause()
      }
    }

    resumeAd () {
      if (this._adsManager) {
        this._adsManager.resume()
      }
    }

    adClicked () {
      console.log('Ad Clicked')
    }

    resize () {
      this._adsManager.resize(this._videoPlayer._width, this._videoPlayer._height, IMA.ViewMode.NORMAL)
      this._videoPlayer.updateVideo()
    }

    onAdComplete () {
      this.contentComplete = true
      this._adsManager.destroy()
      this._adsLoader.contentComplete()
      this._videoPlayer.updateVisibility()
      SceneManager.start()
      this._videoPlayer.replayAudio()
    }

    /**
     * The action to perform when the ad/video has been paused
     *
     *
     * @memberOf AdsManager
     */
    onAdPaused () {
      this._videoPlayer.pause()
      this._videoPlayer.removeOnVideoEnd(this.contentEnded)
    }

    /**
     * The action to perform when the ad or game has resumed.
     *
     *
     * @memberOf AdsManager
     */
    onAdResume () {
      this._videoPlayer.registerOnVideoEnd(this.contentEnded)
    }

    /**
     * Ad event handler, the action to perform when an adEvent has been triggered.
     *
     * @param {any} adEvent - The ad event to process
     *
     * @memberOf AdsManager
     */
    onAdEvent (adEvent) {
      const type = adEvent.type
      console.log('Ad event: ' + adEvent.type)
      switch (type) {
        case IMA.AdEvent.Type.CLICK:
          this.adClicked()
          break

        case IMA.AdEvent.Type.LOADED:
          this.onAdResume()
          this._videoPlayer.saveAudio()
          SceneManager.stop()
          break

        case IMA.AdEvent.Type.COMPLETE:
          this.onAdComplete()
          break

        default:
          break
      }
    }

    onAdError (adErrorEvent) {
      console.log(`Ad error: ${adErrorEvent.getError().toString()}`)
      if (this._adsManager) {
        this._adsManager.destroy()
      }
    }
  }

  /**
   * The AdSense video player for RPG Maker MV, creates all elements and acts as fallback for old devices
   *
   * @param {Number} width - The width of the video player
   * @param {Number} height - The height of the video player
   *
   * @class VideoAdPlayer
   */
  class VideoAdPlayer {
    constructor (width, height) {
      this._width = width
      this._height = height
      this.createContainerElements()
      this.preloadListener = null
      this._oldBgm = null
      this._oldBgs = null
      this._isReady = false
    }

    /**
     * Dynamically creates and appends the required DOM elements for google's IMA SDK
     *
     *
     * @memberOf VideoAdPlayer
     */
    createContainerElements () {
      // Create Elements
      const videoContainer = document.createElement('div')
      const video = document.createElement('video')
      const adsContainer = document.createElement('div')
      const customClickContainer = document.createElement('div')

      /* Set elemnts properties */
      videoContainer.id = 'videoPlayer'
      video.id = 'videoAd'
      adsContainer.id = 'adsContainer'
      video.style.opacity = 0
      customClickContainer.id = 'customClick'

      /* Add video container to the DOM */
      document.body.appendChild(videoContainer)

      /* Assign videoContainer to class property */
      this.videoContainer = document.getElementById('videoPlayer')

      /* Append adCotniner and customClick container as children to videoContainer*/
      this.videoContainer.appendChild(adsContainer)
      this.videoContainer.appendChild(video)
      this.videoContainer.appendChild(customClickContainer)
      this.adsContainer = this.videoContainer.childNodes[0]
      this.video = this.videoContainer.childNodes[1]
      this.customClickContainer = this.videoContainer.childNodes[2]

      /* Update elements dimensions and set isReady to true */
      this.updateVideo()
      this._isReady = true
    }

    /**
     * Aligns and centers ads, video and custom click containers.
     *
     *
     * @memberOf VideoAdPlayer
     */
    updateVideo () {
      this.video.width = this._width
      this.video.height = this._height
      this.adsContainer.height = this._height
      this.adsContainer.width = this._width
      this.customClickContainer.height = this._height
      this.customClickContainer.width = this._width
      this.videoContainer.style.zIndex = 4
      Graphics._centerElement(this.videoContainer)
      Graphics._centerElement(this.video)
      Graphics._centerElement(this.adsContainer)
      Graphics._centerElement(this.customClickContainer)
    }

    isReady () {
      return this._isReady
    }

    preloadContent (loadAction) {
      if (Utils.isMobileDevice() || Utils.isMobileSafari()) {
        this.preloadListener = loadAction
        this.video.addEventListener('loadmetadata', loadAction, false)
        this.video.load()
      } else {
        loadAction()
      }
    }

    removePreloadListener () {
      if (this.preloadListener) {
        this.video.removeEventListener('loadmetadata', this.preloadListener, false)
        this.preloadListener = null
      }
    }

    play () {
      this.video.play()
    }

    pause () {
      this.video.pause()
    }

    registerOnVideoEnd (callback) {
      console.log('Add Video End Listener')
      this.video.addEventListener('ended', callback, false)
    }

    removeOnVideoEnd (callback) {
      console.log('Remove Video End Listener')
      this.video.removeEventListener('ended', callback, false)
    }

    saveAudio () {
      this._oldBgm = AudioManager.saveBgm()
      this._oldBgs = AudioManager.saveBgs()
      AudioManager.stopBgm()
      AudioManager.stopBgs()
    }

    replayAudio () {
      if (this._oldBgm) {
        AudioManager.replayBgm(this._oldBgm)
      }
      if (this._olgBgs) {
        AudioManager.replayBgs(this._oldBgs)
      }
    }

    updateVisibility (showVideo) {
      Graphics._canvas.style.opacity = showVideo ? 0 : 1
      this.video.style.opacity = showVideo ? 1 : 0
      this.adsContainer.style.zIndex = showVideo ? 4 : 0
    }
    /* End Of VideoAdsPlayer Class */
  }

  /**
   * NEW Method
   *
   * @memberOf SceneManager
   */
  SceneManager.start = function () {
    this._stopped = false
    this.update()
  }

  /**
   * ALIASED Method
   *
   * @memberOf Graphics
   */
  $.Alias.Graphics_createVideo = Graphics._createVideo

  Graphics._createVideo = function () {
    $.Alias.Graphics_createVideo.call(this)
    this._videoAdsPlayer = new VideoAdPlayer(this.boxWidth, this.boxHeight)
  }

  /**
   * NEW Method
   *
   * @memberOf Graphics
   */
  Graphics.videoAdsPlayer = function () {
    return this._videoAdsPlayer
  }

  /**
   * NEW Method
   *
   * @memberOf Graphics
   */
  Graphics._loadAds = function () {
    const adTagUrl = $.Param.adTagUrl
    this._videoAdsPlayer.removePreloadListener()
    ADS.requestAds(adTagUrl)
    this._videoAdsPlayer.updateVisibility(true)
  }

  /**
   * ALIASED Method
   *
   * @memberOf Graphics
   */
  $.Alias._Game_Inter_pluginCommand = Game_Interpreter.prototype.pluginCommand
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    if (command === 'Ads') {
      switch (args[0].toLowerCase()) {
        case 'initialize':
          ADS = new AdsManager(Graphics._videoAdsPlayer)
          break
        case 'start':
          ADS.initialUserAction()
          Graphics._videoAdsPlayer.preloadContent(Graphics._loadAds.bind(Graphics))
          break
        default:
          break
      }
    }
  }

  /** -----------------------------------------
   * Exports For Addons
   *
   ---------------------------------------- */
  $.VideoAdPlayer = VideoAdPlayer
  $.AdsManager = AdsManager
})(GU.Utilities.requirePlugin(false, 'AdCore'))

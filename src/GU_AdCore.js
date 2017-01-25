/**
 * @file Guelstie Ad-Sense core.
 * @author Guelstie Project
 * @version 0.0.1
 */
// =============================================================================
// GU_AdCore.js
// =============================================================================
/*:
 @plugindesc v 0.0.1 Guesltie Project Ad-Sense Core plugin.

 @author Guesltie Project

 @param Ad Tag
 @desc
 Default:
 @default

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
  GU.Utilities.registerPlugin('AdCore', '0.0.1', 'LTNGames')
}

if (typeof google === 'undefined') {
  /* Add Google IMA3 SDK to the DOM for Google AdSense
  * FIXME Won't load file due to Access control header with XHR request
  */
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = '//imasdk.googleapis.com/js/sdkloader/ima3.js'
  document.body.appendChild(script)
  console.log(script)
  /* Add style.css to DOM */
  const css = document.createElement('link')
  css.type = 'text/css'
  css.src = '/style.css'
  document.body.appendChild(css)
}

/* Will need to create a custom MV class to handle the video player, probably a new canvas with PIXI elements these elements
will need to be associated with the AdsManager class
*/

(function ($) {
  const IMA = google.ima
  /**
   * Based on the Advanced example of the IMA SDK Examples
   *
   * @class AdsManager
   */
  class AdsManager {
    constructor (application, videoPlayer) {
      // TODO customClick must point to a button in the dom. I'll maniuplate so it's a sprite button from RPG Maker MV
      this._application = application
      this._videoPlayer = videoPlayer
      this._contentComplete = false
      this._customClickDiv = null
      this._adDisplayContainer = null
      this._adsLoader = null
      this._adsManager = null
    }

    initialize () {
      IMA.setting.setVpaidMode(IMA.ImaSdkSettings.VpaidMode.ENABLED)
      // TODO - LTNGames - add plugin parameter for the locale.
      IMA.settings.setLocale('en-us')
      this.createAdsDisplayContainer()
      this.addEventListeners()
    }

    createAdsDisplayContainer () {
      const adContainer = this._videPlayer.adContainer
      const contentPlayer = this._videoPlayer.contentPlayer
      const clickTracker = this.__customClickDiv
      /* AdDisplayContainer(containerElement, opt_videoElement, opt_clickTrackingElement */
      this._adDisplayContainer = new IMA.AdDisplayContainer(adContainer, contentPlayer, clickTracker)
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
      this._videPlayer.contentPlayer.load()
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

    resize (width, height) {
      if (this._adsManager) {
        this._adsManager.resize(width, height, IMA.ViewMode.FULLSCREEN)
      }
    }

    contentEnded () {
      this.contentComplete = true
      this._adsLoader.contentComplete()
    }

    onAdsManagerLoaded (adsLoadedEvent) {
      const contentPlayer = this._videoPlayer.contentPlayer
      this._application.log('Ads Loaded')
      const adsRenderingSettings = new IMA.AdsRenderingSetting()

      adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true
      this._adsManager = adsLoadedEvent.getAdsManager(contentPlayer, adsRenderingSettings)
      this.processAdsManager_(this._adsManager)
    }

    processAdsManager (adsManager) {
      if (adsManager.isCustomClickTrackingUsed()) {
        this._customClickDiv.style.display = 'table'
      }
      let initWidth = 0
      let initHeight = 0
      const contentPauseEvent = IMA.AdEvent.Type.CONTENT_PAUSE_REQUESTED
      const contentResumeEvent = IMA.AdEvent.Type.CONTENT_RESUME_REQUESTED
      const errorEvent = IMA.AdErrorEvent.Type.AD_ERROR
      // Attach the pause/resume events.
      adsManager.addEventListener(contentPauseEvent, this.onContentPauseRequested, false, this)
      adsManager.addEventListener(contentResumeEvent, this.onContentResumeRequested, false, this)
      // Handle errors.
      adsManager.addEventListener(errorEvent, this.onAddError, false, this)
      this.addEventsForAdsManager(adsManager)

      if (this._application.fullscreen) {
        initWidth = this._application.fullscreenWidth
        initHeight = this._application.fullscreenHeight
      } else {
        initWidth = this._videoPlayer.width
        initHeight = this._videoPlayer.height
      }
      adsManager.init(initWidth, initHeight, IMA.ViewMode.NORMAL)
      adsManager.start()
    }

    addEventsForAdsManager (adsManager) {
      const events = [IMA.AdEvent.Type.ALL_ADS_COMPLETED, IMA.AdEvent.Type.CLICK, IMA.AdEvent.Type.COMPLETE, IMA.AdEvent.Type.FIRST_QUARTILE,
        IMA.AdEvent.Type.LOADED, IMA.AdEvent.Type.MIDPOINT, IMA.AdEvent.Type.PAUSED, IMA.AdEvent.Type.STARTED, IMA.AdEvent.Type.THIRD_QUARTILE]

      for (const index in events) {
        if (events.hasOwnProperty(index)) {
          adsManager.addEventListener(events[index], this.onAdEvent, false, this)
        }
      }
    }

    onContentPauseRequested () {
      this._application.pauseForAd()
      this._application.setVideoEndedCallbackEnabled(false)
    }

    onContentResumeRequested () {
      this._application.setVideoEndedCallbackEnabled(true)
      if (!this.contentCompleteCalled) {
        this._application.resumeAfterAd()
      }
    }
    onAdEvent (adEvent) {
      this._application.log('Ad event: ' + adEvent.type)

      if (adEvent.type === IMA.AdEvent.Type.CLICK) {
        this._application.adClicked()
      } else if (adEvent.type === IMA.AdEvent.Type.LOADED) {
        const ad = adEvent.getAd()
        if (!ad.isLinear()) {
          this.onContentResumeRequested()
        }
      }
    }

    onAdError (adErrorEvent) {
      this._application.log(`Ad error: ${adErrorEvent.getError().toString()}`)
      if (this._adsManager) {
        this._adsManager.destroy()
      }
      this._application.resumeAfterAd()
    }
  }
  console.log(GU.Utilities.requirePlugin(false, 'AdCore'))
})(GU.Utilities.requirePlugin(false, 'AdCore'))

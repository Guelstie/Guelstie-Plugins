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

@param Locale
 @desc The language the Ads should be displayed in
 Default: en-us
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
  * For now, I inserted script tag in index.html. May be only choice.
  */
  const script = document.createElement('script')
  script.onload = () => {
    script.type = 'text/javascript'
    script.src = '//imasdk.googleapis.com/js/sdkloader/ima3.js'
    document.body.appendChild(script)
  }
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
      this._application = application
      this._videoPlayer = videoPlayer
      this._contentComplete = false
      this._customClickDiv = null
      this._adDisplayContainer = null
      this._adsLoader = null
      this._adsManager = null
      this.createAdsDisplayContainer()
      this.initialUserAction()
      this.requestAds('https://pubads.g.doubleclick.net/' +
        'gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&' +
        'ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&' +
        'unviewed_position_start=1&' +
        'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=')
    }

    initialize () {
      IMA.setting.setVpaidMode(IMA.ImaSdkSettings.VpaidMode.ENABLED)
      // TODO - LTNGames - add plugin parameter for the locale.
      IMA.settings.setLocale('en-us')
      this.createAdsDisplayContainer()
      this.addEventListeners()
    }

    /* FIXME - Not all proeprties are available until they've been loaded, find a solution to assign proeprties when they load */
    createAdsDisplayContainer () {
      const adContainer = this._videoPlayer.adsContainer
      const contentPlayer = this._videoPlayer.video
      const clickTracker = this._videoPlayer.customClickContainer

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
      // FIXME - Error loading video property of this._videoPlayer.... why?
      // Tried a setTimeout to see if it had to do with loading but still not working
      console.log(this._videPlayer)
      setTimeout(() => {
        this._videPlayer.video.load()
      }, 2000)
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
      const contentPlayer = this._videoPlayer.video
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
      adsManager.addEventListener(contentPauseEvent, this.onContenPaused, false, this)
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

    onContenPaused () {
      this._application.pauseForAd()
      this._application.setVideoEndedCallbackEnabled(false)
    }

    onContentResume () {
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
          this.onContentResume()
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

  /**
   * The AdSense video player for RPG Maker MV
   *
   * @class VideoAdPlayer
   */
  class VideoAdPlayer {
    constructor (width, height) {
      this._width = width
      this._height = height
      this.createContainerElements()
      this.preloadListener = null
    }

    createContainerElements () {
      // Contains the video element
      const videoContainer = document.createElement('div')
      // The Video Element
      const video = document.createElement('video')
      // Ads container contains, pause button and coutndown
      const adsContainer = document.createElement('div')
      const customClickContainer = document.createElement('div')

      window.onload = () => {
        videoContainer.id = 'videoPlayer'
        video.id = 'videoAd'
        adsContainer.id = 'adsContainer'
        video.style.opacity = 0
        customClickContainer.id = 'customClick'
        document.body.appendChild(videoContainer)
        document.body.appendChild(adsContainer)
        document.body.appendChild(customClickContainer)
        this.videoContainer = document.getElementById('videoPlayer')
        this.adsContainer = document.getElementById('adsContainer')
        this.customClickContainer = document.getElementById('customClick')
        this.videoContainer.appendChild(video)
        this.video = this.videoContainer.childNodes[0]
        this.video.src = 'http://rmcdn.2mdn.net/Demo/vast_inspector/android.mp4'
        this.updateVideo()
      }
    }

    updateVideo () {
      this.video.width = this._width
      this.video.height = this._height
      this.video.style.zIndex = 2
      Graphics._centerElement(this.video)
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

    resize () {
      this.updateVideo(this.video)
    }

    registerOnVideoEnd (callback) {
      this.video.addEventListener('ended', callback, false)
    }

    removeOnVideoEnd (callback) {
      this.video.removeEventListener('ended', callback, false)
      // Remove containers from DOM here...
    }
  }
  /* Test what I have */
  const videoPlayer = new VideoAdPlayer(Graphics.width, Graphics.height)
  window.addEventListener('load', () => {
    const ads = new AdsManager(null, videoPlayer)
  })
})(GU.Utilities.requirePlugin(false, 'AdCore'))

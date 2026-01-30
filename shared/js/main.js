/**
 * Grind House Landing Page - Main JavaScript
 * Handles: Tracking, Form Submission, UI Interactions
 */

(function() {
  'use strict';

  // =====================
  // CONFIGURATION
  // =====================
  const CONFIG = {
    customerId: '00ec32c9-e228-4853-85b5-ac1446a70a41',
    gtmId: 'GTM-M7VVF2K6',
    formEndpoint: 'https://analytics.gomega.ai/submission/submit',
    siteId: '3697949b-3fce-406c-b00f-75b805a6538c',
    siteKey: 'sk_mkzpdr12_pn46wqfxwaf',
    hubspotPortalId: '', // Add if available
    fbPixelId: '1926576494597354',
  };

  // =====================
  // UTILITY FUNCTIONS
  // =====================

  /**
   * Get URL parameters
   */
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_term: params.get('utm_term') || '',
      utm_content: params.get('utm_content') || '',
      gclid: params.get('gclid') || '',
      gbraid: params.get('gbraid') || '',
      wbraid: params.get('wbraid') || '',
      fbclid: params.get('fbclid') || '',
    };
  }

  /**
   * Get or create session ID
   */
  function getSessionId() {
    let sessionId = sessionStorage.getItem('gh_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('gh_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get or create visitor ID
   */
  function getVisitorId() {
    let visitorId = localStorage.getItem('gh_visitor_id');
    if (!visitorId) {
      visitorId = 'vis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('gh_visitor_id', visitorId);
    }
    return visitorId;
  }

  /**
   * Get Facebook browser ID (fbp) from cookie
   */
  function getFbp() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === '_fbp') return value;
    }
    return '';
  }

  /**
   * Get Facebook click ID (fbc) from cookie or URL
   */
  function getFbc() {
    // First check cookie
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === '_fbc') return value;
    }
    // If not in cookie, construct from URL param
    const fbclid = getUrlParams().fbclid;
    if (fbclid) {
      return 'fb.1.' + Date.now() + '.' + fbclid;
    }
    return '';
  }

  /**
   * Store attribution data in localStorage
   */
  function storeAttributionData() {
    const params = getUrlParams();
    const existingData = JSON.parse(localStorage.getItem('gh_attribution') || '{}');

    // Only update if we have new UTM/click data (first touch)
    if (!existingData.first_touch && (params.utm_source || params.gclid || params.fbclid)) {
      existingData.first_touch = {
        ...params,
        landing_page: window.location.href,
        timestamp: new Date().toISOString()
      };
    }

    // Always update last touch
    if (params.utm_source || params.gclid || params.fbclid) {
      existingData.last_touch = {
        ...params,
        landing_page: window.location.href,
        timestamp: new Date().toISOString()
      };
    }

    localStorage.setItem('gh_attribution', JSON.stringify(existingData));
    return existingData;
  }

  // =====================
  // STICKY NAVIGATION
  // =====================
  function initStickyNav() {
    const nav = document.querySelector('.sticky-nav');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  }

  // =====================
  // SMOOTH SCROLL
  // =====================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.sticky-nav')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Track anchor click
          trackEvent('anchor_click', { target: targetId });
        }
      });
    });
  }

  // =====================
  // FADE IN ANIMATIONS
  // =====================
  function initFadeAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  }

  // =====================
  // FORM HANDLING
  // =====================
  function initFormHandling() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.textContent;

      // Disable button and show loading
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

      try {
        const formData = new FormData(form);
        const attribution = JSON.parse(localStorage.getItem('gh_attribution') || '{}');
        const urlParams = getUrlParams();

        // Build payload
        const payload = {
          customer_id: CONFIG.customerId,
          site_id: CONFIG.siteId,
          site_key: CONFIG.siteKey,
          form_data: {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            reason: formData.get('reason'),
            location: window.LOCATION_NAME || 'unknown'
          },
          full_url: window.location.href,
          referrer: document.referrer,
          session_id: getSessionId(),
          visitor_id: getVisitorId(),
          utm_source: urlParams.utm_source || attribution.last_touch?.utm_source || '',
          utm_medium: urlParams.utm_medium || attribution.last_touch?.utm_medium || '',
          utm_campaign: urlParams.utm_campaign || attribution.last_touch?.utm_campaign || '',
          utm_term: urlParams.utm_term || attribution.last_touch?.utm_term || '',
          utm_content: urlParams.utm_content || attribution.last_touch?.utm_content || '',
          gclid: urlParams.gclid || attribution.last_touch?.gclid || '',
          gbraid: urlParams.gbraid || attribution.last_touch?.gbraid || '',
          wbraid: urlParams.wbraid || attribution.last_touch?.wbraid || '',
          fbclid: urlParams.fbclid || attribution.last_touch?.fbclid || '',
          fbp: getFbp(),
          fbc: getFbc(),
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          first_touch: attribution.first_touch || null
        };

        // Submit to analytics endpoint
        const response = await fetch(CONFIG.formEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Form submission failed');
        }

        // Track conversion in GTM
        trackEvent('form_submission', {
          form_id: 'contact-form',
          location: window.LOCATION_NAME,
          reason: formData.get('reason')
        });

        // Push to dataLayer for conversion tracking
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'lead_form_submit',
          form_location: window.LOCATION_NAME,
          lead_type: formData.get('reason')
        });

        // Track Facebook Pixel Lead event
        if (typeof fbq !== 'undefined') {
          fbq('track', 'Lead', {
            content_name: 'Schedule Tour Form',
            content_category: window.LOCATION_NAME
          });
        }

        // Show success state
        showFormSuccess();

      } catch (error) {
        console.error('Form submission error:', error);

        // Show error state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Error - Try Again';
        submitBtn.classList.add('error');

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('error');
        }, 3000);

        trackEvent('form_error', { error: error.message });
      }
    });
  }

  /**
   * Show form success state
   */
  function showFormSuccess() {
    const form = document.getElementById('contact-form');
    const formContainer = form.parentElement;

    formContainer.innerHTML = `
      <div class="form-success">
        <svg class="form-success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3 class="form-success-title">Thanks for reaching out!</h3>
        <p class="form-success-message">We'll be in touch within 24 hours to schedule your tour or answer any questions.</p>
      </div>
    `;
  }

  // =====================
  // EVENT TRACKING
  // =====================
  function trackEvent(eventName, eventData = {}) {
    // GTM/GA tracking
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
  }

  /**
   * Track phone clicks
   */
  function initPhoneTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', function() {
        const phoneNumber = this.getAttribute('href').replace('tel:', '');

        trackEvent('phone_click', {
          phone_number: phoneNumber,
          location: window.LOCATION_NAME
        });

        // Push conversion event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'phone_lead',
          phone_number: phoneNumber,
          location: window.LOCATION_NAME
        });
      });
    });
  }

  /**
   * Track CTA button clicks
   */
  function initCtaTracking() {
    document.querySelectorAll('.btn, .service-cta').forEach(btn => {
      btn.addEventListener('click', function() {
        const ctaText = this.textContent.trim();
        const ctaHref = this.getAttribute('href') || '';

        trackEvent('cta_click', {
          cta_text: ctaText,
          cta_destination: ctaHref,
          location: window.LOCATION_NAME
        });
      });
    });
  }

  // =====================
  // SCROLL DEPTH TRACKING
  // =====================
  function initScrollTracking() {
    const milestones = [25, 50, 75, 100];
    const tracked = new Set();

    function getScrollPercent() {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      return Math.round((scrollTop / docHeight) * 100);
    }

    window.addEventListener('scroll', function() {
      const percent = getScrollPercent();

      milestones.forEach(milestone => {
        if (percent >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone);
          trackEvent('scroll_depth', { depth: milestone });
        }
      });
    });
  }

  // =====================
  // FACEBOOK PIXEL
  // =====================
  function initFacebookPixel() {
    if (!CONFIG.fbPixelId) return;

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', CONFIG.fbPixelId);
    fbq('track', 'PageView');
  }

  // =====================
  // INITIALIZATION
  // =====================
  function init() {
    // Initialize Facebook Pixel first
    initFacebookPixel();

    // Store attribution data on page load
    storeAttributionData();

    // Initialize all components
    initStickyNav();
    initSmoothScroll();
    initFadeAnimations();
    initFormHandling();
    initPhoneTracking();
    initCtaTracking();
    initScrollTracking();

    // Track page view
    trackEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      location: window.LOCATION_NAME
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

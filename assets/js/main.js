/**
* Template Name: iPortfolio
* Updated: Jan 09 2024 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * High Performance Throttled Scroll Listener (Prevents layout thrashing & scroll lag)
   */
  let ticking = false;
  const scrollCallbacks = [];

  const onScrollFrame = () => {
    for (let i = 0; i < scrollCallbacks.length; i++) {
      scrollCallbacks[i]();
    }
    ticking = false;
  };

  const onscroll = (listener) => {
    scrollCallbacks.push(listener);
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  }, { passive: true });

  /**
   * Navbar links active state on scroll (Cached positions to avoid reflows during scroll)
   */
  let navbarlinks = [];
  let sectionPositions = [];

  const updateSectionPositions = () => {
    navbarlinks = select('#navbar .scrollto', true);
    sectionPositions = navbarlinks.map(navbarlink => {
      if (!navbarlink.hash) return null;
      let section = select(navbarlink.hash);
      if (!section) return null;
      return {
        link: navbarlink,
        top: section.offsetTop,
        bottom: section.offsetTop + section.offsetHeight
      };
    }).filter(Boolean);
  };

  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    sectionPositions.forEach(item => {
      if (position >= item.top && position <= item.bottom) {
        item.link.classList.add('active');
      } else {
        item.link.classList.remove('active');
      }
    });
  };

  window.addEventListener('load', () => {
    updateSectionPositions();
    navbarlinksActive();
  });
  window.addEventListener('resize', updateSectionPositions);
  onscroll(navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let element = select(el);
    if (!element) return;
    let elementPos = element.offsetTop;
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    });
  };

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /**
   * Close mobile nav on click outside
   */
  document.addEventListener('click', function(e) {
    let body = select('body');
    if (body.classList.contains('mobile-nav-active')) {
      let header = select('#header');
      let toggle = select('.mobile-nav-toggle');
      if (header && !header.contains(e.target) && toggle && !toggle.contains(e.target)) {
        body.classList.remove('mobile-nav-active');
        toggle.classList.remove('bi-x');
        toggle.classList.add('bi-list');
      }
    }
  });

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault();

      let body = select('body');
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active');
        let navbarToggle = select('.mobile-nav-toggle');
        navbarToggle.classList.toggle('bi-list');
        navbarToggle.classList.toggle('bi-x');
      }
      scrollto(this.hash);
    }
  }, true);

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed');
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 1800
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  }

  /**
   * Portfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          if (typeof AOS !== 'undefined') {
            AOS.refresh();
          }
        });
      }, true);
    }
  });

  /**
   * Initiate portfolio lightbox 
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.portfolio-lightbox'
    });
  }

  /**
   * Portfolio details slider
   */
  if (typeof Swiper !== 'undefined' && select('.portfolio-details-slider')) {
    new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }

  /**
   * Testimonials slider
   */
  if (typeof Swiper !== 'undefined' && select('.testimonials-slider')) {
    new Swiper('.testimonials-slider', {
      speed: 500,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });
  }

  /**
   * Animation on scroll (Fast & Smooth 500ms duration)
   */
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 500,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        once: true,
        mirror: false
      });
    }
  });

  /**
   * Initiate Pure Counter 
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }
  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    const hidePreloader = () => {
      preloader.classList.add('loaded');
      setTimeout(() => {
        if (preloader.parentNode) preloader.remove();
      }, 500);
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hidePreloader);
    } else {
      setTimeout(hidePreloader, 50);
    }
  }

})();
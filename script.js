(function(){
  var panel = document.querySelector('.cap-panel');
  if(!panel) return;
  var obs = new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting){
      panel.style.opacity='1';
      panel.style.transform='translateX(0)';
      obs.disconnect();
    }
  },{threshold:0.1});
  obs.observe(panel);
})();

function pauseRow(el){el.classList.add('paused');}
  function resumeRow(el){el.classList.remove('paused');}
  function openLightbox(tile){
    var img = tile.querySelector('img');
    document.getElementById('gal-lb-img').src = img.src;
    var cap = tile.getAttribute('data-title') + '  ·  ' + tile.getAttribute('data-loc');
    document.getElementById('gal-lb-caption').textContent = cap;
    var lb = document.getElementById('gal-lightbox');
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(e){
    if(e && e.force) {}
    else if(e && e.target && e.target.id === 'gal-lb-img') return;
    document.getElementById('gal-lightbox').classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('gal-lb-img').src = '';
  }
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLightbox({force:true});});

(function(){
  /* Lightbox state */
  var spTiles = [], spIdx = 0;

  window.spOpenLb = function(tile){
    var grid = tile.closest('.sp-grid');
    spTiles = Array.from(grid.querySelectorAll('.sp-tile'));
    spIdx   = spTiles.indexOf(tile);
    spShow(spIdx);
    document.getElementById('sp-lightbox').classList.add('sp-open');
    document.body.style.overflow = 'hidden';
  };

  function spShow(i){
    var lb = document.getElementById('sp-lb-img');
    lb.style.animation = 'none'; lb.offsetHeight; lb.style.animation = '';
    lb.src = spTiles[i].querySelector('img').src;
    document.getElementById('sp-lb-count').textContent = (i+1) + ' / ' + spTiles.length;
    spIdx = i;
  }

  window.spLbNav = function(dir){
    spShow((spIdx + dir + spTiles.length) % spTiles.length);
  };

  window.spCloseLb = function(){
    document.getElementById('sp-lightbox').classList.remove('sp-open');
    document.body.style.overflow = '';
    setTimeout(function(){ document.getElementById('sp-lb-img').src = ''; }, 300);
  };

  window.spLbBg = function(e){
    if(e.target.id === 'sp-lightbox') spCloseLb();
  };

  document.addEventListener('keydown', function(e){
    if(!document.getElementById('sp-lightbox').classList.contains('sp-open')) return;
    if(e.key === 'Escape')      spCloseLb();
    if(e.key === 'ArrowLeft')   spLbNav(-1);
    if(e.key === 'ArrowRight')  spLbNav(1);
  });

  /* Scroll reveal for project blocks */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('sp-visible');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.06, rootMargin:'0px 0px -40px 0px'});

  document.querySelectorAll('.sp-project').forEach(function(el){
    io.observe(el);
  });

  /* Fallback */
  setTimeout(function(){
    document.querySelectorAll('.sp-project').forEach(function(el){
      el.classList.add('sp-visible');
    });
  }, 1400);
})();

const dot=document.getElementById('cursor-dot'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function animCursor(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animCursor)})();
document.querySelectorAll('a,button,.proj-nav-item,.proj-hero,.portrait-box,.skill-tag').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
});
document.addEventListener('mousedown',()=>document.body.classList.add('cursor-click'));
document.addEventListener('mouseup',()=>document.body.classList.remove('cursor-click'));
const nav=document.getElementById('main-nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>80));
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
},{threshold:.08,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.fade-up,.fade-down,.fade-in,.portrait-reveal,.card-reveal,.slide-left-reveal').forEach(el=>obs.observe(el));
const projScreens=document.querySelectorAll('.proj-screen');
const navItems=document.querySelectorAll('.proj-nav-item');
const projObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const idx=Array.from(projScreens).indexOf(e.target);
      navItems.forEach((n,i)=>n.classList.toggle('active',i===idx));
    }
  });
},{threshold:.25});
projScreens.forEach(s=>projObs.observe(s));
function scrollToProj(id){document.getElementById(id).scrollIntoView({behavior:'smooth',block:'start'})}

/* ── UNIFIED observer for all animated elements ── */
(function(){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('visible');e.target.classList.add('vis');obs.unobserve(e.target);}
    });
  },{threshold:0,rootMargin:'0px 0px 0px 0px'});
  document.querySelectorAll('.fade-up,.fade-down,.fade-in,.portrait-reveal,.card-reveal,.proj-text-reveal').forEach(function(el){
    obs.observe(el);
  });
  /* Also observe all pa* gallery rows */
  document.querySelectorAll('[class^="pa"]').forEach(function(el,i){
    if(!el.style.animationDelay) el.style.animationDelay=(i%8)*0.12+'s';
    obs.observe(el);
  });
  /* Fallback: show all at 1.3s */
  setTimeout(function(){
    document.querySelectorAll('.fade-up,.fade-down,.fade-in,.portrait-reveal,.card-reveal,.proj-text-reveal').forEach(function(el){
      el.classList.add('visible');el.classList.add('vis');
    });
    document.querySelectorAll('[class^="pa"]').forEach(function(el){el.classList.add('vis');});
    document.querySelectorAll('img').forEach(function(img){img.style.opacity='1';});
  },1300);
})();

/* ══════════════════════════════════════════════
   PREMIUM SCROLL EXPERIENCE
   ══════════════════════════════════════════════ */
(function(){
  'use strict';

  /* ── 1. Scroll progress bar ── */
  var progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  /* ── 2. Smooth scroll tracking with lerp ── */
  var scrollY = 0, lerpScrollY = 0, raf;
  function lerp(a, b, t){ return a + (b-a)*t; }

  /* ── 3. Intersection Observer for section reveals ── */
  var sectionObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        // Don't unobserve proj-screens so they can re-animate if needed
        if(!e.target.classList.contains('proj-screen')){
          sectionObs.unobserve(e.target);
        }
      }
    });
  },{threshold:0.08, rootMargin:'0px 0px -60px 0px'});

  /* Apply section-reveal to main sections */
  ['#identity','#about','#experience','#contact'].forEach(function(sel){
    var el = document.querySelector(sel);
    if(el){ el.classList.add('section-reveal'); sectionObs.observe(el); }
  });

  /* Observe all proj-screens */
  document.querySelectorAll('.proj-screen').forEach(function(el){
    sectionObs.observe(el);
  });

  /* Observe contact */
  var contactEl = document.querySelector('#contact');
  if(contactEl) sectionObs.observe(contactEl);

  /* ── 4. Scroll event handler ── */
  var ticking = false;
  window.addEventListener('scroll', function(){
    scrollY = window.scrollY;
    if(!ticking){
      ticking = true;
      requestAnimationFrame(function(){
        onScroll(scrollY);
        ticking = false;
      });
    }
  }, {passive:true});

  function onScroll(sy){
    /* Progress bar */
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (sy/maxScroll*100) + '%';

    /* Hero parallax — video drifts upward slightly */
    var hero = document.getElementById('hero');
    if(hero){
      var heroH = hero.offsetHeight;
      var progress = Math.min(sy/heroH, 1);
      /* Video parallax */
      var vid = hero.querySelector('video.hero-img, img.hero-img');
      if(vid){ vid.style.transform = 'translateY(' + (progress*60) + 'px) scale(1.06)'; }
      /* Hero content fades out as you scroll */
      var heroContent = hero.querySelectorAll('.hero-name,.hero-bottom,.hero-scroll-indicator,.hero-top');
      heroContent.forEach(function(el){
        el.style.opacity = Math.max(0, 1 - progress*2.2);
        el.style.transform = 'translateY(' + (progress*-30) + 'px)';
      });
      /* Overlay deepens slightly */
      var overlay = hero.querySelector('.hero-overlay');
      if(overlay) overlay.style.opacity = 0.85 + progress*0.15;
    }
  }

  /* ── 5. Stat counter animation ── */
  /* Store target values upfront so counter always has them */
  document.querySelectorAll('.stat-n').forEach(function(el){
    var val = parseInt(el.textContent);
    if(val) el.setAttribute('data-target', val);
  });

  function animateCounters(){
    document.querySelectorAll('.stat-n[data-target]').forEach(function(el){
      var target = parseInt(el.getAttribute('data-target'));
      if(!target) return;
      var duration = 3000; /* ← adjust speed here (ms) */
      var startTime = null;
      /* Ensure visible before counting */
      el.style.opacity = '1';
      function step(ts){
        if(!startTime) startTime = ts;
        var p = Math.min((ts - startTime) / duration, 1);
        /* Cubic ease-out: fast start, smooth landing */
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease);
        if(p < 1){
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    });
  }

  /* Trigger once when identity section enters view */
  var identityObs = new IntersectionObserver(function(entries){
    if(entries[0].isIntersecting){
      animateCounters();
      identityObs.disconnect();
    }
  },{threshold:0.2});
  var idEl = document.getElementById('identity');
  if(idEl){
    identityObs.observe(idEl);
  } else {
    /* Fallback: run immediately if already in view */
    setTimeout(animateCounters, 600);
  }

  /* ── 6. Smooth scrollTo for nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var target = document.querySelector(this.getAttribute('href'));
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  /* ── 7. Active nav highlight on scroll ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  var secObs2 = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        navLinks.forEach(function(a){ a.classList.remove('nav-active'); });
        var active = document.querySelector('.nav-links a[href="#'+e.target.id+'"]');
        if(active) active.classList.add('nav-active');
      }
    });
  },{threshold:0.4});
  sections.forEach(function(s){ secObs2.observe(s); });

})();

/* ══════════════════════════════════════════════
   SECTION HEADING SLIDE-UP OBSERVER v2
   Reference: hero "ASIF IQBAL KHAN" slideUp
   animation: slideUp 1s cubic-bezier(.16,1,.3,1) forwards
   — Triggers when ~25% of element is visible
   — Fires ONCE per element, never replays
   — Observes each .su-word individually
   ══════════════════════════════════════════════ */
(function(){
  'use strict';

  /* threshold:0.25 = fires when 25% of word is visible */
  var suObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;

      var el = e.target;
      /* Add su-run: triggers the slideUp animation */
      el.classList.add('su-run');
      /* Unobserve immediately — plays once only, never replays */
      suObs.unobserve(el);
    });
  },{
    threshold: 0.25,      /* 25% visible — adjust here if needed */
    rootMargin: '0px'     /* no offset — fires based purely on visibility */
  });

  /* Observe every .su-word and .su-line individually */
  function observeSuElements(){
    document.querySelectorAll('.su-word, .su-line').forEach(function(el){
      /* Only observe elements not already animated */
      if(!el.classList.contains('su-run')){
        suObs.observe(el);
      }
    });
  }

  /* Run after DOM is ready */
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', observeSuElements);
  } else {
    observeSuElements();
  }

  /* Safety fallback: show all after 3s if observer fails */
  setTimeout(function(){
    document.querySelectorAll('.su-word, .su-line').forEach(function(el){
      el.classList.add('su-run');
      suObs.unobserve(el);
    });
  }, 3000);

})();

/* ── HOME nav: scroll to top + refresh at top ── */
(function(){
  /* Always start at top on refresh */
  if('scrollRestoration' in history){
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  /* HOME click: smooth scroll to hero */
  var homeLink = document.getElementById('nav-home');
  if(homeLink){
    homeLink.addEventListener('click', function(e){
      e.preventDefault();
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }
})();

/* Hamburger menu */
(function(){
  var btn   = document.getElementById('nav-hamburger');
  var nav   = document.getElementById('main-nav');
  var links = document.querySelector('.nav-links');
  if(!btn||!links) return;
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    var open=links.classList.toggle('open');
    nav.classList.toggle('menu-open',open);
    document.body.style.overflow=open?'hidden':'';
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){
      links.classList.remove('open');
      nav.classList.remove('menu-open');
      document.body.style.overflow='';
    });
  });
  document.addEventListener('click',function(e){
    if(!nav.contains(e.target)&&links.classList.contains('open')){
      links.classList.remove('open');
      nav.classList.remove('menu-open');
      document.body.style.overflow='';
    }
  });
})();

/* Project heading + line scroll animation */
(function(){
  var headers = document.querySelectorAll('.sp-proj-header');
  if(!headers.length) return;

  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      e.target.classList.add('sp-anim');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.2 });

  headers.forEach(function(h){ obs.observe(h); });
})();

/* ── Full-screen sections: slow separate image + text animations — REPLAYS on revisit ── */
(function(){

  function makeFsSection(secId, imgId, txtId, threshold){
    var sec = document.getElementById(secId);
    var img = document.getElementById(imgId);
    var txt = document.getElementById(txtId);
    if(!sec||!img||!txt) return;

    var t1, t2;

    function reset(){
      clearTimeout(t1); clearTimeout(t2);
      img.style.transition = 'none';
      txt.style.transition = 'none';
      img.style.opacity    = '0';
      img.style.transform  = 'scale(1.08)';
      txt.style.opacity    = '0';
      txt.style.transform  = 'translateY(30px)';
    }

    function reveal(){
      t1 = setTimeout(function(){
        img.style.transition = 'opacity 1.25s ease, transform 3s cubic-bezier(.16,1,.3,1)';
        img.style.opacity    = '1';
        img.style.transform  = 'scale(1.0)';
      }, 200);
      t2 = setTimeout(function(){
        txt.style.transition = 'opacity 1s ease-out, transform 1.1s cubic-bezier(.16,1,.3,1)';
        txt.style.opacity    = '1';
        txt.style.transform  = 'translateY(0)';
      }, 600);
    }

    /* No disconnect — observer stays alive, replays every visit */
    new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting){
        reveal();
      } else {
        reset(); /* reset on leave so it replays next time */
      }
    },{threshold: threshold || 0.2}).observe(sec);
  }

  makeFsSection('full-img',   'fi1-img', 'fi1-text', 0.05);
  makeFsSection('full-img-2', 'fi2-img', 'fi2-text', 0.2);
  makeFsSection('full-img-3', 'fi3-img', 'fi3-text', 0.2);

})();

/* ── Section in-view toggle — animations replay on every scroll ── */
(function(){
  var wrap = document.getElementById('page-wrap');
  var snaps = document.querySelectorAll('.snap');
  if(!snaps.length) return;

  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        /* Re-trigger su-word animations */
        e.target.querySelectorAll('.su-word').forEach(function(w){
          w.classList.remove('su-run');
          void w.offsetWidth; /* force reflow */
          w.classList.add('su-run');
        });
      } else {
        /* Remove in-view when section leaves — resets animations */
        e.target.classList.remove('in-view');
        e.target.querySelectorAll('.su-word').forEach(function(w){
          w.classList.remove('su-run');
        });
        e.target.querySelectorAll('.visible,.vis').forEach(function(el){
          el.classList.remove('visible','vis','is-visible');
        });
      }
    });
  },{
    root: wrap || null,
    threshold: 0.3
  });

  snaps.forEach(function(s){ obs.observe(s); });
})();

/* ── Identity / Philosophy / Capabilities image animations ── */
/* Same speed as "Translating Thought to Form" */
(function(){

  function animateSection(secId, imgId, hasScale){
    var sec = document.getElementById(secId);
    var img = document.getElementById(imgId);
    if(!sec||!img) return;

    var t1;

    function reset(){
      clearTimeout(t1);
      img.style.transition = 'none';
      img.style.opacity    = '0';
      if(hasScale) img.style.transform = 'scale(1.08)';
    }

    function reveal(){
      t1 = setTimeout(function(){
        if(hasScale){
          img.style.transition = 'opacity 1.25s ease, transform 3s cubic-bezier(.16,1,.3,1)';
          img.style.transform  = 'scale(1.0)';
        } else {
          img.style.transition = 'opacity 1.25s ease';
        }
        img.style.opacity = '1';
      }, 200);
    }

    new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting){ reveal(); }
      else { reset(); }
    },{threshold:0.2}).observe(sec);
  }

  animateSection('identity',     'id-img',  true);   /* Introduction — scale + fade */
  animateSection('about',        'ab-img',  false);  /* Philosophy — fade only (natural size) */
  animateSection('capabilities', 'cap-img', true);   /* Capabilities — scale + fade */

})();

/* ── Luxury page loader with progress ── */
(function(){
  var loader  = document.getElementById('page-loader');
  var fill    = document.getElementById('loader-fill');
  var tip     = document.getElementById('loader-tip');
  var pct     = document.getElementById('loader-pct');
  if(!loader) return;

  var progress = 0;
  var hidden   = false;

  function setProgress(p){
    p = Math.min(100, Math.max(0, Math.round(p)));
    progress = p;
    if(fill)  fill.style.width = p + '%';
    if(tip)   tip.style.left   = p + '%';
    if(pct)   pct.textContent  = p + '%';
    if(p >= 100 && !hidden){ setTimeout(hideLoader, 400); }
  }

  function hideLoader(){
    if(hidden) return; hidden = true;
    setProgress(100);
    setTimeout(function(){
      loader.classList.add('loaded');
      setTimeout(function(){ loader.remove(); }, 1000);
    }, 300);
  }

  /* Track all images and videos on the page */
  var assets   = Array.from(document.querySelectorAll('img, video source'));
  var total    = assets.length;
  var loaded   = 0;

  /* Simulate initial progress while DOM parses */
  setProgress(5);

  if(total === 0){
    /* No trackable assets — use load event */
    window.addEventListener('load', function(){ setProgress(100); });
  } else {
    function onAssetLoad(){
      loaded++;
      /* Reserve 5–95% for assets, last 5% for window.load */
      setProgress(5 + (loaded / total) * 90);
    }

    assets.forEach(function(el){
      var src = el.src || el.getAttribute('src');
      if(!src){ onAssetLoad(); return; }
      /* Already cached */
      if(el.complete || el.readyState === 4){ onAssetLoad(); return; }
      el.addEventListener('load',  onAssetLoad, {once:true});
      el.addEventListener('error', onAssetLoad, {once:true}); /* count errors too */
    });
  }

  /* Final 5% on full window load */
  window.addEventListener('load', function(){ setProgress(100); });

  /* Fallback — reach 100% after 5s regardless */
  var t = 0;
  var fallback = setInterval(function(){
    t += 100;
    if(t >= 5000){ setProgress(100); clearInterval(fallback); return; }
    /* Ease toward 90% gradually if assets are slow */
    if(progress < 90) setProgress(progress + (90 - progress) * 0.04);
  }, 100);

})();
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = document.querySelectorAll('.editorial-section-heading, .editorial-grid-stage, .editorial-survey-stage, .editorial-detail-row, .editorial-fuji-stage, .fuji-workflow article, .home-trust-layout, .home-download-inner');
  const chapters = [...document.querySelectorAll('main > section[id]')];
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const frames = [...document.querySelectorAll('.home-shot-media')];
  let observer;
  let pending = false;
  function update() {
    pending = false;
    const height = innerHeight;
    const extent = document.documentElement.scrollHeight - height;
    document.documentElement.style.setProperty('--reading-progress', extent > 0 ? Math.min(1, Math.max(0, scrollY / extent)) : 0);
    let current = '';
    chapters.forEach(section => { if (section.getBoundingClientRect().top <= height * .35) current = section.id; });
    links.forEach(link => {
      const active = link.getAttribute('href') === '#' + current;
      link.classList.toggle('chapter-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (!reduced.matches) frames.forEach(frame => {
      const rect = frame.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < height) {
        const arrival = Math.min(1, Math.max(0, (height - rect.top) / (height * .8)));
        frame.style.setProperty('--frame-arrival', arrival);
      }
    });
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  function configure() {
    observer?.disconnect();
    targets.forEach(target => target.classList.remove('darkroom-reveal', 'darkroom-visible'));
    if (!reduced.matches && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('darkroom-visible'); observer.unobserve(entry.target); }
        });
      }, { threshold: .06 });
      targets.forEach(target => { target.classList.add('darkroom-reveal'); observer.observe(target); });
    }
    schedule();
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('load', schedule, { once: true });
  reduced.addEventListener('change', configure);
  configure();
})();

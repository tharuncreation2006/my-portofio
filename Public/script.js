/* ==========================================================================
   THARUN P - AI/ML DEVELOPER & CREATIVE TECHNOLOGIST PORTFOLIO
   Script: Canvas Particles, 3D Two-Photo S-Curve Engine, Role Switcher & UI
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. CUSTOM CURSOR SYSTEM
     -------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('custom-cursor');
  const cursorFollower = document.getElementById('cursor-follower');
  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  if (cursorDot && cursorFollower) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function updateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      requestAnimationFrame(updateFollower);
    }
    updateFollower();

    // Hover interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .tech-node, .glass-panel, input, textarea');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* --------------------------------------------------------------------------
     2. BACKGROUND CANVAS PARTICLE & S-CURVE NEON TRAIL ENGINE
     -------------------------------------------------------------------------- */
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 75;

    function resizeBgCanvas() {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    }
    resizeBgCanvas();
    window.addEventListener('resize', resizeBgCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.5 + 0.2;
        const colors = ['#00f0ff', '#9d4edd', '#ff007f'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Periodic Neon Trail across background
    let trailT = 0;

    function renderBgCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw Particles
      particles.forEach((p, idx) => {
        p.update();
        p.draw();

        // Connect nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      // Ambient Neon Trajectory Wave
      trailT += 0.008;
      const waveY = height / 2 + Math.sin(trailT * 2) * (height / 3);
      const waveX = (trailT * 150) % (width + 400) - 200;

      ctx.beginPath();
      ctx.arc(waveX, waveY, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.globalAlpha = 0.6;
      ctx.fill();
      ctx.shadowBlur = 0;

      requestAnimationFrame(renderBgCanvas);
    }
    renderBgCanvas();
  }

  /* --------------------------------------------------------------------------
     3. CINEMATIC INTRO EXPERIENCE OVERLAY
     -------------------------------------------------------------------------- */
  const introOverlay = document.getElementById('cinematic-intro');
  const enterBtn = document.getElementById('enter-btn');
  const introCanvas = document.getElementById('intro-canvas');

  if (introCanvas && introOverlay) {
    const ictx = introCanvas.getContext('2d');
    let iw = introCanvas.width = window.innerWidth;
    let ih = introCanvas.height = window.innerHeight;

    let stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: (Math.random() - 0.5) * iw,
        y: (Math.random() - 0.5) * ih,
        z: Math.random() * iw
      });
    }

    function renderIntroCanvas() {
      if (introOverlay.classList.contains('hidden')) return;

      ictx.fillStyle = '#020308';
      ictx.fillRect(0, 0, iw, ih);

      const cx = iw / 2;
      const cy = ih / 2;

      stars.forEach(s => {
        s.z -= 2;
        if (s.z <= 0) s.z = iw;

        const k = 250 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        if (px >= 0 && px <= iw && py >= 0 && py <= ih) {
          const size = (1 - s.z / iw) * 2.5;
          ictx.beginPath();
          ictx.arc(px, py, size, 0, Math.PI * 2);
          ictx.fillStyle = '#00f0ff';
          ictx.shadowColor = '#00f0ff';
          ictx.shadowBlur = 6;
          ictx.fill();
        }
      });

      requestAnimationFrame(renderIntroCanvas);
    }
    renderIntroCanvas();

    function dismissIntro() {
      introOverlay.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }

    if (enterBtn) {
      enterBtn.addEventListener('click', dismissIntro);
    }

    window.addEventListener('wheel', (e) => {
      if (!introOverlay.classList.contains('hidden') && e.deltaY > 10) {
        dismissIntro();
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     4. SPECIAL TWO-PHOTO 3D INFINITY / S-CURVE TRANSITION ENGINE
     -------------------------------------------------------------------------- */
  const photo1Wrap = document.getElementById('photo1-wrap');
  const photo2Wrap = document.getElementById('photo2-wrap');
  const togglePhotoBtn = document.getElementById('toggle-photo-btn');
  const stageModeTag = document.getElementById('stage-mode-tag');
  const neonBeamDot = document.getElementById('neon-beam-dot');

  if (photo1Wrap && photo2Wrap) {
    let phase = 0;
    let autoLoop = true;
    let manualFocus = 1; // 1 or 2

    function animate3DStage() {
      if (autoLoop) {
        phase += 0.012;
      }

      // S-curve infinity trajectory parametric formulas
      // Photo 1 position
      const x1 = Math.sin(phase) * 110;
      const z1 = Math.cos(phase) * 180;
      const y1 = (Math.sin(phase * 2) * 20);

      // Photo 2 position (180 deg shifted: phase + Math.PI)
      const x2 = Math.sin(phase + Math.PI) * 110;
      const z2 = Math.cos(phase + Math.PI) * 180;
      const y2 = (Math.sin((phase + Math.PI) * 2) * 20);

      // Apply 3D perspective transforms
      const rotY1 = Math.sin(phase) * 15;
      const rotY2 = Math.sin(phase + Math.PI) * 15;

      const scale1 = 0.85 + ((z1 + 180) / 360) * 0.3;
      const scale2 = 0.85 + ((z2 + 180) / 360) * 0.3;

      const opacity1 = 0.4 + ((z1 + 180) / 360) * 0.6;
      const opacity2 = 0.4 + ((z2 + 180) / 360) * 0.6;

      const blur1 = Math.max(0, (180 - z1) / 50);
      const blur2 = Math.max(0, (180 - z2) / 50);

      photo1Wrap.style.transform = `translate3d(${x1}px, ${y1}px, ${z1}px) rotateY(${rotY1}deg) scale(${scale1})`;
      photo1Wrap.style.opacity = opacity1;
      photo1Wrap.style.filter = `blur(${blur1}px)`;

      photo2Wrap.style.transform = `translate3d(${x2}px, ${y2}px, ${z2}px) rotateY(${rotY2}deg) scale(${scale2})`;
      photo2Wrap.style.opacity = opacity2;
      photo2Wrap.style.filter = `blur(${blur2}px)`;

      // Active depth ordering
      if (z1 > z2) {
        photo1Wrap.classList.add('active');
        photo1Wrap.classList.remove('secondary');
        photo2Wrap.classList.add('secondary');
        photo2Wrap.classList.remove('active');
      } else {
        photo2Wrap.classList.add('active');
        photo2Wrap.classList.remove('secondary');
        photo1Wrap.classList.add('secondary');
        photo1Wrap.classList.remove('active');
      }

      // Animate Neon SVG Dot along path
      if (neonBeamDot) {
        const dotX = 200 + Math.sin(phase) * 100;
        const dotY = 200 + Math.sin(phase * 2) * 60;
        neonBeamDot.setAttribute('cx', dotX);
        neonBeamDot.setAttribute('cy', dotY);
      }

      requestAnimationFrame(animate3DStage);
    }
    animate3DStage();

    if (togglePhotoBtn) {
      togglePhotoBtn.addEventListener('click', () => {
        autoLoop = false;
        manualFocus = manualFocus === 1 ? 2 : 1;
        
        if (manualFocus === 2) {
          phase = Math.PI; // Jump focus to Photo 2
          stageModeTag.textContent = 'MODE: MANUAL FOCUS (PROFILE 02)';
        } else {
          phase = 0; // Jump focus to Photo 1
          stageModeTag.textContent = 'MODE: MANUAL FOCUS (PROFILE 01)';
        }

        // Resume auto loop after 6 seconds
        setTimeout(() => {
          autoLoop = true;
          stageModeTag.textContent = 'MODE: S-CURVE AUTO LOOP';
        }, 6000);
      });
    }
  }

  /* --------------------------------------------------------------------------
     5. TYPEWRITER / GLITCH ROLE ANIMATOR
     -------------------------------------------------------------------------- */
  const roleText = document.getElementById('role-text');
  if (roleText) {
    const roles = [
      'AI/ML Developer',
      'Full Stack Developer',
      'Frontend Developer',
      'UI/UX Designer'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeRole() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        roleText.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        roleText.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let typeSpeed = isDeleting ? 40 : 90;

      if (!isDeleting && charIdx === currentRole.length) {
        typeSpeed = 2200; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeSpeed = 400; // Pause before typing next word
      }

      setTimeout(typeRole, typeSpeed);
    }
    typeRole();
  }

  /* --------------------------------------------------------------------------
     6. INTERSECTION OBSERVER SCROLL REVEALS & ACTIVE NAV
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-element');
  const navHeader = document.querySelector('.glass-nav-header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

  // Scroll Header Glass Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  });

  // Reveal Elements Observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Active Nav Observer
  window.addEventListener('scroll', () => {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     7. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : 'auto';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = 'auto';
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. PROJECT DETAILS MODAL ENGINE
     -------------------------------------------------------------------------- */
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Project Database Content
  const projectsData = {
    1: {
      title: 'AI Heart Disease Diagnosis',
      category: 'MACHINE LEARNING • HEALTHCARE AI',
      description: 'An intelligent medical diagnostic system designed to predict cardiovascular disease risk using supervised machine learning classification algorithms. The model analyzes multi-variate clinical parameters such as cholesterol, blood pressure, resting ECG, and max heart rate.',
      features: [
        'Trained and evaluated using Logistic Regression, Naive Bayes, and Support Vector Machines (SVM).',
        'Data preprocessing pipeline with feature scaling, missing value imputation, and outlier removal.',
        'Model evaluation metrics including Accuracy, Precision, Recall, F1-Score, and ROC-AUC curve visualization.',
        'Designed as a decision-support prototype for clinical risk pre-screening.'
      ],
      tags: ['Python', 'Scikit-learn', 'SVM', 'Naive Bayes', 'Pandas', 'Matplotlib']
    },
    2: {
      title: 'Audio Emotion Detection',
      category: 'AUDIO PROCESSING • MACHINE LEARNING',
      description: 'A speech emotion recognition system engineered in Python to analyze human vocal tone and identify underlying emotional states from audio recordings.',
      features: [
        'Acoustic feature extraction utilizing Librosa for MFCCs (Mel-Frequency Cepstral Coefficients), Chroma, and Mel Spectrograms.',
        'Support Vector Machine (SVM) classifier trained on standardized emotional speech datasets.',
        'Real-time audio file upload processing with probability distribution visualization.',
        'High accuracy classification across key emotional states (Happy, Sad, Angry, Neutral, Fear).'
      ],
      tags: ['Python', 'Librosa', 'NumPy', 'Scikit-learn', 'Signal Processing']
    },
    3: {
      title: 'BloodLink AI Donor Platform',
      category: 'SMART HEALTHCARE • AI MATCHING',
      description: 'A smart blood donor-patient matching platform concept designed to reduce critical emergency response times using intelligent proximity algorithms.',
      features: [
        'Algorithmic donor matching based on blood group compatibility matrix and geospatial proximity.',
        'Real-time network node visualization showing donor availability status.',
        'Urgency prioritization engine for emergency hospital requests.',
        'Clean futuristic user interface for both donors and medical administrators.'
      ],
      tags: ['AI Concept', 'Python', 'Algorithms', 'UI/UX Design', 'Network Graphs']
    },
    4: {
      title: 'Hotel Booking Web Application',
      category: 'FULL STACK WEB DEVELOPMENT',
      description: 'A dynamic, feature-rich web platform for browsing, filtering, and booking hotel rooms with persistent user accounts and reservation history.',
      features: [
        'Interactive room catalog with search, price filtering, and availability status.',
        'Client-side user registration, login authentication flow, and profile management.',
        'Comprehensive booking checkout flow with date calculation and total cost summary.',
        'Persistent reservation history tracking stored locally in browser state.'
      ],
      tags: ['HTML5/CSS3', 'JavaScript', 'DOM API', 'State Persistence', 'Responsive UI']
    },
    5: {
      title: 'Food Ordering Web Application',
      category: 'WEB APPLICATION • INTERACTIVE UI',
      description: 'An interactive food ordering interface providing seamless menu browsing, live shopping cart operations, and order placement workflows.',
      features: [
        'Dynamic food category filtering (Burgers, Pizza, Asian, Drinks, Desserts).',
        'Real-time interactive shopping cart with item quantity controls and item tax/delivery calculations.',
        'Animated item placement feedback and clean modern card UI.',
        'Simulated order confirmation pipeline with delivery tracking modal.'
      ],
      tags: ['JavaScript', 'HTML5/CSS3', 'Cart State', 'DOM Manipulation', 'UI/UX']
    },
    6: {
      title: 'React Component Applications',
      category: 'FRONTEND FRAMEWORK • REACT',
      description: 'A collection of production-standard React applications showcasing modern component architecture, hooks management, and external API consumption.',
      features: [
        'Modular functional component structure using standard React patterns.',
        'State management utilizing useState, useReducer, and custom hooks.',
        'Asynchronous data fetching with useEffect and REST APIs.',
        'Single Page Application (SPA) routing and responsive glassmorphism interfaces.'
      ],
      tags: ['React', 'JSX', 'React Hooks', 'REST API', 'JavaScript ES6+']
    },
    7: {
      title: 'Selenium Automated Testing Suite',
      category: 'AUTOMATION • QUALITY ENGINEERING',
      description: 'An automated web testing suite developed in Python using Selenium WebDriver to execute end-to-end regression testing and interface validation.',
      features: [
        'Automated element locator strategies (XPath, CSS Selectors, ID) for cross-browser testing.',
        'Form submission validation, dynamic wait assertions, and pop-up handling.',
        'Automated test execution logs and pass/fail summary reporting.',
        'Reduces manual QA execution time while ensuring web stability.'
      ],
      tags: ['Python', 'Selenium', 'WebDriver', 'QA Automation', 'Testing']
    },
    8: {
      title: 'Interactive Cyber Portfolio',
      category: 'CREATIVE ENGINEERING • THIS WEBSITE',
      description: 'The futuristic personal portfolio website for Tharun P — engineered from scratch with raw HTML5, custom modern CSS, and JavaScript canvas engines.',
      features: [
        'Cinematic fullscreen intro overlay with particle tunnel starfield.',
        'Custom 3D perspective two-photo S-curve trajectory animation loop for profile PNGs.',
        'Interactive particle grid canvas background running on requestAnimationFrame.',
        'Accessible modal dialogs, custom magnetic cursor, and glassmorphism styling.'
      ],
      tags: ['HTML5/CSS3', 'Canvas API', '3D Perspective', 'JavaScript ES6+', 'UI/UX']
    }
  };

  function openProjectModal(id) {
    const data = projectsData[id];
    if (!data || !projectModal) return;

    document.getElementById('modal-category').textContent = data.category;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-description').textContent = data.description;

    // Populate Features
    const featuresList = document.getElementById('modal-features-list');
    featuresList.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.textContent = feat;
      featuresList.appendChild(li);
    });

    // Populate Tags
    const tagsContainer = document.getElementById('modal-tags-container');
    tagsContainer.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    // Clone SVG Banner
    const cardSvg = document.querySelector(`.project-card[data-project-id="${id}"] .project-svg`);
    const previewBox = document.getElementById('modal-preview-box');
    previewBox.innerHTML = '';
    if (cardSvg) {
      previewBox.appendChild(cardSvg.cloneNode(true));
    }

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  }

  // Bind Click Events
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.view-details-btn') || !e.target.closest('a')) {
        const id = card.getAttribute('data-project-id');
        openProjectModal(id);
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  /* --------------------------------------------------------------------------
     8.5 THREE.JS GLTF 3D ROBOT MODEL ENGINE (OBSIDIAN FURY)
     -------------------------------------------------------------------------- */
  const mechCanvas3D = document.getElementById('mech-canvas-3d');

  if (mechCanvas3D && typeof THREE !== 'undefined') {
    const container = mechCanvas3D.parentElement;
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Initialized directly to Hero Portrait view
    camera.position.set(0, 1.1, 2.8);
    let currentLookAtY = 1.05;
    let targetLookAtY = 1.05;
    camera.lookAt(0, currentLookAtY, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: mechCanvas3D,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Cinematic Cyber Studio Lighting Setup
    // Ambient Light (prevents dark obsidian armor from blending into background)
    const ambientLight = new THREE.AmbientLight(0xddeeff, 1.4);
    scene.add(ambientLight);

    // Primary Cyber Key Light (High-energy Cyan)
    const keyLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    // Warm Secondary Fill Light (Neon Orange / Gold)
    const fillLight = new THREE.DirectionalLight(0xff7700, 2.2);
    fillLight.position.set(-4, 3, 3);
    scene.add(fillLight);

    // Rim Silhouette Light (Bright White / Cyan from behind for silhouette separation)
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // Glowing Chest Reactor Core PointLight (Orange/Gold for Obsidian Fury)
    const corePointLight = new THREE.PointLight(0xff6600, 3.5, 8);
    corePointLight.position.set(0, 1.0, 0.7);
    scene.add(corePointLight);

    // 3. Load PBR Textures for Obsidian Fury glTF Model Fallback
    const textureLoader = new THREE.TextureLoader();
    const obsidianBodyTex = textureLoader.load('assets/obsidian-body.png');
    const obsidianWeaponsTex = textureLoader.load('assets/obsidian-weapons.png');

    // Obsidian Fury Materials
    const obsidianBodyMat = new THREE.MeshStandardMaterial({
      map: obsidianBodyTex,
      emissiveMap: obsidianBodyTex,
      emissive: new THREE.Color(0xff4400),
      emissiveIntensity: 0.5,
      metalness: 0.85,
      roughness: 0.25
    });

    const obsidianWeaponsMat = new THREE.MeshStandardMaterial({
      map: obsidianWeaponsTex,
      emissiveMap: obsidianWeaponsTex,
      emissive: new THREE.Color(0xff3300),
      emissiveIntensity: 0.7,
      metalness: 0.9,
      roughness: 0.2
    });

    // 4. Create Robot Group & GLB / glTF Loader
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);
    window.__DEBUG = { scene, camera, robotGroup, renderer };

    // GLTFLoader loading binary .glb model (obsidian_fury_-_pacific_rim.glb)
    if (typeof THREE.GLTFLoader !== 'undefined') {
      const gltfLoader = new THREE.GLTFLoader();
      gltfLoader.load('assets/obsidian-fury.glb', (gltf) => {
        console.log('GLB_LOADED_SUCCESSFULLY!');
        const glbModel = gltf.scene;
        window.__DEBUG.glbModel = glbModel;

        // Compute matrix world hierarchy for accurate bounding box calculation
        glbModel.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(glbModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = (maxDim > 0 && isFinite(maxDim)) ? (3.6 / maxDim) : 1;
        glbModel.scale.setScalar(scaleFactor);

        // Center mesh geometry directly around (0,0,0)
        if (isFinite(center.x) && isFinite(center.y) && isFinite(center.z)) {
          glbModel.position.x = -center.x * scaleFactor;
          glbModel.position.y = -center.y * scaleFactor;
          glbModel.position.z = -center.z * scaleFactor;
        }

        // Convert MeshBasicMaterial to high-fidelity PBR MeshStandardMaterial
        glbModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const oldMat = child.material;
            const mat = new THREE.MeshStandardMaterial({
              map: oldMat?.map || null,
              roughness: 0.3,
              metalness: 0.75,
              side: THREE.DoubleSide
            });
            if (oldMat?.map) {
              mat.emissiveMap = oldMat.map;
              mat.emissive = new THREE.Color(0x332211);
            }
            child.material = mat;
          }
        });

        // Clear procedural fallback shapes and add authentic 3D GLB model
        while (robotGroup.children.length > 0) {
          robotGroup.remove(robotGroup.children[0]);
        }
        robotGroup.add(glbModel);
      }, undefined, (err) => {
        console.warn('GLB load error, keeping procedural 3D model fallback:', err);
      });
    }

    // A) TORSO & CHEST REACTOR (3D Mesh Geometry with glTF UV Textures)
    const torsoGeo = new THREE.BoxGeometry(2.2, 1.8, 1.2);
    const torsoMesh = new THREE.Mesh(torsoGeo, obsidianBodyMat);
    torsoMesh.position.set(0, 1.2, 0);
    robotGroup.add(torsoMesh);

    // Chest Reactor Core (Glowing Orange/Gold Sphere)
    const reactorGeo = new THREE.SphereGeometry(0.38, 16, 16);
    const reactorMesh = new THREE.Mesh(reactorGeo, new THREE.MeshBasicMaterial({ color: 0xff6600 }));
    reactorMesh.position.set(0, 1.4, 0.58);
    robotGroup.add(reactorMesh);

    // B) HEAD & OBSIDIAN HELMET
    const headGeo = new THREE.BoxGeometry(0.7, 0.6, 0.7);
    const headMesh = new THREE.Mesh(headGeo, obsidianBodyMat);
    headMesh.position.set(0, 2.4, 0.1);
    robotGroup.add(headMesh);

    // Glowing Orange Visor
    const visorGeo = new THREE.BoxGeometry(0.5, 0.18, 0.2);
    const visorMesh = new THREE.Mesh(visorGeo, new THREE.MeshBasicMaterial({ color: 0xff8800 }));
    visorMesh.position.set(0, 2.42, 0.42);
    robotGroup.add(visorMesh);

    // Head Horns
    const hornGeo = new THREE.ConeGeometry(0.12, 0.6, 4);
    const hornL = new THREE.Mesh(hornGeo, obsidianBodyMat);
    hornL.position.set(-0.35, 2.85, 0);
    robotGroup.add(hornL);

    const hornR = new THREE.Mesh(hornGeo, obsidianBodyMat);
    hornR.position.set(0.35, 2.85, 0);
    robotGroup.add(hornR);

    // C) SHOULDER PADS & ARMS WITH PLASMA CHAINSAWS
    const shoulderGeo = new THREE.BoxGeometry(1.1, 0.85, 1.1);
    const shoulderL = new THREE.Mesh(shoulderGeo, obsidianBodyMat);
    shoulderL.position.set(-1.65, 1.8, 0);
    shoulderL.rotation.z = 0.2;
    robotGroup.add(shoulderL);

    const shoulderR = new THREE.Mesh(shoulderGeo, obsidianBodyMat);
    shoulderR.position.set(1.65, 1.8, 0);
    shoulderR.rotation.z = -0.2;
    robotGroup.add(shoulderR);

    // Forearms
    const armGeo = new THREE.CylinderGeometry(0.36, 0.28, 1.6, 8);
    const armL = new THREE.Mesh(armGeo, obsidianBodyMat);
    armL.position.set(-1.75, 0.6, 0.1);
    robotGroup.add(armL);

    const armR = new THREE.Mesh(armGeo, obsidianBodyMat);
    armR.position.set(1.75, 0.6, 0.1);
    robotGroup.add(armR);

    // Plasma Chainsaws (Weapons Texture Mapped)
    const plasmaChainsawGeo = new THREE.BoxGeometry(0.12, 1.8, 0.45);
    const bladeL = new THREE.Mesh(plasmaChainsawGeo, obsidianWeaponsMat);
    bladeL.position.set(-2.0, 0.2, 0.35);
    robotGroup.add(bladeL);

    const bladeR = new THREE.Mesh(plasmaChainsawGeo, obsidianWeaponsMat);
    bladeR.position.set(2.0, 0.2, 0.35);
    robotGroup.add(bladeR);

    // D) WAIST & LEGS
    const waistGeo = new THREE.CylinderGeometry(0.8, 0.7, 0.8, 8);
    const waistMesh = new THREE.Mesh(waistGeo, obsidianBodyMat);
    waistMesh.position.set(0, 0.0, 0);
    robotGroup.add(waistMesh);

    // Thighs & Shin Boots
    const legGeo = new THREE.CylinderGeometry(0.42, 0.35, 2.2, 8);
    const legL = new THREE.Mesh(legGeo, obsidianBodyMat);
    legL.position.set(-0.7, -1.4, 0);
    robotGroup.add(legL);

    const legR = new THREE.Mesh(legGeo, obsidianBodyMat);
    legR.position.set(0.7, -1.4, 0);
    robotGroup.add(legR);

    // Feet Boots
    const bootGeo = new THREE.BoxGeometry(0.7, 0.4, 1.1);
    const bootL = new THREE.Mesh(bootGeo, obsidianBodyMat);
    bootL.position.set(-0.7, -2.6, 0.2);
    robotGroup.add(bootL);

    const bootR = new THREE.Mesh(bootGeo, obsidianBodyMat);
    bootR.position.set(0.7, -2.6, 0.2);
    robotGroup.add(bootR);

    // E) BACK THRUSTER WINGS
    const wingGeo = new THREE.BoxGeometry(0.2, 1.8, 0.6);
    const wingL = new THREE.Mesh(wingGeo, obsidianBodyMat);
    wingL.position.set(-0.6, 1.8, -0.7);
    wingL.rotation.z = -0.25;
    robotGroup.add(wingL);

    const wingR = new THREE.Mesh(wingGeo, obsidianBodyMat);
    wingR.position.set(0.6, 1.8, -0.7);
    wingR.rotation.z = 0.25;
    robotGroup.add(wingR);

    robotGroup.position.set(0, 0, 0);

    // 4. Interactive Mouse Drag-to-Rotate & Hover Logic
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    let targetRotY = 0; // Pure Front View facing camera
    let targetRotX = 0; // Eye-level zero pitch tilt

    let autoRotate = false;

    mechCanvas3D.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;

        targetRotY += deltaX * 0.01;
        targetRotX += deltaY * 0.01;

        // Clamp vertical X rotation
        targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));

        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
      }
    });

    // Touch Support for Mobile
    mechCanvas3D.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMouseX;
        const deltaY = e.touches[0].clientY - previousMouseY;

        targetRotY += deltaX * 0.01;
        targetRotX += deltaY * 0.01;

        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Target camera positions for smooth view switching (default: 3D Hero Portrait)
    let targetCamZ = 2.8;      // Upper-torso hero portrait distance
    let targetCamY = 1.1;      // Focused on helmet visor and chest reactor
    let targetCamX = 0.0;
    targetLookAtY = 1.05;      // Look at center of chest / helmet
    currentLookAtY = 1.05;

    targetRotY = 0;        // Pure front view facing camera
    targetRotX = 0.03;     // Slight heroic upward pitch
    autoRotate = false;

    // View Angle Button Controls
    const mechAngleBtns = document.querySelectorAll('.mech-angle-btn[data-view]');
    const autoRotateBtn = document.getElementById('mech-auto-rotate-btn');
    const autoRotateText = document.getElementById('auto-rotate-text');

    mechAngleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        mechAngleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const view = btn.getAttribute('data-view');
        autoRotate = false;
        if (autoRotateBtn) autoRotateBtn.classList.remove('active');
        if (autoRotateText) autoRotateText.textContent = 'AUTO 360° ROTATE';

        if (view === 'portrait') {
          // 3D Hero Upper-Torso Portrait View
          targetCamZ = 2.8;
          targetCamY = 1.1;
          targetLookAtY = 1.05;
          targetRotY = 0;
          targetRotX = 0.03;
        } else if (view === 'front') {
          // 3D Full Body Front View
          targetCamZ = 5.4;
          targetCamY = 0.1;
          targetLookAtY = 0.0;
          targetRotY = 0;
          targetRotX = 0;
        } else if (view === 'persp') {
          // 3D 3/4 Combat Stance
          targetCamZ = 5.0;
          targetCamY = 0.3;
          targetLookAtY = 0.1;
          targetRotY = 0.55;
          targetRotX = 0.04;
        } else if (view === 'back') {
          // 3D Rear View
          targetCamZ = 5.2;
          targetCamY = 0.3;
          targetLookAtY = 0.1;
          targetRotY = Math.PI;
          targetRotX = 0;
        }
      });
    });

    if (autoRotateBtn) {
      autoRotateBtn.addEventListener('click', () => {
        autoRotate = !autoRotate;
        if (autoRotate) {
          autoRotateBtn.classList.add('active');
          if (autoRotateText) autoRotateText.textContent = 'STOP ROTATE';
        } else {
          autoRotateBtn.classList.remove('active');
          if (autoRotateText) autoRotateText.textContent = 'AUTO 360° ROTATE';
        }
      });
    }

    // 4.5 Hotspot Definitions & 3D Real-time Tracking Engine
    const hotspots = [
      {
        id: 'visor',
        el: document.querySelector('.mech-hotspot-pin[data-pin="visor"]'),
        pos: new THREE.Vector3(0, 1.48, 0.28),
        normal: new THREE.Vector3(0, 0, 1),
        pref: 'left',
        yOffset: -40
      },
      {
        id: 'reactor',
        el: document.querySelector('.mech-hotspot-pin[data-pin="reactor"]'),
        pos: new THREE.Vector3(0, 0.95, 0.38),
        normal: new THREE.Vector3(0, 0, 1),
        pref: 'right',
        yOffset: -25
      },
      {
        id: 'armor',
        el: document.querySelector('.mech-hotspot-pin[data-pin="armor"]'),
        pos: new THREE.Vector3(-1.05, 1.25, 0.10),
        normal: new THREE.Vector3(-0.8, 0, 0.6).normalize(),
        pref: 'left',
        yOffset: 65
      },
      {
        id: 'weapon',
        el: document.querySelector('.mech-hotspot-pin[data-pin="weapon"]'),
        pos: new THREE.Vector3(1.05, 0.50, 0.20),
        normal: new THREE.Vector3(0.8, 0, 0.6).normalize(),
        pref: 'right',
        yOffset: 45
      },
      {
        id: 'thruster',
        el: document.querySelector('.mech-hotspot-pin[data-pin="thruster"]'),
        pos: new THREE.Vector3(0, 1.25, -0.45),
        normal: new THREE.Vector3(0, 0, -1),
        pref: 'right',
        yOffset: -15
      }
    ];

    // Interactive Click/Tap to Highlight Specific Callout Card
    hotspots.forEach(hs => {
      if (hs.el) {
        hs.el.addEventListener('click', (e) => {
          e.stopPropagation();
          const wasActive = hs.el.classList.contains('highlighted');
          hotspots.forEach(h => h.el?.classList.remove('highlighted'));
          if (!wasActive) hs.el.classList.add('highlighted');
        });
      }
    });

    // Dismiss highlight on clicking canvas background
    mechCanvas3D.addEventListener('click', () => {
      hotspots.forEach(h => h.el?.classList.remove('highlighted'));
    });

    // 5. Render & Animation Loop
    let clock = new THREE.Clock();

    function render3DRobot() {
      const time = clock.getElapsedTime();

      // Reactor Core Pulse Lighting
      corePointLight.intensity = 3.0 + Math.sin(time * 4) * 1.2;

      // Subtle float breathing animation centered at eye level
      robotGroup.position.y = Math.sin(time * 2) * 0.03;

      if (autoRotate) {
        targetRotY += 0.012;
      }

      // Smooth camera position and lookAt interpolation
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;
      currentLookAtY += (targetLookAtY - currentLookAtY) * 0.08;
      camera.lookAt(0, currentLookAtY, 0);

      // Smooth interpolation (dampening) to target rotations
      robotGroup.rotation.y += (targetRotY - robotGroup.rotation.y) * 0.08;
      robotGroup.rotation.x += (targetRotX - robotGroup.rotation.x) * 0.08;

      // Real-time 3D Hotspot Screen-space Projection & "Pop Beside Mech" Engine
      const stageW = container.clientWidth || 400;
      const stageH = container.clientHeight || 400;
      const centerScreenX = stageW / 2;

      hotspots.forEach(hs => {
        if (!hs.el) return;

        // 1. Transform 3D local coordinate by robot's current world matrix
        const worldPos = hs.pos.clone().applyMatrix4(robotGroup.matrixWorld);

        // 2. Compute normal vector to check camera facing angle
        const worldNormal = hs.normal.clone().applyEuler(robotGroup.rotation);
        const toCam = camera.position.clone().sub(worldPos).normalize();
        const dot = worldNormal.dot(toCam);

        // 3. Project world position into camera viewport
        const proj = worldPos.clone().project(camera);

        // If behind camera plane, hide
        if (proj.z > 1) {
          hs.el.style.display = 'none';
          return;
        }

        hs.el.style.display = 'flex';

        // Convert NDC to pixel coordinates within the figure container
        const px = (proj.x * 0.5 + 0.5) * stageW;
        const py = (-proj.y * 0.5 + 0.5) * stageH;

        // Determine if this point is to the left or right of the mech
        let side = hs.pref;
        if (px > centerScreenX + 45) {
          side = 'right';
        } else if (px < centerScreenX - 45) {
          side = 'left';
        }

        hs.el.classList.remove('pop-left', 'pop-right');
        hs.el.classList.add(side === 'right' ? 'pop-right' : 'pop-left');

        // Clamp coordinates cleanly so cards stay inside stage boundaries
        const cardTargetY = py + hs.yOffset;
        const clampedY = Math.max(25, Math.min(stageH - 110, cardTargetY));
        const clampedX = Math.max(15, Math.min(stageW - 15, px));

        // Position pin using GPU translate3d
        if (side === 'right') {
          hs.el.style.transform = `translate3d(${clampedX - 10}px, ${clampedY - 10}px, 0)`;
        } else {
          hs.el.style.transform = `translate3d(${clampedX - 10}px, ${clampedY - 10}px, 0) translateX(-100%) translateX(20px)`;
        }

        // Smoothly fade out when occluded/facing away so cards never overlap
        if (dot < -0.05) {
          hs.el.style.opacity = '0';
          hs.el.style.pointerEvents = 'none';
        } else {
          hs.el.style.opacity = '1';
          hs.el.style.pointerEvents = 'auto';
        }
      });

      renderer.render(scene, camera);
      requestAnimationFrame(render3DRobot);
    }
    render3DRobot();

    // Handle Window Resize
    window.addEventListener('resize', () => {
      width = container.clientWidth || 400;
      height = container.clientHeight || 400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  }

  /* --------------------------------------------------------------------------
     9. CONTACT FORM INTERACTIVE SUBMISSION & THANKING MAIL HANDLER
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');
  const submitBtn = document.getElementById('submit-btn');

  // Thanking Mail Modal Elements
  const thankModal = document.getElementById('thank-you-mail-modal');
  const thankModalClose = document.getElementById('thank-modal-close');
  const thankDismissBtn = document.getElementById('thank-dismiss-btn');
  const thankCopyBtn = document.getElementById('thank-copy-btn');
  const thankCopyText = document.getElementById('thank-copy-text');

  function openThankModal(recipientName, recipientEmail, userMsg, isEmailDispatched = true) {
    if (!thankModal) return;

    // Populate Dynamic Fields
    const safeName = recipientName.trim() || 'Valued Visitor';
    const safeEmail = recipientEmail.trim() || 'visitor@portfolio.com';
    const safeMsg = userMsg.trim() || 'Inquiry regarding project development & collaboration';

    const recipientNameEl = document.getElementById('thank-recipient-name');
    const recipientEmailEl = document.getElementById('thank-recipient-email');
    const greetingNameEl = document.getElementById('thank-greeting-name');
    const letterDateEl = document.getElementById('thank-letter-date');
    const letterSubjectEl = document.getElementById('thank-letter-subject');
    const messageExcerptEl = document.getElementById('thank-message-excerpt');
    const badgeTextEl = document.getElementById('thank-badge-text');
    const inboxEmailEl = document.getElementById('thank-inbox-email');

    if (recipientNameEl) recipientNameEl.textContent = safeName;
    if (recipientEmailEl) recipientEmailEl.textContent = safeEmail;
    if (greetingNameEl) greetingNameEl.textContent = safeName;
    if (letterSubjectEl) letterSubjectEl.textContent = `Re: Inquiry from ${safeName} - Tharun P Portfolio`;
    if (inboxEmailEl) inboxEmailEl.textContent = safeEmail;

    if (badgeTextEl) {
      if (isEmailDispatched) {
        badgeTextEl.innerHTML = 'TRANSMISSION DELIVERED &bull; THANKING MAIL DISPATCHED TO INBOX';
      } else {
        badgeTextEl.innerHTML = 'TRANSMISSION QUEUED &bull; MAIL CLIENT PREFILLED';
      }
    }

    if (letterDateEl) {
      const now = new Date();
      letterDateEl.textContent = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' at ' + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    if (messageExcerptEl) {
      const displayMsg = safeMsg.length > 220 ? safeMsg.substring(0, 220) + '...' : safeMsg;
      messageExcerptEl.textContent = `"${displayMsg}"`;
    }

    // Display modal
    thankModal.classList.add('open');
    thankModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeThankModal() {
    if (!thankModal) return;
    thankModal.classList.remove('open');
    thankModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  }

  window.openThankModal = openThankModal;
  window.closeThankModal = closeThankModal;

  if (thankModalClose) thankModalClose.addEventListener('click', closeThankModal);
  if (thankDismissBtn) thankDismissBtn.addEventListener('click', closeThankModal);
  if (thankModal) {
    thankModal.addEventListener('click', (e) => {
      if (e.target === thankModal) closeThankModal();
    });
  }

  // Copy Letter functionality
  if (thankCopyBtn && thankCopyText) {
    thankCopyBtn.addEventListener('click', () => {
      const letterCard = document.querySelector('.thank-mail-letter-card');
      if (!letterCard) return;

      const textToCopy = letterCard.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHtml = thankCopyText.innerHTML;
        thankCopyText.innerHTML = 'COPIED TO CLIPBOARD!';
        thankCopyBtn.style.borderColor = 'var(--neon-green)';
        thankCopyBtn.style.color = 'var(--neon-green)';

        setTimeout(() => {
          thankCopyText.innerHTML = originalHtml;
          thankCopyBtn.style.borderColor = '';
          thankCopyBtn.style.color = '';
        }, 2200);
      }).catch(err => {
        console.warn('Copy failed:', err);
      });
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (thankModal && thankModal.classList.contains('open')) {
        closeThankModal();
      }
      if (typeof closeProjectModal === 'function') {
        closeProjectModal();
      }
    }
  });

  if (contactForm && formToast && submitBtn) {
    // Optional standalone mailto launcher button
    const launchMailtoBtn = document.getElementById('launch-mailto-btn');
    if (launchMailtoBtn) {
      launchMailtoBtn.addEventListener('click', () => {
        const name = document.getElementById('user_name')?.value || 'Visitor';
        const email = document.getElementById('user_email')?.value || '';
        const message = document.getElementById('user_message')?.value || '';
        const mailtoSubject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const mailtoBody = encodeURIComponent(`Hi Tharun,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`);
        window.location.href = `mailto:tharunparthiban2006@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      });
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('user_name')?.value.trim() || 'Visitor';
      const email = document.getElementById('user_email')?.value.trim() || '';
      const message = document.getElementById('user_message')?.value.trim() || '';

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-text">SENDING... <i class="fa-solid fa-spinner fa-spin"></i></span>';
      formToast.className = 'form-toast-msg';
      formToast.style.display = 'none';

      const showToast = (type, html) => {
        formToast.className = `form-toast-msg ${type}`;
        formToast.style.display = 'block';
        formToast.innerHTML = html;
        setTimeout(() => { formToast.style.display = 'none'; }, 10000);
      };

      try {
        // Same-origin when served by `npm start`; falls back to localhost:5000 if the page is opened elsewhere.
        const endpoint = window.location.protocol.startsWith('http') && window.location.port === '5000'
          ? '/api/contact'
          : 'http://localhost:5000/api/contact';

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, message }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          const safeEmail = email.replace(/[&<>"']/g, '');
          showToast('success', data.thankYouSent
            ? `<i class="fa-solid fa-circle-check"></i> <strong>Message sent!</strong> A thank-you mail is on its way to <strong>${safeEmail}</strong>.`
            : `<i class="fa-solid fa-circle-check"></i> <strong>Message sent!</strong> (The thank-you mail could not be delivered.)`);
          openThankModal(name, email, message, Boolean(data.thankYouSent));
          contactForm.reset();
        } else {
          showToast('warning', `<i class="fa-solid fa-triangle-exclamation"></i> ${data.message || 'Could not send your message. Please try again.'}`);
        }
      } catch (err) {
        console.warn('Contact request failed:', err);
        showToast('warning', '<i class="fa-solid fa-triangle-exclamation"></i> Could not reach the mail server. Make sure it is running (<code>npm start</code>), or use the email button instead.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. CURRENT YEAR IN FOOTER
     -------------------------------------------------------------------------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});

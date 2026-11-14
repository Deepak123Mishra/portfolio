/**
 * DEEPAK KUMAR MISHRA - PERSONAL DEVELOPER PORTFOLIO
 * Core JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Theme Toggle (Dark / Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Initialize theme from storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else if (!systemPrefersDark) {
    htmlElement.setAttribute('data-theme', 'light');
  } else {
    htmlElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Typewriter Effect
  // --------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriter');
  const roles = [
    'AI & Machine Learning Engineering',
    'Data Analytics & BI Dashboards',
    'Python & SQL Data Pipelines',
    'RAG & GenAI LLM Architectures',
    'Predictive Modeling & Scikit-Learn'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Finished typing current role; pause before deleting
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting; move to next role
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // --------------------------------------------------------------------------
  // 3. Ambient Canvas Neural Background Animation
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
    const particles = [];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        const isDark = htmlElement.getAttribute('data-theme') === 'dark';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(6, 182, 212, ${this.alpha * 0.6})`
          : `rgba(14, 116, 144, ${this.alpha * 0.35})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      const isDark = htmlElement.getAttribute('data-theme') === 'dark';

      // Connect nearby particles with subtle lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(6, 182, 212, ${lineAlpha})`
              : `rgba(59, 130, 246, ${lineAlpha * 0.8})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Pause canvas when user switches tab
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animateParticles();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Navbar Sticky State & Scroll Spy
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  function handleScroll() {
    const scrollY = window.pageYOffset;

    // Sticky navbar style
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll spy for navigation highlighting
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Mobile Navigation Menu Toggle
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close when clicking outside menu
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    navMenu.classList.add('open');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navMenu.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // --------------------------------------------------------------------------
  // 6. Animated Skill Progress Bars (Trigger on Viewport Entry)
  // --------------------------------------------------------------------------
  const progressFills = document.querySelectorAll('.progress-fill');

  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    progressFills.forEach((fill) => skillObserver.observe(fill));
  } else {
    progressFills.forEach((fill) => fill.classList.add('animated'));
  }

  // --------------------------------------------------------------------------
  // 7. Skills Tab Filter
  // --------------------------------------------------------------------------
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((btn) => btn.classList.remove('active'));
      tab.classList.add('active');

      const targetCategory = tab.getAttribute('data-tab');

      skillCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || targetCategory === cardCategory) {
          card.style.display = 'block';
          // Trigger animation on newly shown cards
          card.querySelectorAll('.progress-fill').forEach((p) => p.classList.add('animated'));
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. Projects Filter
  // --------------------------------------------------------------------------
  const projectTabs = document.querySelectorAll('.project-tab-btn');
  const projectArticles = document.querySelectorAll('.project-card');

  projectTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      projectTabs.forEach((btn) => btn.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      projectArticles.forEach((article) => {
        const categories = article.getAttribute('data-category').split(' ');
        if (filterVal === 'all' || categories.includes(filterVal)) {
          article.style.display = 'flex';
          article.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          article.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 9. Interactive AI Playground: Model 1 - Salary Predictor (IBM Internship Simulation)
  // --------------------------------------------------------------------------
  const expSlider = document.getElementById('exp-slider');
  const expVal = document.getElementById('exp-val');
  const eduSelect = document.getElementById('education-select');
  const roleSelect = document.getElementById('role-select');
  const locSelect = document.getElementById('location-select');
  const skillCount = document.getElementById('skill-count');
  const skillsVal = document.getElementById('skills-val');
  const salaryDisplay = document.getElementById('salary-display');
  const salaryRangeDisplay = document.getElementById('salary-range-display');

  // Education base multipliers (INR in Lakhs)
  const eduWeights = {
    btech: 5.5,
    mtech: 7.2,
    bca: 4.2,
    phd: 11.0
  };

  // Role market multiplier
  const roleWeights = {
    aiml: 1.35,
    'data-analyst': 1.1,
    'data-scientist': 1.3,
    'software-dev': 1.15
  };

  // Location multipliers
  const locWeights = {
    tier1: 1.25,
    tier2: 0.95,
    remote: 1.15
  };

  function updateSalaryPrediction() {
    if (!expSlider || !salaryDisplay) return;

    const exp = parseFloat(expSlider.value);
    const edu = eduSelect.value;
    const role = roleSelect.value;
    const loc = locSelect.value;
    const skills = parseInt(skillCount.value, 10);

    // Update label displays
    expVal.textContent = `${exp.toFixed(1)} ${exp === 1 ? 'Year' : 'Years'}`;
    skillsVal.textContent = `${skills} Core Skills`;

    // Mathematical estimation mimicking ML Regression
    const baseVal = eduWeights[edu] || 5.0;
    const expBoost = Math.pow(exp, 0.85) * 1.45; // Non-linear returns for experience
    const skillBoost = (skills - 2) * 0.45;
    const totalRawLakhs = (baseVal + expBoost + skillBoost) * roleWeights[role] * locWeights[loc];

    // Format to Indian Currency (INR)
    const annualINR = Math.round(totalRawLakhs * 100000);
    const minINR = Math.round(annualINR * 0.88);
    const maxINR = Math.round(annualINR * 1.12);

    animateNumber(salaryDisplay, annualINR);
    if (salaryRangeDisplay) {
      salaryRangeDisplay.textContent = `Range: ${formatINR(minINR)} - ${formatINR(maxINR)} / year`;
    }
  }

  function formatINR(amount) {
    return '₹ ' + amount.toLocaleString('en-IN');
  }

  let currentAnimVal = 950000;
  function animateNumber(element, targetVal) {
    const startVal = currentAnimVal;
    const duration = 400;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startVal + (targetVal - startVal) * easeProgress);

      element.textContent = formatINR(currentVal);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        currentAnimVal = targetVal;
        element.textContent = formatINR(targetVal);
      }
    }

    requestAnimationFrame(step);
  }

  // Bind change listeners to salary predictor controls
  [expSlider, eduSelect, roleSelect, locSelect, skillCount].forEach((ctrl) => {
    if (ctrl) {
      ctrl.addEventListener('input', updateSalaryPrediction);
      ctrl.addEventListener('change', updateSalaryPrediction);
    }
  });

  // Initialize prediction
  updateSalaryPrediction();

  // --------------------------------------------------------------------------
  // 10. Interactive AI Playground: Model 2 - Medical Report Analyzer (RAG Simulation)
  // --------------------------------------------------------------------------
  const runMedicalBtn = document.getElementById('run-medical-ai-btn');
  const sampleReportSelect = document.getElementById('sample-report-select');
  const medicalQuery = document.getElementById('medical-query');
  const medicalSummaryOutput = document.getElementById('medical-summary-output');

  const medicalSampleData = {
    'blood-panel': {
      status: 'Mild Borderline High',
      statusClass: 'tag-alert-mild',
      findings: [
        { label: 'Hemoglobin', value: '14.2 g/dL', normal: '13.5 - 17.5 g/dL', ok: true },
        { label: 'Total Cholesterol', value: '215 mg/dL', normal: '< 200 mg/dL', ok: false, note: 'Borderline Elevated' },
        { label: 'Fasting Blood Glucose', value: '92 mg/dL', normal: '70 - 99 mg/dL', ok: true }
      ],
      advice: 'Your blood sugar and hemoglobin levels are completely healthy. Your total cholesterol is marginally above the standard threshold; consider discussing dietary adjustments with your physician.'
    },
    'thyroid': {
      status: 'Normal Thyroid Profile',
      statusClass: 'badge-accent',
      findings: [
        { label: 'TSH (Thyroid Stimulating Hormone)', value: '2.45 µIU/mL', normal: '0.4 - 4.5 µIU/mL', ok: true },
        { label: 'Free T3', value: '3.1 pg/mL', normal: '2.3 - 4.2 pg/mL', ok: true },
        { label: 'Free T4', value: '1.2 ng/dL', normal: '0.8 - 1.8 ng/dL', ok: true }
      ],
      advice: 'All fundamental thyroid indicators are resting firmly within expected clinical reference intervals. No abnormal metabolic indications detected.'
    },
    'cardiac': {
      status: 'Cardiovascular Baseline Optimal',
      statusClass: 'badge-accent',
      findings: [
        { label: 'High-Sensitivity Troponin I', value: '< 2.5 ng/L', normal: '< 14.0 ng/L', ok: true },
        { label: 'Blood Pressure Marker', value: '118/76 mmHg', normal: '< 120/80 mmHg', ok: true },
        { label: 'Resting Heart Rate', value: '72 bpm', normal: '60 - 100 bpm', ok: true }
      ],
      advice: 'Cardiac biomarkers reflect optimal baseline function. Heart rate and resting arterial pressure present no signs of acute cardiovascular stress.'
    }
  };

  if (runMedicalBtn && medicalSummaryOutput) {
    runMedicalBtn.addEventListener('click', () => {
      const selected = sampleReportSelect ? sampleReportSelect.value : 'blood-panel';
      const sample = medicalSampleData[selected] || medicalSampleData['blood-panel'];
      const userQ = medicalQuery ? medicalQuery.value : 'Report summary';

      // Show temporary processing state
      runMedicalBtn.disabled = true;
      runMedicalBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Embedding & Retrieving Chunks...';

      setTimeout(() => {
        runMedicalBtn.disabled = false;
        runMedicalBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> <span>Analyze with LangChain & RAG</span>';

        // Render response
        let findingsHtml = '';
        sample.findings.forEach((f) => {
          findingsHtml += `<li><strong>${f.label}:</strong> ${f.value} (Normal: ${f.normal}) ${
            f.ok ? '&check; Normal' : `&excl; <em>${f.note}</em>`
          }</li>`;
        });

        medicalSummaryOutput.innerHTML = `
          <h4><i class="fa-solid fa-heart-pulse"></i> Clinical Synthesis for: "${escapeHtml(userQ)}"</h4>
          <p><strong>Status:</strong> <span class="${sample.statusClass}">${sample.status}</span></p>
          <ul class="medical-findings-list">
            ${findingsHtml}
          </ul>
          <div class="patient-friendly-advice">
            <strong>AI Explanation:</strong> ${sample.advice}
          </div>
        `;

        showToast('RAG context retrieved & analyzed successfully!', 'success');
      }, 450);
    });
  }

  // Playground Tab Switcher
  const playgroundTabs = document.querySelectorAll('.playground-tab-btn');
  const playgroundContents = document.querySelectorAll('.playground-content');

  playgroundTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      playgroundTabs.forEach((b) => b.classList.remove('active'));
      playgroundContents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-demo');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 11. Project Details Modal Dialog
  // --------------------------------------------------------------------------
  const projectModal = document.getElementById('project-modal');
  const modalBodyContent = document.getElementById('modal-body-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTriggers = document.querySelectorAll('.project-modal-trigger');

  const projectDetailsDatabase = {
    'medical-analyzer': {
      title: 'AI Medical Report Analyzer & Synthesizer',
      date: 'June 2026',
      badge: 'GenAI & RAG System',
      tech: ['Gemini / Claude', 'LangGraph', 'LangChain', 'RAG Architecture', 'FAISS / ChromaDB', 'FastAPI', 'Streamlit'],
      summary: 'An intelligent multi-agent healthcare intelligence platform that allows patients and clinicians to upload intricate diagnostic PDF reports and obtain intuitive, clinically sound summaries with citations.',
      features: [
        'End-to-end document parsing supporting multimodal PDF clinical diagnostics.',
        'Hierarchical chunking and vector indexing using FAISS and ChromaDB vector embeddings.',
        'LangGraph stateful workflow to verify clinical terminology against trusted health references.',
        'Interactive Q&A interface built with Streamlit and secured FastAPI endpoints.',
        'Strict privacy-preserving prompt guardrails to avoid diagnostic hallucinations.'
      ],
      impact: 'Dramatically reduces patient anxiety by converting complex medical jargon into readable health insights.'
    },
    'salary-predictor': {
      title: 'AI Salary Prediction & HR Compensation Analytics',
      date: 'August 2025',
      badge: 'IBM AI Internship Project',
      tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Linear & Random Forest Regression'],
      summary: 'Developed during Deepak’s virtual AI internship with IBM to forecast employee compensation across departments, minimizing pay disparities and bolstering data-driven HR budgeting.',
      features: [
        'Extensive Exploratory Data Analysis (EDA) on multi-factor employee demographic and compensation datasets.',
        'Data cleaning, categorical feature encoding (One-Hot / Ordinal), and outlier treatment.',
        'Comparative evaluation between Linear Regression, Ridge, and Random Forest Regressors using RMSE and R² metrics.',
        'Interactive visual dashboards rendered with Seaborn & Matplotlib for HR executive reviews.',
        'Simulated compensation scenario modeling to forecast budget impacts of workforce promotions.'
      ],
      impact: 'Provided HR decision-makers with unbiased compensation benchmarks, supporting competitive salary offerings.'
    },
    'employee-system': {
      title: 'Enterprise Employee Management System',
      date: 'August 2025',
      badge: 'Desktop CRUD Application',
      tech: ['Python', 'Tkinter GUI', 'MySQL Database', 'mysql-connector-python', 'Relational Data Modeling'],
      summary: 'A desktop administrative suite built in Python with a Tkinter graphical interface connected to a relational MySQL server for corporate staff management.',
      features: [
        'Full CRUD capabilities: Create, Read, Update, and Delete employee records with instant DB persistence.',
        'Custom Tkinter user interface with search filters by Department, Employee ID, and Role.',
        'Transaction safety and parameter validation preventing SQL injection and data corruption.',
        'Automated database connection pool management via mysql-connector-python.'
      ],
      impact: 'Replaced manual spreadsheet logging with a synchronized, user-friendly relational desktop system.'
    },
    'women-safety': {
      title: 'Women Safety SOS Emergency Alert Trigger',
      date: 'February 2026',
      badge: 'UHack4.0 Hackathon (Team UHK04125)',
      tech: ['Python', 'Geolocation API', 'Emergency Alert Routing', 'Distress Beaconing'],
      summary: 'A rapid emergency trigger mechanism engineered during the UHack4.0 Hackathon at UCER Prayagraj designed to safeguard women in distressing situations.',
      features: [
        'Instant multi-channel emergency distress beacon dispatched upon physical or gesture trigger.',
        'High-accuracy GPS coordinate tracking and automatic Google Maps navigation link generation.',
        'Low-bandwidth failover protocol ensuring alert transmission even in compromised network zones.',
        'Automated routing to designated emergency contacts, nearest police precincts, and local safety patrols.'
      ],
      impact: 'Demonstrated rapid response safety dispatch with sub-5-second notification delivery.'
    },
    'fraud-detection': {
      title: 'Digital Payment Fraud Detection Engine',
      date: '2026',
      badge: 'FinTech Machine Learning',
      tech: ['Python', 'Scikit-learn', 'XGBoost', 'Imbalanced-Learn (SMOTE)', 'Pandas', 'Streamlit'],
      summary: 'A high-throughput machine learning classification system capable of detecting fraudulent electronic payment transactions in real time.',
      features: [
        'Handling severely skewed transaction class imbalances using SMOTE and cost-sensitive learning.',
        'Feature engineering targeting transaction velocity, merchant categories, and anomaly z-scores.',
        'Attained high ROC-AUC and precision-recall trade-off to minimize false customer declines.',
        'Live transaction scoring endpoint demo built on Streamlit.'
      ],
      impact: 'Protects digital financial transactions by identifying high-risk transfers before settlement.'
    },
    'bi-dashboard': {
      title: 'Executive Business Intelligence & KPI Dashboard',
      date: '2025',
      badge: 'Data Analytics & Power BI',
      tech: ['Power BI', 'DAX Formulas', 'Microsoft Excel', 'Data Modeling', 'Interactive KPI Slicers'],
      summary: 'An end-to-end business intelligence suite translating raw enterprise sales and workforce performance data into executive visualizations.',
      features: [
        'Star-schema data modeling integrating multiple fact and dimension tables.',
        'Custom DAX measures for Year-over-Year (YoY) revenue calculations, attrition rates, and margin variances.',
        'Dynamic parameter slicers for multi-region and quarterly deep dives.',
        'Automated data refresh schedules and clean executive KPI card presentations.'
      ],
      impact: 'Streamlined operational review meetings with single-click interactive analytical reporting.'
    }
  };

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = trigger.getAttribute('data-project');
      const details = projectDetailsDatabase[projKey];
      if (!details) return;

      let techPills = details.tech.map((t) => `<span class="tech-pill">${t}</span>`).join(' ');
      let featuresHtml = details.features.map((f) => `<li>${f}</li>`).join('');

      modalBodyContent.innerHTML = `
        <div class="modal-title-row">
          <h2 class="modal-title" id="modal-title">${details.title}</h2>
          <span class="modal-date-tag"><i class="fa-regular fa-calendar"></i> ${details.date}</span>
        </div>
        <div class="modal-badge-row">
          <span class="badge-status">${details.badge}</span>
        </div>
        <p class="project-summary">${details.summary}</p>
        
        <h4 class="modal-section-heading"><i class="fa-solid fa-code"></i> Technology Stack</h4>
        <div class="project-tech-stack">${techPills}</div>

        <h4 class="modal-section-heading"><i class="fa-solid fa-list-check"></i> Key Architectural Highlights</h4>
        <ul class="modal-features-list">${featuresHtml}</ul>

        <h4 class="modal-section-heading"><i class="fa-solid fa-bullseye"></i> Real-World Impact</h4>
        <p class="project-summary" style="margin-bottom: 0;">${details.impact}</p>

        <div class="project-actions" style="margin-top: 1.5rem;">
          <a href="https://github.com/Deepak123Mishra" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <i class="fa-brands fa-github"></i> View GitHub Repository
          </a>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('project-modal').classList.remove('active')">
            Close
          </button>
        </div>
      `;

      projectModal.classList.add('active');
      projectModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalCloseBtn && projectModal) {
    modalCloseBtn.addEventListener('click', closeModal);
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // --------------------------------------------------------------------------
  // 12. Copy Email & Contact Form Interaction
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'deepakkumarhalia@gmail.com';
      copyToClipboard(email, 'Email address copied to clipboard!');
    });
  }

  function copyToClipboard(text, message) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(message, 'success');
      }).catch(() => {
        fallbackCopyText(text, message);
      });
    } else {
      fallbackCopyText(text, message);
    }
  }

  function fallbackCopyText(text, message) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(message, 'success');
    } catch (err) {
      showToast('Could not copy automatically.', 'error');
    }
    document.body.removeChild(tempInput);
  }

  // Contact Form Handling with Field Validation
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        setError(nameInput);
        isValid = false;
      } else {
        clearError(nameInput);
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        setError(emailInput);
        isValid = false;
      } else {
        clearError(emailInput);
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        setError(subjectInput);
        isValid = false;
      } else {
        clearError(subjectInput);
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        setError(messageInput);
        isValid = false;
      } else {
        clearError(messageInput);
      }

      if (!isValid) {
        showToast('Please correct the highlighted fields.', 'error');
        return;
      }

      // Simulate asynchronous form delivery
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Send Message</span>';

        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.innerHTML = `<strong>Thank you, ${escapeHtml(
            nameInput.value.trim()
          )}!</strong> Your message has been received. Deepak will connect with you shortly.`;
        }

        showToast('Message transmitted successfully!', 'success');
        contactForm.reset();

        setTimeout(() => {
          if (formStatus) formStatus.style.display = 'none';
        }, 8000);
      }, 900);
    });
  }

  function setError(inputElement) {
    const group = inputElement.closest('.form-group');
    if (group) group.classList.add('has-error');
  }

  function clearError(inputElement) {
    const group = inputElement.closest('.form-group');
    if (group) group.classList.remove('has-error');
  }

  // --------------------------------------------------------------------------
  // 13. Toast Notification Helper
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 400);
    }, 3500);
  }

  // Utility to prevent XSS in dynamic text
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Auto-update footer current year
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
});

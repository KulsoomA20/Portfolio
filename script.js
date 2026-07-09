/* ==========================================================================
   DEVELOPER PORTFOLIO - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Safe localStorage wrapper to prevent SecurityErrors in nested environments
  const safeStorage = {
    getItem(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage is blocked or unavailable:', e);
        return null;
      }
    },
    setItem(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('localStorage writing is blocked or unavailable:', e);
      }
    }
  };


  // --------------------------------------------------------------------------
  // 2. MOBILE MENU OVERLAY
  // --------------------------------------------------------------------------
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const menuIcon = mobileMenuToggle ? mobileMenuToggle.querySelector('i') : null;
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      if (menuIcon) {
        menuIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });
  }

  // Close mobile navigation overlay when clicking link items
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav) mobileNav.classList.remove('open');
      if (menuIcon) menuIcon.className = 'fa-solid fa-bars';
    });
  });

  // --------------------------------------------------------------------------
  // 3. SCROLL SPY (ACTIVE Navigation highlights)
  // --------------------------------------------------------------------------
  const desktopNavLinks = document.querySelectorAll('.desktop-nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Default to 'about' when at the top of the page
    if (window.scrollY < 100) {
      currentSectionId = 'about';
    }

    // Update Desktop Nav items
    desktopNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    // Update Mobile Nav items
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. TYPEWRITER EFFECT
  // --------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const words = JSON.parse(typewriterElement.getAttribute('data-words'));
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // deleting speed
      } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 120; // typing speed
      }

      // Transition criteria
      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at typed word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 300; // Pause before typing next word
      }

      setTimeout(type, typeSpeed);
    }

    // Initialize typing loops
    setTimeout(type, 500);
  }

  // --------------------------------------------------------------------------
  // 5. PROJECT FILTERING
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle button states
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectItems.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Hide animation scale transition
        card.style.transform = 'scale(0.97)';
        card.style.opacity = '0';
        
        setTimeout(() => {
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'block';
            // Show scale animations
            setTimeout(() => {
              card.style.transform = 'scale(1)';
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // Assign transitions for projects
  projectItems.forEach(card => {
    card.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease';
  });

  // --------------------------------------------------------------------------
  // 6. CONTACT FORM & SUCCESS TOAST NOTIFICATION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const toastContainer = document.getElementById('toast-container');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (name && email && subject && message) {
        showToast('Success!', 'Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
      } else {
        showToast('Error', 'Please fill in all fields before sending.', 'error');
      }
    });
  }

  function showToast(title, message, type = 'success') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation';
    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-content">
        <strong style="display: block; margin-bottom: 2px;">${title}</strong>
        <span class="toast-message">${message}</span>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // --------------------------------------------------------------------------
  // 7. SCROLL REVEAL ANIMATIONS
  // --------------------------------------------------------------------------
  const revealElements = () => {
    const reveals = document.querySelectorAll('.card, .timeline-card, .section-heading');
    
    reveals.forEach(element => {
      if (!element.classList.contains('reveal')) {
        element.classList.add('reveal');
      }
      
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 80;

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  };

  revealElements();
  window.addEventListener('scroll', revealElements);

});

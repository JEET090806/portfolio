// Wait for DOM to load completely
document.addEventListener('DOMContentLoaded', () => {
    // Check if device is touch-enabled
    const isTouchDevice = () => {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    };
    
    const isTouch = isTouchDevice();
    
    // Add touch class to body if it's a touch device
    if (isTouch) {
        document.body.classList.add('touch-device');
    }
    
    // Preloader
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 1000);
    }

    // Custom cursor - only for non-touch devices
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower && !isTouch) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });

        document.addEventListener('mousedown', () => {
            cursor.style.width = '8px';
            cursor.style.height = '8px';
            cursorFollower.style.width = '35px';
            cursorFollower.style.height = '35px';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
        });

        // Add hover effect for links and buttons
        const hoverElements = document.querySelectorAll('a, button, .resume-button, .cta-button');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.width = '25px';
                cursor.style.height = '25px';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.border = '1px solid var(--green)';
                cursorFollower.style.width = '0';
                cursorFollower.style.height = '0';
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.width = '10px';
                cursor.style.height = '10px';
                cursor.style.backgroundColor = 'var(--green)';
                cursor.style.border = 'none';
                cursorFollower.style.width = '30px';
                cursorFollower.style.height = '30px';
            });
        });
    } else if (cursor && cursorFollower) {
        // Hide cursor elements on touch devices
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
                
                // Hide header on scroll down, show on scroll up
                if (window.scrollY > lastScrollY) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.classList.remove('scrolled');
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = window.scrollY;
        });
    }

    // Mobile menu toggle with improved functionality
    const menuButton = document.querySelector('.menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuButton && mobileMenu) {
        // Toggle mobile menu
        menuButton.addEventListener('click', () => {
            menuButton.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = document.querySelectorAll('.mobile-nav-item a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuButton.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !menuButton.contains(e.target)) {
                menuButton.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                menuButton.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Typing effect for hero section
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const phrases = ['Web Developer', 'Software Engineer', 'UI/UX Designer'];
        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentPhrase = phrases[currentPhraseIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && currentCharIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 1000; // Pause at the end of typing
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before typing the next phrase
            }

            setTimeout(typeEffect, typingSpeed);
        }

        setTimeout(typeEffect, 1000);
    }

    // Experience tabs with improved mobile support
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const tabList = document.querySelector('.tab-list');

    if (tabButtons.length && tabPanels.length) {
        // Set first tab as active by default if none is active
        if (!document.querySelector('.tab-button.active') && tabButtons.length > 0) {
            tabButtons[0].classList.add('active');
            tabPanels[0].classList.add('active');
        }
        
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to current button and panel
                button.classList.add('active');
                tabPanels[index].classList.add('active');
                
                // Scroll the tab into view on mobile
                if (tabList && window.innerWidth <= 768) {
                    const buttonLeft = button.offsetLeft;
                    const buttonWidth = button.offsetWidth;
                    const tabListWidth = tabList.offsetWidth;
                    const scrollLeft = buttonLeft - (tabListWidth / 2) + (buttonWidth / 2);
                    
                    tabList.scrollTo({
                        left: scrollLeft,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Add keyboard navigation for tabs
        if (tabList) {
            tabList.addEventListener('keydown', (e) => {
                const focusedButton = document.activeElement;
                if (!focusedButton.classList.contains('tab-button')) return;
                
                const currentIndex = Array.from(tabButtons).indexOf(focusedButton);
                let nextIndex;
                
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % tabButtons.length;
                    e.preventDefault();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                    e.preventDefault();
                } else {
                    return;
                }
                
                tabButtons[nextIndex].focus();
                tabButtons[nextIndex].click();
            });
        }
    }

    // Animate skill progress bars
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if (skillBars.length) {
        const animateSkills = () => {
            skillBars.forEach(bar => {
                const percentage = bar.getAttribute('data-percentage');
                if (percentage) {
                    bar.style.width = percentage + '%';
                }
            });
        };

        // Use Intersection Observer to trigger animation when skills section is visible
        const skillsSection = document.querySelector('#skills');
        if (skillsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSkills();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(skillsSection);
        } else {
            // If no skills section, animate on page load
            setTimeout(animateSkills, 1000);
        }
    }

    // Scroll animations for sections
    const sections = document.querySelectorAll('section');
    
    if (sections.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            section.classList.add('section-hidden');
            observer.observe(section);
        });
    }
    
    // Enhance project cards for touch devices
    if (isTouch) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            // Add touch feedback
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            }, { passive: true });
            
            // Make project image visible on touch for mobile
            const projectImage = card.querySelector('.project-image');
            if (projectImage) {
                projectImage.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                }, { passive: true });
            }
        });
    }
    
    // Optimize performance on mobile
    if (isTouch || window.innerWidth < 768) {
        // Reduce animation complexity on mobile
        document.body.classList.add('reduce-motion');
        
        // Lazy load images on mobile
        const images = document.querySelectorAll('img');
        if ('loading' in HTMLImageElement.prototype) {
            images.forEach(img => {
                if (img.getAttribute('data-src')) {
                    img.src = img.getAttribute('data-src');
                }
            });
        } else {
            // Fallback for browsers that don't support lazy loading
            const lazyLoadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.getAttribute('data-src')) {
                            img.src = img.getAttribute('data-src');
                            lazyLoadObserver.unobserve(img);
                        }
                    }
                });
            });
            
            images.forEach(img => {
                if (img.getAttribute('data-src')) {
                    lazyLoadObserver.observe(img);
                }
            });
        }
    }
});

var typed= new Typed(".text", {
    strings: ["Web Developer", "Frontend Developer", "UI/UX Designer"],
    typeSpeed: 95,
    backSpeed: 95,
    backDelay: 1000,
    loop: true
});

// Navbar active state on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

// Mobile Menu Toggle
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuIcon.classList.toggle('bx-x');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuIcon.classList.remove('bx-x');
    });
});

function activeNavOnScroll() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Check if we're at the bottom of the page
    if (scrollY + windowHeight >= documentHeight - 50) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#contact') {
                link.classList.add('active');
            }
        });
        return;
    }
    
    // Normal section detection
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });
    
    if (currentSection) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

window.addEventListener('scroll', activeNavOnScroll);

// Set home as active on page load
window.addEventListener('load', () => {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home') {
            link.classList.add('active');
        }
    });
});

// Web3Forms Contact Form Handler
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const formResponse = document.getElementById('form-response');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        formResponse.style.display = 'none';
        
        // Get form data
        const formData = new FormData(contactForm);
        
        try {
            // Send to Web3Forms API
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Success message
                formResponse.style.display = 'block';
                formResponse.style.backgroundColor = 'rgba(0, 234, 255, 0.1)';
                formResponse.style.color = '#00eaff';
                formResponse.style.border = '1px solid #00eaff';
                formResponse.innerHTML = '<i class="bx bx-check-circle"></i> Message sent successfully! I will get back to you soon.';
                
                // Reset form
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formResponse.style.display = 'none';
                }, 5000);
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            // Error message
            formResponse.style.display = 'block';
            formResponse.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            formResponse.style.color = '#ff4444';
            formResponse.style.border = '1px solid #ff4444';
            formResponse.innerHTML = '<i class="bx bx-error-circle"></i> Failed to send message. Please try again or email me directly.';
            
            console.error('Form submission error:', error);
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
        }
    });
}

// ===== Particle Trail Animation =====
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particleCanvas');
    
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle array
    const particlesArray = [];
    const maxParticles = 100;

    // Mouse position
    const mouse = {
        x: undefined,
        y: undefined
    };

    // Track mouse movement
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
        
        // Create particles at mouse position
        for (let i = 0; i < 3; i++) {
            particlesArray.push(new Particle());
        }
    });

    // Particle class
    class Particle {
        constructor() {
            this.x = mouse.x;
            this.y = mouse.y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.life = 100;
        }

        // Update particle
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= 2;
            
            if (this.size > 0.2) this.size -= 0.05;
        }

        // Draw particle
        draw() {
            ctx.fillStyle = `rgba(0, 238, 255, ${this.life / 100})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0ef';
        }
    }

    // Handle particles
    function handleParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            // Remove dead particles
            if (particlesArray[i].life <= 0) {
                particlesArray.splice(i, 1);
                i--;
            }
        }
        
        // Limit particles
        if (particlesArray.length > maxParticles) {
            particlesArray.splice(0, particlesArray.length - maxParticles);
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        requestAnimationFrame(animate);
    }

    animate();
});
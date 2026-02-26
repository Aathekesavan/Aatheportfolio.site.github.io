document.addEventListener('DOMContentLoaded', () => {

    /* --- TERMINAL TYPING EFFECT --- */
    const words = ["CLOUD_ARCHITECT", "DEVOPS_ENGINEER", "SITE_RELIABILITY"];
    const typingTextElement = document.querySelector('.typing-text');

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 60;
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    if (typingTextElement && words.length > 0) {
        type();
    }

    /* --- SCROLL PROGRESS LINE --- */
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
    });

    /* --- ADVANCED SCROLL REVEALS --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger once for performance
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach((el) => revealObserver.observe(el));

    /* --- HUD NAVIGATION ACTIVE STATE --- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* --- MOBILE HUD TOGGLE --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (navLinksContainer.style.display === 'flex') {
                navLinksContainer.style.display = 'none';
            } else {
                navLinksContainer.style.display = 'flex';
                navLinksContainer.style.flexDirection = 'column';
                navLinksContainer.style.position = 'absolute';
                navLinksContainer.style.top = '100%';
                navLinksContainer.style.right = '0';
                navLinksContainer.style.background = 'rgba(5, 5, 10, 0.95)';
                navLinksContainer.style.padding = '2rem';
                navLinksContainer.style.border = '1px solid var(--accent)';
            }
        });
    }

    /* --- NEURAL NETWORK CANVAS PHYSICS --- */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        const mouse = {
            x: null,
            y: null,
            radius: 200 // Larger interaction radius
        }

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });

        class NodeParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1; // Nodes

                // Slow, creeping movements
                this.speedX = (Math.random() * 2 - 1) * 0.3;
                this.speedY = (Math.random() * 2 - 1) * 0.3;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges instead of wrapping
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

                // Neural Repulsion from mouse
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        // Push away
                        this.x -= forceDirectionX * force * 2;
                        this.y -= forceDirectionY * force * 2;
                    }
                }
            }

            draw() {
                ctx.fillStyle = `rgba(45, 212, 191, 0.5)`; // Teal Nodes
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 5000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new NodeParticle());
            }
        }

        function connectNodes() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    // Long connection distance
                    if (distance < 150) {
                        let opacityValue = 1 - (distance / 150);
                        // Teal webbing
                        ctx.strokeStyle = `rgba(45, 212, 191, ${opacityValue * 0.2})`;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse cursor (Creates a glowing web around cursor)
                if (mouse.x != null && mouse.y != null) {
                    let mouseDx = particlesArray[a].x - mouse.x;
                    let mouseDy = particlesArray[a].y - mouse.y;
                    let mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

                    if (mouseDistance < 250) {
                        let opacityValue = 1 - (mouseDistance / 250);
                        ctx.strokeStyle = `rgba(45, 212, 191, ${opacityValue * 0.8})`; // Bright teal to mouse
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateNeuralNet() {
            requestAnimationFrame(animateNeuralNet);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }

            connectNodes();
        }

        initParticles();
        animateNeuralNet();
    }

    /* --- DEVOPS SKILLS 3D FLIP SYSTEM --- */
    const skillData = {
        "Cloud_Infra": {
            description: "Designing highly available, fault-tolerant infrastructure in the cloud.",
            details: [
                "<strong>AWS:</strong> Managing EC2, S3, VPCs, and IAM policies.",
                "<strong>GCP:</strong> Deploying on Compute Engine and managing Cloud Storage.",
                "<strong>Architecture:</strong> Designing systems for scalability and resilience."
            ]
        },
        "Containers": {
            description: "Containerizing applications for portable, scalable deployments.",
            details: [
                "<strong>Docker:</strong> Building optimized, secure container images.",
                "<strong>Kubernetes:</strong> Orchestrating microservices at scale.",
                "<strong>Helm:</strong> Managing complex K8s application deployments."
            ]
        },
        "Provisioning": {
            description: "Implementing Infrastructure as Code (IaC) for consistent environments.",
            details: [
                "<strong>Terraform:</strong> Declarative provisioning of cloud resources.",
                "<strong>Ansible:</strong> Automated configuration management and application deployment.",
                "<strong>Linux:</strong> Deep system administration and shell scripting."
            ]
        },
        "CI_CD_Ops": {
            description: "Automating software delivery and maintaining system health.",
            details: [
                "<strong>Pipelines:</strong> Engineering automated testing, build, and deployment workflows.",
                "<strong>GitHub Actions:</strong> Creating reusable, secure CI/CD components.",
                "<strong>Monitoring:</strong> Implementing observability and alerting systems."
            ]
        }
    };

    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        const title = card.querySelector('h4').innerText;

        const oldContent = card.innerHTML;
        card.innerHTML = '';

        const inner = document.createElement('div');
        inner.classList.add('skill-card-inner');

        const front = document.createElement('div');
        front.classList.add('skill-card-front');
        front.innerHTML = oldContent;

        const back = document.createElement('div');
        back.classList.add('skill-card-back');

        if (skillData[title]) {
            const data = skillData[title];
            let detailsList = "<ul>";
            data.details.forEach(item => {
                detailsList += `<li>${item}</li>`;
            });
            detailsList += "</ul>";

            back.innerHTML = `
                <h4>${title}</h4>
                <p>${data.description}</p>
                ${detailsList}
            `;
        } else {
            back.innerHTML = `<p>Details incoming...</p>`;
        }

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            if (card.classList.contains('flipped')) {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('flipped')) {
                setTimeout(() => {
                    card.classList.remove('flipped');
                }, 400);
            }
        });
    });
});

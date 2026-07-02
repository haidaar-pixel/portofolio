// Load data from JSON files
async function loadData() {
    try {
        const [profileData, educationData, experienceData] = await Promise.all([
            fetch('data/profile.json').then(res => res.json()),
            fetch('data/education.json').then(res => res.json()),
            fetch('data/experience.json').then(res => res.json())
        ]);

        renderProfile(profileData);
        renderEducation(educationData);
        renderExperience(experienceData);

        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render Profile Section
function renderProfile(data) {
    document.getElementById('profile-name').textContent = data.name;
    document.getElementById('profile-description').textContent = data.description;
    document.getElementById('profile-email').textContent = data.email;
    document.getElementById('profile-phone').textContent = data.phone;

    const profilePic = document.getElementById('profile-pic');
    profilePic.src = data.profileImage;
    profilePic.alt = `${data.name}'s profile picture`;

    const socialLinks = document.getElementById('social-links');
    data.socialMedia.forEach(social => {
        const link = document.createElement('a');
        link.href = social.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.innerHTML = `<i class="fab fa-${social.platform.toLowerCase()}"></i>`;
        socialLinks.appendChild(link);
    });

    // Render skills with percentage bars
    if (data.skills) {
        const skillsGrid = document.getElementById('skills-grid');
        data.skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-row';
            skillItem.innerHTML = `
                <div class="skill-row-top">
                    <span class="skill-name"><i class="skill-icon ${skill.icon}"></i>${skill.name}</span>
                    ${skill.level ? `<span class="skill-pct">${skill.level}%</span>` : ''}
                </div>
                ${skill.level ? `<div class="skill-level"><div class="skill-level-bar" style="width: ${skill.level}%"></div></div>` : ''}
            `;
            skillsGrid.appendChild(skillItem);
        });
    }

    if (data.cv) {
        const cvLink = document.getElementById('cv-download');
        cvLink.href = data.cv.file;
        cvLink.querySelector('i').className = data.cv.icon;
        cvLink.setAttribute('download', '');

        // Insert CV button inside social links container
        document.getElementById('social-links').appendChild(cvLink);
    }
}

// Render Education Section
function renderEducation(data) {
    const educationList = document.getElementById('education-list');

    data.forEach(edu => {
        const eduItem = document.createElement('div');
        eduItem.className = 't-item';
        eduItem.innerHTML = `
            <div class="t-date">${edu.year}</div>
            <div class="t-header">
                ${edu.logo ? `<img src="${edu.logo}" alt="${edu.university} logo" class="t-logo">` : ''}
                <div class="t-title">${edu.university}</div>
            </div>
            <div class="t-sub">${edu.major}</div>
            <div class="t-desc">${edu.description}</div>
        `;
        educationList.appendChild(eduItem);
    });
}

// Render Experience Section
function renderExperience(data) {
    const experienceList = document.getElementById('experience-list');

    data.forEach(exp => {
        const expItem = document.createElement('div');
        expItem.className = 't-item';
        expItem.innerHTML = `
            <div class="t-date">${exp.year}</div>
            <div class="t-header">
                ${exp.logo ? `<img src="${exp.logo}" alt="${exp.company} logo" class="t-logo">` : ''}
                <div class="t-title">${exp.company}</div>
            </div>
            <div class="t-sub">${exp.position}</div>
            <div class="t-desc">${exp.description}</div>
        `;
        experienceList.appendChild(expItem);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', loadData);

document.addEventListener('DOMContentLoaded', function() {
    // Highlight active section
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
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

    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // Animate sections on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
    });
});

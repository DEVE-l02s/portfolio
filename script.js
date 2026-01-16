//global
////////
const nickname = document.getElementById("nickname");
const chars = document.querySelectorAll(".char");
const pagesMenu = document.querySelector(".pages-menu");
const pagesMenuButtons = document.querySelectorAll(".pages-menu .menu-btn");
const homeArrow = document.querySelector(".arrow-home");
let specialAnimationRunning = false;
let currentPage = null;

const fonts = [
    "Inter, sans-serif",
    "JetBrains Mono, monospace",
    "Playfair Display, serif",
    "Space Grotesk, sans-serif",
    "IBM Plex Mono, monospace"
];

const weights = [300, 400, 500, 700];
const spacings = ["0em", "0.04em", "0.08em", "0.12em"];
const scales = [0.96, 1, 1.04];

const menuButtons = document.querySelectorAll(".menu-btn");

const pages = {
    about: document.getElementById("page-about"),
    projects: document.getElementById("page-projects"),
    contacts: document.getElementById("page-contacts")
};
const colorBlocks = document.querySelectorAll(".color-list li");

//util fnc
//////////
function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

//nickname anim
///////////////
function animateRandomChar() {
    const char = random([...chars]);

    char.style.fontFamily = random(fonts);
    char.style.fontWeight = random(weights);
    char.style.letterSpacing = random(spacings);
    char.style.transform = `scale(${random(scales)})`;
    char.style.opacity = 0.85;

    setTimeout(() => {
        char.style.opacity = 1;
    }, 120);
}

function applyGlobalPreset() {
    const preset = {
        font: random(fonts),
        weight: random(weights),
        spacing: random(spacings),
        scale: random(scales)
    };

    chars.forEach(char => {
        char.style.fontFamily = preset.font;
        char.style.fontWeight = preset.weight;
        char.style.letterSpacing = preset.spacing;
        char.style.transform = `scale(${preset.scale})`;
    });
}

function runSpecialAnimation() {
    if (specialAnimationRunning) return;
    specialAnimationRunning = true;

    const zero = chars[0];
    const two = chars[1];

    if (!zero || !two) return;

    //create extra chars
    const L = document.createElement("span");
    L.className = "char";
    L.textContent = "L";

    const S = document.createElement("span");
    S.className = "char";
    S.textContent = "S";

    const refStyle = window.getComputedStyle(zero);
    [L, S].forEach(el => {
        el.style.fontFamily = refStyle.fontFamily;
        el.style.fontWeight = refStyle.fontWeight;
        el.style.letterSpacing = refStyle.letterSpacing;
        el.style.opacity = "0";
        el.style.transform = "scale(0.9)";
        el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    });

    nickname.insertBefore(L, zero);
    nickname.appendChild(S);

    //highlight
    const highlight = document.createElement("span");
    highlight.style.position = "absolute";
    highlight.style.top = "0";
    highlight.style.width = "100%";
    highlight.style.height = "100%";
    highlight.style.background = "rgba(255,255,255,0.08)";
    highlight.style.borderRadius = "6px";
    highlight.style.zIndex = "-1";
    highlight.style.opacity = "0";
    highlight.style.transition = "opacity 0.4s ease";
    nickname.appendChild(highlight);

    //animate
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            highlight.style.opacity = "1";
            L.style.opacity = "1";
            L.style.transform = "scale(1)";
            S.style.opacity = "1";
            S.style.transform = "scale(1)";
        });
    });

    //hide after 1s
    setTimeout(() => {
        highlight.style.opacity = "0";
        L.style.opacity = "0";
        L.style.transform = "scale(0.9)";
        S.style.opacity = "0";
        S.style.transform = "scale(0.9)";
    }, 1000);

    //remove after 1.4s
    setTimeout(() => {
        L.remove();
        S.remove();
        highlight.remove();
        specialAnimationRunning = false;
    }, 1400);
}

//timestamps for nn anim
setInterval(animateRandomChar, 200);
setInterval(applyGlobalPreset, 7000);
setInterval(runSpecialAnimation, 14000);

//underline anim
////////////////
menuButtons.forEach(btn => {
    const underline = btn.querySelector(".underline");
    let targetX = 0;
    let currentX = 0;
    let animating = false;

    btn.addEventListener("mousemove", e => {
        const rect = btn.getBoundingClientRect();
        targetX = e.clientX - rect.left - underline.offsetWidth / 2;
        underline.style.opacity = "1";
        if (!animating) animate();
    });

    btn.addEventListener("mouseleave", () => {
        underline.style.opacity = "0";
    });

    function animate() {
        animating = true;
        const delta = (targetX - currentX) * 0.2;
        currentX += delta;
        underline.style.transform = `translateX(${currentX}px)`;
        if (Math.abs(delta) > 0.1) {
            requestAnimationFrame(animate);
        } else {
            animating = false;
        }
    }
});

//global menu anim
//////////////////
function showGlobalMenu(pageName) {
    pagesMenu.style.display = "flex";
    homeArrow.style.display = "block"; //show the nav arrow

    //remove old classes (currups if not)
    pagesMenu.classList.remove("from-left", "from-top", "from-right", "visible");

    switch (pageName) {
        case "about":
            pagesMenu.classList.add("from-left");
            break;
        case "projects":
            pagesMenu.classList.add("from-top");
            break;
        case "contacts":
            pagesMenu.classList.add("from-right");
            break;
    }

    positionArrow(pageName); //position the arrow

    //slowly change the opacity of the nav arrow
    requestAnimationFrame(() => {
        pagesMenu.classList.add("visible");
    });

    //underline the active page button
    pagesMenuButtons.forEach(btn => {
        btn.style.color = btn.dataset.page === pageName ? "#fff" : "#aaa";
    });
}

function positionArrow(pageName) {
    const arrowWidth = homeArrow.offsetWidth;
    const arrowHeight = homeArrow.offsetHeight;
    let left = 0;
    let top = 20;
    let rotate = 0;

    switch (pageName) {
        case "about":
            left = window.innerWidth - arrowWidth - 20; //top right
            top = 20;
            rotate = -135;
            break;
        case "projects":
            left = (window.innerWidth / 2) - (arrowWidth / 2); //centre
            top = 60;
            rotate = 180;
            break;
        case "contacts":
            left = 20; //top left
            top = 20;
            rotate = 135;
            break;
    }

    //smooth travel + angle
    homeArrow.style.left = left + "px";
    homeArrow.style.top = top + "px";
    homeArrow.style.transform = `rotate(${rotate}deg)`;
    homeArrow.style.opacity = 1;
}

function hideArrow() {
    homeArrow.style.opacity = 0;
}

function moveArrowAndHighlight(pageName) {
    pagesMenuButtons.forEach(btn => {
        if (btn.dataset.page === pageName) {
            btn.style.color = "#fff";
            btn.style.transform = "translateY(-10px)";
        } else {
            btn.style.color = "#aaa";
            btn.style.transform = "translateY(0)";
        }
    });

    //smooth travel
    positionArrow(pageName);
}

function activateMenuItem(pageName, immediate = false) {
    pagesMenuButtons.forEach(btn => {
        const text = btn.querySelector(".text");
        const slash = btn.querySelector(".slash");

        if (btn.dataset.page === pageName) {
            const textWidth = text.offsetWidth;
            const slashWidth = slash.offsetWidth;

            btn.classList.add("active");

        } else {
            btn.classList.remove("active");
        }
    });
}




//navigation
////////////

//open the page
function openPage(pageName) {
    //hide the current page content
    if (currentPage) {
        currentPage.classList.remove("show");
    }

    //show new content/page
    const page = pages[pageName];
    if (page) {
        page.classList.add("show");
        currentPage = page;
    }
}

homeArrow.style.display = "none";

///home menu///

//buttons
menuButtons.forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        const pageName = btn.dataset.page;

        document.querySelector(".menu").style.display = "none"; //hide home menu

        showGlobalMenu(pageName);

        openPage(pageName);
        activateMenuItem(pageName, true);
    });
});

///global menu///

//buttons
pagesMenuButtons.forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        const pageName = btn.dataset.page;

        openPage(pageName);

        moveArrowAndHighlight(pageName);

        activateMenuItem(pageName);
    });
});


///home nav arrow
menuButtons.forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        const pageName = btn.dataset.page;

        document.querySelector(".menu").style.display = "none";
        pagesMenu.style.display = "flex";

        openPage(pageName);
        moveArrowAndHighlight(pageName);
    });
});

//return to home
homeArrow.addEventListener("click", () => {
    if (currentPage) {
        currentPage.classList.remove("show");
        currentPage = null;
    }

    pagesMenu.classList.remove("visible");
    hideArrow();
    document.querySelector(".menu").style.display = "flex";
});

//palette interactions
//////////////////////
colorBlocks.forEach(block => {
    const tooltip = block.querySelector(".copied-tooltip");

    block.addEventListener("click", () => {
        const bgColor = window.getComputedStyle(block).backgroundColor;
        copyToClipboard(bgColor);

        //show tooltip
        block.classList.add("show-tooltip");
        setTimeout(() => block.classList.remove("show-tooltip"), 1200);
    });
});

//contact form integration
//////////////////
const contactForm = document.getElementById("contact-form");
const formStatus = contactForm.querySelector(".form-status");
const COOLDOWN_KEY = "contactFormCooldown";
const COOLDOWN_MS = 30 * 60 * 1000; //30m cooldown

function getCooldownRemaining() {
    const lastSent = localStorage.getItem(COOLDOWN_KEY);
    if (!lastSent) return 0;
    const elapsed = Date.now() - parseInt(lastSent, 10);
    return Math.max(COOLDOWN_MS - elapsed, 0);
}

function setCooldown() {
    localStorage.setItem(COOLDOWN_KEY, Date.now());
}

contactForm.addEventListener("submit", async e => {
    e.preventDefault();

    const remaining = getCooldownRemaining();
    if (remaining > 0) {
        const minutes = Math.ceil(remaining / 60000);
        formStatus.textContent = `Please wait ${minutes} minute(s) before sending another message.`;
        return;
    }

    const formData = new FormData(contactForm);

    try {
        const response = await fetch(contactForm.action, {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            formStatus.textContent = "Message sent successfully!";
            contactForm.reset();
            setCooldown();

            setTimeout(() => {
                formStatus.textContent = "";
            }, 5000);
        } else {
            const data = await response.json();
            formStatus.textContent = data.errors
                ? data.errors.map(e => e.message).join(", ")
                : "Oops! There was a problem.";
        }
    } catch (err) {
        formStatus.textContent = "Oops! Something went wrong.";
    }
});

//projects page
///////////////

//projects contents
const PROJECTS = {
    "portfolio-site": {
        title: "Portfolio Website",
        page() {
            return `
                <section class="project-hero">
                    <div class="project-hero-bg"></div>
                    <div class="project-hero-content">
                        <h1>Portfolio Website</h1>
                        <p class="project-subtitle">
                            (This website)
                        </p>
                    </div>
                </section>

                <section class="project-body center">
                    <p><strong>Stack:</strong> HTML, CSS, Vanilla JS</p>
                </section>

                <section class="project-footer">
                    <a href="https://github.com/DEVE-l02s/portfolio" target="_blank" class="outline-btn">
                        github repo
                    </a>
                </section>
            `;
        }
    },

    "steam-screenshots-uploader": {
        title: "Steam Screenshots Uploader",
        page() {
            return `
                <section class="project-hero">
                    <div class="project-hero-bg"></div>
                    <div class="project-hero-content">
                        <h1>Steam Screenshots Uploader</h1>
                        <p class="project-subtitle">
                            Upload your Steam screenshots in bulk, bypassing Steam overlay restrictions
                        </p>
                    </div>
                </section>

                <section class="project-body center">
                    <p><strong>Stack:</strong> C#, WinForms, Visual Studio</p>
                </section>

                <section class="project-footer">
                    <a href="https://github.com/DEVE-l02s/Steam-ScreenShots-Uploader" target="_blank" class="outline-btn">
                        github repo
                    </a>
                </section>
            `;
        }
    },

    "steam-link-generator": {
        title: "Steam Link Generator",
        page() {
            return `
                <section class="project-hero">
                    <div class="project-hero-bg"></div>
                    <div class="project-hero-content">
                        <h1>Steam Link Generator</h1>
                        <p class="project-subtitle">
                            A simple console tool to generate custom Steam URLs quickly and efficiently
                        </p>
                    </div>
                </section>

                <section class="project-body center">
                    <p><strong>Stack:</strong> C# (Console Application), Visual Studio</p>
                </section>

                <section class="project-footer">
                    <a href="https://github.com/DEVE-l02s/SteamLinkGenerator?tab=readme-ov-file" target="_blank" class="outline-btn">
                        github repo
                    </a>
                </section>
            `;
        }
    },

    "reportx": {
        title: "ReportX",
        page() {
            return `
                <section class="project-hero">
                    <div class="project-hero-bg"></div>
                    <div class="project-hero-content">
                        <h1>ReportX</h1>
                        <p class="project-subtitle">
                            A WinForms application for system monitoring and management, featuring license control and hardware utilities
                        </p>
                    </div>
                </section>

                <section class="project-body center">
                    <p><strong>Stack:</strong> C#, WinForms, Visual Studio, GunaUI, Figma</p>
                </section>

                <section class="project-footer">

                </section>
            `;
        }
    }
};

const cards = document.querySelectorAll('.project-card');
const overlay = document.getElementById('project-overlay');
const closeBtn = document.querySelector('.close-expanded');

const titleEl = document.getElementById('expanded-title');
const contentEl = document.getElementById('expanded-content');

cards.forEach(card => {
    card.addEventListener('click', () => {
        const key = card.dataset.project;
        const project = PROJECTS[key];
        if (!project) return;

        contentEl.innerHTML = project.page();

        const heroBg = contentEl.querySelector('.project-hero-bg');

        const projectBgImages = {
            "steam-screenshots-uploader": "assets/projects/steam-uploader.png",
            "portfolio-site": "assets/projects/portfolio-website.png",
            "steam-link-generator": "assets/projects/steam-link.gif",
            "reportx": "assets/projects/reportx.gif"
        };

        if (heroBg && projectBgImages[key]) {
            heroBg.style.backgroundImage = `url('${projectBgImages[key]}')`;
        }

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});



closeBtn.addEventListener('click', closeOverlay);

overlay.addEventListener('click', (e) => {
    //if clicked outside of the overlay window
    if (!e.target.closest('.project-expanded')) {
        closeOverlay();
    }
});

function closeOverlay() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

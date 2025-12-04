'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterFunc = function (selectedValue) {
  const filterItems = document.querySelectorAll("[data-filter-item]");
  const normalizedValue = selectedValue === "all" ? "all" : selectedValue.split(" ")[0].toLowerCase();

  for (let i = 0; i < filterItems.length; i++) {
    if (normalizedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (normalizedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// Handle form submission
form.addEventListener("submit", function (e) {
  formBtn.setAttribute("disabled", "");
  const originalBtnText = formBtn.querySelector("span").textContent;
  formBtn.querySelector("span").textContent = "Sending...";

  // Form will submit normally to FormSubmit service
  // Reset button text after a delay (in case of error)
  setTimeout(() => {
    if (formBtn.querySelector("span").textContent === "Sending...") {
      formBtn.querySelector("span").textContent = originalBtnText;
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      }
    }
  }, 5000);
});

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

// -----------------------------
// JSON-driven Experience & Projects
// -----------------------------

async function loadExperienceFromJson() {
  try {
    const res = await fetch('experiences.json');
    if (!res.ok) throw new Error('Failed to load experiences.json');
    const experiences = await res.json();

    let list = document.getElementById('experience-list');
    if (!list) {
      const resumePage = document.querySelector('[data-page="experience"]');
      if (!resumePage) return;
      const timelineSections = resumePage.querySelectorAll('.timeline');
      for (const sec of timelineSections) {
        const title = sec.querySelector('.h3');
        if (title && title.textContent.trim().toLowerCase() === 'experience') {
          list = sec.querySelector('.timeline-list');
          break;
        }
      }
    }
    if (!list) return;

    list.innerHTML = '';

    experiences.forEach(exp => {
      const li = document.createElement('li');
      li.className = 'timeline-item';

      li.innerHTML = `
        <h4 class="h4 timeline-item-title">${exp.role} – ${exp.company}</h4>
        <span>${exp.period} · ${exp.location}</span>
        <p class="timeline-text">${exp.description}</p>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

async function loadProjectsFromJson() {
  try {
    const res = await fetch('projects.json');
    if (!res.ok) throw new Error('Failed to load projects.json');
    const projects = await res.json();

    let list = document.getElementById('projects-list');
    if (!list) {
      const portfolioPage = document.querySelector('[data-page="portfolio"]');
      if (!portfolioPage) return;
      list = portfolioPage.querySelector('.project-list');
    }
    if (!list) return;

    list.innerHTML = '';

    projects.forEach(p => {
      const li = document.createElement('li');
      li.className = 'project-item active';
      li.setAttribute('data-filter-item', '');
      li.setAttribute('data-category', p.category.toLowerCase());

      const hasLink = !!p.link;
      const skillsHtml = p.skills && p.skills.length > 0
        ? `<div class="project-skills">
            ${p.skills.map(skill => `<code class="project-skill">${skill}</code>`).join('')}
          </div>`
        : '';

      li.innerHTML = `
        <a href="${hasLink ? p.link : '#'}" ${hasLink ? 'target="_blank" rel="noopener"' : ''}>
          <figure class="project-img">
            <div class="project-item-icon-box">
              <ion-icon name="eye-outline"></ion-icon>
            </div>
            <img class="project-img-icon" src="${p.image}" alt="${p.title}" loading="lazy">
          </figure>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-category">${p.description}</p>
          ${skillsHtml}
        </a>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

async function loadSkillsFromJson() {
  try {
    const res = await fetch('skills.json');
    if (!res.ok) throw new Error('Failed to load skills.json');
    const skills = await res.json();

    const container = document.getElementById('skills-container');
    if (!container) return;

    // Group skills by category
    const skillsByCategory = {};
    skills.forEach(skill => {
      const category = skill.catogory || skill.category;
      if (!skillsByCategory[category]) {
        skillsByCategory[category] = [];
      }
      skillsByCategory[category].push(skill);
    });

    // Category display names mapping
    const categoryNames = {
      'languages': 'Languages I use to code',
      'game-engines': 'Game Engines I use to build games',
      'design-tools': 'Design Tools I use to design games',
      'development-tools': 'Development Tools I use to build games'
    };

    // Clear container
    container.innerHTML = '';

    // Render each category
    Object.keys(skillsByCategory).forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'skills-category';

      const categoryTitle = document.createElement('h4');
      categoryTitle.className = 'h4 skills-category-title';
      categoryTitle.textContent = categoryNames[category] || category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      categoryDiv.appendChild(categoryTitle);

      const skillsList = document.createElement('ul');
      skillsList.className = 'skills-list content-card';

      skillsByCategory[category].forEach(skill => {
        const li = document.createElement('li');
        li.className = 'skills-item';

        li.innerHTML = `
          <img src="${skill.icon}" alt="${skill.title}" class="skill-icon" />
          <div class="skill-content">
            <div class="title-wrapper">
              <h5 class="h5">${skill.title}</h5>
              <data value="${skill.percentage}">${skill.percentage}%</data>
            </div>
            <div class="skill-progress-bg">
              <div class="skill-progress-fill" style="width: ${skill.percentage}%;"></div>
            </div>
          </div>
        `;

        skillsList.appendChild(li);
      });

      categoryDiv.appendChild(skillsList);
      container.appendChild(categoryDiv);
    });
  } catch (err) {
    console.error('Error loading skills:', err);
  }
}

// Show success message if form was submitted successfully
function showFormSuccessMessage() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    const formBtn = document.querySelector("[data-form-btn]");
    if (formBtn) {
      formBtn.querySelector("span").textContent = "Message Sent!";
      formBtn.style.background = "#4caf50";
      formBtn.setAttribute("disabled", "");

      // Clear URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);

      // Reset after 5 seconds
      setTimeout(() => {
        formBtn.querySelector("span").textContent = "Send Message";
        formBtn.style.background = "";
        formBtn.setAttribute("disabled", "");
      }, 5000);
    }
  }
}

// Kick off JSON loading after DOM is parsed
window.addEventListener('DOMContentLoaded', function () {
  loadExperienceFromJson();
  loadProjectsFromJson();
  loadSkillsFromJson();
  showFormSuccessMessage();
});

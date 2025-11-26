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
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
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

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

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

    // Prefer explicit #experience-list if user adds it, otherwise find the Experience timeline in Resume page
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

    // Clear existing static items and rebuild from JSON
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

    // Prefer explicit #projects-list if user adds it, otherwise use default .project-list
    let list = document.getElementById('projects-list');
    if (!list) {
      const portfolioPage = document.querySelector('[data-page="portfolio"]');
      if (!portfolioPage) return;
      list = portfolioPage.querySelector('.project-list');
    }
    if (!list) return;

    // Clear existing static projects
    list.innerHTML = '';

    projects.forEach(p => {
      const li = document.createElement('li');
      li.className = 'project-item active';
      li.setAttribute('data-filter-item', '');
      // Normalize category to lowercase for filtering (matching filter button text.toLowerCase())
      li.setAttribute('data-category', p.category.toLowerCase());

      const hasLink = !!p.link;

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
      const category = skill.catogory || skill.category; // Handle typo in JSON
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

// Kick off JSON loading after DOM is parsed
window.addEventListener('DOMContentLoaded', function () {
  loadExperienceFromJson();
  loadProjectsFromJson();
  loadSkillsFromJson();
});

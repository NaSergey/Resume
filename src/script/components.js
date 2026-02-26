// Data for reusable components
const personalInfo = [
    { labelClass: "translate-Location", label: "Location", value: "Rostov-on-don" },
    { labelClass: "translate-Dateofbirth", label: "Date of birth", value: "01.03.2000" },
    { labelClass: "translate-Experience", label: "Experience", valueClass: "translate-frontednDew", value: "Frontend Developer (21-24)" },
    { label: "Email", value: "wxtx.ns@gmail.com" }
];

const mainSkills = [
    { number: "01", title: "React Stack", textClass: "translate-ReactStack" },
    { number: "02", title: "Animation/Style Stack", textClass: "translate-Base" },
    { number: "03", title: "Git/GitHub", textClass: "translate-Git" },
    { number: "04", title: "TypeScript/JavaScript", textClass: "translate-TypeScript" },
    { number: "05", title: "Architecture", textClass: "translate-Styling" },
    { number: "06", title: "API", textClass: "translate-API" }
];

const additionalSkills = [
    { title: "Nest.js", textClass: "translate-Nestworking" },
    { title: "Crypto libraries", textClass: "translate-Node" },
    { title: "PHP", textClass: "translate-PHP" },
    { title: "Docker", textClass: "translate-Docker" }
];

const workExperience = [
    {
        dateClass: "translate-workstart",
        date: "Март 2022 — Сентябрь 2022",
        titleClass: "translate-worktitle",
        title: "Фриланс: Создание сайтов",
        textClass: "translate-dickriphn",
        text: "Разрабатывал сайты на Bootstrap с адаптивной версткой. Постепенно начал работать с заказами, включающими JavaScript и PHP. Начал изучать взаимодействие клиентской части с сервером.",
        visible: true
    },
    {
        dateClass: "translate-workstart2",
        date: "Август 2022 — Октябрь 2023",
        titleClass: "translate-worktitle2",
        title: "Dats.Team: Разработка на React Native",
        textClass: "translate-dickriphn2",
        text: "Работал над созданием мобильных приложений с использованием React Native и Firebase. Интеграция авторизации, баз данных и взаимодействие с API. Получил опыт работы в командной среде.",
        visible: true
    },
    {
        dateClass: "translate-workstart3",
        date: "Декабрь 2023 — Август 2024",
        titleClass: "translate-worktitle3",
        title: "Dats.Team: Разработка",
        textClass: "translate-dickriphn3",
        text: "Участвовал в разработке и оптимизации фронтенд-части различных веб-сайтов и приложений. Использовал современные технологии, включая React и Next.js, для создания эффективных и высокопроизводительных интерфейсов.",
        visible: true
    },
    {
        dateClass: "translate-workstart4",
        date: "Октябрь 2024 — Январь 2025",
        titleClass: "translate-worktitle4",
        title: "Саморазвитие",
        textClass: "translate-dickriphn4",
        text: "Улучшение уже имеющихся знаний по React и Next.js, разрабатывал и тестировал различные архитектуры приложений. Фокус был на практическом применении паттернов, оптимизации клиентского рендера и взаимодействии с серверной логикой.",
        visible: false
    },
    {
        dateClass: "translate-workstart5",
        date: "Февраль 2025 — Апрель 2025",
        titleClass: "translate-worktitle5",
        title: "Разработка CRM-системы",
        textClass: "translate-dickriphn5",
        text: "Перенёс CRM-систему с монолита на компонентную архитектуру на базе React. Внедрил React Query для эффективной работы с серверными данными. Оптимизировал производительность, упростил поддержку и улучшил UX.",
        visible: false
    },
    {
        dateClass: "translate-workstart6",
        date: "Май 2025 — Октябрь 2025",
        titleClass: "translate-worktitle6",
        title: "Работа над проектом BasisOS",
        textClass: "translate-dickriphn6",
        text: "Участвую в разработке BasisOS. Оптимизировал клиентский рендер, повысив производительность интерфейса, внедрил архитектурные улучшения. Начал работать с Web3-библиотеками и взаимодействие с блокчейном.",
        visible: false
    },
    {
        dateClass: "translate-workstart7",
        date: "Октябрь 2025 — Февраль 2026",
        titleClass: "translate-worktitle7",
        title: "Работа над проектом Dopamine",
        textClass: "translate-dickriphn7",
        text: "Работа над проектом Dopamine, улучшенная оптимизация, разделение ответственности компонентов.",
        visible: false
    }
];

// Helper function to create section with sidebar
function createSectionWithSidebar(id, sidebarBg, contentBg, sidebarTitle, sidebarSubtitle, content) {
    const section = document.createElement('div');
    section.className = 'grid md:grid-cols-[30%_70%] block';
    if (id) section.id = id;

    const sidebar = document.createElement('div');
    sidebar.className = `flex md:justify-end ${sidebarBg} border-t border-b border-[#5e5e5e] md:border-none`;
    sidebar.innerHTML = `
        <div class="flex flex-col md:py-20 md:px-16 p-6">
            <p class="${sidebarTitle} md:text-right text-yellow-400">${sidebarTitle.includes('translate-') ? '' : sidebarTitle}</p>
            ${sidebarSubtitle ? `<p class="${sidebarSubtitle} ${sidebarTitle.includes('translate-') ? 'pt-2' : 'text-right pt-2'}">${sidebarSubtitle.includes('translate-') ? '' : sidebarSubtitle}</p>` : ''}
        </div>
    `;

    const contentDiv = document.createElement('div');
    contentDiv.className = contentBg;
    contentDiv.innerHTML = content;

    section.appendChild(sidebar);
    section.appendChild(contentDiv);

    return section;
}

// Create personal info blocks
function createPersonalInfoBlocks() {
    return personalInfo.map(item => `
        <div class="text-center md:text-left rounded-lg">
            <p class="${item.labelClass || ''} font-bold text-xl mb-2">${item.label}</p>
            <p class="${item.valueClass || ''}">${item.value}</p>
        </div>
    `).join('');
}

// Create main skills blocks
function createMainSkillsBlocks() {
    return mainSkills.map(skill => `
        <div class="p-2 flex row rounded-lg">
            <div class="text-yellow-400 font-bold text-lg">${skill.number}</div>
            <div class="px-4">
                <p class="text-[#c2c0c0] font-bold text-lg">${skill.title}</p>
                <p class="${skill.textClass} py-4">${skill.text}</p>
            </div>
        </div>
    `).join('');
}

// Create additional skills blocks
function createAdditionalSkillsBlocks() {
    return additionalSkills.map(skill => `
        <div class="p-2 flex flex-row items-start gap-4 rounded-lg">
            <div class="w-1 h-full bg-yellow-400 rounded-full shrink-0"></div>
            <div class="px-4">
                <p class="text-[#c2c0c0] font-bold text-lg">${skill.title}</p>
                <p class="${skill.textClass} py-4">${skill.text}</p>
            </div>
        </div>
    `).join('');
}

// Create work experience blocks
function createWorkExperienceBlocks() {
    const visibleBlocks = workExperience.filter(exp => exp.visible);
    const hiddenBlocks = workExperience.filter(exp => !exp.visible);

    let html = visibleBlocks.map(exp => `
        <div class="flex items-center space-x-4 mb-6 cursor-pointer hover:brightness-125 transition">
            <div class="flex-shrink-0 w-3 h-3 bg-yellow-400 z-[1] rounded-full"></div>
            <div class="pt-4">
                <p class="${exp.dateClass} text-xs">${exp.date}</p>
                <p class="${exp.titleClass} font-bold text-lg">${exp.title}</p>
                <p class="${exp.textClass}">${exp.text}</p>
            </div>
        </div>
    `).join('');

    if (hiddenBlocks.length > 0) {
        html += `<div id="more-experience" class="overflow-hidden max-h-0 transition-[max-height] duration-700 ease-in-out">`;
        html += hiddenBlocks.map((exp, index) => `
            <div class="flex items-center space-x-4 mb-6 cursor-pointer hover:brightness-125 transition">
                <div class="flex-shrink-0 w-3 h-3 bg-yellow-400 z-[1] rounded-full" ${index === 0 ? 'id="expand-trigger"' : ''}></div>
                <div class="pt-4">
                    <p class="${exp.dateClass} text-xs">${exp.date}</p>
                    <p class="${exp.titleClass} font-bold text-lg">${exp.title}</p>
                    <p class="${exp.textClass}">${exp.text}</p>
                </div>
            </div>
        `).join('');
        html += `</div>`;

        html += `
            <div id="expand-indicator" class="flex items-center space-x-4 mb-6 cursor-pointer hover:brightness-125 transition">
                <div class="flex-shrink-0 w-3 h-3 z-[1]"></div>
                <div class="flex items-center space-x-2">
                    <p class="translate-ShowMore text-yellow-400 font-semibold">Показать больше</p>
                    <svg data-name="1-Arrow Down" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400 animate-bounce" viewBox="0 0 32 32" style="margin-top: 16px;">
                        <path fill="none" stroke="currentColor" stroke-width="2" d="M16 22L6 12l1.41-1.41L15 19.17V0h2v19.17l7.59-7.58L26 12z"/>
                    </svg>
                </div>
            </div>
        `;
    }

    return html;
}

// Initialize components on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Personal info blocks
    const personalInfoContainer = document.getElementById('personal-info-container');
    if (personalInfoContainer) {
        personalInfoContainer.innerHTML = createPersonalInfoBlocks();
    }

    // Main skills section
    const mainSkillsContainer = document.getElementById('main-skills-container');
    if (mainSkillsContainer) {
        mainSkillsContainer.innerHTML = createMainSkillsBlocks();
    }

    // Additional skills section
    const additionalSkillsContainer = document.getElementById('additional-skills-container');
    if (additionalSkillsContainer) {
        additionalSkillsContainer.innerHTML = createAdditionalSkillsBlocks();
    }

    // Work experience timeline
    const timelineContent = document.querySelector('#Workexperience .relative.max-w-4xl');
    if (timelineContent) {
        const timelineLine = timelineContent.querySelector('#timeline-line');
        const existingContent = timelineLine ? timelineLine.outerHTML : '';
        timelineContent.innerHTML = existingContent + createWorkExperienceBlocks();

        // Reinitialize timeline script after a short delay to ensure DOM is ready
        setTimeout(() => {
            initTimeline();
        }, 100);
    }

    // Apply translation after all content is populated to prevent flickering on load
    if (typeof translate === 'function') {
        translate(localStorage.getItem('preferredLanguage') || 'en');
    }
});

// Timeline initialization function
function initTimeline() {
    let revealedCount = 0;
    const step = 2;

    const wrapper = document.getElementById('more-experience');
    const timeline = document.getElementById('timeline-line');
    const indicator = document.getElementById('expand-indicator');

    if (!wrapper || !timeline || !indicator) return;

    const allBlocks = Array.from(wrapper.children).filter(el => el.classList.contains('flex'));
    const total = allBlocks.length;

    // Initially hide blocks
    wrapper.style.maxHeight = '0px';
    allBlocks.forEach(el => el.style.opacity = 0);

    function toggleBlocks() {
        if (revealedCount >= total) {
            // Collapse all
            revealedCount = 0;
            wrapper.style.maxHeight = '0px';
            allBlocks.forEach(el => el.style.opacity = 0);
            timeline.classList.remove('after:opacity-100');
            if (indicator) {
                indicator.style.display = 'flex';
            }
            return;
        }

        // Expand next batch
        revealedCount += step;
        const visibleBlocks = allBlocks.slice(0, revealedCount);
        visibleBlocks.forEach(el => el.style.opacity = 1);

        // Recalculate height
        const totalHeight = visibleBlocks.reduce((sum, el) => sum + el.offsetHeight + 24, 0);
        wrapper.style.maxHeight = totalHeight + 'px';

        if (revealedCount >= total) {
            timeline.classList.add('after:opacity-100');
            if (indicator) {
                indicator.style.display = 'none';
            }
        }
    }

    // Click on indicator
    if (indicator) {
        indicator.addEventListener('click', toggleBlocks);
    }

    // Click on any experience block
    const clickable = document.querySelectorAll('#Workexperience .flex.items-center.space-x-4.mb-6');
    clickable.forEach(el => el.addEventListener('click', toggleBlocks));
}


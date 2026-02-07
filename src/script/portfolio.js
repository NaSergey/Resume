// Описание портфолио
const portfolioDescription = {
    ru: "Здесь представлены мои проекты, над которыми я работал. Каждый проект демонстрирует различные аспекты моих навыков в разработке веб-приложений.",
    en: "Here are my key projects that I've worked on. Each project demonstrates different aspects of my skills in developing modern web applications."
};

// Данные портфолио
const portfolioData = [
    {
        id: 1,
        title: { ru: "Basios OS", en: "Basios OS" },
        description: {
            ru: "BasisOS — веб-приложение для децентрализованного финансового протокола (DeFAI). В рамках проекта я выполнил полный редизайн пользовательского интерфейса и разработал анимации для главной страницы.",
            en: "BasisOS is a web application for a decentralized financial protocol (DeFAI). As part of the project, I completed a full UI redesign and developed animations for the main page."
        },
        image: "./src/image/basiosos/logo.png",
        media: [
            { type: "video", url: "./src/image/basiosos/video.mp4" },
            { type: "image", url: "./src/image/basiosos/1.png" },
            { type: "image", url: "./src/image/basiosos/2.png" },
            { type: "image", url: "./src/image/basiosos/3.png" },
            { type: "image", url: "./src/image/basiosos/4.png" },
        ],
        technologies: ["Next.js", "React Query", "Framer Motion", "gsap", "lenis", "Chart.js", "Zod", "Wagmi"]

    },
    {
        id: 2,
        title: { ru: "Dopamine", en: "Dopamine" },
        description: {
            ru: "Dopamine — веб-приложение для пользователей, которые получают вознаграждение за продвижение продуктов. Проект разрабатывался совместно с сеньор фронтенд-разработчиком; я отвечал за вёрстку, работу с API, обработку ошибок и анимации интерфейса.",
            en: "Dopamine is a web application for users who earn rewards by promoting products. The project was developed together with a senior frontend developer; I was responsible for layout implementation, API integration, error handling, and interface animations."
        },


        image: "./src/image/dopamin/2.png",
        media: [
            { type: "video", url: "./src/image/dopamin/video.mp4" },
            { type: "image", url: "./src/image/dopamin/1.png" },
            { type: "image", url: "./src/image/dopamin/2.png" },
            { type: "image", url: "./src/image/dopamin/3.png" },
            { type: "image", url: "./src/image/dopamin/4.png" },
            { type: "image", url: "./src/image/dopamin/5.png" }
        ],
        technologies: ["Next.js", "React Query", "ShadcnUI", "Zod", "React Hook Form", "FSD", "Chart.js"]
    },

    {
        id: 3,
        title: { ru: "Pixel CRM", en: "Pixel CRM" },
        description: {
            ru: "PIXEL CRM — веб-система управления клиентами (CRM) для лидов, партнеров, брокеров и маркетинговых кампаний в сфере финансов. Я переписал проект с монолитной архитектуры на компонентную структуру с использованием React, внедрил React Query для работы с API, повысил производительность, упростил поддержку и улучшил интерфейс. Проект успешно вышел в релиз и поддерживается.",
            en: "PIXEL CRM is a web-based CRM system for managing leads, partners, brokers, and marketing campaigns in financial services. I rewrote the project from a monolithic architecture to a component-based structure using React, implemented React Query for API handling, improved performance, simplified maintenance, and enhanced the user interface. The project has been successfully released and is actively maintained."
        },
        image: "./src/image/pixel/logo.png",
        media: [
            { type: "video", url: "./src/image/pixel/video.mp4" },
            { type: "image", url: "./src/image/pixel/1.png" },
            { type: "image", url: "./src/image/pixel/2.png" },
            { type: "image", url: "./src/image/pixel/3.png" }
        ],
        technologies: ["React", "Redux Toolkit", "React Query", "React Router", "TypeScript", "Tailwind CSS"]
    },
    {
        id: 4,
        title: { ru: "Traffic.Card", en: "Traffic.Card" },
        description: {
            ru: "Traffic Cards — это веб-платформа для управления виртуальными картами, предназначенная для рекламных кампаний и финансовых операций. Система предоставляет управление виртуальными картами, мониторинг транзакций, аналитику расходов. Аутентификация на основе JWT-токенов и поддержка разных профилей пользователей (роли и уровни доступа). Проект не завершён: команда не смогла договориться с банками, frontend реализован примерно на 50%.",
            en: "Traffic Cards is a web platform for managing virtual cards, designed for advertising campaigns and financial operations. The system provides virtual card management, transaction monitoring, expense analytics. JWT-based authentication, and support for multiple user profiles (roles and access levels). The project is incomplete: the team was unable to reach agreements with banks, and the frontend is approximately 50% complete."
        },
        image: "./src/image/traffic/logo.png",
        media: [
            { type: "video", url: "./src/image/traffic/video.mp4" },
            { type: "image", url: "./src/image/traffic/1.png" },
            { type: "image", url: "./src/image/traffic/2.png" },
        ],
        technologies: ["Next.js", "Redux Toolkit", "React Query", "Tailwind"]
    },
];

// Текущий язык
// Текущий язык
// Текущий язык
let currentLang = localStorage.getItem("preferredLanguage") || "en";

// Текущий индекс карусели
let currentCarouselIndex = 0;

// Инициализация портфолио
function initPortfolio() {
    const container = document.getElementById('portfolio-container');
    const descriptionElement = document.getElementById('portfolio-description');

    if (!container) return;

    // Update portfolio description
    if (descriptionElement) {
        descriptionElement.textContent = portfolioDescription[currentLang];
    }

    container.innerHTML = '';

    portfolioData.forEach(project => {
        const card = createPortfolioCard(project);
        container.appendChild(card);
    });
}

// Создание карточки портфолио
function createPortfolioCard(project) {
    const card = document.createElement('div');
    card.className = 'cursor-pointer group';
    card.addEventListener('click', () => openModal(project));

    card.innerHTML = `
        <div class="relative overflow-hidden rounded-lg bg-[#2d2e2e] hover:scale-105 transition-transform duration-300">
            <img src="${project.image}" alt="${project.title[currentLang]}" 
                 class="w-full aspect-video object-cover group-hover:brightness-75 transition">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="absolute bottom-4 left-4 right-4">
                    <h3 class="text-white font-bold text-lg">${project.title[currentLang]}</h3>
                </div>
            </div>
        </div>
    `;

    return card;
}

// Открытие модального окна
function openModal(project) {
    const modal = document.getElementById('portfolio-modal');
    const title = document.getElementById('modal-title');
    const description = document.getElementById('modal-description');
    const techContainer = document.getElementById('modal-tech');
    const carouselTrack = document.getElementById('carousel-track');

    if (!modal || !title || !description) return;

    // Устанавливаем данные
    title.textContent = project.title[currentLang];
    description.textContent = project.description[currentLang];

    // Технологии
    techContainer.innerHTML = '';
    project.technologies.forEach(tech => {
        const badge = document.createElement('span');
        badge.className = 'px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm';
        badge.textContent = tech;
        techContainer.appendChild(badge);
    });

    // Видео - отдельный блок на всю ширину
    const videoContainer = document.getElementById('video-container');
    const modalVideo = document.getElementById('modal-video');
    const videoItem = project.media.find(item => item.type === 'video');

    if (videoItem && videoContainer && modalVideo) {
        modalVideo.src = videoItem.url;
        videoContainer.classList.remove('hidden');
    } else if (videoContainer) {
        videoContainer.classList.add('hidden');
    }

    // Карусель - только изображения
    carouselTrack.innerHTML = '';
    const images = project.media.filter(item => item.type === 'image');

    // Показываем/скрываем карусель в зависимости от наличия изображений
    const carouselContainer = document.getElementById('carousel-container');

    if (images.length > 0) {
        if (carouselContainer) {
            carouselContainer.style.display = 'block';
        }

        images.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'min-w-[calc(50%-4px)] md:min-w-[calc(33.333%-6px)] flex-shrink-0';

            const img = document.createElement('img');
            img.src = item.url;
            img.alt = project.title[currentLang];
            img.className = 'w-full h-36 object-cover rounded-lg cursor-pointer hover:opacity-80 transition aspect-video';
            img.addEventListener('click', () => openFullscreenImage(item.url));
            slide.appendChild(img);
            carouselTrack.appendChild(slide);
        });

        currentCarouselIndex = 0;

        // Принудительно показываем кнопки если есть больше 1 слайда
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');

        if (images.length > 1) {
            if (prevBtn) {
                prevBtn.style.display = 'flex';
                prevBtn.style.visibility = 'visible';
            }
            if (nextBtn) {
                nextBtn.style.display = 'flex';
                nextBtn.style.visibility = 'visible';
            }
        }

        // Небольшая задержка для правильной инициализации
        setTimeout(() => {
            updateCarousel();
        }, 50);
    } else {
        // Если нет изображений, скрываем карусель
        if (carouselContainer) {
            carouselContainer.style.display = 'none';
        }
    }

    // Показываем модальное окно с анимацией
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Небольшая задержка для запуска анимации
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        const modalContent = document.getElementById('modal-content');
        if (modalContent) {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }
    });
}

// Закрытие модального окна с анимацией
function closeModal() {
    const modal = document.getElementById('portfolio-modal');
    const modalContent = document.getElementById('modal-content');

    if (!modal) return;

    // Запускаем анимацию исчезновения
    modal.classList.add('opacity-0');
    if (modalContent) {
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
    }

    // Ждем окончания анимации перед скрытием (300ms соответствует duration-300 в CSS)
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }, 300);
}

// Открытие изображения в полном размере
function openFullscreenImage(imageUrl) {
    const fullscreenModal = document.getElementById('fullscreen-image-modal');
    const fullscreenImg = document.getElementById('fullscreen-image');

    if (!fullscreenModal || !fullscreenImg) return;

    fullscreenImg.src = imageUrl;
    fullscreenModal.classList.remove('hidden');
    fullscreenModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

// Закрытие полноэкранного изображения
function closeFullscreenImage() {
    const fullscreenModal = document.getElementById('fullscreen-image-modal');
    if (!fullscreenModal) return;

    fullscreenModal.classList.add('hidden');
    fullscreenModal.classList.remove('flex');
    document.body.style.overflow = '';
}

// Helper to get accurate visible slides count
function getSlidesPerView() {
    const track = document.getElementById('carousel-track');
    if (!track || track.children.length === 0) return 1;

    const container = track.parentElement;
    const style = window.getComputedStyle(container);
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    const containerInnerWidth = container.offsetWidth - paddingLeft - paddingRight;

    const slideWidth = track.children[0].offsetWidth;
    const gap = 8;

    let slidesCount = 0;
    let widthUsed = 0;
    // Check how many slides fit in the INNER width
    while (widthUsed + slideWidth <= containerInnerWidth + 1) {
        slidesCount++;
        widthUsed += slideWidth + gap;
    }
    return Math.max(1, slidesCount);
}

// Обновление карусели
function updateCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (!track || track.children.length === 0) return;

    const totalSlides = track.children.length;
    const slidesPerView = getSlidesPerView();

    // Calculate max index
    const maxIndex = Math.max(0, totalSlides - slidesPerView);

    // Limit current index
    currentCarouselIndex = Math.min(Math.max(currentCarouselIndex, 0), maxIndex);

    console.log('Update: Total:', totalSlides, 'Visible:', slidesPerView, 'Index:', currentCarouselIndex, 'Max:', maxIndex);

    // Calculate if we need navigation buttons
    const needsNavigation = totalSlides > slidesPerView;

    if (needsNavigation) {
        if (prevBtn) {
            prevBtn.style.display = 'flex';
            prevBtn.style.visibility = 'visible';
            prevBtn.style.opacity = currentCarouselIndex > 0 ? '1' : '0.5';
            prevBtn.style.pointerEvents = currentCarouselIndex > 0 ? 'auto' : 'none';
        }

        if (nextBtn) {
            nextBtn.style.display = 'flex';
            nextBtn.style.visibility = 'visible';
            const canGoNext = currentCarouselIndex < maxIndex;
            nextBtn.style.opacity = canGoNext ? '1' : '0.5';
            nextBtn.style.pointerEvents = canGoNext ? 'auto' : 'none';
        }
    } else {
        if (prevBtn) {
            prevBtn.style.display = 'none';
            prevBtn.style.visibility = 'hidden';
        }
        if (nextBtn) {
            nextBtn.style.display = 'none';
            nextBtn.style.visibility = 'hidden';
        }
    }

    // Calculate transform
    const container = track.parentElement;
    const style = window.getComputedStyle(container);
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    const containerInnerWidth = container.offsetWidth - paddingLeft - paddingRight;

    const slideWidth = track.children[0].offsetWidth;
    const gap = 8;

    // Formula: Index * (Width + Gap)
    let translateX = -(currentCarouselIndex * (slideWidth + gap));

    // Fix for the last slide: align to right edge of INNER container
    if (currentCarouselIndex === maxIndex && maxIndex > 0) {
        const totalWidth = (totalSlides * slideWidth) + ((totalSlides - 1) * gap);
        translateX = -(totalWidth - containerInnerWidth);
    }

    track.style.transform = `translateX(${translateX}px)`;
}

// Следующий слайд
function nextSlide(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const track = document.getElementById('carousel-track');
    if (!track || track.children.length === 0) return;

    const totalSlides = track.children.length;
    const slidesPerView = getSlidesPerView();
    const maxIndex = Math.max(0, totalSlides - slidesPerView);

    // Переключаем на 1 слайд вперед, но не дальше maxIndex
    if (currentCarouselIndex < maxIndex) {
        currentCarouselIndex++;
        updateCarousel();
    }
}

// Предыдущий слайд
function prevSlide(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const modal = document.getElementById('portfolio-modal');
    if (!modal || modal.classList.contains('hidden')) return;

    const track = document.getElementById('carousel-track');
    if (!track) return;

    const totalSlides = track.children.length;
    if (totalSlides === 0) return;

    console.log('Prev - Current:', currentCarouselIndex);

    // Переключаем на 1 слайд назад
    if (currentCarouselIndex > 0) {
        currentCarouselIndex--;
        console.log('Moving to:', currentCarouselIndex);
    }
    updateCarousel();
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initPortfolio();

    // Обработчики событий
    const closeBtn = document.getElementById('close-modal');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const modal = document.getElementById('portfolio-modal');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Закрытие по клику вне модального окна
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Обновление при смене языка
    const langLinks = document.querySelectorAll('[data-lang]');
    langLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                currentLang = localStorage.getItem("preferredLanguage") || "en";
                initPortfolio();
            }, 100);
        });
    });

    // Обновление карусели при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 250);
    });

    // Обработчики для полноэкранного просмотра изображений
    const closeFullscreenBtn = document.getElementById('close-fullscreen');
    const fullscreenModal = document.getElementById('fullscreen-image-modal');

    if (closeFullscreenBtn) {
        closeFullscreenBtn.addEventListener('click', closeFullscreenImage);
    }

    if (fullscreenModal) {
        fullscreenModal.addEventListener('click', (e) => {
            if (e.target === fullscreenModal || e.target.id === 'fullscreen-image') {
                closeFullscreenImage();
            }
        });
    }

    // Закрытие полноэкранного изображения по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const fullscreenModal = document.getElementById('fullscreen-image-modal');
            if (fullscreenModal && !fullscreenModal.classList.contains('hidden')) {
                closeFullscreenImage();
            }
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const links = mobileMenu.querySelectorAll("a"); 
    // Проверка наличия элементов
    if (!menuBtn || !mobileMenu) {
        console.error("Не найдены элементы с id 'menu-btn' или 'mobile-menu'. Проверьте HTML.");

        return;
    }
    menuBtn.addEventListener("click", () => {
        if (mobileMenu.classList.contains("max-h-0")) {
            mobileMenu.classList.remove("max-h-0", "opacity-0", "-translate-y-5");
            mobileMenu.classList.add("max-h-screen", "opacity-100", "translate-y-0");
        } else {
            mobileMenu.classList.remove("max-h-screen", "opacity-100", "translate-y-0");
            mobileMenu.classList.add("max-h-0", "opacity-0", "-translate-y-5");
        }
    });




    const langTrigger = document.getElementById('lang-trigger');
    const langMenu = document.getElementById('lang-menu');
    const languageLinks = document.querySelectorAll('[data-lang]');
    
    // Функция перевода
    const translate = (langCode) => {
        const translatableElements = document.querySelectorAll('[class^="translate-"]');
        translatableElements.forEach((element) => {
            const className = element.className;
            const key = className.split(' ')[0].split('-')[1]; // Извлекаем ключ перевода
            if (lang[key] && lang[key][langCode]) {
                element.textContent = lang[key][langCode];
            }
        });
    };
    
    // Установить язык из localStorage или по умолчанию
    const savedLanguage = localStorage.getItem("preferredLanguage") || "en";
    translate(savedLanguage);
    

    
    // Показать/скрыть меню при клике
    langTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        langMenu.classList.toggle('hidden');
    });
    
    // Закрыть меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!langTrigger.contains(e.target) && !langMenu.contains(e.target)) {
            langMenu.classList.add('hidden');
        }
    });
    
    // Добавление события на ссылки
    languageLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Отключить переход по ссылке
            const selectedLanguage = link.dataset.lang;
            localStorage.setItem("preferredLanguage", selectedLanguage); // Сохранить язык
            translate(selectedLanguage);
    
            // Обновить текст триггера
            // langTrigger.textContent = link.textContent;
    
            // Закрыть меню
            langMenu.classList.add('hidden');
        });
    });
    
});

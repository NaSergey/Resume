document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

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
});

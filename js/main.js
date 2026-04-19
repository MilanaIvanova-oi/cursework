// ============================================
// ГЛАВНАЯ СТРАНИЦА
// Студия маникюра "Милка"
//
// Описание: Функции для главной страницы:
// - Загрузка и отрисовка услуг
// - Загрузка и отрисовка мастеров
// - Слайдер галереи
// - Слайдер скидок
// ============================================

// ============================================
// ПОЛУЧЕНИЕ УСЛУГ ИЗ БАЗЫ ДАННЫХ
// Отправляет запрос на сервер и получает список услуг
// ============================================
async function fetchServices() {
    let url = `http://localhost/myserver/get?action=get_services`
    let response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
    })
    let services = await response.json()

    if (Array.isArray(services) && services.length > 0) {
        renderServices(services)
    } else {
        console.error('Услуги не найдены или ошибка сервера')
    }
}

// ============================================
// ОТРИСОВКА УСЛУГ НА СТРАНИЦЕ
// ============================================
function renderServices(services) {
    const container = document.querySelector('.services-grid')
    if (!container) return

    container.innerHTML = ''

    services.forEach(service => {
        const serviceItem = document.createElement('div')
        serviceItem.className = 'service-item'
        serviceItem.innerHTML = `
            <img src="${service.image}" alt="${service.title}">
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <div class="price">от ${service.price} руб.</div>
        `
        container.appendChild(serviceItem)
    })
}

// ============================================
// ПОЛУЧЕНИЕ МАСТЕРОВ ИЗ БАЗЫ ДАННЫХ
// ============================================
async function fetchMasters() {
    let url = `http://localhost/myserver/get?action=get_masters`
    let response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
    })
    let masters = await response.json()

    if (Array.isArray(masters) && masters.length > 0) {
        renderMasters(masters)
    } else {
        console.error('Мастера не найдены или ошибка сервера')
    }
}

// ============================================
// ОТРИСОВКА МАСТЕРОВ НА СТРАНИЦЕ
// ============================================
function renderMasters(masters) {
    const container = document.querySelector('.masters-grid')
    if (!container) return

    container.innerHTML = ''

    masters.forEach(master => {
        const masterCard = document.createElement('div')
        masterCard.className = 'master-card'
        masterCard.innerHTML = `
            <img src="${master.image}" alt="${master.name}">
            <h3>${master.name}</h3>
            <p>${master.experience}</p>
            <p>${master.specialization}</p>
        `
        container.appendChild(masterCard)
    })
}

// ============================================
// СЛАЙДЕР ДЛЯ ГАЛЕРЕИ
// ============================================
function initGallerySlider() {
    const slider = document.querySelector('.gallery-slider');
    if (!slider) return;

    const slides = document.querySelector('.gallery-slides');
    const items = document.querySelectorAll('.gallery-slides .gallery-item');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');

    if (!slides || items.length === 0) return;

    let currentSlide = 0;
    const itemsPerSlide = 2;

    function showSlide(index) {
        if (index < 0) {
            currentSlide = items.length - itemsPerSlide;
        } else if (index >= items.length) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }

        const itemWidth = items[0].offsetWidth;
        slides.style.transform = `translateX(-${currentSlide * itemWidth}px)`;
    }

    prevBtn.addEventListener('click', () => showSlide(currentSlide - itemsPerSlide));
    nextBtn.addEventListener('click', () => showSlide(currentSlide + itemsPerSlide));

    // Обработка изменения размера окна
    window.addEventListener('resize', () => showSlide(currentSlide));

    // Инициализация
    showSlide(0);
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРА СО СКИДКАМИ
// ============================================
 // Инициализация слайдера скидок
        document.addEventListener('DOMContentLoaded', () => {
            const DEFAULT_SPEED = 2;

            const slider = document.querySelector('.discount-slider-wrapper .slider');
            if (!slider) return;

            const wrapper = document.querySelector('.discount-slider-wrapper .slider-track');

            wrapper.innerHTML += wrapper.innerHTML;

            let speed = DEFAULT_SPEED;
            let position = 0;

            slider.addEventListener('mouseenter', () => {
                speed = DEFAULT_SPEED / 2;
            });

            slider.addEventListener('mouseleave', () => {
                speed = DEFAULT_SPEED;
            });

            function animate() {
                position -= speed;

                if (Math.abs(position) >= wrapper.scrollWidth / 2) {
                    position = 0;
                }

                wrapper.style.transform = `translateX(${position}px)`;
                requestAnimationFrame(animate);
            }

            animate();
        })

    // CSS анимация делает всю работу - бесконечная плавная прокрутка
    // При наведении курсора анимация приостанавливается через :hover


// ============================================
// ИНИЦИАЛИЗАЦИЯ ГЛАВНОЙ СТРАНИЦЫ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    fetchServices()
    fetchMasters()
    initGallerySlider()
    
})

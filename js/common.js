// ============================================
// ОБЩИЕ ФУНКЦИИ
// Студия маникюра "Милка"
//
// Описание: Базовые функции для всех страниц:
// - Проверка авторизации
// - Обновление кнопок входа/выхода
// - Выпадающее меню в шапке
// - Валидация форм
// ============================================

// ============================================
// ПРОВЕРКА АВТОРИЗАЦИИ
// Возвращает true если пользователь вошёл
// ============================================
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true'
}

// ============================================
// ОБНОВЛЕНИЕ КНОПОК АВТОРИЗАЦИИ
// Показывает/скрывает кнопки Вход/Выход
// ============================================
function updateAuthButtons() {
    const authLink = document.querySelector('#authLink')
    const regLink = document.querySelector('#regLink')
    const logoutLink = document.querySelector('#logoutLink')

    if (isLoggedIn()) {
        if (authLink) authLink.style.display = 'none'
        if (regLink) regLink.style.display = 'none'
        if (logoutLink) logoutLink.style.display = 'inline-block'

        const username = localStorage.getItem('username')
        if (logoutLink && username) {
            logoutLink.textContent = username + ' (Выход)'
        }
    } else {
        if (authLink) authLink.style.display = 'inline-block'
        if (regLink) regLink.style.display = 'inline-block'
        if (logoutLink) logoutLink.style.display = 'none'
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault()
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('username')
            window.location.reload()
        })
    }
}

// ============================================
// ВЫПАДАЮЩЕЕ МЕНЮ В ШАПКЕ
// ============================================
function initHeaderMenu() {
    const menuToggle = document.querySelector('#menuToggle')
    const headerMenu = document.querySelector('#headerMenu')

    if (menuToggle && headerMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation()
            menuToggle.classList.toggle('active')
            headerMenu.classList.toggle('active')
        })

        document.addEventListener('click', function(e) {
            if (!headerMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active')
                headerMenu.classList.remove('active')
            }
        })

        const menuLinks = headerMenu.querySelectorAll('a')
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active')
                headerMenu.classList.remove('active')
            })
        })
    }
}

// ============================================
// ВАЛИДАЦИЯ ПОЛЕЙ
// ============================================


// ============================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    updateAuthButtons()
    initHeaderMenu()

    // Установка минимальной даты для appointment-date
    const dateInput = document.querySelector('#appointment-date')
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0]
        dateInput.setAttribute('min', today)
    }
})

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
function validateField(fieldId) {
    const field = document.querySelector('#' + fieldId)
    const errorDiv = document.querySelector('#' + fieldId + '-error')
    if (!field || !errorDiv) return true

    const value = field.value ? field.value.trim() : ''

    // Проверка на пустое значение для обязательных полей
    if (!value && field.required) {
        errorDiv.textContent = 'Это поле обязательно для заполнения'
        errorDiv.style.display = 'block'
        field.classList.add('input-error')
        return false
    }

    if (fieldId === 'reg-name' || fieldId === 'name') {
        const nameRegex = /^[а-яА-ЯёЁ\s]{2,50}$/
        if (!nameRegex.test(value)) {
            errorDiv.textContent = 'Имя должно содержать только русские буквы (2-50 символов)'
            errorDiv.style.display = 'block'
            field.classList.add('input-error')
            return false
        } else {
            errorDiv.textContent = ''
            errorDiv.style.display = 'none'
            field.classList.remove('input-error')
            return true
        }
    }
    

    if (fieldId === 'email' || fieldId === 'reg-email') {
        const emailRegex = /^[a-zA-Z0-9._-]+@(gmail|mail|yandex)\.(ru|com)$/
        if (!emailRegex.test(value)) {
            errorDiv.textContent = 'Email должен быть @gmail, @mail или @yandex (.ru или .com)'
            errorDiv.style.display = 'block'
            field.classList.add('input-error')
            return false
        } else {
            errorDiv.textContent = ''
            errorDiv.style.display = 'none'
            field.classList.remove('input-error')
            return true
        }
    }

    if (fieldId === 'phone' || fieldId === 'reg-phone') {
        // Принимаем форматы: +7XXXXXXXXXX или 8XXXXXXXXXX (11 цифр)
        const phoneRegex = /^(\+7|8)\d{10}$/
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            errorDiv.textContent = 'Введите номер в формате +7XXXXXXXXXX или 8XXXXXXXXXX (11 цифр)'
            errorDiv.style.display = 'block'
            field.classList.add('input-error')
            return false
        } else {
            errorDiv.textContent = ''
            errorDiv.style.display = 'none'
            field.classList.remove('input-error')
            return true
        }
    }

    if (fieldId === 'reg-password') {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@#$%^&*(),.?!:;])[a-zA-Z\d_@#$%^&*(),.?!:;]{8,}$/
        if (!passwordRegex.test(value)) {
            errorDiv.textContent = 'Пароль должен содержать минимум 8 символов, 1 заглавную букву, 1 строчную букву, 1 цифру и 1 спецсимвол (_, @, #, $ и т.д.)'
            errorDiv.style.display = 'block'
            field.classList.add('input-error')
            return false
        } else {
            errorDiv.textContent = ''
            errorDiv.style.display = 'none'
            field.classList.remove('input-error')
            return true
        }
    }

    if (fieldId === 'reg-password-confirm') {
        const password = document.querySelector('#reg-password').value
        if (field.value !== password) {
            errorDiv.textContent = 'Пароли не совпадают'
            errorDiv.style.display = 'block'
            field.classList.add('input-error')
            return false
        } else {
            errorDiv.textContent = ''
            errorDiv.style.display = 'none'
            field.classList.remove('input-error')
            return true
        }
    }

    if (fieldId === 'reg-username' || fieldId === 'username') {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
        if (!usernameRegex.test(value)) {
            errorDiv.textContent = 'Логин должен содержать от 3 до 20 символов (буквы, цифры, _)'
            errorDiv.style.display = 'block'
            field.classList.add('input-error')
            return false
        } else {
            errorDiv.textContent = ''
            errorDiv.style.display = 'none'
            field.classList.remove('input-error')
            return true
        }
    }

    if (fieldId === 'message') {
        if (value.length < 10) {
            errorDiv.textContent = 'Отзыв должен содержать минимум 10 символов'
            errorDiv.style.display = 'block'
            field.classList.add('input-error')
            return false
        } else {
            errorDiv.textContent = ''
            errorDiv.style.display = 'none'
            field.classList.remove('input-error')
            return true
        }
    }

    if (fieldId === 'appointment-sessions') {
        const sessions = parseInt(value)
        if (isNaN(sessions) || sessions < 1 || sessions > 20) {
            errorDiv.textContent = 'Количество сеансов должно быть от 1 до 20'
            errorDiv.style.display = 'block'
            field.classList.add('input-error')
            return false
        } else {
            errorDiv.textContent = ''
            errorDiv.style.display = 'none'
            field.classList.remove('input-error')
            return true
        }
    }

    if (fieldId === 'payment') {
        const selectedPayment = document.querySelector('input[name="payment"]:checked')
        if (!selectedPayment) {
            errorDiv.textContent = 'Выберите способ оплаты'
            errorDiv.style.display = 'block'
            return false
        } else {
            errorDiv.textContent = ''
            errorDiv.style.display = 'none'
            return true
        }
    }

    if (fieldId === 'appointment-agreement') {
        if (!field.checked) {
            errorDiv.textContent = 'Необходимо дать согласие на обработку персональных данных'
            errorDiv.style.display = 'block'
            field.classList.add('input-error')
            return false
        } else {
            errorDiv.textContent = ''
            errorDiv.style.display = 'none'
            field.classList.remove('input-error')
            return true
        }
    }

    if (fieldId === 'service-select' || fieldId === 'master-select' || fieldId === 'appointment-time') {
        if (!value) {
            errorDiv.textContent = 'Выберите значение из списка'
            errorDiv.style.display = 'block'
            field.classList.add('input-error')
            return false
        } else {
            errorDiv.textContent = ''
            errorDiv.style.display = 'none'
            field.classList.remove('input-error')
            return true
        }
    }

    if (fieldId === 'services-select') {
        // Валидация выбора услуг через чекбоксы
        const servicesErrorDiv = document.querySelector('#services-select-error')
        const checkedServices = document.querySelectorAll('#services-checkboxs-container input[type="checkbox"]:checked')
        if (checkedServices.length === 0) {
            if (servicesErrorDiv) {
                servicesErrorDiv.textContent = 'Выберите хотя бы одну услугу'
                servicesErrorDiv.style.display = 'block'
            }
            return false
        } else {
            if (servicesErrorDiv) {
                servicesErrorDiv.textContent = ''
                servicesErrorDiv.style.display = 'none'
            }
            return true
        }
    }

    if (fieldId === 'masters-select') {
        // Валидация выбора мастеров через чекбоксы
        const mastersErrorDiv = document.querySelector('#masters-select-error')
        const checkedMasters = document.querySelectorAll('#masters-checkboxs-container input[type="checkbox"]:checked')
        if (checkedMasters.length === 0) {
            if (mastersErrorDiv) {
                mastersErrorDiv.textContent = 'Выберите хотя бы одного мастера'
                mastersErrorDiv.style.display = 'block'
            }
            return false
        } else {
            if (mastersErrorDiv) {
                mastersErrorDiv.textContent = ''
                mastersErrorDiv.style.display = 'none'
            }
            return true
        }
    }

    if (fieldId === 'appointment-date') {
        if (!value) {
            errorDiv.textContent = 'Выберите дату записи'
            errorDiv.style.display = 'block'
            field.classList.add('input-error')
            return false
        }
        const selectedDate = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) {
            errorDiv.textContent = 'Нельзя записаться на прошедшую дату'
            errorDiv.style.display = 'block'
            field.classList.add('input-error')
            return false
        } else {
            errorDiv.textContent = ''
            errorDiv.style.display = 'none'
            field.classList.remove('input-error')
            return true
        }
    }

    return true
}

// ============================================
// НАВЕШИВАНИЕ ОБРАБОТЧИКОВ ВАЛИДАЦИИ
// ============================================
function attachValidationHandlers(fieldIds) {
    if (!fieldIds || !Array.isArray(fieldIds)) {
        console.error('attachValidationHandlers: ожидается массив fieldIds')
        return
    }
    fieldIds.forEach(function(fieldId) {
        const field = document.querySelector('#' + fieldId)
        if (field) {
            // Radio buttons
            if (field.type === 'radio') {
                const radioButtons = document.querySelectorAll('input[name="' + field.name + '"]')
                radioButtons.forEach(function(radio) {
                    radio.addEventListener('change', function() {
                        validateField(fieldId)
                    })
                })
            }
            // Checkboxes
            else if (field.type === 'checkbox') {
                field.addEventListener('change', function() {
                    validateField(fieldId)
                })
            }
            // Select elements
            else if (field.tagName === 'SELECT') {
                field.addEventListener('change', function() {
                    validateField(fieldId)
                })
            }
            // Number inputs
            else if (field.type === 'number') {
                field.addEventListener('input', function() {
                    validateField(fieldId)
                })
                field.addEventListener('blur', function() {
                    validateField(fieldId)
                })
            }
            // Text, tel, email, date, password
            else {
                field.addEventListener('input', function() {
                    validateField(fieldId)
                })
                field.addEventListener('blur', function() {
                    validateField(fieldId)
                })
            }
        }
    })
}

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

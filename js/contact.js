// ============================================
// СТРАНИЦА КОНТАКТОВ
// Студия маникюра "Милка"
//
// Описание: Функции для формы обратной связи:
// - Отправка отзыва на сервер
// - Валидация полей формы
// - Обработка звёздного рейтинга
// - Автозаполнение имени, телефона, email из users
// ============================================

// ============================================
// ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ДЛЯ ОТЗЫВА
// ============================================
async function fetchContactUser() {
    const username = localStorage.getItem('username')
    if (!username) {
        console.error('Имя пользователя не найдено в localStorage')
        return null
    }

    let url = `http://localhost/myserver/get.php?action=get_appointment_user&username=${encodeURIComponent(username)}`

    try {
        let response = await fetch(url, {
            method: 'GET',
            headers: { Accept: 'application/json' },
        })
        let userData = await response.json()
        return userData
    } catch (error) {
        console.error('Ошибка получения данных пользователя:', error)
        return null
    }
}



// ============================================
// ОТПРАВКА ОТЗЫВА
// Отправляет отзыв на сервер
// ============================================
async function fetchContact(name, phone, email, message) {
    let url = `http://localhost/myserver/`
    let d = { name, phone, email, message }

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(d).toString(),
        })
        let result = await response.json()

        if (result.status === 'success') {
            const contactForm = document.querySelector('#contact-form')
            if (contactForm) contactForm.reset()

            const modal = document.querySelector('#contactSuccessModal')
            if (modal) {
                modal.classList.add('active')
            }
        } else {
            const modal = document.querySelector('#contactErrorModal')
            if (modal) {
                modal.classList.add('active')
            }
        }
    } catch (error) {
        console.error('Ошибка:', error)
        const modal = document.querySelector('#contactErrorModal')
        if (modal) {
            modal.classList.add('active')
        }
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ ФОРМЫ КОНТАКТОВ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Звёздный рейтинг
    const ratingInputs = document.querySelectorAll('.star-input')
    if (ratingInputs) {
        ratingInputs.forEach(function(input) {
            input.addEventListener('change', function() {
                // При изменении радиокнопки — звёзды обновляются через CSS
            })
        })
    }

    const contactForm = document.querySelector('#contact-form')
    if (contactForm) {
        if (typeof attachValidationHandlers === 'function') {
            attachValidationHandlers(['message', 'rating'])
        }

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault()

            let hasErrors = false
            if (typeof validateField === 'function') {
                if (!validateField('message')) hasErrors = true
            }

            // Проверка рейтинга
            const ratingInput = document.querySelector('.star-input:checked')
            if (!ratingInput) {
                const ratingError = document.querySelector('#rating-error')
                if (ratingError) {
                    ratingError.textContent = 'Пожалуйста, поставьте оценку'
                }
                hasErrors = true
            }

            if (hasErrors) return

            const name = document.querySelector('#name').value
            const email = document.querySelector('#email').value
            const message = document.querySelector('#message').value
            const phoneField = document.querySelector('#phone')
            const phone = phoneField ? phoneField.value : ''
            const rating = document.querySelector('.star-input:checked')?.value || ''

            console.log('Отправка отзыва:', { name, phone, email, message, rating })
            fetchContact(name, phone, email, message, rating)
        })
    }

    // Закрытие модальных окон
    document.querySelectorAll('.modal-close-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            this.closest('.modal-overlay').classList.remove('active')
        })
    })
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.classList.remove('active')
        })
    })
})

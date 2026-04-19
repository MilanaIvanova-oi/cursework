// ============================================
// СТРАНИЦА РЕГИСТРАЦИИ
// Студия маникюра "Милка"
//
// Описание: Функции для формы регистрации:
// - Отправка данных нового пользователя
// - Валидация всех полей формы
// ============================================

// ============================================
// РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
// Отправляет регистрационные данные на сервер
// ============================================
async function fetchData(name, username, email, phone, password) {
    let url = `http://localhost/myserver/`
    let d = { name, username, email, phone, password }

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
        console.log('Ответ сервера:', result)

        if (result.status === 'success') {
            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('username', username)
            localStorage.setItem('name', name)
            localStorage.setItem('phone', phone)

            const modal = document.querySelector('#regSuccessModal')
            if (modal) {
                modal.classList.add('active')
            }

            setTimeout(() => {
                window.location.href = 'index.html'
            }, 2000)
        } else {
            const modal = document.querySelector('#regErrorModal')
            if (modal) {
                modal.classList.add('active')
            }
        }
    } catch (error) {
        console.error('Ошибка:', error)
        const modal = document.querySelector('#regErrorModal')
        if (modal) {
            modal.classList.add('active')
        }
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ ФОРМЫ РЕГИСТРАЦИИ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const regForm = document.querySelector('#registration-form')
    if (regForm) {
        attachValidationHandlers(['reg-name', 'reg-username', 'reg-email', 'reg-phone', 'reg-password', 'reg-password-confirm'])

        regForm.addEventListener('submit', function(event) {
            event.preventDefault()

            const fields = ['reg-name', 'reg-username', 'reg-email', 'reg-phone', 'reg-password', 'reg-password-confirm']
            let hasErrors = false

            fields.forEach(function(fieldId) {
                if (!validateField(fieldId)) {
                    hasErrors = true
                }
            })

            if (hasErrors) return

            const name = document.querySelector('#reg-name').value
            const username = document.querySelector('#reg-username').value
            const email = document.querySelector('#reg-email').value
            const phone = document.querySelector('#reg-phone').value
            const password = document.querySelector('#reg-password').value

            console.log('Отправка данных:', { name, username, email, phone })
            fetchData(name, username, email, phone, password)
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

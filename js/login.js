// ============================================
// СТРАНИЦА ВХОДА
// Студия маникюра "Милка"
//
// Описание: Функции для формы авторизации:
// - Отправка данных для входа
// - Валидация логина и пароля
// ============================================

// ============================================
// ВХОД ПОЛЬЗОВАТЕЛЯ
// Отправляет логин и пароль на сервер
// ============================================
async function fetchLogin(username, password) {
    let url = `http://localhost/myserver/post`
    let d = { action: 'login', username, password }

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
            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('username', username)
            localStorage.setItem('name', result.name || '')
            localStorage.setItem('phone', result.phone || '')

            const modal = document.querySelector('#loginSuccessModal')
            const nameSpan = document.querySelector('#loginUserName')
            if (nameSpan) nameSpan.textContent = result.name || username
            if (modal) {
                modal.classList.add('active')
            }

            setTimeout(() => {
                window.location.href = 'index.html'
            }, 2000)
        } else {
            const modal = document.querySelector('#loginErrorModal')
            if (modal) {
                modal.classList.add('active')
            }
        }
    } catch (error) {
        console.error('Ошибка:', error)
        const modal = document.querySelector('#loginErrorModal')
        if (modal) {
            modal.classList.add('active')
        }
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ ФОРМЫ ВХОДА
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('#login-form')
    if (loginForm) {
        if (typeof attachValidationHandlers === 'function') {
            attachValidationHandlers(['username', 'password'])
        }

        loginForm.addEventListener('submit', function(event) {
            event.preventDefault()

            let hasErrors = false
            const fields = ['username', 'password']
            fields.forEach(function(fieldId) {
                if (typeof validateField === 'function' && !validateField(fieldId)) {
                    hasErrors = true
                }
            })

            if (hasErrors) return

            const username = document.querySelector('#username').value
            const password = document.querySelector('#password').value

            console.log('Вход:', { username })
            fetchLogin(username, password)
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

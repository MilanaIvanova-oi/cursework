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
    let url = `http://localhost/myserver/`
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
            alert(result.message)
            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('username', username)
            window.location.href = 'index.html'
        } else {
            alert(result.message)
        }
    } catch (error) {
        console.error('Ошибка:', error)
        alert('Ошибка соединения с сервером')
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ ФОРМЫ ВХОДА
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('#login-form')
    if (loginForm) {
        attachValidationHandlers(['username', 'password'])

        loginForm.addEventListener('submit', function(event) {
            event.preventDefault()

            let hasErrors = false
            ['username', 'password'].forEach(function(fieldId) {
                if (!validateField(fieldId)) {
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
})

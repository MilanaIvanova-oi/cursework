// ============================================
// СТРАНИЦА ЗАПИСИ НА УСЛУГУ
// Студия маникюра "Милка"
//
// Описание: Функции для формы записи:
// - Отправка записи на сервер
// - Загрузка услуг и мастеров для формы
// - Валидация формы
// - Выбор мастера для каждой услуги
// ============================================

// Глобальные переменные для хранения данных
let allServices = [];
let allMasters = [];
let selectedServiceMasterPairs = []; // [{service_id, service_name, master_id, master_name}]

// ============================================
// ОТПРАВКА ЗАПИСИ НА УСЛУГУ
// Отправляет данные записи на сервер
// ============================================
async function submitAppointment(username, name, phone, serviceMasterPairs, date, time) {
    // Формируем объект данных для отправки
    const d = {
        action: 'submit_appointment',
        username,
        name,
        phone,
        services: JSON.stringify(serviceMasterPairs.map(pair => pair.service_id)), // ID услуг в JSON
        masters: JSON.stringify(serviceMasterPairs.map(pair => pair.master_id)),   // ID мастеров в JSON
        date,
        time
    }

    try {
        // Отправляем POST-запрос на сервер
        const response = await fetch('http://localhost/myserver/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(d).toString(),
        })

        // Получаем текст ответа
        const responseText = await response.text()
        console.log('Сырой ответ сервера:', responseText)

        // Парсим JSON
        const result = JSON.parse(responseText)
        console.log('Ответ сервера:', result)

        // Находим элементы на странице
        const successMessage = document.querySelector('#successMessage')
        const errorMessage = document.querySelector('#errorMessage')
        const form = document.querySelector('#appointment-form')

        // Обрабатываем успешный ответ
        if (result.status === 'success') {
            successMessage?.classList.add('active')
            if (form) form.style.display = 'none'
            setTimeout(() => window.location.href = 'index.html', 3000)
        } else {
            // Сервер вернул ошибку
            errorMessage?.classList.add('active')
            const errorDetail = errorMessage?.querySelector('.error-detail')
            if (errorDetail) errorDetail.textContent = result.message || 'Произошла ошибка'
        }
    } catch (error) {
        // Ловим ошибки сети, парсинга JSON и DOM
        console.error('Ошибка:', error)
        const errorMessage = document.querySelector('#errorMessage')
        errorMessage?.classList.add('active')
        const errorDetail = errorMessage?.querySelector('.error-detail')
        if (errorDetail) {
            errorDetail.textContent = error.message.includes('JSON')
                ? 'Сервер вернул не-JSON ответ. Проверьте PHP логи.'
                : 'Ошибка сервера. Проверьте консоль.'
        }
    }
}

// ============================================
// ПОЛУЧЕНИЕ УСЛУГ ДЛЯ ФОРМЫ ЗАПИСИ
// ============================================
async function fetchAppointmentServices() {
    let url = `http://localhost/myserver/get.php?action=get_services`
    let response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
    })
    let services = await response.json()

    // Если услуги получены — заполняем чекбоксы
    if (Array.isArray(services) && services.length > 0) {
        fillServicesCheckboxes(services)
    } else {
        console.error('Услуги не найдены или ошибка сервера')
    }
}

// ============================================
// ПОЛУЧЕНИЕ МАСТЕРОВ ДЛЯ ФОРМЫ ЗАПИСИ
// ============================================
async function fetchAppointmentMasters() {
    let url = `http://localhost/myserver/get.php?action=get_masters`
    let response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
    })
    let masters = await response.json()

    // Сохраняем мастеров в глобальную переменную
    if (Array.isArray(masters) && masters.length > 0) {
        fillMastersData(masters)
    } else {
        console.error('Мастера не найдены или ошибка сервера')
    }
}

// ============================================
// ЗАПОЛНЕНИЕ ЧЕКБОКСАМИ УСЛУГ
// ============================================
function fillServicesCheckboxes(services) {
    allServices = services;
    const container = document.querySelector('#services-checkboxs-container')
    if (!container) return

    container.innerHTML = ''

    // Для каждой услуги создаём чекбокс
    services.forEach(service => {
        const item = document.createElement('label')
        item.className = 'checkbox-item'
        item.innerHTML = `
            <input type="checkbox" name="services[]" value="${service.id}" data-id="${service.id}" data-title="${service.title}">
            <div>
                <div class="checkbox-item-label">${service.title}</div>
                <div class="checkbox-item-info">${service.price} руб.</div>
            </div>
        `
        container.appendChild(item)

        // При изменении чекбокса обновляем пары и проверяем валидацию
        const checkbox = item.querySelector('input[type="checkbox"]')
        checkbox.addEventListener('change', function() {
            updateServiceMasterPairs()
            validateField('services-select')
        })
    })
}

// ============================================
// ПОЛУЧЕНИЕ МАСТЕРОВ ДЛЯ КОНКРЕТНОЙ УСЛУГИ
// Загружает мастеров из промежуточной таблицы service_masters
// ============================================
async function fetchMastersForService(serviceId) {
    let url = `http://localhost/myserver/get.php?action=get_masters_for_service&service_id=${serviceId}`

    try {
        let response = await fetch(url, {
            method: 'GET',
            headers: { Accept: 'application/json' },
        })
        let masters = await response.json()
        return Array.isArray(masters) ? masters : []
    } catch (error) {
        console.error('Ошибка загрузки мастеров для услуги:', error)
        return []
    }
}

// ============================================
// ЗАПОЛНЕНИЕ МАСТЕРОВ (для внутреннего использования)
// ============================================
function fillMastersData(masters) {
    allMasters = masters;
}

// ============================================
// ПОИСК МАСТЕРОВ ПО СПЕЦИАЛИЗАЦИИ
// Загружает мастеров из промежуточной таблицы service_masters
// ============================================
async function findMastersForService(service) {
    // Загружаем мастеров из БД
    const masters = await fetchMastersForService(service.id)

    // Если нашли — возвращаем
    if (masters.length > 0) {
        return masters
    }

    // Если нет записей — возвращаем всех мастеров
    console.warn(`Для услуги "${service.title}" нет мастеров в service_masters. Показаны все мастера.`)
    return allMasters
}

// ============================================
// ОБНОВЛЕНИЕ ПАР УСЛУГА-МАСТЕР
// Вызывается при изменении выбранных услуг
// ============================================
async function updateServiceMasterPairs() {
    const pairsContainer = document.querySelector('#service-master-pairs')
    const assignmentBlock = document.querySelector('#service-master-assignment')

    if (!pairsContainer || !assignmentBlock) return

    // Получаем все выбранные услуги
    const selectedCheckboxes = document.querySelectorAll('#services-checkboxs-container input[type="checkbox"]:checked')

    // Если ничего не выбрано — скрываем блок
    if (selectedCheckboxes.length === 0) {
        assignmentBlock.style.display = 'none'
        pairsContainer.innerHTML = ''
        selectedServiceMasterPairs = []
        return
    }

    // Показываем блок выбора мастеров
    assignmentBlock.style.display = 'block'
    pairsContainer.innerHTML = '<p style="text-align:center;color:#999;">Загрузка мастеров...</p>'
    selectedServiceMasterPairs = []
    pairsContainer.innerHTML = ''

    // Для каждой выбранной услуги создаём блок выбора мастера
    for (const checkbox of selectedCheckboxes) {
        const serviceId = checkbox.dataset.id
        const serviceTitle = checkbox.dataset.title

        // Находим объект услуги
        const service = allServices.find(s => s.id == serviceId)

        // Загружаем подходящих мастеров
        const suitableMasters = await findMastersForService(service)

        // Создаём блок выбора мастера
        const pairBlock = document.createElement('div')
        pairBlock.className = 'service-master-pair'
        pairBlock.dataset.serviceId = serviceId

        // Формируем опции для <select>
        let mastersOptions = '<option value="">-- Выберите мастера --</option>'
        if (suitableMasters.length > 0) {
            suitableMasters.forEach(master => {
                mastersOptions += `<option value="${master.id}" data-master-name="${master.name}">${master.name} (${master.specialization})</option>`
            })
        } else {
            // Если нет подходящих — показываем всех
            allMasters.forEach(master => {
                mastersOptions += `<option value="${master.id}" data-master-name="${master.name}">${master.name} (${master.specialization})</option>`
            })
        }

        // Вставляем HTML
        pairBlock.innerHTML = `
            <div class="service-master-row">
                <div class="service-name">
                    <strong>${serviceTitle}</strong>
                </div>
                <div class="master-select">
                    <select class="master-select-for-service" data-service-id="${serviceId}" data-service-name="${serviceTitle}" required>
                        ${mastersOptions}
                    </select>
                </div>
            </div>
        `

        pairsContainer.appendChild(pairBlock)

        // При изменении выбора обновляем пары и проверяем валидацию
        const masterSelect = pairBlock.querySelector('.master-select-for-service')
        masterSelect.addEventListener('change', function() {
            updateSelectedPairs()
            validateField('service-master')
        })
    }
}

// ============================================
// ОБНОВЛЕНИЕ ВЫБРАННЫХ ПАР
// Собирает все выбранные пары услуга-мастер
// ============================================
function updateSelectedPairs() {
    selectedServiceMasterPairs = []

    const pairBlocks = document.querySelectorAll('.service-master-pair')
    pairBlocks.forEach(block => {
        const serviceId = block.dataset.serviceId
        const masterSelect = block.querySelector('.master-select-for-service')

        // Если мастер выбран — добавляем пару в массив
        if (masterSelect && masterSelect.value) {
            const selectedOption = masterSelect.options[masterSelect.selectedIndex]
            selectedServiceMasterPairs.push({
                service_id: serviceId,
                service_name: masterSelect.dataset.serviceName,
                master_id: masterSelect.value,
                master_name: selectedOption.dataset.masterName
            })
        }
    })
}

// ============================================
// ПОЛУЧЕНИЕ ИМЕНИ И ТЕЛЕФОНА ПОЛЬЗОВАТЕЛЯ
// ============================================
async function fetchUserInfo() {
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
// ОТОБРАЖЕНИЕ ИНФОРМАЦИИ О ПОЛЬЗОВАТЕЛЕ
// ============================================
async function displayUserInfo() {
    const userInfoDisplay = document.querySelector('#userInfoDisplay')
    const userInfoName = document.querySelector('#userInfoName')
    const userInfoPhone = document.querySelector('#userInfoPhone')

    if (!userInfoDisplay) return

    const userData = await fetchUserInfo()

    // Если данные получены — показываем блок
    if (userData && (userData.name || userData.phone)) {
        userInfoDisplay.style.display = 'block'
        if (userInfoName) userInfoName.textContent = userData.name || 'Не указано'
        if (userInfoPhone) userInfoPhone.textContent = userData.phone || 'Не указан'
    }
}

// ============================================
// ПРОВЕРКА ПЕРЕД ЗАПИСЬЮ
// ============================================
function checkAppointmentAuth() {
    if (!isLoggedIn()) {
        alert('Для записи на услугу необходимо войти в систему или зарегистрироваться.')
        window.location.href = 'login.html'
        return false
    }
    return true
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ ФОРМЫ ЗАПИСИ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    if (!checkAppointmentAuth()) return

    // Загрузка услуг и мастеров
    fetchAppointmentServices()
    fetchAppointmentMasters()

    // Отображение информации о пользователе
    displayUserInfo()

    // Валидация и отправка формы
    const appointmentForm = document.querySelector('#appointment-form')
    if (appointmentForm) {
        attachValidationHandlers([
            'appointment-date',
            'appointment-time',
            'appointment-sessions',
            'payment',
            'appointment-agreement'
        ])

        // Проверка заполнения при изменении услуг
        document.querySelectorAll('#services-checkboxs-container input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', function() {
                validateField('services-select')
            })
        })

        // Обработчик отправки формы
        appointmentForm.addEventListener('submit', function(event) {
            event.preventDefault()

            // Список полей для валидации
            const fields = [
                'services-select',
                'appointment-date',
                'appointment-time',
                'appointment-sessions',
                'payment',
                'appointment-agreement'
            ]
            let hasErrors = false

            // Проверяем каждое поле
            fields.forEach(function(fieldId) {
                if (!validateField(fieldId)) {
                    hasErrors = true
                }
            })

            // Проверяем, что для всех услуг выбраны мастера
            updateSelectedPairs()
            const selectedCheckboxes = document.querySelectorAll('#services-checkboxs-container input[type="checkbox"]:checked')
            if (selectedServiceMasterPairs.length !== selectedCheckboxes.length) {
                hasErrors = true
                const errorEl = document.querySelector('#service-master-error')
                if (errorEl) errorEl.textContent = 'Пожалуйста, выберите мастера для каждой услуги'
            } else {
                const errorEl = document.querySelector('#service-master-error')
                if (errorEl) errorEl.textContent = ''
            }

            if (hasErrors) return

            // Собираем данные и отправляем
            const username = localStorage.getItem('username')
            const name = localStorage.getItem('name')
            const phone = localStorage.getItem('phone')
            const date = document.querySelector('#appointment-date').value
            const time = document.querySelector('#appointment-time').value

            console.log('Отправка записи:', { username, name, phone, serviceMasterPairs: selectedServiceMasterPairs, date, time })
            submitAppointment(username, name, phone, selectedServiceMasterPairs, date, time)
        })
    }

    // Закрытие модальных окон по кнопке
    document.querySelectorAll('.modal-close-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            this.closest('.modal-overlay').classList.remove('active')
        })
    })

    // Закрытие модальных окон по клику на фон
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.classList.remove('active')
        })
    })
})

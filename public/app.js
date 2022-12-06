const saveButton = document.getElementById('save_task')
const taskStorage = document.getElementById('task')
const logoutButton = document.getElementById('logout')
const changePasswordButton = document.getElementById('change_pass')

window.addEventListener("load", renderUserTasks);
saveButton.addEventListener('click', createTask)
logoutButton.addEventListener('click', logOut)
changePasswordButton.addEventListener('click', changePassword)

function createTaskContainer(taskStorage, text) {
    const taskContainer = document.createElement('div')
    taskContainer.className = 'task_container'
    const taskElement = document.createElement('div')
    taskElement.className = 'task_element'
    taskElement.innerHTML = text
    const deleteButton = document.createElement('button')
    deleteButton.className = 'delete_button'
    deleteButton.textContent = 'x'
    taskContainer.append(taskElement)
    taskContainer.append(deleteButton)
    taskStorage.append(taskContainer)
}
function createTask(event) {
    event.preventDefault()
    const taskValue = document.getElementById('task_value')
    const taskText = taskValue.value

    createTaskContainer(taskStorage, taskText)

}
async function renderUserTasks() {
    const token = getCookie('token')
    console.log(token)
    const response =  await fetch('/auth/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
            'Authorization':'Bearer '+ token}
    })
    let user = await response.json()
    const currentAuthorizedUser = user.username
    const currentAuthorizedUserTasks = user.tasks
    currentAuthorizedUserTasks.forEach(el => {
        createTaskContainer(taskStorage, el)
    })
    console.log(currentAuthorizedUserTasks)
    console.log(currentAuthorizedUser)
    return currentAuthorizedUser
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function changePassword() {
    console.log('log from change pass')
    const changePassPopup = document.getElementById('popup')
    const changePassField = document.querySelector('.popup_text')
    const agreeToChange = document.getElementById('agree')
    const disagreeToChange = document.getElementById('disagree')
    changePassPopup.style.visibility = "visible"
    changePassPopup.style.opacity = "1"
    agreeToChange.addEventListener('click', ()=> {
        const newPassInput = document.createElement('input')
        console.log('Hi!')
        newPassInput.setAttribute('type','text')
        const confirmButton = document.createElement('button')
        confirmButton.textContent = 'Confirm'
        changePassField.append(newPassInput)
        changePassField.append(confirmButton)
        confirmButton.addEventListener('click', saveNewPassword)
        async function saveNewPassword() {
            const token = getCookie('token')
            const newPass = newPassInput.value
            const data = {"password":newPass}
            const json = JSON.stringify(data)
            const response =  await fetch('/auth/user-password',
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: json
                })
            let user = await response.json()
            changePassPopup.style.visibility = "hidden"
            changePassPopup.style.opacity = "0"
        }

    })
    disagreeToChange.addEventListener('click', () => {
        changePassPopup.style.visibility = "hidden"
        changePassPopup.style.opacity = "0"
    })

}

function logOut() {
    document.cookie = 'token'+'=;Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT'
    setTimeout(()=> {
        window.location.href = '/authorization.html'
    }, 1000)

}
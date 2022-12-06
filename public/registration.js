const form = document.getElementById('contact')
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const passwordRepeatInput = document.getElementById('repeatPassword')
const passwordError = document.getElementById('error_message_password')
form.addEventListener('submit', register)

function getData(formNode) {
    const { elements } = formNode

    const data = new FormData()
    Array.from(elements)
        .filter((item) => !!item.name)
        .map((element) => {
            const { name, value } = element

            data.append(name.trim(), value.trim())
        })
    const object = {};
    data.forEach(function(value, key){
        object[key] = value;
    });
    const json = JSON.stringify(object)
    console.log(json)
    return json
}

async function sendData(data) {
    return await fetch('/auth/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
    })
}
async function register(event) {
    event.preventDefault()
    console.log('Отправка формы регистрации')
    if(passwordInput.value === passwordRepeatInput.value) {
        const data = getData(form)
        const response = await sendData(data)
        if (response.ok) {
            passwordError.textContent = 'Registration is successful'
            setTimeout(()=> {
                window.location.href = '/authorization.html'
            }, 2000)
        } else {
            console.log("Ошибка HTTP: " + response.status)
            if(response.status === 409) {
                passwordError.textContent = 'Пользователь с таким именем уже существует'
            }
            if(response.status === 400) {
                passwordError.textContent = 'Ошибка при регистрации: имя не может быть пустым'
            }
            if(response.status === 500) {
                passwordError.textContent = 'Registration error'
            }

        }



    } else {
        passwordError.textContent = 'The passwords must match!!'
    }


}


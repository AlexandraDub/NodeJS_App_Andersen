const loginForm = document.getElementById('loginForm')
const errorMessageContainer = document.getElementById('error_message')
loginForm.addEventListener('submit', loginToApp)
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
    return json
}
async function sendData(data) {
    return await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
    })
}
async function loginToApp(event) {
    event.preventDefault()
    const loginData = getData(loginForm)
    const response = await sendData(loginData)
    if (response.ok) {
        errorMessageContainer.textContent = 'Success!'
        setTimeout(()=> {
            window.location.href = '/index.html'
        }, 2000)
    } else {
        console.log("Ошибка HTTP: " + response.status)
        errorMessageContainer.textContent = 'Wrong name of customer or password!'
    }
}
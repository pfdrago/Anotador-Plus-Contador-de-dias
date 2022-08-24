let events = []

const nombre = document.querySelector("#nombre")
const fecha = document.querySelector("#fecha")
const buttonAdd = document.querySelector("#bAdd")

const json = load()

try {
    arr = JSON.parse(json)
} catch (error) {
    arr = []
}

events = arr ? [...arr] : []

renderEvents()

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault()
})


buttonAdd.addEventListener("click", (e) => {
    if (nombre.value === "" || fecha.value === "") {
        addEvent()
        Swal.fire({
        title: 'Error',
        text: 'Es necesario completar todos los campos',
        icon: 'error',
        confirmButtonText: 'Ok'
    })
        return
    }
    if (datediff(fecha.value) < 0) {
        return
    }
    addEvent()
    Swal.fire({
        title: 'Agregado!',
        text: 'Podes agregas mas contadores si necesitas',
        icon: 'success',
        confirmButtonText: 'Ok'
    })
})


function addEvent() {
    if (nombre.value === "" || fecha.value === "") {
        return
    }
    if (datediff(fecha.value) < 0) {
        return
    }

    const newEvent = {
        id: (Math.random() * 100).toString(36).slice(2),
        name: nombre.value,
        date: fecha.value,
    }

    events.unshift(newEvent)

    save(JSON.stringify(events))

    nombre.value = ""

    renderEvents()
}

function renderEvents() {
    const eventsHTML = events.map((event) => {
        return `
        <div class="task">
            <div class="days"><span class="days-number">${datediff(
              event.date
            )}</span><span class="days-text">días</span></div>
            <div class="event-name">${event.name}</div>
            <div class="event-date">${event.date}</div>
            <div class="actions"><button data-id="${
              event.id
            }" class="bDelete">Eliminar</button></div>
        </div>`
    })

    document.querySelector("#tasksContainer").innerHTML = eventsHTML.join("")

    document.querySelectorAll(".bDelete").forEach((button) => {
        button.addEventListener("click", (e) => {
            const id = button.getAttribute("data-id")
            events = events.filter((event) => event.id !== id)
            save()
            renderEvents()
        })
    })
}

function datediff(d) {
    var date1 = new Date(d)
    var date2 = new Date()
    var difference = date1.getTime() - date2.getTime()
    var days = Math.ceil(difference / (1000 * 3600 * 24))
    return days
}

function save(data) {
    localStorage.setItem("items", data)
}

function load() {
    return localStorage.getItem("items")
}

console.log(events)
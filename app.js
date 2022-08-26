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
        addEvent()
        Swal.fire({
        title: 'Error',
        text: 'La fecha no puede ser anteior a la actual',
        icon: 'error',
        confirmButtonText: 'Ok'
    })
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
            save(JSON.stringify(events))
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
    console.log(events)
}

function load() {
    return localStorage.getItem("items")
}

// API del tiempo
window.addEventListener("load", () => {
    let lon
    let lat

    let temperaturaValor = document.getElementById("temperatura-valor")
    let temperaturaDescripcion = document.getElementById("temperatura-descripcion")

    let ubicacion = document.getElementById("ubicacion")
    let iconoAnimado = document.getElementById("icono-animado")

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(posicion => {
            lon = posicion.coords.longitude
            lat = posicion.coords.latitude

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${"50760e86fb12ddc11ef581ebe3daa220"}`

            fetch(url)
            .then( response => { return response.json()})
            .then( data => {
                let temp = Math.round(data.main.temp)
                temperaturaValor.textContent = `${temp} °C`
                
                let desc = data.weather[0].description
                temperaturaDescripcion.textContent = desc.toUpperCase()

                ubicacion.textContent = data.name
                
                switch (data.weather[0].main) {
                    case 'Thunderstorm':
                      iconoAnimado.src='animated/thunder.svg'
                      console.log('TORMENTA')
                      break
                    case 'Drizzle':
                      iconoAnimado.src='animated/rainy-2.svg'
                      console.log('LLOVIZNA')
                      break
                    case 'Rain':
                      iconoAnimado.src='animated/rainy-7.svg'
                      console.log('LLUVIA')
                      break
                    case 'Snow':
                      iconoAnimado.src='animated/snowy-6.svg'
                        console.log('NIEVE')
                      break                        
                    case 'Clear':
                        iconoAnimado.src='animated/day.svg'
                        console.log('LIMPIO')
                      break
                    case 'Atmosphere':
                      iconoAnimado.src='animated/weather.svg'
                        console.log('ATMOSFERA')
                        break  
                    case 'Clouds':
                        iconoAnimado.src='animated/cloudy-day-1.svg'
                        console.log('NUBES')
                        break  
                    default:
                      iconoAnimado.src='animated/cloudy-day-1.svg'
                      console.log('por defecto')
                  }



            })
            .catch( error => {
                console.log(error)
            })
        })
    }
})
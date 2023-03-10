const cancha = document.getElementById("cancha");
const botonSuplente = document.getElementById("botonSuplente");
const suplente = document.getElementById("suplente")
const total = document.getElementById("total");

let jugadores = [];
let numeros = [];
const posiciones = ["arquero", "defensorDerecho", "defensorIzquierdo", "volanteCentral", "volanteDerecho", "volanteIzquierdo", "delantero"];

let suplentes = 0;
let valor = 0;

botonSuplente.addEventListener("click", () => {
    if(suplentes == 5){
        Swal.fire({
            title: "Alcanzaste el limite de suplentes",
            icon: "warning"
        })
    }else{
        agregarJugador("suplente", "suplente");
    }
})

if(localStorage.getItem("jugadores")) jugadores = JSON.parse(localStorage.getItem("jugadores"));
if(localStorage.getItem("numeros")) numeros = JSON.parse(localStorage.getItem("numeros"));
if(localStorage.getItem("valor")) valor = localStorage.getItem("valor");

class Jugador{
    constructor(nombre, apellido, numero, posicion, condicion){
        this.nombre = nombre;
        this.apellido = apellido;
        this.numero = numero;
        this.posicion = posicion;
        this.condicion = condicion;
    }
}

const crearCancha = () => {
    cancha.innerHTML = "";

    posiciones.forEach(posicion => {
        const div = document.createElement("div");
        div.setAttribute("id", posicion);
        div.innerHTML = `
                    <button id = "boton${posicion}" class = "botonJugador"><img src = "./img/camiseta.png"></button>
                    `
        cancha.appendChild(div);

        const boton = document.getElementById(`boton${posicion}`);
        boton.addEventListener("click", () => {
            agregarJugador(posicion, "titular");
        })
    })

    imprimirJugadores();
}


const botonEliminarEquipo = document.getElementById("eliminarEquipo");
botonEliminarEquipo.addEventListener("click", () => {
    eliminarEquipo();
    Toastify({
      text: "Equipo Eliminado",
      duration: 2500,
      gravity: "top",
      position: "right",
      style: {
          background: "radial-gradient(circle at 81.9% 53.5%, rgb(173, 53, 53) 16.3%, rgb(240, 60, 60) 100.2%)",
      }
  }).showToast()
})

const eliminarEquipo = () => {
    jugadores = [];
    numeros = [];
    valor = 0;
    localStorage.clear();
    crearCancha();
}

const agregarJugador = (posicion, condicion) => {
    Swal.fire({
        html:`
            <label for = "nombre">Nombre</label>
            <input type = "text" id = "nombre" class = "swal2-input">

            <label for = "apellido">Apellido</label>
            <input type = "text" id = "apellido" class = "swal2-input">

            <label for = "numero">Numero</label>
            <input type = "number" id = "numero" class = "swal2-input">
        `,
        confirmButtonText: "Enviar",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {   
            const nombre = document.getElementById("nombre");
            const apellido = document.getElementById("apellido");
            const numero = document.getElementById("numero");

            enviarJugador(nombre, apellido, numero, posicion, condicion);
        }
    })
}

const enviarJugador = (nombre, apellido, numero, posicion, condicion) => {
    const numeroInt = parseInt(numero.value);

    const jugador = new Jugador(nombre.value, apellido.value, numeroInt, posicion, condicion);

    if(nombre.value == "" || apellido.value == "" || isNaN(numeroInt)){
        Swal.fire({
            title: "No se ingresaron todos los datos",
            icon: "warning"
        })
    }else if(numeros.indexOf(numeroInt) != -1){
        Swal.fire({
            title: "Numero repetido",
            icon: "warning"
        })
    }else{
        posicion == "suplente" && suplentes++;
        
        valor++;
        localStorage.setItem("valor", valor);

        numeros.push(numeroInt);
        localStorage.setItem("numeros", JSON.stringify(numeros));

        jugadores.push(jugador);
        localStorage.setItem("jugadores", JSON.stringify(jugadores));


        Toastify({
            text: "Juagador Agregado",
            duration: 2500,
            gravity: "top",
            position: "right",
            style: {
                background: "radial-gradient(circle at -1% 57.5%, rgb(19, 170, 82) 0%, rgb(0, 102, 43) 90%)",
            }
        }).showToast()
        
        imprimirJugadores();
    }
}

function imprimirJugadores(){
    suplente.innerHTML = "";

    jugadores.forEach(jugador => {
        const card = document.createElement("div");
        card.classList.add("jugador");
        card.innerHTML = `
                            <div>
                            <img src = "./img/camiseta.png">
                                <div class = "info-jugador">
                                    <p>${jugador.numero}. ${jugador.nombre} ${jugador.apellido}</p>
                                </div>
                                <div class = "botones">
                                    <button id = "eliminar${jugador.numero}" class = "btn btn-danger">Eliminar</button>
                                </div>
                            </div>
                            `
        
        if(jugador.posicion == "suplente"){
            const posicion = document.getElementById(jugador.posicion);
            posicion.appendChild(card);
        }else{
            const posicion = document.getElementById(jugador.posicion);
            posicion.innerHTML = "";
            posicion.appendChild(card);
        }

        
        const botonEliminarJugador = document.getElementById(`eliminar${jugador.numero}`);
        botonEliminarJugador.addEventListener("click", () => {
            eliminarJugador(jugador.numero);
            Toastify({
                text: "Jugador Eliminado",
                duration: 2500,
                gravity: "top",
                position: "right",
                style: {
                    background: "radial-gradient(circle at 81.9% 53.5%, rgb(173, 53, 53) 16.3%, rgb(240, 60, 60) 100.2%)",
                }
            }).showToast()
        })
    })

    calcularTotal();
}

const eliminarJugador = (numeroBuscado) => {
    const jugadorBuscado = jugadores.find(jugador => jugador.numero === numeroBuscado);
    
    const indiceJugador = jugadores.indexOf(jugadorBuscado);
    const indiceNumero = numeros.indexOf(jugadorBuscado.numero);

    valor--;
    localStorage.setItem("valor", JSON.stringify(valor));

    
    numeros.splice(indiceNumero, 1);
    localStorage.setItem("numeros", JSON.stringify(numeros));
    jugadores.splice(indiceJugador, 1);
    localStorage.setItem("jugadores", JSON.stringify(jugadores));

    crearCancha();
}

const calcularTotal = () => {
    const criptoYa = "https://criptoya.com/api/dolar";
    fetch(criptoYa)
        .then(response => response.json())
        .then(({blue, ccb, ccl, mep, oficial, solidario}) => {
            total.innerHTML = `
                                    <h2>El valor total del equipo es de: </h2>
                                    <p>Dolar Oficial: ${valor * oficial}</p>
                                    <p>Dolar Solidario: ${valor * solidario}</p>
                                    <p>Dolar MEP: ${valor * mep}</p>
                                    <p>Dolar CCL: ${valor *ccl}</p>
                                    <p>Dolar CCB: ${valor * ccb}</p>
                                    <p>Dolar Blue: ${valor * blue}</p>
                                `
        })
        .catch(error => console.log(error));
}

crearCancha();
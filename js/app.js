const criptomonedasSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const monedaSelect = document.querySelector('#moneda');

const objBusqueda = {
    moneda : '',
    criptomoneda : ''
}
const obtenerCriptomonedas = criptomonedas => new Promise (resolve => {
    resolve(criptomonedas);

});
document.addEventListener('DOMContentLoaded', () => {
    consultarCriptmonedas();
    formulario.addEventListener('submit', submitFormulaio);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
    
});

function consultarCriptmonedas(){

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=50&tsym=USD';

    mostrarspiner();

    fetch(url)
    .then (respuesta => respuesta.json())
    .then (resultado => obtenerCriptomonedas(resultado.Data))
    .then (criptomonedas => selectCritomonedas(criptomonedas))
};

function selectCritomonedas(criptomonedas){

        criptomonedas.forEach(cripto => {
            const { FullName, Name } = cripto.CoinInfo;

            const option = document.createElement('option');
            option.value = Name;
            option.textContent = FullName;

            criptomonedasSelect.appendChild(option);
            
        });
};

function leerValor (e){
    objBusqueda [ e.target.name ]= e.target.value;
    

}

function submitFormulaio(e) {
    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;
    
    if ( moneda ==='' || criptomoneda ==='' ) {
        mostrarAlerta('ambos campos son obligatorios')
        return;
        
    }
    conultarApi();
};
//consular la api con losresultados


function mostrarAlerta (mensaje){

    const exsteError = document.querySelector('.error');

    if(!exsteError){

        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error')

    //Mensaje error
        divMensaje.textContent = mensaje;
    
        formulario.appendChild(divMensaje);
    
    
    setTimeout(() =>{
        divMensaje.remove();
    }, 3000);
    }
  
};

function conultarApi (){
    const { moneda, criptomoneda }= objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    fetch(url)
        .then(respuesta => respuesta.json())
        .then (cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacionHTML(cotizacion){

    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE }= cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio mas alto del dia <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio mas Bajo del dia <span>${LOWDAY}</span>`;

    const ultimaHora = document.createElement('p');
    ultimaHora.innerHTML = `<p>Variación ultimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacon = document.createElement('p');
    ultimaActualizacon.innerHTML = `<p>Ultima actualización fue <span>${LASTUPDATE}</span>`;


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimaHora);
    resultado.appendChild(ultimaActualizacon);

}   

function limpiarHTML (){
    while(resultado.firstChild){ 

        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarspiner(){
    limpiarHTML();

    const spinner = document.createElement('div');

    spinner.classList.add('spinner')

    spinner.innerHTML= `
    <div class="sk-chase">
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
  <div class="sk-chase-dot"></div>
 </div>
`;

    resultado.appendChild(spinner);
}
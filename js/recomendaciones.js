const matrizInput = document.querySelector('#matriz-input');
const metrica = document.querySelector('#metrica');
const prediccion = document.querySelector('#prediccion');
const vecinos = document.querySelector('#vecinos');
const resultado = document.querySelector('#resultado');

let matriz = [];
let matriz_resultado = [];
let matriz_similitud = [];
let pos_cal = [];




function cargarMatriz() {

    pos_cal = [];
    matriz = matrizInput.value.split("\n");
    for (const i in matriz) {
        matriz[i] = matriz[i].split(/[' ']/g);;
    }
    for (let i = 0; i < matriz.length; i++) {
        if (matriz[i][0] !== "" && matriz[i][0] !== " ") {
            for (let j = 0; j < matriz[i].length; j++) {
                if (matriz[i][j] == "") {
                    matriz[i].pop(matriz[i][j]);
                }
            }
        } else {
            matriz.pop(matriz[i]);
            i--;
        }
    }

    matriz_similitud = Array(matriz.length).fill().map(() => Array(matriz.length));

    for (let i = 0; i < matriz_similitud.length; i++) {
        for (let j = 0; j < matriz_similitud[i].length; j++) {
            matriz_similitud[i][j] = 0;
        }
    }

    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j] == '-') {
                const coord = { persona: i, item: j }
                pos_cal.push(coord);
            }
        }
    }

    console.log('Matriz cargada : \n');
    console.log(matriz);
    console.log('Matriz similitud : \n');
    console.log(matriz_similitud);
    console.log('vector calculos : \n');
    console.log(pos_cal);
}

function calcularMatriz() {

    cargarMatriz();

    switch (metrica.value) {
        case 'pearson':

            for (let i = 0; i < matriz_similitud.length; i++) {
                for (let j = 0; j < matriz_similitud[i].length; j++) {
                    if (!isNaN(pearson(matriz[i], matriz[j]))) {
                        const valor = { persona: j, valor: pearson(matriz[i], matriz[j]) }
                        matriz_similitud[i][j] = valor
                    } else {
                        const valor = { persona: j, valor: pearson(matriz[j], matriz[i]) }
                        matriz_similitud[i][j] = valor
                    }
                }
            }

            break;

        case 'coseno':

            for (let i = 0; i < matriz_similitud.length; i++) {
                for (let j = 0; j < matriz_similitud[i].length; j++) {
                    if (!isNaN(coseno(matriz[i], matriz[j]))) {
                        const valor = { persona: j, valor: coseno(matriz[i], matriz[j]) }
                        matriz_similitud[i][j] = valor
                    } else {
                        const valor = { persona: j, valor: coseno(matriz[j], matriz[i]) }
                        matriz_similitud[i][j] = valor
                    }
                }
            }

            break;

        case 'euclidea':

            for (let i = 0; i < matriz_similitud.length; i++) {
                for (let j = 0; j < matriz_similitud[i].length; j++) {
                    if (!isNaN(euclidea(matriz[i], matriz[j]))) {
                        const valor = { persona: j, valor: euclidea(matriz[i], matriz[j]) }
                        matriz_similitud[i][j] = valor
                    } else {
                        const valor = { persona: j, valor: euclidea(matriz[j], matriz[i]) }
                        matriz_similitud[i][j] = valor
                    }
                }
            }

            break;

        default:
            break;
    }

    switch (prediccion.value) {
        case 'simple':
            preSimple(vecinos.value);
            break;

        case 'media':

            preMedia(vecinos.value);

            break;

        default:
            break;
    }

    resetearResultado();
    mostrarResultado();
}

function promedioMetrica(usuarioPro, usuarioRef) {
    let sum = 0;
    let cont = 0;
    for (let i = 0; i < usuarioPro.length; i++) {
        if (usuarioPro[i] != '-' && usuarioRef[i] != '-') {
            sum += parseInt(usuarioPro[i])
            cont++;
        }
    }

    return sum / cont;
}

function pearson(usuarioA, usuarioB) {

    let num = 0;
    let den = 0;
    let den_der = 0;
    let den_izq = 0

    for (let i = 0; i < usuarioA.length; i++) {
        if ((usuarioA[i] != '-') && (usuarioB[i] != '-')) {
            num += ((usuarioA[i] - promedioMetrica(usuarioA, usuarioB)) * (usuarioB[i] - promedioMetrica(usuarioB, usuarioA)))
        }
    }

    for (let i = 0; i < usuarioA.length; i++) {
        if ((usuarioA[i] != '-') && (usuarioB[i] != '-')) {
            den_der += (Math.pow((usuarioA[i] - promedioMetrica(usuarioA, usuarioB)), 2));
            den_izq += (Math.pow((usuarioB[i] - promedioMetrica(usuarioB, usuarioA)), 2));
        }
        den = ((Math.sqrt(den_der)) * (Math.sqrt(den_izq)))
    }

    return (num / den).toFixed(2);
}

function coseno(usuarioA, usuarioB) {

    let num = 0;
    let den = 0;
    let den_der = 0;
    let den_izq = 0

    for (let i = 0; i < usuarioA.length; i++) {
        if ((usuarioA[i] != '-') && (usuarioB[i] != '-')) {
            num += ((usuarioA[i]) * (usuarioB[i]))
        }
    }

    for (let i = 0; i < usuarioA.length; i++) {
        if ((usuarioA[i] != '-') && (usuarioB[i] != '-')) {
            den_der += (Math.pow((usuarioA[i]), 2));
            den_izq += (Math.pow((usuarioB[i]), 2));
        }
        den = ((Math.sqrt(den_der)) * (Math.sqrt(den_izq)))
    }

    return (num / den).toFixed(2);

}

function euclidea(usuarioA, usuarioB) {

    let num = 0;
    let res = 0;

    for (let i = 0; i < usuarioA.length; i++) {
        if ((usuarioA[i] != '-') && (usuarioB[i] != '-')) {
            num += (Math.pow((usuarioA[i]) - (usuarioB[i]), 2))
        }
        res = Math.sqrt(num)
    }

    return (res).toFixed(2);

}

function promedio(usuario) {
    let total = 0;
    let cont = 0;
    for (let i = 0; i <= usuario.length; i++) {
        if (parseInt(usuario[i]) || usuario[i] == 0) {
            total += parseInt(usuario[i]);
            cont++;
        }
    }
    return (total / cont);
}

function vecinosCercanos(persona) {
    let orden;
    if(metrica.value != "euclidea") {
        orden = [...persona].sort((a, b) => {
            return b.valor - a.valor
        });

    } else {
        orden = [...persona].sort((a, b) => {
            return a.valor - b.valor
        });
    }

    return orden
}

function preMedia(numero_vecinos) {



    matriz_resultado = matriz.map(function (arr) {
        return arr.slice();
    });

    for (let i = 0; i < pos_cal.length; i++) {

        console.log(matriz_resultado);

        let num = 0;
        let den = 0;
        let predic = 0;
        let vecinos_cercanos = vecinosCercanos(matriz_similitud[pos_cal[i].persona]);

        vecinos_cercanos = vecinos_cercanos.filter(a => a.persona != pos_cal[i].persona)



        console.log("Vecinos cercanos a la persona : " + pos_cal[i].persona);
        console.log(vecinos_cercanos);

        for (let j = 0; j < numero_vecinos; j++) {
            let condition;
            console.log("numerador antes = " + num);
            if ((matriz[vecinos_cercanos[j].persona][pos_cal[i].item]) == '-') {
                condition = 0
            } else {
                condition = (matriz[vecinos_cercanos[j].persona][pos_cal[i].item])
            }
            num += ((matriz_similitud[vecinos_cercanos[j].persona][pos_cal[i].persona].valor) * (condition - promedio(matriz[vecinos_cercanos[j].persona])));
            console.log(`matriz_similitud[${vecinos_cercanos[j].persona}][${pos_cal[i].persona}].valor = ${(matriz_similitud[pos_cal[i].persona][vecinos_cercanos[j].persona].valor)}`)
            console.log(`num = ${(matriz_similitud[vecinos_cercanos[j].persona][pos_cal[i].persona].valor)} x (${condition} - ${promedio(matriz[vecinos_cercanos[j].persona])})`);
            console.log("numerador ahora = " + num);
        }

        console.log("Numerador = " + num);

        for (let j = 0; j < numero_vecinos; j++) {
            den += parseFloat((matriz_similitud[vecinos_cercanos[j].persona][pos_cal[i].persona].valor));
            console.log(`matriz_similitud[${vecinos_cercanos[j].persona}][${pos_cal[i].persona}].valor = ${(matriz_similitud[pos_cal[i].persona][vecinos_cercanos[j].persona].valor)}`)
            console.log(`den = ${matriz_similitud[vecinos_cercanos[j].persona][pos_cal[i].persona].valor}`);
        }


        predic = (promedio(matriz[pos_cal[i].persona]) + (num / den)).toFixed(2);

        predic = predic < 0 ? 0 : predic;
        predic = predic > 5 ? 5 : predic;


        // if(isNaN(predic)){
        //     predic = promedio(matriz[pos_cal[i].persona]);
        // }

        console.log("Denominador = " + den);
        console.log("Promedio = " + promedio(matriz[pos_cal[i].persona]));
        console.log("Resultado = " + predic);

        matriz_resultado[pos_cal[i].persona][pos_cal[i].item] = predic;
    }

}

function preSimple(numero_vecinos) {

    matriz_resultado = matriz.map(function (arr) {
        return arr.slice();
    });

    for (let i = 0; i < pos_cal.length; i++) {

        console.log(matriz_resultado);

        let num = 0;
        let den = 0;
        let predic = 0;
        let vecinos_cercanos = vecinosCercanos(matriz_similitud[pos_cal[i].persona]);

        vecinos_cercanos = vecinos_cercanos.filter(a => a.persona != pos_cal[i].persona)


        console.log("Vecinos cercanos a la persona : " + pos_cal[i].persona);
        console.log(vecinos_cercanos);

        for (let j = 0; j < numero_vecinos; j++) {

            let condition;
            console.log("numerador antes = " + num);
            if ((matriz[vecinos_cercanos[j].persona][pos_cal[i].item]) == '-') {
                condition = 0
            } else {
                condition = (matriz[vecinos_cercanos[j].persona][pos_cal[i].item])
            }
            num += ((matriz_similitud[vecinos_cercanos[j].persona][pos_cal[i].persona].valor) * (condition));
            console.log(`matriz_similitud[${vecinos_cercanos[j].persona}][${pos_cal[i].persona}].valor = ${(matriz_similitud[pos_cal[i].persona][vecinos_cercanos[j].persona].valor)}`)
            console.log(`num = ${(matriz_similitud[vecinos_cercanos[j].persona][pos_cal[i].persona].valor)} x (${condition})`);
            console.log("numerador ahora = " + num);
        }


        for (let j = 0; j < numero_vecinos; j++) {
            den += parseFloat((matriz_similitud[vecinos_cercanos[j].persona][pos_cal[i].persona].valor));
            console.log(`matriz_similitud[${vecinos_cercanos[j].persona}][${pos_cal[i].persona}].valor = ${(matriz_similitud[pos_cal[i].persona][vecinos_cercanos[j].persona].valor)}`)
            console.log(`den = ${matriz_similitud[vecinos_cercanos[j].persona][pos_cal[i].persona].valor}`);
        }

        console.log("Numerador = " + num);
        console.log("Denominador = " + den);

        predic = ((num / den)).toFixed(2);

        console.log("Resultado antes de fix = " + predic);
        predic = predic < 0 ? 0 : predic;
        predic = predic > 5 ? 5 : predic;
        console.log("Resultado despues de fix = " + predic);


        // if(isNaN(predic)){
        //     predic = promedio(matriz[pos_cal[i].persona]);
        // }

        matriz_resultado[pos_cal[i].persona][pos_cal[i].item] = predic;
    }

}

function mostrarResultado() {

    resultado.innerHTML = `
    <hr>
    <h5>Prediccion de matriz</h5>
    <div class="mb-3 mt-3 container" id="matriz-output">
    </div>
    <h5>Detalles</h5>
    <div class="mb-3 mt-3 container" id="detalles">
    </div>
    `

    const matrizOutput = document.querySelector('#matriz-output');
    const detalles = document.querySelector('#detalles');

    const divTablaMR = document.createElement('div');
    divTablaMR.className = 'table-responsive'

    const tablaMR = document.createElement('table');
    tablaMR.className = 'table table-bordered'
    divTablaMR.appendChild(tablaMR);

    const theadMR = document.createElement('thead');
    tablaMR.appendChild(theadMR);

    const trhMR = document.createElement('tr');
    theadMR.appendChild(trhMR);

    const thMR = document.createElement('th')
    thMR.innerText = '#'
    trhMR.appendChild(thMR);

    for (let i = 0; i < matriz_resultado[0].length; i++) {
        const th = document.createElement('th')
        th.innerText = 'Item ' + i
        trhMR.appendChild(th);
    }

    const tbodyMR = document.createElement('tbody');
    for (let i = 0; i < matriz_resultado.length; i++) {

        const trb = document.createElement('tr');
        const th = document.createElement('th');
        th.innerText = 'Persona ' + i
        trb.appendChild(th);

        for (let j = 0; j < matriz_resultado[i].length; j++) {
            const td = document.createElement('td');
            td.innerText = matriz_resultado[i][j]
            trb.appendChild(td);
        }

        tbodyMR.appendChild(trb);
    }

    tablaMR.appendChild(tbodyMR);
    matrizOutput.appendChild(divTablaMR);


    // for (let i = 0; i < matriz.length; i++) {
    //     for (let j = 0; j < matriz[i].length; j++) {
    //         matrizOutput.textContent += matriz[i][j] + " "
    //     }
    //     matrizOutput.textContent += '\n'
    // }

    const h5Similitud = document.createElement('h5')
    h5Similitud.innerText = 'Matriz de similitud con ' + metrica.value;
    detalles.appendChild(h5Similitud);

    const divTabla = document.createElement('div');
    divTabla.className = 'table-responsive'

    const tabla = document.createElement('table');
    tabla.className = 'table table-bordered'
    divTabla.appendChild(tabla);

    const thead = document.createElement('thead');
    tabla.appendChild(thead);

    const trh = document.createElement('tr');
    thead.appendChild(trh);

    const th = document.createElement('th')
    th.innerText = '#'
    trh.appendChild(th);

    for (let i = 0; i < matriz_similitud.length; i++) {
        const th = document.createElement('th')
        th.innerText = 'Persona ' + i
        trh.appendChild(th);
    }

    const tbody = document.createElement('tbody');
    for (let i = 0; i < matriz_similitud.length; i++) {

        const trb = document.createElement('tr');
        const th = document.createElement('th');
        th.innerText = 'Persona ' + i
        trb.appendChild(th);

        for (let j = 0; j < matriz_similitud[i].length; j++) {
            const td = document.createElement('td');
            td.innerText = matriz_similitud[i][j].valor
            trb.appendChild(td);
        }

        tbody.appendChild(trb);
    }

    tabla.appendChild(tbody);
    detalles.appendChild(divTabla);

    const h5Vecinos = document.createElement('h5');

    const divVecinos = document.createElement('div');
    divVecinos.className = "container"
    divVecinos.id = "vecinos"

    h5Vecinos.innerText = 'Vecinos utilizados :';
    divVecinos.appendChild(h5Vecinos);
    detalles.appendChild(divVecinos);

    let persona_actual = -1;
    for (let i = 0; i < pos_cal.length; i++) {
        if (pos_cal[i].persona != persona_actual) {
            persona_actual = pos_cal[i].persona
            const h4 = document.createElement('h4');
            h4.innerText = "Persona " + persona_actual;
            detalles.appendChild(h4);
            let vecinos_cercanos = vecinosCercanos(matriz_similitud[pos_cal[i].persona]);
            vecinos_cercanos = vecinos_cercanos.filter(a => a.persona != pos_cal[i].persona)

            for (let j = 0; j < vecinos.value; j++) {
                const ppersona = document.createElement('p');
                ppersona.innerText = "Vecino " + vecinos_cercanos[j].persona + " con similitud de : " + vecinos_cercanos[j].valor ;
                detalles.appendChild(ppersona);
            }
        }
    }

    
    const h5Calculo = document.createElement('h5');
    h5Calculo.innerText = "Calculos";
    detalles.appendChild(h5Calculo);

    for (let i = 0; i < pos_cal.length; i++) {
        const pOperacion = document.createElement('p')
        pOperacion.innerText = `r^(Persona ${pos_cal[i].persona}, item ${pos_cal[i].item}) = ${matriz_resultado[pos_cal[i].persona][pos_cal[i].item]}`
        detalles.appendChild(pOperacion);
    }
    

}

function resetearResultado() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}



//     i1 i2 i3 i4 i5
//usu1  5  3  4  4  -
//usu2  3  1  2  3  3 
//usu3  4  3  4  3  5
//usu4  3  3  1  5  4
//usu5  1  5  5  2  1


// 0: (5) [5, 3, 4, 4, '-'] 4
// 1: (5) [3, 1, 2, 3, 3] 2.4
// 2: (5) ['1.00', '-1.00', '0.00', '0.00', '-4.00']
// 3: (5) ['0.60', '-1.40', '-0.40', '0.60', '0.60']
// 4: (6) ['1.00', '1.00', '0.00', '0.00', '16.00', '18.00']
// 5: (6) ['0.36', '1.96', '0.16', '0.36', '0.36', '3.20']
// 6: (6) ['0.60', '1.40', '0.00', '0.00', '-2.40', '-0.40']

// 4 - - 0 2 - 3 - 0 - 
// - 4 4 1 1 3 0 - - 2  
// 2 5 1 2 1 5 5 5 2 0 
// 1 4 1 3 1 - 1 0 0 0 
// 0 3 4 0 0 5 5 4 5 -

// 2 - 1 5 2 4 5 4 - 3 
// - 2 4 0 2 3 - 0 2 2 
// - 4 2 - 5 5 4 4 3 2 
// 1 1 - - 0 - 0 4 0 - 
// 2 0 - 4 1 3 2 - 1 -
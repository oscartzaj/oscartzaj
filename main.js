/*
===============================================
           ARCHIVO JAVASCRIPT PRINCIPAL
===============================================
Este archivo contiene toda la funcionalidad JavaScript del sitio:
- Funciones de la calculadora matemática
- Validaciones y manejo de errores
===============================================
*/

// ============================================= 
//         FUNCIONES DE LA CALCULADORA
// ============================================= 

/**
 * FUNCIÓN: SUMAR
 * Realiza la suma de dos números ingresados por el usuario
 * - Obtiene los valores de los campos numero1 y numero2
 * - Valida que ambos sean números válidos
 * - Muestra el resultado o un mensaje de error
 */
function sumar() {
    // Obtener valores de los campos de entrada y convertir a números
    const numero1 = parseFloat(document.getElementById("numero1").value);
    const numero2 = parseFloat(document.getElementById("numero2").value);
    
    // Validación: verificar que ambos inputs contienen números válidos
    if (isNaN(numero1) || isNaN(numero2)) {
        document.getElementById("Resultado").textContent = "Error: Ingresa ambos números";
        return;
    }
    
    // Realizar la operación y mostrar el resultado
    const suma = numero1 + numero2;
    document.getElementById("Resultado").textContent = suma;
}

/**
 * FUNCIÓN: RESTAR
 * Realiza la resta de dos números (numero1 - numero2)
 * - Incluye las mismas validaciones que la función sumar
 */
function restar() {
    // Obtener valores de los campos de entrada
    const numero1 = parseFloat(document.getElementById("numero1").value);
    const numero2 = parseFloat(document.getElementById("numero2").value);
    
    // Validación de entrada
    if (isNaN(numero1) || isNaN(numero2)) {
        document.getElementById("Resultado").textContent = "Error: Ingresa ambos números";
        return;
    }
    
    // Realizar la operación y mostrar el resultado
    const resta = numero1 - numero2;
    document.getElementById("Resultado").textContent = resta;
}

/**
 * FUNCIÓN: MULTIPLICAR
 * Realiza la multiplicación de dos números
 * - Maneja la validación estándar de entrada de números
 */
function multiplicar() {
    // Obtener valores de los campos de entrada
    const numero1 = parseFloat(document.getElementById("numero1").value);
    const numero2 = parseFloat(document.getElementById("numero2").value);
    
    // Validación de entrada
    if (isNaN(numero1) || isNaN(numero2)) {
        document.getElementById("Resultado").textContent = "Error: Ingresa ambos números";
        return;
    }
    
    // Realizar la operación y mostrar el resultado
    const multiplicar = numero1 * numero2;
    document.getElementById("Resultado").textContent = multiplicar;
}

/**
 * FUNCIÓN: DIVIDIR
 * Realiza la división de dos números (numero1 ÷ numero2)
 * - Incluye validación adicional para evitar división por cero
 * - Maneja el caso especial de división por cero con mensaje de error
 */
function dividir() {
    // Obtener valores de los campos de entrada
    const numero1 = parseFloat(document.getElementById("numero1").value);
    const numero2 = parseFloat(document.getElementById("numero2").value);
    
    // Validación de entrada
    if (isNaN(numero1) || isNaN(numero2)) {
        document.getElementById("Resultado").textContent = "Error: Ingresa ambos números";
        return;
    }
    
    // Validación específica: evitar división por cero
    if (numero2 === 0) {
        document.getElementById("Resultado").textContent = "Error: División por cero";
        return;
    }
    
    // Realizar la operación y mostrar el resultado
    const division = numero1 / numero2;
    document.getElementById("Resultado").textContent = division;
}

// (Las funciones de operación están arriba: sumar, restar, multiplicar, dividir)

/**
 * limpiar()
 * Borra los valores de los inputs y el resultado, y resetea la operación seleccionada.
 */
function limpiar() {
    const n1 = document.getElementById("numero1");
    const n2 = document.getElementById("numero2");
    const res = document.getElementById("Resultado");

    if (n1) n1.value = "";
    if (n2) n2.value = "";
    if (res) res.textContent = "";

    // No hay operación seleccionada en esta versión simple
}
// Fin del archivo
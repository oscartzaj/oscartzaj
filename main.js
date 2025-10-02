function calcular(operacion) {
    const numero1 = parseFloat(document.getElementById("numero1").value);
    const numero2 = parseFloat(document.getElementById("numero2").value);
    let resultado;

    // Validar que ambos campos tienen números válidos
    if (isNaN(numero1) || isNaN(numero2)) {
        document.getElementById("resultado").textContent = "Por favor ingresa dos números válidos.";
        return;
    }

    switch (operacion) {
        case 'suma':
            resultado = numero1 + numero2;
            break;
        case 'resta':
            resultado = numero1 - numero2;
            break;
        case 'multiplicacion':
            resultado = numero1 * numero2;
            break;
        case 'division':
            if (numero2 === 0) {
                document.getElementById("resultado").textContent = "Error: División entre 0";
                return;
            }
            resultado = numero1 / numero2;
            break;
        default:
            resultado = "Operación no válida";
    }

    document.getElementById("resultado").textContent = "Resultado: " + resultado;
}


  
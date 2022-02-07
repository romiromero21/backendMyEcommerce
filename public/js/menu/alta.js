class FormularioAlta {
    inputs = null
    form = null
    button = null
    camposValidos = [false, false, false, false, false]
    regExpValidar = [
        /^.+$/, //regexp nombre
        /^.+$/, //regexp precio    
        /^[0-9]+$/, //regexp stock
        /^.+$/, //regexp categoria
        /^.+$/, //regexp detalles  
    ]

    /* --------------- drag and drop ------------------- */
    imagenSubida = ''
    dropArea = null
    progressBar = null
    /* ------------------------------------------------- */

    constructor(renderTablaAlta, guardarProducto) {
        this.inputs = document.querySelectorAll('main form input.data-validation')
        this.form = document.getElementById('form-alta')
        this.button = document.querySelector('main form button')

        this.button.disabled = true

        // console.log(inputs)
        this.inputs.forEach((input, index) => {
            if (input.type != 'checkbox') {
                input.addEventListener('input', () => {
                    this.validar(input.value, this.regExpValidar[index], index)
                    if (renderTablaAlta) renderTablaAlta(!this.algunCampoNoValido(), productoController.productos)
                })
            }
        })

        this.form.addEventListener('submit', e => {
            e.preventDefault()

            let producto = this.leerProductoIngresado()
            this.limpiarFormulario()

            if (guardarProducto) guardarProducto(producto)
        })

        /* --------------- drag and drop ------------------- */
        this.dropArea = document.getElementById('drop-area')
        this.progressBar = document.getElementById('progress-bar')

            //Para cancelar el evento automática de drag and drop
            ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, e => e.preventDefault())
                document.body.addEventListener(eventName, e => e.preventDefault())
            })

            //Para remarcar la zona de drop al arrastrar una imagen dentro de ella
            ;['dragenter', 'dragover'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, () => {
                    this.dropArea.classList.add('highlight')
                })
            })

            //Para desmarcar la zona de drop al abandonar la zona de drop
            ;['dragleave', 'drop'].forEach(eventName => {
                this.dropArea.addEventListener(eventName, () => {
                    this.dropArea.classList.remove('highlight')
                })
            })

        this.dropArea.addEventListener('drop', e => {
            var dt = e.dataTransfer
            var files = dt.files

            this.handleFiles(files)
        })
    }

    setCustomValidityJS = function (mensaje, index) {
        let divs = document.querySelectorAll('form div.mensaje-validacion')
        divs[index].innerHTML = mensaje
        divs[index].style.display = mensaje ? 'block' : 'none'
    }

    algunCampoNoValido() {
        let valido =
            this.camposValidos[0] &&
            this.camposValidos[1] &&
            this.camposValidos[2] &&
            this.camposValidos[3] &&
            this.camposValidos[4]

        return !valido
    }

    validar(valor, validador, index) {
        //console.log(valor,index)

        if (!validador.test(valor)) {
            this.setCustomValidityJS('Este campo no es válido', index)
            this.camposValidos[index] = false
            this.button.disabled = true
            return null
        }

        this.camposValidos[index] = true
        this.button.disabled = this.algunCampoNoValido()

        this.setCustomValidityJS('', index)
        return valor
    }

    leerProductoIngresado() {
        return {
            nombre: this.inputs[0].value,
            precio: this.inputs[1].value,
            stock: this.inputs[2].value,
            foto: this.imagenSubida ? `/uploads/${this.imagenSubida}` : '',
            categoria: this.inputs[3].value,
            detalles: this.inputs[4].value,
            envio: this.inputs[5].checked,
        }
    }

    limpiarFormulario() {
        //borro todos los input
        this.inputs.forEach(input => {
            if (input.type != 'checkbox') input.value = ''
            else if (input.type == 'checkbox') input.checked = false
        })

        this.button.disabled = true
        this.camposValidos = [false, false, false, false, false]

        let img = document.querySelector('#gallery img')
        img.src = ''

        this.initializeProgress()
        this.imagenSubida = ''
    }

    /* --------------- drag and drop ------------------- */
    initializeProgress() {
        this.progressBar.value = 0
    }

    updateProgress(porcentaje) {
        this.progressBar.value = porcentaje
    }

    previewFile(file) {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function () {
            let img = document.querySelector('#gallery img')
            img.src = reader.result
        }
    }

    handleFiles = files => {
        let file = files[0]
        this.initializeProgress()
        this.uploadFile(file)
        this.previewFile(file)
    }

    uploadFile = file => {
        var url = '/upload'

        var xhr = new XMLHttpRequest()
        var formdata = new FormData()

        xhr.open('POST', url)

        xhr.upload.addEventListener('progress', e => {
            let porcentaje = (((e.loaded * 100.0) / e.total) || 100)
            this.updateProgress(porcentaje)
        })

        xhr.addEventListener('load', () => {
            if (xhr.status == 200) {
                this.imagenSubida = JSON.parse(xhr.response).nombre
            }
        })

        formdata.append('foto', file)
        xhr.send(formdata)
    }
    /* ------------------------------------------------- */
}

async function renderTablaAlta(validos, productos) {
    let plantillaHbs = await fetch('plantillas/alta.hbs').then(r => r.text())

    var template = Handlebars.compile(plantillaHbs);
    let html = template({ productos, validos })
    document.getElementById('listado-productos').innerHTML = html
}

/* ------------------------------------------------------------ */
/*      Inicializaciones para el funcionamiento del módulo      */
/* ------------------------------------------------------------ */
let formularioAlta = null

async function initAlta() {
    console.warn('initAlta()')

    formularioAlta = new FormularioAlta(renderTablaAlta, productoController.guardarProducto)

    let productos = await productoController.obtenerProductos()
    renderTablaAlta(null, productos)
}

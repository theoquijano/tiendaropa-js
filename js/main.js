let productos = []

fetch('./js/productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data
        cargarProductos(productos);
    })

const productosContenido = document.querySelector('#productos-contenido')
const categoriaBtn = document.querySelectorAll('.categoria-btn')
const tituloPrincipal = document.querySelector('#titulo-principal')
let botonesAgregar = document.querySelectorAll('.producto-agregar')
const carritoAgregado = document.querySelector('#carrito-agregado')

function cargarProductos(productosElegidos) {

    productosContenido.innerHTML = ''
    productosElegidos.forEach(producto => {

        const div = document.createElement('div')
        div.classList.add('producto')
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button id="${producto.id}" class="producto-agregar">Agregar</button>
            </div>
        `
        productosContenido.append(div)
    })
    
    actualizarBotonesAgregar()
    
}


categoriaBtn.forEach(boton => {
    boton.addEventListener('click', (e) => {

        categoriaBtn.forEach(boton => boton.classList.remove('active'))
        e.currentTarget.classList.add('active')

        if (e.currentTarget.id != 'todos') {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id)
            tituloPrincipal.innerText = productoCategoria.categoria.nombre

            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id)
            cargarProductos(productosBoton)
        } else {
            tituloPrincipal.innerText = 'Todos los productos'
            cargarProductos(productos)
        }

        

    })
})

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll('.producto-agregar')

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito)
    })
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem('productos-en-carrito')

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS)
    actualizarNumerito()
} else {
    productosEnCarrito = []
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Agregaste un producto",
        duration: 1500,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #566573, #283747)",
        },
        onClick: function(){}
      }).showToast();
    
    const idBoton = e.currentTarget.id
    const productoAgregado = productos.find(producto => producto.id === idBoton)

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton)
        productosEnCarrito[index].cantidad++
    } else {
        productoAgregado.cantidad = 1
        productosEnCarrito.push(productoAgregado) 
    }
    actualizarNumerito()

    localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito))
}

function actualizarNumerito() {
    let nuevoCarritoA = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)
    carritoAgregado.innerText = nuevoCarritoA
}
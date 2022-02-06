// Agrega credenciales de SDK
const mercadopago = new MercadoPago("APP_USR-b20e9574-41a2-40b0-80ae-6674282470fa", {
    locale: "es-AR",
});

async function renderPago(preference) {
    let html = await fetch('vistas/pago.html').then(r => r.text())

    document.querySelector('main').style.display = 'none'
    document.querySelector('.section-pago').innerHTML = html

    createCheckoutButton(preference.id)

    document.getElementById("go-back").addEventListener("click", function() {
        document.querySelector('main').style.display = 'block'
        document.querySelector('.section-pago').innerHTML = ''
    });
}

// Create preference when click on checkout button
function createCheckoutButton(preferenceId) {
    // Initialize the checkout
    mercadopago.checkout({
        preference: {
            id: preferenceId
        },
        render: {
            container: '#button-checkout', // Class name where the payment button will be displayed
            label: 'Pagar', // Change the payment button text (optional)
        }
    });
}
// SDK de Mercado Pago
import mercadopago from "mercadopago"

// Agrega credenciales
mercadopago.configure({
  access_token: 'APP_USR-1248373813158046-020522-3f8d5623678da8e4dd5b0230d26edeca-256311110',
});

console.log('---------configuración de SDK de mercado pago OK!------')

const feedBack =(req,res)=> {
    let infoPago = {
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	};

    console.log(infoPago)

    res.redirect('/')

}

export default{
    feedBack
}
const Node = require('../models/nodes');
const Customer = require('../models/customers');

const appCtrl = {};


appCtrl.index = (req, res) => {
    res.render('index.hbs');
}

appCtrl.control = (req, res) =>{
    res.render('application/control.hbs');
}

appCtrl.loriot = (req, res) => {
    if(req.body.data !=undefined){
        datos = req.body.data;
        console.log(datos);
    }
    res.send('ok');
}

appCtrl.addNode = async (req, res) =>{
    const customersDB = await Customer.find();
    res.render('application/addNode',{customersDB});
}

appCtrl.addCustomer = (req, res) =>{
    res.render('application/addCustomer.hbs')
}

appCtrl.apiAddNode = async (req, res)=>{
    try{ 
        if(!req.user) return res.redirect('/');
        const {model, eui, customer} = req.body;
        const customer2 = await Customer.findOne({name: customer});
        newNode = new Node({
            eui,
            model,
            customer_id: customer2._id
        })
        newNode.save()
            .then(()=>{
                res.redirect('/guardado');
            })
            .catch(()=>{
                res.redirect('/No-guardado');
            }) 
    }catch(e){
        console.log(e);
        res.redirect('/error');
    }
}

appCtrl.apiAddCustomer = async (req, res) =>{
    try{

        const {address, latitud, longitud, name, email, phone} = req.body;
        const emailCustomer = await Customer.findOne({email: email});
        if(emailCustomer) return res.redirect('/email-usado');
        newCustomer = new Customer({
            address,
            latitud,
            longitud,
            phone,
            name, 
            email
        });
        newCustomer.save()
            .then(()=>{
                res.redirect('/customer-guardado')
            })
            .catch(()=>{
                res.redirect('/customer-no-guardado')
            });
    }catch(e){
        res.redirect('/error')
    }
}



module.exports = appCtrl;
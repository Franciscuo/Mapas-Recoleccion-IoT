const nodemailer = require("nodemailer");

class Email {

    constructor(oConfig) {
        this.createTransport = nodemailer.createTransport(oConfig);
    }

    enviarCorreo(oEmail, callback) {
        try {
            this.createTransport.sendMail(oEmail, function(error, info) {
                if (error) {
                    console.log("Error al enviar email" + error + '\n--------------');
                    callback(error);
                } else {
                    console.log("Correo enviado correctamente");
                    callback();
                }
                this.createTransport.close();
            });
        } catch (err) {
            console.log("Email.enviarCorreo -- Error-- " + err);
            callback(err);
        }
    }
}
module.exports = Email;
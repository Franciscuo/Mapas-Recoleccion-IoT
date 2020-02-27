const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://laser:laser*1234@cluster0-kt6sj.mongodb.net/limpo?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.connection.once('open', () => {
    console.log('DB is connected');
});
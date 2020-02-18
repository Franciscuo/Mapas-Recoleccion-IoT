const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test-pastarn', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
    console.log('DB is connected');
});
const mongoose = require("mongoose");
const express = require("express");

const app = express();
const PORT = process.env.PORT | 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(require("./routes"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/social-network-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () =>
console.log('Connected to MongoDB Endpoint')
);

mongoose.connection.on('error', (err) =>
console.log(`MONGOOSE DISCONNECTED ERROR: ${err}`)
);

mongoose.set('debug', true)

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
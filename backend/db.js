const mongoose = require("mongoose");
const connectToMongo = async () => {
    await mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB Connected..."))
        .catch((err) => console.log(err));
};

module.exports = connectToMongo;
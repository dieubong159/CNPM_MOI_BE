const mongoose = require("mongoose");
let count = 0;

const options = {
  autoIndex: false, //Dont build indexes
  reconnectTries: 30, //Retry up to 30 times
  reconnectInterval: 500, //Reconnect every 500ms
  poolSize: 10, //Maintain up to 10 socket connections
  //If not connected, return errors immediately rather than waiting for the connect
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const connectWithRetry = () => {
  console.log("MongoDB connection with retry");
  mongoose
    .connect(
      "mongodb+srv://dieubong159:dieu0586060734@cnpm-new-obpke.mongodb.net/CNPM-MOI?retryWrites=true&w=majority",
      options
    )
    .then(() => {
      console.log("MongoDB is connected");
    })
    .catch(err => {
      console.log(
        "MongoDB connection successful, retry after 5 seconds.",
        count++
      );
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

exports.mongoose = mongoose;

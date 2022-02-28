const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, //To use the new Server Discover and Monitoring engine
});

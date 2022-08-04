require("dotenv").config();
const express = require("express");
const app = express();

const rmsData = require("./routes/user");
const adminData = require("./routes/admin");
const subAdminData = require("./routes/subadmin");
const errorHandler = require("./middleware/error-handler");

app.use(express.json());

app.use("/admin", adminData);
app.use("/sub-admin", subAdminData);
app.use("/user", rmsData);

app.use("*", errorHandler.pageNotFound);

app.use(errorHandler.errorHandler);

const port = process.env.port || 8080;

app.listen(port, () => {
  console.log(`Server is started at port ${port}`);
});

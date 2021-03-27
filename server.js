const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const terminalCtrl = require("./controllers/terminalControllers");
const userCtrl = require("./controllers/userControllers");

const addTerminalValidations = require("./validations/addTerminal");
const registerValidations = require("./validations/register");
const loginValidations = require("./validations/login");
const passport = require("./core/passport");

dotenv.config();

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.get("/terminals", terminalCtrl.index);
app.post(
  "/terminals",
  passport.authenticate("jwt", { session: false }),
  addTerminalValidations,
  terminalCtrl.create
);
app.delete(
  "/terminals/delete",
  passport.authenticate("jwt", { session: false }),
  terminalCtrl.delete
);

app.get(
  "/users/me",
  passport.authenticate("jwt", { session: false }),
  userCtrl.getUserInfo
);

app.post(
  "/auth/login",
  passport.authenticate("local"),
  loginValidations,
  userCtrl.login
);

app.post(
  "/auth/register",
  passport.authenticate("jwt", { session: false }),
  registerValidations,
  userCtrl.register
);


app.use('/', express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
})

io.on("connection", (socket) => {
  let terminalId;

  socket.emit("connected", "Успешное подключение");

  socket.on("TERMINAL-ONLINE", (data) => {
    terminalCtrl.setStatus(data, true);

    terminalId = data;

    socket.emit("TERMINAL-STATUS-CHANGED");

    console.log("Терминал в сети");

  });

  socket.on("disconnect", () => {
    terminalCtrl.setStatus(terminalId, false);

    socket.emit("TERMINAL-STATUS-CHANGED");

    console.log("Терминал отключен");
  });

  
});

const PORT = process.env.PORT || 3001;

http.listen(PORT, () => {
  console.log(`Server is run on port ${PORT}`);
});

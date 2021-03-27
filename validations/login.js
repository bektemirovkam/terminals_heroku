const body = require("express-validator").body

const loginValidations = [
  body("username", "Введите логин")
    .isString()
    .withMessage("Введите корректный логин")
    .isLength({ min: 2, max: 40 })
    .withMessage("Допустимое количество символов от 2 до 40"),
  body("password", "Введите пароль")
    .isString()
    .trim()
];

module.exports = loginValidations
const body = require("express-validator").body

const registerValidations = [
  body("username", "Введите логин")
    .isString()
    .withMessage("Введите корректный логин")
    .isLength({ min: 2, max: 40 })
    .withMessage("Допустимое количество символов от 2 до 40"),
  body("password", "Введите пароль")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Минимальное количество символов 6")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.confirm) {
        throw new Error("Повторный пароль не верный");
      }
      return true;
    }),
];

module.exports = registerValidations
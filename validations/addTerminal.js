const {body} = require("express-validator")

const addTerminalValidations = [
  body("city", "Введите город")
    .isString()
    .isLength({ min: 2, max: 40 })
    .withMessage("Допустимое количество символов от 2 до 40")
    .trim(),
  body("organization", "Введите огранизацию")
    .isString()
    .isLength({ min: 2, max: 70 })
    .withMessage("Допустимое количество символов от 2 до 70")
    .trim(),
  body("address", "Введите адресс")
    .isString()
    .trim(),
  body("model", "Введите модель терминала")
    .isString()
    .trim(),
  body("yearOfIssue", "Введите дату изготовления терминала")
    .isNumeric()
    .withMessage("Введите число")
    .trim(),
];

module.exports = addTerminalValidations;

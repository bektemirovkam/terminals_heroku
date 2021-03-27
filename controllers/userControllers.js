const express = require("express");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel");
const generateMD5 = require("../utils/generateHash");

class UserController {
  async register(req, res) {
    const user = req.user;
    try {
      if (user && user.isAdmin) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ status: "error", errors: errors.array() });
        } else {
          const data = {
            username: req.body.username,
            password: generateMD5(req.body.password + process.env.SECRET_KEY),
            isAdmin: req.body.isAdmin,
            canEdit: req.body.canEdit,
          };
          const user = await UserModel.create(data);

          res.json({
            status: "success",
            data: user,
          });
        }
      } else {
        res.status(403).send();
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        messages: JSON.stringify(error),
      });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ status: "error", errors: errors.array() });
      } else {
        const user = req.user ? req.user.toJSON() : undefined;
        res.json({
          status: "success",
          data: {
            ...user,
            token: jwt.sign(
              { data: req.user },
              process.env.SECRET_KEY || "123",
              { expiresIn: "30 days" }
            ),
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        messages: JSON.stringify(error),
      });
    }
  }
  
  async getUserInfo(req, res) {
    try {
      const user = req.user ? req.user.toJSON() : undefined; 
      res.json({
        status: "success",
        data: user
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        messages: JSON.stringify(error),
      });
    }
  }
}

module.exports = new UserController();

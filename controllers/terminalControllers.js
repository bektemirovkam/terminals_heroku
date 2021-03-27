const { validationResult } = require("express-validator");

const TerminalModel = require("../models/terminalModel");
const isValidObjectId = require("../utils/isValidObjectId");

class TerminalController {
  async index(req, res) {
    try {
      const terminals = await TerminalModel.find(req.query)
        .sort({ createdAt: -1 })
        .exec();
      res.json({
        status: "success",
        data: terminals,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        errors: JSON.stringify(error),
      });
    }
  }

  async create(req, res) {
    try {
      const user = req.user;

      if ((user && user.canEdit) || (user && user.isAdmin)) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json({ status: "error", errors: errors.array() });
        } else {
          const data = {
            city: req.body.city,
            organization: req.body.organization,
            address: req.body.address,
            model: req.body.model,
            yearOfIssue: +req.body.yearOfIssue,
          };
          const terminal = await TerminalModel.create(data);

          res.json({
            status: "success",
            data: terminal,
          });
        }
      } else {
        res.status(403).send();
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        messages: JSON.stringify(error),
      });
    }
  }

  async delete(req, res) {
    const user = req.user;
    try {
      if ((user && user.canEdit) || (user && user.isAdmin)) {
        const arrayTerminals = req.body.arrayTerminals;

        for (let terminalId of arrayTerminals) {
          if (!isValidObjectId(terminalId)) {
            res.status(400).send();
            return;
          }

          const terminal = await TerminalModel.findById(terminalId).exec();
          if (terminal) {
            terminal.remove();
          } else {
            continue;
          }
        }

        const terminals = await TerminalModel.find({})
          .sort({ createdAt: -1 })
          .exec();

        res.json({
          status: "success",
          data: terminals,
        });
      } else {
        res.status(403).send();
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        errors: JSON.stringify(error),
      });
    }
  }

  async setStatus(terminalId, status) {
    try {
      if (!isValidObjectId(terminalId)) {
        return;
      }

      const terminal = await TerminalModel.findById(terminalId).exec();

      if (terminal) {
        terminal.isOnline = status;
        await terminal.save();
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new TerminalController();

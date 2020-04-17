const crypto = require("crypto");
const _ = require("lodash");
const Sequelize = require("sequelize");

const db = require("./db");

const User = db.define(
  "user",
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
    },
    salt: {
      type: Sequelize.STRING,
    },
    theme: {
      type: Sequelize.STRING,
      defaultValue: "wood",
    },
    bestScores: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: [],
      get() {
        let scores = this.getDataValue("bestScores");
        return scores.sort((a, b) => (a < b ? 1 : -1));
      },
    },
    googleId: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate: setSaltAndPassword,
      beforeUpdate: setSaltAndPassword,
    },
  }
);

User.prototype.changeTheme = function(theme) {
  this.theme = theme
  this.save()
}

// instance methods
User.prototype.correctPassword = function (candidatePassword) {
  return (
    User.encryptPassword(candidatePassword, this.salt) === this.password
  );
};

User.prototype.sanitize = function () {
  return _.omit(this.toJSON(), ["password", "salt"]);
};

User.prototype.addBestScore = function (score) {
  if (this.bestScores[this.bestScores.length - 1] < score) {
    this.bestScores[this.bestScores.length - 1] = score;
  }

  this.save();
};

// class methods
User.generateSalt = function () {
  return crypto.randomBytes(16).toString("base64");
};

User.encryptPassword = function (plainText, salt) {
  const hash = crypto.createHash("sha1");
  hash.update(plainText);
  hash.update(salt);
  return hash.digest("hex");
};

function setSaltAndPassword(user) {
  // we need to salt and hash again when the user enters their password for the first time
  // and do it again whenever they change it
  if (user.changed("password")) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password, user.salt);
  }
}

module.exports = User;

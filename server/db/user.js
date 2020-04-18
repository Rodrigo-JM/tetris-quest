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
      type: Sequelize.ARRAY(Sequelize.BIGINT),
      defaultValue: [],
    },
    bestScore: {
      type: Sequelize.BIGINT,
      defaultValue: 0
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

User.prototype.addScore = function (score) {
  let scores = [...this.bestScores]
  scores.push(score)
  this.update({bestScores: scores})
}

User.prototype.updateBestScore = function () {
  let scores = this.bestScores
  scores = scores.sort((a, b) => (a < b) ? 1 : -1);

  this.bestScore = scores[0]
}
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

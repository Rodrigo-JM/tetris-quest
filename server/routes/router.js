const router = require("express").Router();
const User = require("../db/user");

//get me
router.get("/", (req, res, next) => {
  res.json(req.user);
});

//login
router.put("/", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    console.log(req.body)
    if (!user) {
      res.status(401).send("User not found");
    } else if (!user.correctPassword(req.body.password)) {
      res.status(401).send("Incorrect password");
    } else {
      req.login(user, (err) => {
        if (err) next(err);
        else res.json(user);
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//signup
router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    req.login(user, (err) => {
      if (err) {
        next(err);
      } else {
        res.json(user);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

//logout
router.delete("/", (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.sendStatus(204);
});

module.exports = router;

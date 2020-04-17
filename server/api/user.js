const router = require("express").Router();
const User = require("../db/user");

router.put("/:id/theme", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "theme", "email", "bestScores"],
    });
    if (user === null) {
      res.sendStatus(404);
    } else {
      await user.update({ ...user, theme: req.body.theme });

      res.status(200).send(user);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/highscores/:id/add", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user === null) {
      res.sendStatus(404);
    } else {
      user.addBestScore(req.body.score);
      user.updateBestScore()
      await user.update({...user});

      res.status(200).send(user);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/leaderboards", async (req, res, next) => {
  try {
    let users = await User.findAll();
    users.map((user) => {
      console.log(user);
    });
    
    users = users.sort((a, b) => (a.bestScore < b.bestScore) ? 1 : -1)

    res.status(200).send(users.slice(0, 11));
  } catch (err) {
    next(err);
  }
});

module.exports = router;

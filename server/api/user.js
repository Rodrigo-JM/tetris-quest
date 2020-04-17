const router = require('express').Router();
const User = require('../db/user')


router.put('/:id/theme', async (req, res, next) => {
    try {   
        const user = await User.findByPk(req.params.id);

        if (user === null) {
            res.sendStatus(404)
        } else {
            await user.changeTheme(req.body.theme)

            res.status(200).send(user)
        }
    } catch(err) {
        next(err)
    }
})

module.exports = router
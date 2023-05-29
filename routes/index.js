var express = require('express');
var router = express.Router();
const Mailjs = require("@cemalgnlts/mailjs");
const mailjs = new Mailjs();
const password = "123123Qq";

const login = async () => {
    let user = await register();
    await mailjs.login(user.email, user.password);
    return user;

}
const sleep = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

const getCode = async () => {
    while (true) {
        let kq = await mailjs.getMessages();
        if (kq.status === true) {
            let data = kq.data.filter(item => {
                let createdAt = new Date(item.createdAt);
                let now = new Date();
                return (now.getTime() - createdAt.getTime()) / 1000 < 300 && item.seen === false;
            });
            if (data.length > 0) {
                await mailjs.setMessageSeen(data[0].id, true);
                return data[0].intro.match(/\d+/g)[0];
            }
        }
        await sleep(1000);
    }
}
/* GET home page. */
router.get('/:mail', async function (req, res, next) {
    let mail = req.params.mail;
    await mailjs.login(mail, password);
    let code = await getCode();
    res.json({code});
});

module.exports = router;

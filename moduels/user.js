/**
 * Created by flyman on 16-8-31.
 */
var fs = require("fs");

function User() {
    this.username = "";
    this.password = "";
}

User.check = function (req) {
    this.username = req.body.username;
    this.password = req.body.password;
    var data = fs.readFileSync("./user.json");

    data = JSON.parse(data);

    if (this.username === data.username && this.password === data.password) {
        return true;
    }
    return false;
};

module.exports = User;
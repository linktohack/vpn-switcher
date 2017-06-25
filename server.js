const express = require('express')
const app = express()
const cp = require('child_process')

function exec(command) {
    return new Promise((resolve, reject) => {
        cp.exec(command, (e, out, err) => {
            if (e) {
                return reject({ e, out, err })
            }
            resolve({ e, out, err })
        })
    })
}

app.use(express.static('public'))
app.use(require('body-parser').json())

app.post('/', function (req, res) {
    const profile = req.body.profile
    if (profile) {
        var hasError = false
        return exec(`killall openvpn; sleep 5; systemctl start openvpn@${profile}`)
            .then(it => {
                res.send(JSON.stringify({ status: "ok", profile: `${profile}` }))
            })
            .catch(e => {
                res.send(JSON.stringify({ status: "error" }))
            })
    }
    res.send(JSON.stringify({ status: "error" }))
})

app.post('/kill', function (req, res) {
    const profile = req.body.profile

    return exec(`killall openvpn`)
        .then(it => {
            res.send(JSON.stringify({ status: "ok", profile: `none` }))
        })
        .catch(e => {
            res.send(JSON.stringify({ status: "error" }))
        })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
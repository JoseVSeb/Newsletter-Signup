
const { response } = require('express');
const express = require('express');
const https = require('https');

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const dc = "us20"
    const list_id = "53e5018553"
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${list_id}`

    const options = {
        method: "POST",
        auth: "josevs:1bd035e5b71ba1841d77743dc0d2bd0a-us20"
    }

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data))
        })

        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", (req, res) => {
    res.redirect("/")
})

port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The server is running on port ${port}.`)
})

// API Key:
// 1bd035e5b71ba1841d77743dc0d2bd0a-us20

// List ID:
// 53e5018553
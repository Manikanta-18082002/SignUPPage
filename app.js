const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
//const client = require("@mailchimp/mailchimp_marketing");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //Inorder to get the Static files(CSS, Images)


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

    const firstname = req.body.fname; //const ? Bcz we never go to change these var
    const lastname = req.body.lname;
    const email = req.body.email;
    console.log(firstname, lastname, email);

    const data = { //This data will sent to the Mail Chimp
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/19b6c81c7b";
    const options = {
        method: "POST",
        auth: "Mani:fa12b8d32d40aadd27b3d40a11aedacc-us14"
    }

    const mailchimpRequest = https.request(url, options, function(response) {

        if (response.statusCode === 200) {

            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    mailchimpRequest.write(jsonData);
    mailchimpRequest.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/"); //Redirect to HOME Page
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});


//API Key: fa12b8d32d40aadd27b3d40a11aedacc-us14 //us 1 to 20

//List ID: 19b6c81c7b
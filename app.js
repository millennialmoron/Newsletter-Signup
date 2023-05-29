const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { response } = require("express");

mailchimp.setConfig({
  apiKey: "5da0ea082fceb63148fac0980a1d4ee0-us12",
  server: "us12",
});

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  // const listID = "ca224df003";
  const subscribingUser = {
    email_address: email,
    firstName: firstName,
    lastName: lastName,
  };

  const run = async () => {
    const response = await mailchimp.lists
      .addListMember("ca224df003", {
        email_address: subscribingUser.email_address,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      })
      .then((responses) => {
        console.log(responses);
        if (responses.id !== "") {
          res.sendFile(__dirname + "/success.html");
        }
      })
      .catch((err) => {
        res.sendFile(__dirname + "/failure.html");
        console.log("Error!");
      });
  };
  run();

  // if (response.status !== "subscribed"){
  //   res.sendFile(__dirname + "/failure.html");
  // } else {
  //
  // }

  // run().catch(err => res.sendFile(__dirname + "/failure.html"));
});

app.listen(process.env.PORT, function () {
  console.log("am listening");
});

//API KEY
//5da0ea082fceb63148fac0980a1d4ee0-us12
//
// LIST ID
// ca224df003

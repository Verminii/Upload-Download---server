var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, function () {
    console.log("Server działa na porcie " + PORT)
})

app.use(express.static('static'))

const html1 = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/table.css">
    <title>USERS</title>
</head>
<body>
    <div class="main">
        <div class="nav">
            <a href="/sort">Sort</a>
            <a href="/gender">Gender</a>
            <a href="/show">Show</a>
        </div class="content">`;

const html2 = `
</div>
</div>
</body>
</html>`;

const sortAscForm = `
    <form onchange="submit()" method="POST">
        <input type="radio" name="sorttype" value="rosnaco" checked>
        <label for="ascending">rosnąco</label>
        <input type="radio" name="sorttype" value="malejaca">
        <label for="descending">malejąco</label>
    </form>
`;

const sortDescForm = `
    <form onchange="submit()" method="POST">
        <input type="radio" name="sorttype" value="rosnaco">
        <label for="ascending">rosnąco</label>
        <input type="radio" name="sorttype" value="malejaca" checked>
        <label for="descending">malejąco</label>
    </form>
`;

var path = require("path")
var isLoged = false
var id = 4
var users = [
    {
        id: 1, log: "AAA", pass: "PASS1", age: 15, student: true, gender: "mezczyzna",
    },
    {
        id: 2, log: "BBB", pass: "PASS2", age: 19, student: false, gender: "kobieta",
    },
    {
        id: 3, log: "CCC", pass: "PASS3", age: 20, student: true, gender: "mezczyzna",
    },
];

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname + "/static/pages/main.html"))

})

app.get("/main", (req, res) => {

    res.sendFile(path.join(__dirname + "/static/pages/main.html"))

})

app.get("/register", (req, res) => {

    res.sendFile(path.join(__dirname + "/static/pages/register.html"))

})

app.post("/register", (req, res) => {
    users.push({
        id: id,
        log: req.body.log,
        pass: req.body.pass,
        age: parseInt(req.body.age),
        student: req.body.student === "on",
        gender: req.body.gender,
    });
    id += 1
    res.send(`Dodano użytkownika ${req.body.log}`);

})

app.get("/login", (req, res) => {

    res.sendFile(path.join(__dirname + "/static/pages/login.html"))

})

app.get("/logout", (req, res) => {
    isLoged = false;
    res.redirect("/main");

})

app.post("/login", (req, res) => {
    let check = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].log == req.body.log && users[i].pass == req.body.pass)
            check = true;
    }
    if (check == false) {
        res.send("Błędny login lub hasło")
    }
    else {
        isLoged = true;
        res.redirect("/admin");
    }
})

app.get("/admin", (req, res) => {
    if (!isLoged)
        res.sendFile(path.join(__dirname + "/static/pages/admin1.html"))
    else
        res.sendFile(path.join(__dirname + "/static/pages/admin2.html"))
})

app.get("/sort", (req, res) => {
    if (isLoged) {
        users.sort((a, b) => a.age - b.age);
        let htmlForm = sortAscForm;
        let Table = sortTable();
        let document = html1 + htmlForm + Table + html2;
        res.send(document);
    }
})

app.post("/sort", (req, res) => {
    if (req.body.sorttype === "rosnaco") {
        users.sort((a, b) => a.age - b.age);
        htmlForm = sortAscForm;
    } else {
        users.sort((a, b) => b.age - a.age);
        htmlForm = sortDescForm;
    }
    let Table = sortTable();
    let document = html1 + htmlForm + Table + html2;
    res.send(document);
})

app.get("/gender", (req, res) => {
    if (isLoged) {
        let Table = genderTable();
        let document = html1 + Table + html2;
        res.send(document);
    }
})

app.get("/show", (req, res) => {
    if (isLoged) {
        let Table = showTable();
        let document = html1 + Table + html2;
        res.send(document);
    }

})

function showTable() {
    let table = "<table>"
    let student;
    for (let i = 0; i < users.length; i++) {
        if (users[i].student) {
            student = "check"
        }
        else {
            student = ""
        }
        table += `
        <tr>
                <td>Id: ${users[i].id}</td>
                <td>User: ${users[i].log} - ${users[i].pass}</td>
                <td>Student: ${student}</td>
                <td>Age: ${users[i].age}</td>
                <td>Gender: ${users[i].gender}</td>
            </tr>
        `
    }
    table += "</table>";
    return table
}

function genderTable() {
    let table = "<table>";
    for (let i = 0; i < users.length; i++) {
        if (users[i].gender == "mezczyzna") {
            table += `
            <tr>
                    <td>Id: ${users[i].id}</td>
                    <td>Płeć: ${users[i].gender}</td>
                </tr>
            `
        }
    }
    table += "</table><br>";
    table += "<table>";
    for (let i = 0; i < users.length; i++) {
        if (users[i].gender == "kobieta") {
            table += `
            <tr>
                    <td>Id: ${users[i].id}</td>
                    <td>Płeć: ${users[i].gender}</td>
                </tr>
            `
        }
    }
    table += "</table>";

    return table;
}

function sortTable() {
    let table = "<table>"
    for (let i = 0; i < users.length; i++) {
        table += `
        <tr>
                <td>Id: ${users[i].id}</td>
                <td>User: ${users[i].log} - ${users[i].pass}</td>
                <td>Age: ${users[i].age}</td>
            </tr>
        `
    }
    table += "</table>";
    return table
}
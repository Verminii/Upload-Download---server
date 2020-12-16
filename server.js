const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const formidable = require('formidable');
const app = express();
const PORT = process.env.PORT || 3000;
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs', extname: '.hbs', partialsDir: 'views/partials' }));
app.set('view engine', 'hbs');
app.use(express.static('static'))
app.listen(PORT, function () {
    console.log("Server działa na porcie " + PORT)
})
let id = 0
let fileInformation = []

app.get("/upload", function (req, res) {
    res.render('upload.hbs');
});
app.get("/", function (req, res) {
    res.redirect('/upload');
});

app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', { fileInformation });
});

app.get("/info", function (req, res) {
    res.render('info.hbs');
});

app.post('/handleUpload', function (req, res) {
    let form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/';
    form.keepExtensions = true;
    form.multiples = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err)
            return
        }

        if (Array.isArray(files.fileToUpload)) {
            files.fileToUpload.forEach((element) => {
                id++;
                fileInformation.push({ id: id, imagePath: `gfx/${getExtension(element.name)}.png`, name: element.name, size: element.size, type: element.type, generatedName: path.basename(element.path), date: new Date().getTime(), path: element.path });
            });
        }
        else {

            id++;
            fileInformation.push({ id: id, imagePath: `gfx/${getExtension(files.fileToUpload.name)}.png`, name: files.fileToUpload.name, size: files.fileToUpload.size, type: files.fileToUpload.type, generatedName: path.basename(files.fileToUpload.path), date: new Date().getTime(), path: files.fileToUpload.path });
        }

        res.redirect('/filemanager');
    });

});

app.get('/delete:p', function (req, res) {
    const id = req.params.p;
    fileInformation.forEach((e, i, a) => {
        if (e.id == id) {
            a.splice(i, 1);
        }
    });
    res.redirect('/filemanager');
});

app.get('/dAll', function (req, res) {
    fileInformation.length = 0;
    res.redirect('/filemanager');
});

app.get('/info:p', function (req, res) {
    const id = req.params.p;
    fileInformation.forEach((e) => {
        if (e.id == id) {
            res.render('info.hbs', { e });
        }
    });
});

const getExtension = (filename) => {
    return filename.substr(filename.indexOf('.') + 1);
};
const fs = require('fs')
const path = require('path')
const ipc = require('electron').ipcRenderer
let btnCreate = document.getElementById('btnCreate')
let btnRead = document.getElementById('btnRead')
let btnDelete = document.getElementById('btnDelete')
let fileName = document.getElementById('fileName')
let fileContent = document.getElementById('fileContent')
let filePath = document.getElementById('filePath')

btnCreate.addEventListener('click', function () {
    let pathName = filePath.value
    let file = path.join(pathName, fileName.value)
    let content = fileContent.value;
    fs.writeFile(file, content, function (err) {
        if (err) {
            return console.log(err)
        }
        ipc.send('file-create')
    })
})

btnRead.addEventListener('click', function () {
    let pathName = filePath.value
    let file = path.join(pathName, fileName.value)
    fs.readFile(file, function (err, data) {
        if (err) {
            return console.log(err)
        }
        fileContent.value = data;
        console.log("The file was read")
    })
})

btnDelete.addEventListener('click', function () {
    let pathName = filePath.value
    let file = path.join(pathName, fileName.value)
    let result = ipc.sendSync('file-delete')
    if (result == 0) {
        fs.unlink(file, function (err) {
            if (err) {
                return console.log(err)
            }
            fileName.value = '';
            fileContent.value = '';

        })
    }
})

ipc.on('file-created', function (event, arg) {
    console.log(arg)
})
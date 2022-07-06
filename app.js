// cdn is front end play store
// npm is backend play store

const express = require("express");
const socket = require("socket.io");

const app = express(); // Intialize app & server ready
app.use(express.static("public"));
let port = 5000;

let server = app.listen(port, function () {
    console.log("Listening to port : " + port);
})

let io = socket(server);



var path = require("path");
var bodyParser = require("body-parser");
var compiler = require('compilex');
var options = { stats: true }; //prints stats on console 
compiler.init(options);

app.use(bodyParser());

// console.log(io);
console.log("#########################################");
io.on("connection", function (socket) {

    // console.log(io);
    console.log("connection establish");
    socket.on("mouseDownSock", function (data) {
        // console.log("mouse down sent by server");
        io.sockets.emit("mouseDownSock", data);
    });

    socket.on("mouseMoveSock", function (data) {
        io.sockets.emit("mouseMoveSock", data);
    });

    socket.on("mouseUpSock", function () {
        // console.log("mouse up sent by server");
        io.sockets.emit("mouseUpSock");
    });

    socket.on("eraserSock", function (data) {
        // console.log("mouse up sent by server");
        io.sockets.emit("eraserSock", data);
    });

    socket.on("pencilSock", function (data) {
        // console.log("pencil changed");
        io.sockets.emit("pencilSock", data);
    });

    socket.on("changePencilSizeSock", function (data) {
        // console.log("pencil size r̥changed");
        io.sockets.emit("changePencilSizeSock", data);
    });

    socket.on("changeEraserSizeSock", function (data) {
        io.sockets.emit("changeEraserSizeSock", data);
    });

    socket.on("pencilColorChangeSock", function (data) {
        io.sockets.emit("pencilColorChangeSock", data);
    });

    socket.on("undoRedoSock", function (data) {
        console.log("complete ScreenShot");
        io.sockets.emit("undoRedoSock", data);
    })

    socket.on("runCode", function (data) {

        let code = data.code;
        let input = data.inputData;
        let lang = data.lang;

        console.log(code);
        console.log(input);
        console.log(lang);

        if (lang == "cpp") {
            console.log("cpp");
            if (input == "") {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };

                compiler.compileCPP(envData, code, function (data) {
                    console.log("output", data);
                    output = data;
                    io.sockets.emit("runCode", data);
                });
            } else {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
                let output = "";

                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    output = data.output;
                    console.log("op", output);
                    io.sockets.emit("runCode", data);
                });
            }
        } else if (lang == "Java") {
            console.log("Java");
            if (input == "") {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };

                compiler.compileJava(envData, code, function (data) {
                    console.log("output", data);
                    output = data;
                    io.sockets.emit("runCode", data);
                });
            } else {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
                let output = "";

                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    output = data.output;
                    console.log("op", output);
                    io.sockets.emit("runCode", data);
                });
            }
        } else if (lang == "Python") {
            console.log("Python");
            if (input == "") {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };

                compiler.compilePython(envData, code, function (data) {
                    console.log("output", data);
                    output = data;
                    io.sockets.emit("runCode", data);
                });
            } else {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
                let output = "";

                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    
                    console.log("op", output);
                    io.sockets.emit("runCode", data);
                });
            }
        }
    })

});

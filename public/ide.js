let IDEEditor;

editorIcon.addEventListener("click", function () {
    IDEEditor = ace.edit("editor");
    IDEEditor.setTheme("ace/theme/monokai");
    IDEEditor.session.setMode("ace/mode/c_cpp");
});


let languagesContainer = document.querySelector("#languages");
let currLanguage = "cpp";
let outputTextArea = document.querySelector(".output");

languagesContainer.addEventListener("change", function (e) {

    let language = languagesContainer.value;

    if (language == "c" || language == "cpp") {
        currLanguage = "cpp";
        IDEEditor.session.setMode("ace/mode/c_cpp");
    } else if (language == "Java") {
        currLanguage = "Java";
        IDEEditor.session.setMode("ace/mode/java");
    } else if (language == "Python") {
        currLanguage = "Python"
        IDEEditor.session.setMode("ace/mode/python");
    }
});

let runBtn = document.querySelector("#run");
runBtn.addEventListener("click", function (e) {
    let code = IDEEditor.getSession().getValue();
    let inputTag = document.querySelector(".input");
    let inputData = inputTag.value;
    console.log(code);
    console.log(inputData);

    data = {
        code: code,
        inputData: inputData,
        lang : currLanguage
    };

    console.log("called from ide.js")
    let res = socket.emit("runCode", data);
    console.log("response : ", res);

});

socket.on("runCode", function (data) {
    console.log("FinalOutput : ", data);

    let error = data.error;
    let output = data.output;

    console.log("ohh err" , error);
    console.log("ohh out" , output);

    if(error == undefined){
        outputTextArea.innerHTML = output;
    }else if(output == undefined){
        console.log("till here op");
        outputTextArea.innerHTML = error;
    }
});
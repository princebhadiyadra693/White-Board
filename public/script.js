// element selectors 
let canvasBoard = document.querySelector("canvas");
let tool = canvasBoard.getContext('2d');
let body = document.querySelector("body");
let toolBar = document.querySelector(".tool-bar");
let pencil = document.querySelector("#pencil");
let eraser = document.querySelector("#eraser");
let download = document.querySelector("#download");
let upload = document.querySelector("#upload");
let notes = document.querySelector("#notes");
let redo = document.querySelector("#redo");
let undo = document.querySelector("#undo");
let pencilSelector = document.querySelector(".sizeSetter");
let eraserSelector = document.querySelector(".eraserSetter");

// set canvas height & width
canvasBoard.height = window.innerHeight * 4;
canvasBoard.width = window.innerWidth * 2;

// initially pencilSizeChanger & erasertSizeChanger display none 
// false -> display none , true -> display block
let pencilSelectorDisplay = false;
let eraserSelectorDisplay = false;

let activePencilOrEraser = "pencil";
let pencilSize = 1;
let eraserSize = 5;
let pencilColor = "black";
let eraserColor = "white";

let undoRedoTracker = [] // data
let track = 0;

// add event listener to pencil for appear & disappear pencilSizeChanger
pencil.addEventListener("click", function (e) {
    activePencilOrEraser = "pencil";

    if (pencilSelectorDisplay === true) {
        pencilSelectorDisplay = false;
        eraserSelectorDisplay = false;
        pencilSelector.style.display = "none";
        eraserSelector.style.display = "none";
    }
    else {
        pencilSelectorDisplay = true;
        eraserSelectorDisplay = false;
        pencilSelector.style.display = "block";
        eraserSelector.style.display = "none";
    }

    tool.strokeStyle = pencilColor;
    tool.lineWidth = pencilSize;

    let data = {
        activePencilOrEraser: "pencil",

        pencilColor: tool.strokeStyle,
        pencilSize: tool.lineWidth,
        pencilSelectorDisplay: pencilSelectorDisplay,
        eraserSelectorDisplay: eraserSelectorDisplay,
        pencilSelectorStyleDisplay: pencilSelector.style.display,
        eraserSelectorStyleDisplay: eraserSelector.style.display
    };

    socket.emit("pencilSock", data);

});


function pencilSock(data) {

    setPositionWithChangingSizeOfWindow(pencil, pencilSelector);

    activePencilOrEraser = data.activePencilOrEraser,
        tool.strokeStyle = data.pencilColor;
    tool.lineWidth = data.pencilSize;
    pencilSelectorDisplay = data.pencilSelectorDisplay,
        eraserSelectorDisplay = data.eraserSelectorDisplay,
        pencilSelector.style.display = data.pencilSelectorStyleDisplay,
        eraserSelector.style.display = data.eraserSelectorStyleDisplay
}

// add event listener to eraser for appear & disappear eraserSizeChanger
eraser.addEventListener("click", function (e) {

    console.log(this);
    let data = {
        size: this.getAttribute("size"),
    };

    socket.emit("eraserSock", data);

});


function eraserSock(data) {
    activePencilOrEraser = "eraser";
    if (eraserSelectorDisplay === true) {
        pencilSelectorDisplay = false;
        eraserSelectorDisplay = false;
        pencilSelector.style.display = "none";
        eraserSelector.style.display = "none";
    }
    else {
        pencilSelectorDisplay = false;
        eraserSelectorDisplay = true;
        pencilSelector.style.display = "none";
        eraserSelector.style.display = "block";
    }

    tool.strokeStyle = "white";
    tool.lineWidth = data.size;
    setPositionWithChangingSizeOfWindow(eraser, eraserSelector);
}

socket.on("eraserSock", function (data) {
    eraserSock(data);
});

socket.on("pencilSock", function (data) {
    pencilSock(data);
});

// when window size resized(changed) also change location of pencilSizeChanger & eraserSizeChanger
window.addEventListener("resize", function (e) {
    setPositionWithChangingSizeOfWindow(eraser, eraserSelector);
    setPositionWithChangingSizeOfWindow(pencil, pencilSelector);
    // setPositionWithChangingSizeOfWindow(ide , pencilSelector);
})

window.addEventListener("scroll", function (e) {
    toolBar.style.left = (window.scrollX + 48) + "px";
    toolBar.style.top = (window.scrollY + 48) + "px";
    setPositionWithChangingSizeOfWindow(eraser, eraserSelector);
    setPositionWithChangingSizeOfWindow(pencil, pencilSelector);
})

// change location of element according to given referance
function setPositionWithChangingSizeOfWindow(referance, element) {
    const rect = referance.getBoundingClientRect();
    let targetFound = referance.getBoundingClientRect();
    let heightOfToolBox = toolBar.getBoundingClientRect().height;

    element.style.left = (targetFound.left + window.scrollX) + "px";
    element.style.top = (targetFound.top + heightOfToolBox + window.scrollY) + "px";
}

// when clicked on canvas hide pencilSizeChanger & eraserSizeChanger
canvasBoard.addEventListener("click", function (e) {
    // if (e.target.parentNode != pencil && e.target.parentNode != eraser) {
    pencilSelectorDisplay = false;
    eraserSelectorDisplay = false;
    pencilSelector.style.display = "none";
    eraserSelector.style.display = "none";
    // }
});

// highlight selected circle to pencilSizeChanger
let pencilCirclePicker = document.querySelectorAll('.sizeSetter .size');
for (let i = 0; i < pencilCirclePicker.length; i++) {
    pencilCirclePicker[i].addEventListener("click", function (e) {
        for (let j = 0; j < pencilCirclePicker.length; j++) {
            pencilCirclePicker[j].classList.remove("select");
        }

        let currClicked = e.target;
        let pass = "";

        currClicked.classList.add("select");
        let circleArray = currClicked.classList;
        if (circleArray[0] === "size1") {
            pass = 0;
            pencilSize = 1.5;
        } else if (circleArray[0] === "size2") {
            pass = 1;
            pencilSize = 2;
        } else if (circleArray[0] === "size3") {
            pass = 2;
            pencilSize = 3;
        } else if (circleArray[0] === "size4") {
            pass = 3;
            pencilSize = 4;
        }

        data = {
            idx: pass,
            pencilSize: pencilSize
        }

        socket.emit("changePencilSizeSock", data);

    });
}

socket.on("changePencilSizeSock", function (data) {
    changePencilSizeSock(data);
});

function changePencilSizeSock(data) {
    for (let j = 0; j < pencilCirclePicker.length; j++) {

        if (j == data.idx) {
            pencilCirclePicker[j].classList.add("select");
        } else {
            pencilCirclePicker[j].classList.remove("select");
        }
    }

    pencilSize = data.pencilSize;
}

// highlight selected circle to eraserSizeChanger
let erasercirclePicker = document.querySelectorAll('.eraserSetter .size');
for (let i = 0; i < erasercirclePicker.length; i++) {
    erasercirclePicker[i].addEventListener("click", function (e) {
        for (let j = 0; j < erasercirclePicker.length; j++) {
            erasercirclePicker[j].classList.remove("select");
        }

        let currClicked = e.target;
        currClicked.classList.add("select");
        let pass = 0;

        let circleArray = currClicked.classList;
        if (circleArray[0] === "size1") {
            pass = 0;
            eraser.setAttribute("size", "5");
            eraserSize = 5;
        } else if (circleArray[0] === "size2") {
            pass = 1;
            eraser.setAttribute("size", "10");
            eraserSize = 10;
        } else if (circleArray[0] === "size3") {
            pass = 2;
            eraser.setAttribute("size", "20");
            eraserSize = 20;
        } else if (circleArray[0] === "size4") {
            pass = 3;
            eraser.setAttribute("size", "30");
            eraserSize = 30;
        }

        data = {
            idx: pass,
            eraserSize: eraserSize
        }

        socket.emit("changeEraserSizeSock", data);

    });
}

socket.on("changeEraserSizeSock", function (data) {
    changeEraserSizeSock(data);
});

function changeEraserSizeSock(data) {

    for (let j = 0; j < erasercirclePicker.length; j++) {
        if (j == data.idx) {
            console.log("YYYYYYYYYYYYYYYYYYYYYYYY");
            erasercirclePicker[j].classList.add("select");
        } else {
            erasercirclePicker[j].classList.remove("select");
        }
    }
    eraserSize = data.eraserSize;

}

// highlight selected circle from colors 
let colorpicker = document.querySelectorAll(".color");
for (let i = 0; i < colorpicker.length; i++) {
    colorpicker[i].addEventListener("click", function (e) {
        for (let j = 0; j < colorpicker.length; j++) {
            colorpicker[j].classList.remove("select");
        }
        let currClicked = e.target;
        console.log(currClicked);
        currClicked.classList.add("select");

        let classArray = currClicked.classList;

        pencilColor = classArray[1];

        data = {
            pencilColor: pencilColor,
        }
        socket.emit("pencilColorChangeSock", data);

    });
}

socket.on("pencilColorChangeSock", function (data) {
    pencilColorChangeSock(data);
});

function pencilColorChangeSock(data) {
    let allColor = document.querySelectorAll(".color");

    for (let j = 0; j < allColor.length; j++) {
        let currColor = allColor[j].classList[1];
        if (currColor == data.pencilColor) {
            allColor[j].classList.add("select");
            pencilColor = data.pencilColor;
        } else {
            allColor[j].classList.remove("select");
        }
    }
    eraserSize = data.eraserSize;
}
// add event listener to craete sticky notes & it's functionaities
let note = document.querySelector("#notes");
note.addEventListener('click', function (e) {
    // create sticky note 
    let div = document.createElement('div');
    div.classList.add("sticky-note");
    div.innerHTML = `<div class="header drag">
                        <div class="minimize"></div>
                        <div class="close"></div>
                    </div>
                    <div class="content">
                         <textarea class = "hideScrollBar"></textarea>
                    </div>`;

    div.style.left = (window.scrollX + 250) + "px";
    div.style.top = (window.scrollY + 250) + "px";

    body.appendChild(div); // append into body

    let header = div.querySelector(".header");

    // drag and drop implematation
    header.onmousedown = function (e) {
        dragAndDrop(div, e);
    };
    div.ondragstart = function () {
        return false;
    };

    // delete sticky note
    let close = div.querySelector('.close');
    addEventListenerForCloseStickyNote(close);

    // minimize sticky notes
    let minimize = div.querySelector(".minimize");
    addEventListenerForMinimizeStickyNote(minimize);
})

// delete stcicky notes funtionality
function addEventListenerForCloseStickyNote(close) {
    close.addEventListener("click", function (e) {
        let deleteTarget = e.currentTarget.parentNode.parentNode;
        deleteTarget.remove();
    })
}

// minimize stcicky notes funtionality
function addEventListenerForMinimizeStickyNote(minimize) {
    minimize.addEventListener("click", function (e) {
        let currStickyNote = e.currentTarget.parentNode.parentNode;
        let content = currStickyNote.querySelector(".content");

        let display = getComputedStyle(content).getPropertyValue("display");
        if (display === "none") {
            content.style.display = "block";
            currStickyNote.style.height = "13rem"
        }
        else {
            content.style.display = "none";
            currStickyNote.style.height = "2rem"
        }
    });
}

// drag & drop stcicky notes funtionality
function dragAndDrop(div, event) {

    let shiftX = event.clientX - div.getBoundingClientRect().left;
    let shiftY = event.clientY - div.getBoundingClientRect().top;

    div.style.position = 'absolute';
    div.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the div at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        div.style.left = pageX - shiftX + 'px';
        div.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the div on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    div.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        div.onmouseup = null;
    };
}

// add event listener to upload tool
upload.addEventListener("click", function () {
    // open dialogbox of file upload
    let input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.addEventListener("change", function () {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let div = document.createElement('div');
        div.classList.add("sticky-note");
        div.innerHTML = `<div class="header">
                        <div class="minimize"></div>
                        <div class="close"></div>
                    </div>
                    <div class="content">
                       <img src = "${url}" class = "sticky-img"></img> 
                    </div>`;

        body.appendChild(div); // append into body

        // drag and drop implematation
        let header = div.querySelector(".header");
        header.onmousedown = function (e) {
            dragAndDrop(div, e);
        };
        div.ondragstart = function () {
            return false;
        };

        // delete sticky note
        let close = div.querySelector('.close');
        addEventListenerForCloseStickyNote(close);

        // minimize sticky notes
        let minimize = div.querySelector(".minimize");
        addEventListenerForMinimizeStickyNote(minimize);
    })
})

// -----------------------------------------------------------

// RELETED TO CANVAS

// 2D not work so make sure you write 2d

tool.strokeStyle = pencilColor;
tool.lineWidth = pencilSize;

// ------- DRAW LINE ------------
let sx, sy;
let mouseDown = false;

canvasBoard.addEventListener("mousedown", function (e) {

    sx = e.clientX + window.scrollX;
    sy = e.clientY + window.scrollY;

    let data = {
        x: sx,
        y: sy
    };
    console.log("Sent By the client side down");
    socket.emit("mouseDownSock", data);

    // mouseDownSock(data);
});

function mouseDownSock(data) {
    mouseDown = true;

    sx = data.x;
    sy = data.y;

    if (activePencilOrEraser === "pencil") {
        tool.strokeStyle = pencilColor;
        tool.lineWidth = pencilSize;
    } else {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserSize;
    }
}

canvasBoard.addEventListener("mousemove", function (e) {

    if (mouseDown) {
        let ex = e.clientX + window.scrollX;
        let ey = e.clientY + window.scrollY;

        let data = {
            x: ex,
            y: ey
        };

        socket.emit("mouseMoveSock", data);
    }

    // mouseMoveSock(data);

});

function mouseMoveSock(data) {

    ex = data.x;
    ey = data.y;

    if (mouseDown) {
        tool.beginPath();
        tool.moveTo(sx, sy);
        tool.lineTo(ex, ey);
        tool.stroke();
        sx = ex; sy = ey;
    }
}

canvasBoard.addEventListener("mouseup", function () {
    console.log("Sent By the client side up");
    socket.emit("mouseUpSock");
    // mouseUpSock();
})

function mouseUpSock() {

    mouseDown = false;


    let url = canvasBoard.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
    console.log("yesssssssssssssssss", track);

    // let a = document.createElement("a");
    // a.href = url;
    // a.download = "board.jpg";
    // a.click();
}
// socket

socket.on("mouseDownSock", function (data) {
    console.log("BroadCat Down");
    mouseDownSock(data);
});
socket.on("mouseMoveSock", function (data) {
    console.log("BroadCat move");
    mouseMoveSock(data);
});
socket.on("mouseUpSock", function () {
    console.log("BroadCat up");
    mouseUpSock();
});


undo.addEventListener("click", function () {
    if (track > 0) {
        track = track - 1;
    }

    let trackObj = {
        trackValue: track,
        undoRedoTracker: undoRedoTracker
    }
    // undoRedoCanvas(trackObj);
    socket.emit("undoRedoSock", trackObj);
});

redo.addEventListener("click", function () {
    if (track < undoRedoTracker.length - 1) {
        track++;
    }
    let trackObj = {
        trackValue: track,
        undoRedoTracker: undoRedoTracker
    }
    // undoRedoCanvas(trackObj);
    socket.emit("undoRedoSock", trackObj);

});

socket.on("undoRedoSock", function (data) {
    undoRedoSock(data);
});

function undoRedoSock(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];

    // let a = document.createElement("a");
    // a.href = url;
    // a.download = "board.jpg";
    // a.click();

    let img = new Image();
    canvasBoard.getContext("2d").clearRect(0, 0, canvasBoard.width, canvasBoard.height);
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvasBoard.width, canvasBoard.height);
    }
}

// download ----------------------

download.addEventListener("click", function () {

    let url = canvasBoard.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

// IDE
let ide = document.querySelector(".ide");
let miniMax = document.querySelector(".minimize-maximize");
let IDEPos = "minimize";
let editor = document.querySelector(".editor");
let input = document.querySelector(".input");
let output = document.querySelector(".output");
let controlPanel = document.querySelector(".control-panel");
let completePart = document.querySelector(".ide");
controlPanel.onmousedown = function (e) {
    dragAndDrop(completePart, e);
};
controlPanel.ondragstart = function () {
    return false;
};


ide.style.left = (window.innerWidth / 2) + "px";
ide.style.top = "8.5rem";
ide.style.width = (window.innerWidth / 2) + "px";
ide.style.height = ((window.innerHeight * 76) / 100) + "px";

miniMax.addEventListener("click", function (e) {
    if (IDEPos === "minimize") {
        IDEPos = "maximize";
        ide.style.left = "0px";
        ide.style.top = "0px";
        ide.style.width = window.innerWidth + "px";
        ide.style.height = window.innerHeight + "px";
        editor.style.height = "65%";
        // output.style.height = "29%";
        // input.style.height = "29%";
        controlPanel.style.height = "6%";
    } else {
        IDEPos = "minimize";
        ide.style.left = (window.innerWidth / 2) + "px";
        ide.style.top = "8.5rem";
        ide.style.width = (window.innerWidth / 2) + "px";
        ide.style.height = ((window.innerHeight * 76) / 100) + "px";
        editor.style.height = "65%";
        // output.style.height = "29%";
        // input.style.height = "29%";
        controlPanel.style.height = "6%";
    }
})

let editorIcon = document.querySelector("#editorIcon");

let isVisibleEditor = false;
editorIcon.addEventListener("click", function (e) {
    if (isVisibleEditor == true) {
        isVisibleEditor = false;
        ide.style.display = "none";
    } else {
        isVisibleEditor = true;
        ide.style.display = "block";
    }
})
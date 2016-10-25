$(document).ready(function () {
    //Constants
    var bomb = "\u2688";
    var flag = "\u2691";
    var close = "\u2588";
    var BIG_BOOM = false;
    var OpenedCells = 0;
    var BOMBS = 10;
    var M = 9, N = 9;
    //Ctor for Cell object
function Cell(init) {
    this.State = close;
    this.Id = init;
    this.Mined = false;
    this.Closed = true;
    this.Flag = false;
    this.CountNeighborBombs = 0;
    this.IsMined = function() {
        return this.Mined;
    }
    this.IsSigned=function() {
        return this.Flag;
    }
    this.IsClosed = function () {
        return this.Closed;
    }
    this.open= function() {
        this.Closed = false;
        BIG_BOOM = this.Mined;
        if (!this.Mined) {
            OpenedCells++;
            this.State = this.CountNeighborBombs.toString();
            if (OpenedCells == (M * N) - BOMBS)
                alert("You won!");
        } else {
            this.State = bomb;
            alert("You lost!");
        }
    }
}
    //Function for bombs computing around cell
var ComputeBombs= function(data) {
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            if (!data[i][j].IsMined()) {
                var count = 0;
                for (var di = -1; di < 2; di++) {
                    for (var dj = -1; dj < 2; dj++) {
                        var y = i + di;
                        var x = j + dj;
                        if (y < 0 || y > M - 1 || x < 0 || x > N - 1) continue; //Bad coordinates
                        count += (data[y][x].IsMined()) ? 1 : 0;    
                    }
                }
                data[i][j].CountNeighborBombs = count;
            }
        }
    }
}
var OpenCells=function(i, j) {
    if (i < 0 || i > M - 1 || j < 0 || j > N - 1) return; //Bad coordinates
    if (!cels[i][j].IsClosed()) return; // Cell is opened
    cels[i][j].open();
    if (cels[i][j].CountNeighborBombs > 0 || BIG_BOOM) return; //Cell not empty or player  lost
    for (var di = -1; di < 2; di++) {
        for (var dj = -1; dj < 2; dj++) {
            OpenCells(i+di,j+dj); //Open cells around this cell
        }
    }
}
    //Function for initialization of area
var Init= function(array) {
    var i, j, k = 0;
    var tmpIJ = [];//temporary
    var min = 0, max = N - 1;
    while (k < BOMBS) {
        i = Math.floor(Math.random() * (max - min)) + min;
        j = Math.floor(Math.random() * (max - min)) + min;
        if (!array[i][j].IsMined() && array[i][j]) {
            tmpIJ.push([i,j]);
            array[i][j].Mined = true;
            k++;
        }
    }
    console.log(tmpIJ);
}
    //Creation array for plaing area
var cels = new Array(M);
    for (var i = 0; i < cels.length; i++)
        cels[i] = new Array(N);
    for (var rows = 0; rows < cels.length; rows++) {
        for (var col = 0; col < cels[rows].length; col++) {
            cels[rows][col] = new Cell([rows, col]);
        }
    }
    //Initialization of area
    Init(cels);

    //Computing neighborBombs
    ComputeBombs(cels);

    //ViewModel 
    var VM = {
       xells: ko.mapping.fromJS(cels),
       Name: ko.observable('Roman'),
       Swap: function(e) {
           var t = e.Id();
           var i = t[0], j = t[1];
           OpenCells(i,j);
           Update(cels);
       },
        Flag: function(e) {
            var t = e.Id();
            var tmp = cels[t[0]][t[1]];
            tmp.State = flag;
            Update(cels);
        }
    };

    function Update(data) {
        ko.mapping.fromJS(data,VM.xells);
    }
    function handler(event) {
    var target = event.target;
        
        //alert(event.target.innerHTML);
        var tds = 0;
        var trs = 0;
        while (target != this) {
            if (target.tagName == 'TD')
                tds++;
            if (target.tagName == 'TR')
                trs++;
            //console.log(target);
            if (!target.previousSibling) {
                target = target.parentNode;
                if (target == this) {
                  //  alert(event.target.tagName);
                   // alert("[" + trs + "]" + "[" + (tds-1) + "]");
                    return;
                }
            }
            target = target.previousSibling;
        }
    };
   // $('table').on('click', handler); 
//VM.Name(i);
ko.applyBindings(VM);
});
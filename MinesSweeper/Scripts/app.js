$(document).ready(function () {
    //Constants
    var bomb = "\u2688";
    var flag = "\u2691";
    var close = "\u2588";
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
}
    //Function for bombs computing around cell
var ComputeBombs= function(data) {
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            if (data[i][j].IsMined()) {
                continue;
            }
            else {
                if ((i-1)>=0 && data[i - 1][j].IsMined())
                    data[i][j].CountNeighborBombs += 1;

                if ((i-1)>=0 && (j-1)>=0 && data[i - 1][j-1].IsMined())
                    data[i][j].CountNeighborBombs += 1;

                if ((i - 1) >= 0 && (j + 1) <N && data[i - 1][j + 1].IsMined())
                    data[i][j].CountNeighborBombs += 1;

                if ((i + 1) < M && data[i + 1][j].IsMined())
                    data[i][j].CountNeighborBombs += 1;

                if ((i + 1) < M && (j - 1) >=0 && data[i + 1][j - 1].IsMined())
                    data[i][j].CountNeighborBombs += 1;

                if ((i + 1) < M && (j + 1) < N && data[i + 1][j + 1].IsMined())
                    data[i][j].CountNeighborBombs += 1;

                if ((j - 1) >= 0 && data[i][j - 1].IsMined())
                    data[i][j].CountNeighborBombs += 1;

                if ((j + 1) < N && data[i][j + 1].IsMined())
                    data[i][j].CountNeighborBombs += 1;
            }
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
           //console.log(e.State + " " + e.Id[0] + e.Id[1] + e.Id);
         //  console.log(cels);
           //console.log(e.State());
           //console.log(e.Id());
           var t = e.Id();
           var i = t[0], j = t[1];
          // e.State = bomb;
          // console.log(e.State);
           var tmp = cels[i][j];
           if (tmp.IsMined())
               tmp.State = bomb;
           else
               tmp.State = tmp.CountNeighborBombs.toString();
           Update(cels);
          // console.log(cels);
       },
        Flag: function(e) {
           // console.log(e.State());
            var t = e.Id();
           //e.State = flag;
            var tmp = cels[t[0]][t[1]];
            tmp.State = flag;
            Update(cels);
        }
    };

    function Update(data) {
        ko.mapping.fromJS(data,VM.xells);
        //VM.xells = data;
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
<style>
    #SVG {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(50, 50, 50);
    }
    :global(path) {
        stroke-linejoin: round;
        stroke: url(#imagePattern);
        stroke-opacity: 0.8;
        stroke-width:10px;
        fill: url(#imagePattern);
    }
</style>
<svg id="SVG" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <pattern id="imagePattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <image href="/images/assets/Grass.png" cx="0" cy="0" width="200" height="200"/>
        </pattern>
    </defs>
</svg>
<script>
    import { onMount } from "svelte";
    function GenerateSVGFillArea(Areas) {
        Areas.sort(sortByXY);
        let Points = [];
        for (let i = 0; i < Areas.length; i++) {
            if (!Points.some(pos => pos.x === Areas[i].x-0.5 && pos.y === Areas[i].y-0.5)) {
                Points.push({x:Areas[i].x-0.5,y:Areas[i].y-0.5});
            }
            if (!Points.some(pos => pos.x === Areas[i].x+0.5 && pos.y === Areas[i].y-0.5)) {
                Points.push({x:Areas[i].x+0.5,y:Areas[i].y-0.5});
            }
            if (!Points.some(pos => pos.x === Areas[i].x+0.5 && pos.y === Areas[i].y+0.5)) {
                Points.push({x:Areas[i].x+0.5,y:Areas[i].y+0.5});
            }
            if (!Points.some(pos => pos.x === Areas[i].x-0.5 && pos.y === Areas[i].y+0.5)) {
                Points.push({x:Areas[i].x-0.5,y:Areas[i].y+0.5});
            }
        }
        for (let i = 0; i < Points.length; i++) {
            if (IsPointSurrounded(Points,Points[i])) {
                Points.splice(i,1);
                i--;
            }
        }
        let PathPoints = [Points[0]];
        Points.splice(0,1);
        let NextPoint = {};
        
        for (let i = 0; i < Points.length; i++) {
            if (i>=0 && !PathPoints.includes(Points[i])) {
                if (PathPoints[PathPoints.length-1].x+1 == Points[i].x && PathPoints[PathPoints.length-1].y == Points[i].y) {
                    NextPoint = {...Points[i],Direction:"Right",Index:i.toString()};
                } else if (PathPoints[PathPoints.length-1].x == Points[i].x && PathPoints[PathPoints.length-1].y+1 == Points[i].y && NextPoint.Direction != "Right") {
                    NextPoint = {...Points[i],Direction:"Up",Index:i.toString()};
                }else if (PathPoints[PathPoints.length-1].x-1 == Points[i].x && PathPoints[PathPoints.length-1].y == Points[i].y && NextPoint.Direction != "Right" && NextPoint.Direction != "Up") {
                    NextPoint = {...Points[i],Direction:"Left",Index:i.toString()};
                } else if (PathPoints[PathPoints.length-1].x == Points[i].x && PathPoints[PathPoints.length-1].y-1 == Points[i].y && NextPoint.Direction != "Right" && NextPoint.Direction != "Up" && NextPoint.Direction != "Left") {
                    NextPoint = {...Points[i],Direction:"Down",Index:i.toString()};
                } 
            }
            if (i == Points.length-1 && NextPoint.Direction != null) {
                PathPoints.push({x:NextPoint.x,y:NextPoint.y,Direction:NextPoint.Direction});
                Points.splice(parseInt(NextPoint.Index),1);
                NextPoint = {};
                i=-1;
            }
        }
        console.log(PathPoints);
        document.getElementById("SVG").innerHTML += "<path d='"+createSVGPath(PathPoints)+"'>";
    }
    function SvgUsableDirections(Array, Position) {
        let Directions = [];
        for (let i = 0; i < Array.length; i++) {
            
        }
    }
    
    function IsPointSurrounded(Array, Position) {
        let Surroundings = 0;
        for (let i = 0; i < Array.length; i++) {
            if ((Array[i].x+1 >= Position.x && Position.x >= Array[i].x-1) && (Array[i].y+1 >= Position.y && Position.y >= Array[i].y-1) && Array[i] != Position) {
                Surroundings++;
                if (Surroundings>=8) console.log(Position,true,Surroundings);
                if (Surroundings>=8) return true;
            }
        }
        return false;
    }
    function createSVGPath(positions) {
        return "M" + positions.map(({ x, y }) => `${x*100} ${y*100}`).join(' L ') + ' Z';
    }

    // Custom sorting function
    function sortByXY(a, b) {
        if (a.y !== b.y) {
            return a.y - b.y; // Sort by y first
        } else {
            return a.x - b.x; // If y values are equal, sort by x
        }
    }
    function FindAllConnectedPoints(PositionArray) {
        let ReturnArrays = PositionArray.length > 0 && Array.isArray(PositionArray[0]) ? PositionArray[0] : [];
        if (PositionArray.length > 0 && Array.isArray(PositionArray[0])) {
            PositionArray.splice(0,1);
        }
        let Continue = false;
        for (let i = 0; i < PositionArray.length; i++) {
            let NewArray = true;
            for (let j = 0; i < PositionArray.length && j < ReturnArrays.length; j++) {
                if (IsPositionCloseInArray(ReturnArrays[j],PositionArray[i])) {
                    ReturnArrays[j].push(PositionArray[i]);
                    NewArray = false;
                    Continue = true;
                    PositionArray.splice(i,1);
                    i = Math.max((i-1),0);
                }
            }
            if (NewArray) {
                ReturnArrays.push([PositionArray[i]]);
                Continue = true;
                PositionArray.splice(i,1);
                i--;   
            }
        }
        for (let i = 0; i < ReturnArrays.length; i++) {
            for (let j = 0; i < ReturnArrays.length && j < ReturnArrays.length; j++) {
                if (j!=i) {
                    for (let l = 0; i < ReturnArrays.length && j < ReturnArrays.length && l < ReturnArrays[j].length; l++) {
                        if (IsPositionCloseInArray(ReturnArrays[i],ReturnArrays[j][l])) {
                            ReturnArrays[i] = [...ReturnArrays[i],...ReturnArrays[j]];
                            ReturnArrays.splice(j,1);
                            j = Math.max((j-1),0);
                            i = Math.max((i-1),0);
                            l = 1000000000000000;
                        }
                    }
                }
            }
        }
        if (Continue) {
            ReturnArrays = [ReturnArrays,...PositionArray];
            ReturnArrays = FindAllConnectedPoints(ReturnArrays);
        }
        
        return ReturnArrays;
    }
    function IsPositionCloseInArray(Array,Position) {
        for (let i = 0; i < Array.length; i++) {
            if ((Array[i].x+1 >= Position.x && Position.x >= Array[i].x-1) && (Array[i].y+1 >= Position.y && Position.y >= Array[i].y-1) && (Array[i].x == Position.x || Array[i].y == Position.y)) {
                return true;
            }
        }
        return false;
    }
    let PointArray = [
        {x:2,y:1},
        {x:2,y:2},
        {x:6,y:1},
        {x:6,y:2},
        {x:2,y:4},
        {x:6,y:4},
        {x:3,y:5},
        {x:4,y:5},
        {x:5,y:5}
    ]
    onMount(async() => {
        let Areas = FindAllConnectedPoints(PointArray);
        for (let i = 0; i < Areas.length; i++) {
            GenerateSVGFillArea(Areas[i]);
        }
        
    })
</script>
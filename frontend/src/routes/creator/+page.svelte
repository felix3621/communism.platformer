<head>
    <title>Creator</title>
</head>
<style>
    #Background {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url(/images/backgrounds/Bricks.png);
        background-size: contain;
        pointer-events: none;
    }
    #Tabs {
        position: absolute;
        top: 10px;
        left: 160px;
        bottom: 10px;
        right: 10px;
        color: white;
    }
    #TabButtons {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: row;
    }
    :global(#TabButtons > *) {
        margin: 0;
        color: white;
        background-color: rgb(50, 50, 50);
    }
    #TabItems {
        position: absolute;
        left: 0;
        top: 20px;
        bottom: 0;
        background-color: rgb(50, 50, 50);
        outline: 5px white solid;
        width: 150px;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        color: white;
    }
    :global(::-webkit-scrollbar) {
        background-color: rgb(50, 50, 50);
        outline: 2px white solid; 
        width: 10px;
    }
    :global(::-webkit-scrollbar-thumb) {
        background-color: rgb(75, 75, 75);
        outline: 2px white solid; 
        width: 10px;
    }
    :global(#TabItems *) {
        margin: 0;
        cursor: pointer;
    }
    :global(.TextureDropDown) {
        position: fixed;
        height: 100px;
        background-color: rgb(50, 50, 50);
        outline: 2px white solid;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
    }
    :global(.TextureDropDown *) {
        cursor: pointer;
        margin: 0;
    }
    :global(.TextureDropDown *:not(div)) {
        float: left;
    }
    #MapDisplay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
    }
    #MapGrid {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        background-image: url(/images/assets/Grid.png);
    }
    #MapLayers {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    :global(#MapLayers > div) {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    :global(svg) {
        position: absolute;
        z-index: 110;
    }
</style>
<div id="Background"></div>
<div id="MapDisplay">
    <div id="MapLayers"></div>
    <div id="MapGrid"></div>
</div>
<div id="Tabs">
    <div id="MapCreator">
        <div id="MapInfo"></div>
        <div id="MapLayersSelector"></div>
        <div id="MapAsstSelector"></div>
    </div>
    <div id="AssetCreator"></div>
    <div id="ItemsCreator"></div>
    <div id="EnemyCreator"></div>
    <div id="ClassCreator"></div>
</div>
<div id="TabItems"></div>
<div id="TabButtons">
    <button on:click={()=>{SetTab(0)}}>Map</button>
    <button on:click={()=>{SetTab(1)}}>Assets</button>
    <button on:click={()=>{SetTab(2)}}>Items</button>
    <button on:click={()=>{SetTab(3)}}>Enemy</button>
    <button on:click={()=>{SetTab(4)}}>Classes</button>
    <button on:click={()=>{SaveInfo()}}>Save!</button>
    <input type="file" id="UploadImageBtn" accept="image/png, image/jpeg, image/gif, image/jpg">
</div>
<script>
    import { onMount } from "svelte";
    var CurrentTab = 0;
    var Info = {
        Map: {},
        Assets: {},
        Items: {},
        Enemy: {},
        Class: {},
        Textures: {}
    }
    var MapPrefab = {
        Name:"No-Name",
        Description:"",
        BaseTexture:"Grass",
        Layers:[]
    }
    var AssetPrefab = {
        Name:"",
        Description:"",
        Height:1,
        Width:1,
        Texture:""
    }
    var ItemPrefab = {
        Name:"",
        Description:"",
        Texture:"",
        Damage: 1
    }
    var EnemyPrefab = {
        Name:"",
        Description:"",
        Texture:"",
        Size: 1,
        Attack: 1,
        Health: 1
    }
    var ClassPrefab = {
        Name:"",
        Description:""
    }
    var MapDisplay = null;
    function MapsTab() {
        let Tab = document.getElementById("MapCreator");
        let TabItemHolder = document.getElementById("TabItems");
        TabItemHolder.innerHTML = "<h1 style='margin:0;text-align:center;'>Maps</h1><hr>";
        let AddBtn = document.createElement("Button");
        AddBtn.innerHTML = "Add";
        AddBtn.addEventListener("click",()=>{Info.Map["new"+NewAmount] = {...MapPrefab}; NewAmount++; MapsTab()});
        TabItemHolder.appendChild(AddBtn);
        for (let key in Info.Map) {
            if (Info.Map[key].State != "remove") {
                let Item = document.createElement("div");
                TabItemHolder.appendChild(Item);
                Item.classList.add("Item");

                if (Info.Map[key].Name) { // Do it have a name property then use it else dont
                    var Name = document.createElement("h1");
                    Name.innerHTML = Info.Map[key].Name;
                    Item.appendChild(Name);
                } else {
                    var Name = document.createElement("h1");
                    Name.innerHTML = key;
                    Item.appendChild(Name);
                }
                Name.style.width = "90%";
                Name.style.float = "left";
                Name.style.maxWidth = "90%";
                Name.style.overflow = "hidden";
                // Remove Button
                let RemoveBtn = document.createElement("h1");
                RemoveBtn.innerHTML = "&#128465";
                // Remove Entery
                RemoveBtn.addEventListener("click", () => {Info.Map[key].State = "remove";});
                RemoveBtn.style.width = "10%";
                RemoveBtn.style.float = "right";
                Item.appendChild(RemoveBtn);
                
                Item.addEventListener("click", ()=>{
                    setTimeout(()=>{
                        if (Info.Map[key].State != "remove") {
                            // Click Event
                        } else {
                            MapsTab();
                        }
                        
                    },100);
                });
                if (Info.Map[key].Description) { // If Description property then use it
                    let Description = document.createElement("p");
                    Description.innerHTML = Info.Map[key].Description;
                    Description.style.float = "left";
                    Item.appendChild(Description);
                }
            }
        }
        console.log(Info.Map)
        GenerateMap(Info.Map["0"], 0,0, 2);
    }
    function GenerateMap(Map,X,Y, zoom) {
        MapDisplay.style.display = "block";
        if (Map.BaseTexture != null && Info.Textures[Map.BaseTexture]) {
            MapDisplay.style.backgroundImage = "url(/images/assets/"+Info.Textures[Map.BaseTexture]+")" ;
            MapDisplay.style.backgroundSize = zoom + "%";
            MapDisplay.style.backgroundColor = "";
        } else {
            MapDisplay.style.backgroundImage = "";
            MapDisplay.style.backgroundColor = "rgb(0,0,0)";
        }
        document.getElementById("MapGrid").style.backgroundSize = zoom + "%";

        let MapLayers = document.getElementById("MapLayers");
        for (let i = 0; i < Map.Layers.length; i++) {
            for (let key in Map.Layers[i]) {
                let Asset = FindAssetByName(key);
                let Layer = document.createElement("div");
                // What Asset Type Is It
                console.log(Asset, key)
                if (Asset && Asset.Type == "ConnectedTexture") {
                    let Bodys = FindAllConnectedPoints([...Map.Layers[i][key]]);
                    for (let j = 0; j < Bodys.length; j++) {
                        let Svg = document.createElement("svg");
                        Svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
                        Layer.appendChild(Svg);
                        let SvgPath = document.createElement("path");
                        Svg.appendChild(SvgPath);
                        SvgPath.style.backgroundColor = "white";
                        SvgPath.setAttribute('d', createSVGPath(Bodys[j]));
                        SvgPath.innerHTML = "";
                        Svg.style.display = "none";
                        Svg.offsetHeight; // Trigger reflow
                        Svg.style.display = "block";
                        Svg.innerHTML = Svg.innerHTML + " ";
                        let updateEvent = new Event("update");
                        Svg.dispatchEvent(updateEvent);
                    }
                } else {

                }
                MapLayers.appendChild(Layer);
            }
        }
    }
    // Function to create an SVG path with rectangles at each position
    function createSVGPath(positions, cellSize = 100) {
        positions.sort(sortByXY);
        return "M" + positions.map(({ x, y }) => `${x*100} ${y*100}`).join(' L ') + ' Z';
    }

    // Custom sorting function
    function sortByXY(a, b) {
        if (a.x !== b.x) {
            return a.x - b.x; // Sort by x first
        } else {
            return a.y - b.y; // If x values are equal, sort by y
        }
    }
    function FindAssetByName(Name) {
        for (let key in Info.Assets) {
            console.log(Info.Assets[key])
            if (Info.Assets[key].Name == Name) {
                return Info.Assets[key];
            }
        }
        return null;
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
                console.log(PositionArray.length,i,j)
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
            console.log(Position);
            if ((Array[i].x+1 >= Position.x && Position.x >= Array[i].x-1) && (Array[i].y+1 >= Position.y && Position.y >= Array[i].y-1) && (Array[i].x == Position.x || Array[i].y == Position.y)) {
                return true;
            }
        }
        return false;
    }
    onMount(async() => {
        let user = await fetch(window.location.origin+'/api/account/login', {
            method: 'POST',
            headers: {
	    		'Content-Type': 'application/json',
	    	}
        });
        if (user.ok) {
            let userData = await user.json();
            if (!userData.admin)
                window.location.href = "/";
        } else {
            window.location.href = "/";
        }
        MapDisplay = document.getElementById("MapDisplay");
        GetInfo();
        SetTab(2);
        document.getElementById("UploadImageBtn").addEventListener("change", (e) => {
            const imgDetails = document.querySelector("input[type=file]").files[0];
            if (imgDetails) {
                SaveImage(imgDetails, e);
            } else {
                console.error("Please select a picture");
            }
        })
    });
    async function GetInfo() {
        Info.Textures = await (await fetch(window.location.origin+'/api/info/textures', {
            method: 'GET',
            headers: {
	    		'Content-Type': 'application/json',
	    	}
        })).json();
        Info.Assets = await (await fetch(window.location.origin+'/api/info/assets', {
            method: 'GET',
            headers: {
	    		'Content-Type': 'application/json',
	    	}
        })).json();
        Info.Items = await (await fetch(window.location.origin+'/api/info/items', {
            method: 'GET',
            headers: {
	    		'Content-Type': 'application/json',
	    	}
        })).json();
        Info.Enemy = await (await fetch(window.location.origin+'/api/info/enemy', {
            method: 'GET',
            headers: {
	    		'Content-Type': 'application/json',
	    	}
        })).json();
        Info.Map = await (await fetch(window.location.origin+'/api/info/map', {
            method: 'GET',
            headers: {
	    		'Content-Type': 'application/json',
	    	}
        })).json();
        Info.Class = await (await fetch(window.location.origin+'/api/info/class', {
            method: 'GET',
            headers: {
	    		'Content-Type': 'application/json',
	    	}
        })).json();
        SetTab(CurrentTab);
    }
    function SetTab(Index = CurrentTab) {
        let TabParent = document.getElementById("Tabs");
        for (let i = 0; i < TabParent.children.length; i++) {
            if (i == Index) {
                TabParent.children[i].style.display = "block"; 
            } else {
                TabParent.children[i].style.display = "none";
            }
        }
        if (Index == 0) {
            MapsTab();
        } else if (Index == 1) {
            AssetsTab();
        } else if (Index == 2) {
            ItemsTab();
        } else if (Index == 3) {
            EnemyTab();
        } else if (Index == 4) {
            ClassTab();
        }
        CurrentTab = Index;
    }
    let NewAmount = 0;
    function UpdateTabItems(Items, Tab, Type) {
        MapDisplay.style.display = "none";
        let TabItemHolder = document.getElementById("TabItems");
        TabItemHolder.innerHTML = "<h1 style='margin:0;text-align:center;'>Entries</h1><hr>";
        let AddBtn = document.createElement("Button");
        AddBtn.innerHTML = "Add";
        if (Type == "Assets") {
            AddBtn.addEventListener("click",()=>{Items["new"+NewAmount] = {...AssetPrefab}; Tab.innerHTML = ""; Tab.appendChild(GenerateEntries(Items["new"+NewAmount])); NewAmount++; UpdateTabItems(Items,Tab,Type)});
        } else if (Type == "Items") {
            AddBtn.addEventListener("click",()=>{Items["new"+NewAmount] = {...ItemPrefab}; Tab.innerHTML = ""; Tab.appendChild(GenerateEntries(Items["new"+NewAmount])); NewAmount++; UpdateTabItems(Items,Tab,Type)});
        } else if (Type == "Enemy") {
            AddBtn.addEventListener("click",()=>{Items["new"+NewAmount] = {...EnemyPrefab}; Tab.innerHTML = ""; Tab.appendChild(GenerateEntries(Items["new"+NewAmount])); NewAmount++; UpdateTabItems(Items,Tab,Type)});
        } else if (Type == "Class") {
            AddBtn.addEventListener("click",()=>{Items["new"+NewAmount] = {...ClassPrefab}; Tab.innerHTML = ""; Tab.appendChild(GenerateEntries(Items["new"+NewAmount])); NewAmount++; UpdateTabItems(Items,Tab,Type)});
        }
        TabItemHolder.appendChild(AddBtn);
        if (Items.constructor === Object) { // Object
            for (let key in Items) {
                if (Items[key].State != "remove") {
                    let Item = document.createElement("div");
                    TabItemHolder.appendChild(Item);
                    Item.classList.add("Item");

                    if (Items[key].Name) { // Do it have a name property then use it else dont
                        var Name = document.createElement("h1");
                        Name.innerHTML = Items[key].Name;
                        Item.appendChild(Name);
                    } else {
                        var Name = document.createElement("h1");
                        Name.innerHTML = key;
                        Item.appendChild(Name);
                    }
                    Name.style.width = "90%";
                    Name.style.float = "left";
                    Name.style.maxWidth = "90%";
                    // Remove Button
                    let RemoveBtn = document.createElement("h1");
                    RemoveBtn.innerHTML = "&#128465";
                    RemoveBtn.addEventListener("click", () => {Items[key].State = "remove";});
                    RemoveBtn.style.width = "10%";
                    RemoveBtn.style.float = "right";
                    Item.appendChild(RemoveBtn);
                    // Remove Entery
                    Item.addEventListener("click", ()=>{
                        setTimeout(()=>{
                            if (Items[key].State != "remove") {
                                Tab.innerHTML = ""; 
                                Tab.appendChild(GenerateEntries(Items[key]));
                            } else {
                                SetTab(CurrentTab);
                            }
                            
                        },100);
                    });
                    if (Items[key].Description) { // If Description property then use it
                        let Description = document.createElement("p");
                        Description.innerHTML = Items[key].Description;
                        Description.style.float = "left";
                        Item.appendChild(Description);
                    }
                }
                
            }
        }
    }
    function TextureDropDown(InputField, Object, Option = null, Open = false, ImagePreview = null) {
        if (!Option) {
            Option = document.createElement("div");
            Option.classList.add("TextureDropDownPart");
            Option.classList.add("TextureDropDown");
            Option.style.display = "none";
            InputField.addEventListener("click", ()=>{
                TextureDropDown(InputField, Object, Option, true, ImagePreview);
            });
            InputField.addEventListener('blur', () => {
                setTimeout(()=>{TextureDropDown(InputField, Object, Option, false, ImagePreview);},100);
            });
            InputField.addEventListener("input",()=>{
                setTimeout(()=>{
                    TextureDropDown(InputField, Object, Option, true, ImagePreview)
                },100);
            });
        }
        Option.style.display = Open ? "flex" : "none";
        
        InputField.parentNode.appendChild(Option);
        let boundReact = InputField.getBoundingClientRect();
        Option.style.top = boundReact.bottom + "px";
        Option.style.left = boundReact.left + "px";
        Option.style.width = (boundReact.right - boundReact.left) + "px";
        Option.innerHTML = "";
        for (let key in Info.Textures) {
            if (key.startsWith(InputField.value)) {
                let Container = document.createElement("div");
                let TextureName = document.createElement("h1");
                TextureName.innerHTML = key.replace(new RegExp(InputField.value, 'g'), '<span style="color:green;">$&</span>');
                TextureName.classList.add("TextureDropDownPart");
                TextureName.style.width = "80%";
                let Texture = document.createElement("img");
                Texture.src = "/images/assets/"+Info.Textures[key];
                Container.appendChild(Texture);
                Texture.style.width = "15%";
                TextureName.style.color = "red";
                TextureName.addEventListener("click",()=>{Object["Texture"] = key; InputField.value = key; Object["State"] = "change"; });
                Container.appendChild(TextureName);
                Option.appendChild(Container);
            }
        }
        if (!ImagePreview) {
            ImagePreview = document.createElement("img");
            ImagePreview.src = Info.Textures[InputField.value] != null?"/images/assets/"+Info.Textures[InputField.value]:"";
            ImagePreview.style.width = "25px";
            InputField.parentNode.appendChild(ImagePreview);
            
        }
        if (Info.Textures[InputField.value] != null) {
            ImagePreview.style.display = "block";
            ImagePreview.src = "/images/assets/"+Info.Textures[InputField.value];
        } else {
            ImagePreview.style.display = "none";
        } 
        
    }
    function AssetsTab() {
        UpdateTabItems(Info.Assets, document.getElementById("Tabs").children[1], "Assets");
    }
    function ItemsTab() {
        UpdateTabItems(Info.Items, document.getElementById("Tabs").children[2], "Items");
    }
    function EnemyTab() {
        UpdateTabItems(Info.Enemy, document.getElementById("Tabs").children[3], "Enemy");
    }
    function ClassTab() {
        UpdateTabItems(Info.Class, document.getElementById("Tabs").children[4], "Class");
    }

    function GenerateEntries(Object) {
        let Holder = document.createElement("div");
        for (let key in Object) {
            if (key != "State") {
                let Paramiter = document.createElement("p");
                Paramiter.innerHTML = key;
                Holder.appendChild(Paramiter);

                let InputField = document.createElement("input");
                InputField.value = Object[key];
                
                Holder.appendChild(InputField);
                if (key == "Texture") {
                    InputField.classList.add("TextureDropDownPart");
                    InputField.style.float = "left"
                    TextureDropDown(InputField, Object);
                }
                InputField.oninput = ()=> {
                    Object[key] = InputField.value; 
                    Object.State = "change"; 
                    SetTab(CurrentTab); 
                };
                let Break = document.createElement("br");
                Holder.appendChild(Break);
            }
        }
        return Holder;
    }
    async function SaveInfo() {
        console.log("Send Info")
        await fetch(window.location.origin+'/api/info/', {
            method: 'POST',
            headers: {
	    		'Content-Type': 'application/json',
	    	},
            body: JSON.stringify({
                textures: Info.Textures,
                assets: Info.Assets,
                items: Info.Items,
                class: Info.Class,
                enemy: Info.Enemy,
                map: Info.Map
            })
        });
        GetInfo();
    }
    function SaveImage(imgD, e) {
        const reader = new FileReader();

        // PREVIEW
        reader.addEventListener("load", async function () {
            let name = imgD.name.split(".")
            name.pop()
            name.join(".")

            const fd = new FormData();
            fd.append('file', e.target.files[0])
            
            await fetch(window.location.origin+'/api/assets/'+name, {
                method: 'POST',
                body: fd
            });
            GetInfo();
        })

        // CHECK IF THERE IS SELECTION 
        if (imgD) {
            // CHECK IF THE FILE IS AN IMAGE
            if (imgD.type === "image/jpeg" || imgD.type == "image/jpg" || imgD.type == "image/gif" || imgD.type == "image/png") {

                // CONVERTS FILE TO BASE 64
                reader.readAsDataURL(imgD);
            } else {
                document.getElementById("imagePreview").src = "";
            }
        }
        // IF NO IMAGE
        else {
            document.getElementById("imagePreview").src = ""
        }
    }
</script>
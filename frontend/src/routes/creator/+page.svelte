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
    #imagePreview {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        max-height: 80%;
        max-width: 80%;
    }
</style>
<div id="Background"></div>
<div id="Tabs">
    <div id="MapCreator"></div>
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
        let TabItemHolder = document.getElementById("TabItems");
        TabItemHolder.innerHTML = "<h1 style='margin:0;text-align:center;'>Entries</h1><hr>";
        let AddBtn = document.createElement("Button");
        AddBtn.innerHTML = "Add";
        if (Type == "Map") {
            AddBtn.addEventListener("click",()=>{Items["new"+NewAmount] = {...MapPrefab}; Tab.innerHTML = ""; Tab.appendChild(GenerateEntries(Items["new"+NewAmount])); NewAmount++; UpdateTabItems(Items,Tab,Type)});
        } else if (Type == "Assets") {
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
    function MapsTab() {
        UpdateTabItems(Info.Map, document.getElementById("Tabs").children[0], "Map");
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
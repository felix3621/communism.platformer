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
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
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
        top: 25px;
        bottom: 0;
        background-color: rgb(50, 50, 50);
        outline: 5px white solid;
        min-width: 150px;
        max-width: 200px;
        overflow-y: scroll;
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
</style>
<div id="Background"></div>
<div id="Tabs">
    <div id="MapCreator"></div>
    <div id="AssetCreator"></div>
    <div id="ToolCreator"></div>
    <div id="EnemyCreator"></div>
    <div id="ClassCreator"></div>
</div>
<div id="TabItems"></div>
<div id="TabButtons">
    <button on:click={()=>{SetTab(0)}}>Map</button>
    <button on:click={()=>{SetTab(1)}}>Assets</button>
    <button on:click={()=>{SetTab(2)}}>Tool</button>
    <button on:click={()=>{SetTab(3)}}>Enemy</button>
    <button on:click={()=>{SetTab(4)}}>Classes</button>
</div>
<script>
    import { onMount } from "svelte";
    var CurrentTab = 0;
    var Info = {
        Map: [],
        Assets: [],
        Tools: [],
        Enemy: [],
        Classes: [],
        Textures: []
    }

    onMount(() => console.log("yeet"))

    /*onMount(async() => {
        console.log("test")
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
        console.log("test2")
        SetTab(2);
    });*/
    async function GetInfo() {

        SetTab(CurrentTab);
    }
    function SetTab(Index = CurrentTab) {
        console.log(Index);
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
            ToolsTab();
        }
        CurrentTab = Index;
    }
    function UpdateTabItems(Array) {
        console.log(Array)
        let TabItemHolder = document.getElementById("TabItems");
        TabItemHolder.innerHTML = "<h1>Items</h1>";
        for (let i = 0; i < Array.length; i++) {
            let Item = document.createElement("div");
            TabItemHolder.appendChild(Item);
            Item.classList.add("Item");

            if (Array[i].Name) {
                let Name = document.createElement("h5");
                Name.innerHTML = Array[i].Name;
                Item.appendChild(Name);
            }
            if (Array[i].Description) {
                let Description = document.createElement("p");
                Description.innerHTML = Array[i].Description;
                Item.appendChild(Description);
            }
        }
    }
    function MapsTab() {
        UpdateTabItems(Info.Map);
    }
    function AssetsTab() {
        UpdateTabItems(Info.Assets);
    }
    function ToolsTab() {
        UpdateTabItems(Info.Tools);
    }
</script>
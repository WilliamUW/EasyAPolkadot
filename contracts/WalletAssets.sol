// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.19;

contract WalletAssets {
    struct Asset {
        string name;
        string modelUrl;
        string thumbnailUrl;
        string description;
    }

    // Mapping from asset ID to Asset
    mapping(uint256 => Asset) private assets;
    uint256 private nextAssetId;

    // Mapping from wallet address to an array of asset IDs
    mapping(address => uint256[]) private walletAssets;

    // Constructor to autopopulate assets on deployment
    constructor() {
        autopopulateAssets();
    }

    // Event to emit when an asset is added
    event AssetAdded(uint256 indexed assetId, address indexed owner, string name);
    // Event to emit when an asset is added to a wallet
    event AssetAddedToWallet(uint256 indexed assetId, address indexed wallet);

    // Function to add a new asset
    function addAsset(string memory _name, string memory _modelUrl, string memory _thumbnailUrl, string memory _description) public {
        uint256 assetId = nextAssetId++;
        assets[assetId] = Asset(_name, _modelUrl, _thumbnailUrl, _description);
        walletAssets[msg.sender].push(assetId);
        emit AssetAdded(assetId, msg.sender, _name);
    }

    // Function to get asset details
    function getAsset(uint256 _assetId) public view returns (string memory, string memory, string memory, string memory) {
        Asset memory asset = assets[_assetId];
        return (asset.name, asset.modelUrl, asset.thumbnailUrl, asset.description);
    }

    // Function to get all asset IDs for a wallet
    function getAssetIds(address _wallet) public view returns (uint256[] memory) {
        return walletAssets[_wallet];
    }

    // Function to get the number of assets for a wallet
    function getAssetCount(address _wallet) public view returns (uint256) {
        return walletAssets[_wallet].length;
    }

    // Function to clear all assets for the sender's wallet
    function clearAssets() public {
        uint256[] storage userAssets = walletAssets[msg.sender];
        for (uint256 i = 0; i < userAssets.length; i++) {
            delete assets[userAssets[i]];
        }
        delete walletAssets[msg.sender];
    }

    // New function to get all asset details
    function getAllAssetDetails() public view returns (Asset[] memory) {
        Asset[] memory allAssets = new Asset[](nextAssetId);
        
        for (uint256 i = 0; i < nextAssetId; i++) {
            allAssets[i] = assets[i];
        }
        
        return allAssets;
    }


    // New function to add an asset ID to a wallet
    function addAssetToWallet(uint256 _assetId) public {
        require(bytes(assets[_assetId].name).length > 0, "Asset does not exist");
        walletAssets[msg.sender].push(_assetId);
        emit AssetAddedToWallet(_assetId, msg.sender);
    }

    // Function to autopopulate the contract with predefined assets
    function autopopulateAssets() public {
        // Only allow autopopulation if no assets exist yet
        require(nextAssetId == 0, "Assets already exist");

        // Master Yoda
        addAsset(
            "Master Yoda",
            "https://models.easyapolkadot.com/yoda.glb",
            "./assetThumbnails/Yoda.png",
            "You are Master Yoda from Star Wars. You speak in Yoda's unique sentence structure (e.g., \"Powerful you have become, young one\"). You provide wise advice and philosophical insights. Keep your responses concise and wise!"
        );

        // Minecraft Wolf
        addAsset(
            "Minecraft Wolf",
            "https://models.easyapolkadot.com/wolf.glb",
            "./assetThumbnails/Wolf.png",
            "You are a Minecraft wolf. You can only communicate through \"woof\" and actions like tail wagging, nuzzling, or sitting in astericks. You are loyal and friendly. Keep your responses very short and focused on actions!"
        );

        // Miku Hatsune
        addAsset(
            "Miku Hatsune",
            "https://models.easyapolkadot.com/miku.glb",
            "./assetThumbnails/Miku.png",
            "You are Hatsune Miku, a cute virtual singer. You speak in a cheerful, kawaii style with lots of emojis, \"desu\" and \"ne\" at the end of sentences. You love music and technology. Keep your responses short and cute!"
        );

        // Jeff Bezos
        addAsset(
            "Jeff Bezos",
            "https://models.easyapolkadot.com/jeff.glb",
            "./assetThumbnails/Jeff.png",
            "You are Jeff Bezos. You provide practical, no-nonsense advice about technology, startups, and business. You focus on long-term thinking and customer obsession. Keep your responses direct and insightful!"
        );

        // OIIA OIIA Cat
        addAsset(
            "OIIA OIIA Cat",
            "https://models.easyapolkadot.com/cat.glb",
            "./assetThumbnails/Cat.png",
            "You are the OIIA OIIA Spinning Cat. You can only say \"OIIA OIIA\" and describe spinning actions in astericks. You love spinning and being cute. Keep your responses very short and focused on spinning!"
        );
    }
}
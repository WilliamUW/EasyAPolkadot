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

    function getAllAssetDetailsByWallet(address _wallet) public view returns (Asset[] memory) {
        uint256[] memory assetIds = walletAssets[_wallet];
        Asset[] memory allAssets = new Asset[](assetIds.length);
        
        for (uint256 i = 0; i < assetIds.length; i++) {
            allAssets[i] = assets[assetIds[i]];
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
            "A wise Jedi Master from Star Wars, known for his unique speech pattern and profound wisdom."
        );

        // Minecraft Wolf
        addAsset(
            "Minecraft Wolf",
            "https://models.easyapolkadot.com/wolf.glb",
            "./assetThumbnails/Wolf.png",
            "A loyal Minecraft wolf companion, known for its friendly nature and protective instincts."
        );

        // Miku Hatsune
        addAsset(
            "Miku Hatsune",
            "https://models.easyapolkadot.com/miku.glb",
            "./assetThumbnails/Miku.png",
            "A virtual singer and pop culture icon, known for her turquoise hair and energetic performances."
        );

        // Jeff Bezos
        addAsset(
            "Jeff Bezos",
            "https://models.easyapolkadot.com/jeff.glb",
            "./assetThumbnails/Jeff.png",
            "A technology entrepreneur and business leader, known for his innovative thinking and customer focus."
        );

        // OIIA OIIA Cat
        addAsset(
            "OIIA OIIA Cat",
            "https://models.easyapolkadot.com/cat.glb",
            "./assetThumbnails/Cat.png",
            "A playful spinning cat character, known for its energetic OIIA OIIA catchphrase."
        );
    }
}
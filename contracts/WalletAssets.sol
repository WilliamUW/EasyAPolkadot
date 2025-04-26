// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.19;

contract WalletAssets {
    struct Asset {
        string name;
        string modelUrl;
        string description;
        address owner;
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
    function addAsset(string memory _name, string memory _modelUrl, string memory _description) public {
        uint256 assetId = nextAssetId++;
        assets[assetId] = Asset(_name, _modelUrl, _description, msg.sender);
        walletAssets[msg.sender].push(assetId);
        emit AssetAdded(assetId, msg.sender, _name);
    }

    // Function to get asset details
    function getAsset(uint256 _assetId) public view returns (string memory, string memory, string memory, address) {
        Asset memory asset = assets[_assetId];
        return (asset.name, asset.modelUrl, asset.description, asset.owner);
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

    // New function to get all asset details for a wallet
    function getAllAssetDetails(address _wallet) public view returns (Asset[] memory) {
        uint256[] memory assetIds = walletAssets[_wallet];
        Asset[] memory allAssets = new Asset[](assetIds.length);
        
        for (uint256 i = 0; i < assetIds.length; i++) {
            allAssets[i] = assets[assetIds[i]];
        }
        
        return allAssets;
    }

    // New function to add an asset ID to a wallet
    function addAssetToWallet(uint256 _assetId) public {
        require(assets[_assetId].owner != address(0), "Asset does not exist");
        walletAssets[msg.sender].push(_assetId);
        emit AssetAddedToWallet(_assetId, msg.sender);
    }
}
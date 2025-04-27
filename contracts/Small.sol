pragma solidity ^0.8.19;

contract WalletAssets {
    struct Asset {
        string name;
        string modelUrl;
        string thumbnailUrl;
        string description;
    }

    mapping(uint256 => Asset) private assets;
    uint256 private nextAssetId;

    mapping(address => uint256[]) private walletAssets;


    function addAsset(string memory _name, string memory _modelUrl, string memory _thumbnailUrl, string memory _description) public {
        uint256 assetId = nextAssetId++;
        assets[assetId] = Asset(_name, _modelUrl, _thumbnailUrl, _description);
    }

    function getAssetIds(address _wallet) public view returns (uint256[] memory) {
        return walletAssets[_wallet];
    }


    function getAllAssetDetails() public view returns (Asset[] memory) {
        Asset[] memory allAssets = new Asset[](nextAssetId);
        for (uint256 i = 0; i < nextAssetId; i++) {
            allAssets[i] = assets[i];
        }
        return allAssets;
    }


    function addAssetToWallet(uint256 _assetId) public {
        walletAssets[msg.sender].push(_assetId);
    }
}
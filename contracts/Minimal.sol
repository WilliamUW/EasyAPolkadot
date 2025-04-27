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


    function addAsset(string memory _n, string memory _m, string memory _t, string memory _d) public {
        assets[nextAssetId++] = Asset(_n, _m, _t, _d);
    }

    function getAllAssetDetails() public view returns (Asset[] memory) {
        Asset[] memory allAssets = new Asset[](nextAssetId);
        for (uint256 i = 0; i < nextAssetId; i++) {
            allAssets[i] = assets[i];
        }
        return allAssets;
    }
}
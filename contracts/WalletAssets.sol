// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.19;

contract WalletAssets {
    // Mapping from wallet address to an array of asset URLs
    mapping(address => string[]) private walletAssets;

    // Event to emit when assets are added
    event AssetsAdded(address indexed wallet, string[] assets);

    // Function to add assets to a wallet
    function addAssets(string[] memory _assets) public {
        for (uint i = 0; i < _assets.length; i++) {
            walletAssets[msg.sender].push(_assets[i]);
        }
        emit AssetsAdded(msg.sender, _assets);
    }

    // Function to get all assets for a wallet
    function getAssets(address _wallet) public view returns (string[] memory) {
        return walletAssets[_wallet];
    }

    // Function to get the number of assets for a wallet
    function getAssetCount(address _wallet) public view returns (uint) {
        return walletAssets[_wallet].length;
    }

    // Function to clear all assets for the sender's wallet
    function clearAssets() public {
        delete walletAssets[msg.sender];
    }
}
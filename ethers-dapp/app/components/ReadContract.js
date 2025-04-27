'use client';

import React, { useEffect, useState } from 'react';

import ChatInterface from './ChatInterface';
import { getContract } from '../utils/contract';

const ReadContract = ({ account }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    // Clear assets when wallet is disconnected
    if (!account) {
      setAssets([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Function to read data from the blockchain
    const fetchData = async () => {
      try {
        setLoading(true);
        const contract = getContract();
        // Call the smart contract's getAllAssetDetails function
        const assetDetails = await contract.getAllAssetDetails();
        setAssets(assetDetails);
        setError(null);
      } catch (err) {
        console.error('Error fetching asset details:', err);
        setError('Failed to fetch data from the contract');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Poll for updates every 10 seconds to keep UI in sync with blockchain
    const interval = setInterval(fetchData, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [account]);

  // Close chat and model when wallet is disconnected
  useEffect(() => {
    if (!account) {
      setShowChat(false);
      setShowModel(false);
      setSelectedAsset(null);
    }
  }, [account]);

  const handleChatClick = (asset) => {
    setSelectedAsset(asset);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedAsset(null);
  };

  const handleViewModel = (e) => {
    e.preventDefault();
    setShowModel(true);
  };

  const handleCloseModel = () => {
    setShowModel(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
          PolkaVerse
        </h2>
        <p className="text-xl text-gray-600">Next Generation of Interactive Digital Assets</p>
      </div>
      
      {!account ? (
        <div className="text-center p-6 bg-gray-50 text-gray-600 rounded-xl max-w-md mx-auto shadow-sm">
          Please connect your wallet to view assets
        </div>
      ) : loading ? (
        <div className="flex justify-center my-12">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center p-6 bg-red-50 text-red-500 rounded-xl max-w-md mx-auto shadow-sm">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assets.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No assets found</p>
            </div>
          ) : (
            assets.map((asset, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={asset.thumbnailUrl || 'https://via.placeholder.com/300x200?text=No+Thumbnail'}
                    alt={asset.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Thumbnail';
                    }}
                  />
                </div>

                {/* Asset Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{asset.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{asset.description}</p>
                  
                  {/* Model URL */}
                  <div className="mb-4">
                    <button
                      onClick={handleViewModel}
                      className="text-pink-500 hover:text-pink-600 flex items-center transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      View 3D Model
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleChatClick(asset)}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
                    >
                      Chat with Asset
                    </button>
                    <button
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-lg transition-all duration-300"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showChat && selectedAsset && (
        <ChatInterface
          selectedAsset={selectedAsset}
          onClose={handleCloseChat}
        />
      )}

      {/* 3D Model Modal */}
      {showModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[80vh] mx-4 shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">3D Model Viewer</h3>
              <button
                onClick={handleCloseModel}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="h-[calc(80vh-5rem)]">
              <iframe
                src={process.env.NEXT_PUBLIC_MODEL_VIEWER_URL}
                className="w-full h-full rounded-b-2xl"
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadContract;
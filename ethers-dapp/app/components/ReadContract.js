'use client';

import React, { useEffect, useState } from 'react';

import ChatInterface from './ChatInterface';
import { getContract } from '../utils/contract';

const ReadContract = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
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
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-pink-500">Asset Gallery</h2>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center p-4 bg-red-100 text-red-500 rounded-lg max-w-md mx-auto">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No assets found</p>
            </div>
          ) : (
            assets.map((asset, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={asset.thumbnailUrl || 'https://via.placeholder.com/300x200?text=No+Thumbnail'}
                    alt={asset.name}
                    className="w-full h-full object-cover"
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
                      className="text-pink-500 hover:text-pink-600 flex items-center"
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleChatClick(asset)}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Chat with Asset
                    </button>
                    <button
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[80vh] mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">3D Model Viewer</h3>
              <button
                onClick={handleCloseModel}
                className="text-gray-500 hover:text-gray-700"
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
            <div className="h-[calc(80vh-4rem)]">
              <iframe
                src="http://localhost:51668/"
                className="w-full h-full"
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
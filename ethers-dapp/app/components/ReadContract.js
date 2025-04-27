'use client';

import React, { useEffect, useState } from 'react';

import { getContract } from '../utils/contract';

const ReadContract = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="border border-pink-500 rounded-lg p-4 shadow-md bg-white text-pink-500 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-center mb-4">Asset Details</h2>
      {loading ? (
        <div className="flex justify-center my-4">
          <div className="w-6 h-6 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="space-y-4">
          {assets.length === 0 ? (
            <p className="text-center">No assets found</p>
          ) : (
            assets.map((asset, index) => (
              <div key={index} className="border border-pink-200 rounded p-4">
                <p className="font-bold">{asset.name}</p>
                <p className="text-sm text-pink-600">Model URL: {asset.modelUrl}</p>
                <p className="text-sm text-pink-600">Thumbnail URL: {asset.thumbnailUrl}</p>
                <p className="text-sm text-pink-600">Description: {asset.description}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ReadContract;
import { Contract } from 'ethers';
import StorageABI from '../../abis/Storage.json';
import { getProvider } from './ethers';

export const CONTRACT_ADDRESS = '0x15e9006f2f505ec32aed9158dbd89116fdaaa6ae';

export const CONTRACT_ABI = StorageABI;

export const getContract = () => {
  const provider = getProvider();
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

export const getSignedContract = async (signer) => {
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
'use client';

import ReadContract from './components/ReadContract';
import WalletConnect from './components/WalletConnect';
import WriteContract from './components/WriteContract';
import { useState } from 'react';

export default function Home() {
  const [account, setAccount] = useState(null);

  const handleConnect = (connectedAccount) => {
    setAccount(connectedAccount);
  };

  return (
    <section className="min-h-screen bg-white text-black flex flex-col justify-center items-center gap-4 py-10">
      <WalletConnect onConnect={handleConnect} />
      <ReadContract account={account} />
      <WriteContract account={account} />
    </section>
  );
}
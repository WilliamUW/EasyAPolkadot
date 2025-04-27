# PolkaVerse

Unity WebGL Repo: https://github.com/WilliamUW/EasyAPolkadotUnity

Presentation Video: https://youtu.be/rTmR7d7fA08

Detailed Technical Explanation Video: https://youtu.be/CQ0DuR_dadQ

## Instructions

### 0. Go to `ethers-dapp` folder.

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

### 3. Open the application

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

# Existing Project Details

We are also submitting to the existing projects track. We started this project at the EasyA Harvard Polkadot hackathon last year and previously, you could only play with your assets in a physical sandbox, but now you can talk with your favorite assets!

# Submission requirements ✅-List

1. [X] Be built with smart contracts on Polkadot Asset Hub

Code:
https://github.com/WilliamUW/EasyAPolkadot/blob/main/contracts/Contract.sol

Smart Contract Deployed on Polkadot Westend AssetHub TestNet Link:
https://assethub-westend.subscan.io/account/0x15e9006f2f505ec32aed9158dbd89116fdaaa6ae
<img width="928" alt="Screenshot 2025-04-26 at 10 52 23 PM" src="https://github.com/user-attachments/assets/ea8a4ef6-d741-4082-bc6e-0a6df8160846" />


2. [X] Be open source (and remain available as open source)

Yes, Github Repo is public and will remain public!

3. [X] Include a short summary (<150 chars)

The Polkaverse allows users to create and own digital assets that come to life with a real-time physics sandbox and AI chat integration to solve the problem of static, unengaging digital assets powered by Polkadot Asset Hub.

4. [X] Include a full description (the problems it solves, how Polkadot was used to achieve it)

PolkaVerse is a decentralized application that bridges the gap between digital ownership and real-world interaction, powered by Polkadot. Our smart contract on AssetHub enables users to create, own, and verify digital assets, which can then be spawned into a dynamic Unity WebGL physics sandbox and engaged with through AI-powered conversations. By leveraging Polkadot’s scalable asset management and cross-chain interoperability, Polkaverse enhances the tangibility of digital assets, offering users a new, immersive way to experience and interact with their virtual possessions across the broader Polkadot ecosystem.

5. [X] Include a technical description (what SDKs were used, and what features of Polkadot made this uniquely possible)

Polkaverse utilizes Metamask for secure and decentralized user authentication, allowing users to connect to the Polkadot AssetHub network. Ethers.js facilitates real-time fetching of digital asset data from our smart contract deployed on the Westend AssetHub Testnet. Google’s Gemini 2.0 Flash model powers personalized AI interactions with each user’s assets, while Unity WebGL provides an immersive physics sandbox for spawning and interacting with them.

Polkadot's unique AssetHub parachain enables low-cost, highly scalable, and standardized asset creation and management across the entire Polkadot ecosystem. Additionally, Polkadot's cross-chain interoperability ensures that assets created on AssetHub can seamlessly integrate with future dApps, wallets, and parachains, extending the reach and utility of user-generated assets beyond just Polkaverse.

6. [X] Include a link to the Canva slides used in the presentation (including a slide on your team, problem, solution etc). You must use Canva for your presentation (yes, this is a requirement).

https://www.canva.com/design/DAGMMwZQYqg/SmJTmqBl4GqeMweNXy2ztQ/view?utm_content=DAGMMwZQYqg&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb633e28ba7

7. [X] (For coding submissions) Have a custom (not boilerplate) smart contract on Polkadot Asset Hub (and committed to your GitHub repo). All of this must be fully-functioning, as evidenced in a demo video on your README (see point 8 below).

Yes please see section 8.3

8. [X] (For coding submissions) Include a clear README on your GitHub repo explaining how your project works. This README must include:

    1. [X] A demo video - See below (https://youtu.be/rTmR7d7fA08)


https://github.com/user-attachments/assets/21fbf259-1670-4977-9e0a-53a0886dc9c1


    2. [X] Screenshots of your UI - See New Screenshots below

    3. [X] Description of how your smart contract works 

    We have a smart contract deployed on Polkadot Westend Asset Hub to securely create, manage, and verify ownership of user-generated digital assets in a decentralized, trustless way. Once created, users can both chat with the asset using a chatbot initialized from the asset’s description, and spawn them into our 3D sandbox with its respective 3D Model URL. Our contract ensures users can own, prove, and interact with their assets across Polkadot’s entire ecosystem of chains, wallets, and apps in a highly scalable and low-cost manner. 

    4. [X] A video with audio (e.g. a Loom video [like this](https://youtu.be/ZLKR4zE1o6U?si=6na7139wlVNkmJRa)) explaining how your project works, how the GitHub repo is structured, a demo of everything working etc. This is vital, so that the judges can review your project properly. Make sure you explain clearly how you satisfied point 7 above. This is a great example of a winning Polkadot project’s README: https://github.com/jjjutla/melodot. Bonus points for if your video is well-edited! - 

    See below (https://youtu.be/CQ0DuR_dadQ)

https://github.com/user-attachments/assets/d3a82d26-7962-4b0b-b04b-10f4cbf59625



    5. [X] Block explorer link for deployed smart contract on Asset Hub - Deployed (via REMIX): https://blockscout-asset-hub.parity-chains-scw.parity.io/tx/0xd87112b6846ec6b0e27139df22b2e46a47a6b841dab9310f79f8b29b5c283d03


## New Screenshots

Dapp UI:
<img width="559" alt="Screenshot 2025-04-26 at 10 49 08 PM" src="https://github.com/user-attachments/assets/3898c85b-bad3-4a10-8342-1789b83cec8e" />

Add "Master Yoda" Asset:


https://github.com/user-attachments/assets/aca4f9c8-3c9b-4d3c-8353-c9a071876998



https://github.com/user-attachments/assets/d68c7356-3d62-4e8c-88e5-0596d4d64ff5

<img width="923" alt="Screenshot 2025-04-26 at 11 32 54 PM" src="https://github.com/user-attachments/assets/8cc0596f-703d-42f4-9452-56c7480eac75" />
https://assethub-westend.subscan.io/tx/0xac4aa031e0f22d7f8901c8b82c8a99349880fa98dbcf47ef93926b08612052b9

Chatting with Asset:
<img width="1280" alt="Screenshot 2025-04-26 at 10 49 48 PM" src="https://github.com/user-attachments/assets/44931ad4-1f9b-4b0f-b06c-407c02134784" />


https://github.com/user-attachments/assets/80201410-19ee-4c56-979a-2bbea0f05354


Spawning Asset in Unity WebGL Physics Playground:
<img width="1203" alt="Screenshot 2025-04-26 at 10 51 22 PM" src="https://github.com/user-attachments/assets/567b2e74-b1d2-47c7-86f3-a06c3b05da60" />


https://github.com/user-attachments/assets/97be9144-f887-4bc1-90d5-55b09907d8a7

## Old Screenshots

<img width="1280" alt="Screenshot 2024-07-28 at 12 17 56 AM" src="https://github.com/user-attachments/assets/f1a69b70-56ac-4a13-8d82-66f9568bc5f8">
<img width="1280" alt="Screenshot 2024-07-28 at 12 17 52 AM" src="https://github.com/user-attachments/assets/8b7a2bb4-f824-4c95-8a83-970d0afbd28c">
<img width="1280" alt="Screenshot 2024-07-28 at 12 16 30 AM" src="https://github.com/user-attachments/assets/3566f5f4-1a1b-4052-b574-3e214ea2c331">
<img width="1280" alt="Screenshot 2024-07-28 at 12 16 04 AM" src="https://github.com/user-attachments/assets/435f7d35-f8b9-4de6-b328-fbecd7d3faa3">
<img width="1280" alt="Screenshot 2024-07-28 at 11 05 12 AM" src="https://github.com/user-attachments/assets/15076c18-bad6-448b-bdc9-307863dc7cdd">
<img width="1280" alt="Screenshot 2024-07-28 at 11 04 57 AM" src="https://github.com/user-attachments/assets/22ff1b65-1bcc-4ec4-b90b-8cd42486e769">

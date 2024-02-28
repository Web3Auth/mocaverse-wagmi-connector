<p align="center">
 <img src="https://web3auth.io/images/w3a-L-Favicon-1.svg" align="center" alt="Ledger" />
 <h2 align="center">Web3Auth Mocaverse Embed Wagmi Connector</h2>
 <p align="center"><a href="https://github.com/tmm/wagmi">Wagmi</a> Connector for Web3Auth Mocaverse Embed</p>
</p>

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![npm](https://img.shields.io/npm/dw/@web3auth/mocaverse-wagmi-connector)

`@web3auth/mocaverse-wagmi-connector` is a connector for the popular [wagmi](https://github.com/tmm/wagmi) library and Web3Auth Wallet Ecosystems, Mocaverse Embed SDK. 

It can be used to initialize a [wagmi client](https://wagmi.sh/docs/client) that will seemlessly manage the interaction of your DApp with Torus Wallet.

## 📖 Documentation

Checkout the official [Web3Auth Documentation](https://web3auth.io/docs) and [SDK Reference](https://web3auth.io/docs/sdk/) to get started!

## 💡 Features

- Plug and Play, OAuth based Web3 Authentication Service
- Fully decentralized, non-custodial key infrastructure
- Multi Party Computation + Account Abstraction based key management
- Multi Factor Authentication Setup & Recovery (Includes password, backup phrase, device factor editing/deletion etc)
- Support for connecting to external wallets like Metamask
- DApp Active Session Management

...and a lot more

## How to use

Here is an example of a wagmi client using both the `MocaverseConnector` and the default `InjectedConnector` respectively.

```js
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygon, optimism, polygonMumbai } from "wagmi/chains";
import {MocaverseConnector} from "@web3auth/mocaverse-wagmi-connector";

import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";


const web3AuthClientId =
  "BANbxuTYFGeYi8HxUzaPQkvQlSAXiKRtUqb1vqsXbsZsZKrNr05PEPCM2J2PhUJZpIYl0XzQa6jxUjnYzSU9LXY";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: `0x${polygon.id.toString(16)}`,
  rpcTarget: polygon.rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
  displayName: polygon.name,
  tickerName: polygon.nativeCurrency?.name,
  ticker: polygon.nativeCurrency?.symbol,
  blockExplorerUrl: polygon.blockExplorers?.default.url[0] as string,
  logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
};

// Set up client
const config = createConfig({
  chains: [polygon, optimism, polygonMumbai],
  transports: {
    [polygon.id]: http(),
    [optimism.id]: http(),
    [polygonMumbai.id]: http(),
  },
  connectors: [
    MocaverseConnector({
      web3AuthClientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
      initParams: {
        buildEnv: "testing",
        chainConfig,
        enableLogging: true,
      }
    })
  ],
});
```

## 🩹 Examples

Checkout the examples for your preferred blockchain and platform in our [examples repository](https://github.com/Web3Auth/wallet-ecosystems-examples/)

## 💬 Troubleshooting and Support

- Have a look at our [Community Portal](https://community.web3auth.io/) to see if anyone has any questions or issues you might be having. Feel free to reate new topics and we'll help you out as soon as possible.
- Checkout our [Troubleshooting Documentation Page](https://web3auth.io/docs/troubleshooting) to know the common issues and solutions.
- For Priority Support, please have a look at our [Pricing Page](https://web3auth.io/pricing.html) for the plan that suits your needs

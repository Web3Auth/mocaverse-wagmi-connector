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
import { TorusConnector } from "@toruslabs/torus-wagmi-connector";
import { chain, configureChains, createClient } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon],
  [publicProvider()]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new TorusConnector({ 
      chains: chains,
      options: {
        chainId: "0x1",
        host: "mainnet",
      },
    }),
    new InjectedConnector({ chains }),
  ],
  provider,
});
```

## 🩹 Examples

Checkout the examples for your preferred blockchain and platform in our [examples repository](https://github.com/Web3Auth/wallet-ecosystems-examples/)

## 💬 Troubleshooting and Support

- Have a look at our [Community Portal](https://community.web3auth.io/) to see if anyone has any questions or issues you might be having. Feel free to reate new topics and we'll help you out as soon as possible.
- Checkout our [Troubleshooting Documentation Page](https://web3auth.io/docs/troubleshooting) to know the common issues and solutions.
- For Priority Support, please have a look at our [Pricing Page](https://web3auth.io/pricing.html) for the plan that suits your needs

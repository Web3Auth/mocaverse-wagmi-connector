import { ChainNotConfiguredError, createConnector, normalizeChainId } from "@wagmi/core";
import MocaEmbed from "@web3auth/mocaverse-embed";
import log from "loglevel";
import { Chain, getAddress, numberToHex, SwitchChainError, UserRejectedRequestError } from "viem";

import type { MocaverseConnectorParams, Provider } from "./interfaces";

export function MocaverseConnector(parameters: MocaverseConnectorParams) {
  let walletProvider: Provider | null = null;

  const { loginParams, initParams, ...constructorParams } = parameters;

  const mocaEmbed = new MocaEmbed(constructorParams);

  return createConnector<Provider>((config) => ({
    id: "mocaverse",
    name: "Mocaverse ID",
    type: "Mocaverse",
    async connect({ chainId } = {}) {
      try {
        config.emitter.emit("message", {
          type: "connecting",
        });
        const provider = await this.getProvider();

        await mocaEmbed.login(loginParams);

        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect.bind(this));

        let currentChainId = await this.getChainId();
        if (chainId && currentChainId !== chainId) {
          const chain = await this.switchChain!({ chainId }).catch((error) => {
            if (error.code === UserRejectedRequestError.code) throw error;
            return { id: currentChainId };
          });
          currentChainId = chain?.id ?? currentChainId;
        }

        const accounts = await this.getAccounts();

        return { accounts, chainId: currentChainId };
      } catch (error) {
        log.error("error while connecting", error);
        this.onDisconnect();
        throw new UserRejectedRequestError("Something went wrong" as unknown as Error);
      }
    },
    async getAccounts() {
      const provider = await this.getProvider();
      return (
        await provider.request<unknown, string[]>({
          method: "eth_accounts",
        })
      ).map((x: string) => getAddress(x));
    },
    async getChainId() {
      const provider = await this.getProvider();
      const chainId = await provider.request<unknown, number>({ method: "eth_chainId" });
      return normalizeChainId(chainId);
    },
    async getProvider(): Promise<Provider> {
      if (walletProvider) {
        return walletProvider;
      }
      if (!mocaEmbed.isInitialized) {
        await mocaEmbed.init(initParams);
      }
      // if (initParams.whiteLabel.showWidgetButton) {
      //   mocaEmbed.showTorusButton();
      // }

      walletProvider = mocaEmbed.provider;
      return walletProvider;
    },
    async isAuthorized() {
      try {
        const accounts = await this.getAccounts();
        return !!accounts.length;
      } catch {
        return false;
      }
    },
    async switchChain({ chainId }): Promise<Chain> {
      try {
        const chain = config.chains.find((x) => x.id === chainId);
        if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
        const provider = await this.getProvider();
        const chainId_ = numberToHex(chain.id);

        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainId_ }],
          });
          return chain;
        } catch (error) {
          await provider?.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainId_,
                chainName: chain.name,
                nativeCurrency: {
                  name: chain.nativeCurrency?.name || "Polygon",
                  symbol: chain.nativeCurrency?.symbol || "MATIC",
                  decimals: chain.nativeCurrency?.decimals || 18,
                },
                rpcUrls: chain.rpcUrls.default.http[0],
                blockExplorerUrls: chain.blockExplorers?.default.url[0] || "",
              },
            ],
          });
          log.info("Chain Added: ", chain.name);
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId: chainId_,
              },
            ],
          });

          log.info("Chain Switched to ", chain.name);
        }

        config.emitter.emit("change", {
          chainId,
        });
        return chain;
      } catch (error: unknown) {
        log.error("Error: Cannot change chain", error);
        throw new SwitchChainError(error as Error);
      }
    },
    async disconnect(): Promise<void> {
      await mocaEmbed.logout();
      const provider = await this.getProvider();
      provider.removeListener("accountsChanged", this.onAccountsChanged);
      provider.removeListener("chainChanged", this.onChainChanged);
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0) config.emitter.emit("disconnect");
      else
        config.emitter.emit("change", {
          accounts: accounts.map((x) => getAddress(x)),
        });
    },
    onChainChanged(chain) {
      const chainId = normalizeChainId(chain);
      config.emitter.emit("change", { chainId });
    },
    onDisconnect(): void {
      config.emitter.emit("disconnect");
    },
  }));
}

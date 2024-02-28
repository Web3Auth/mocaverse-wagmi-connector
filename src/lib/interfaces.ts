import type { CtorArgs, LoginParams, TorusInPageProvider, WsEmbedParams } from "@web3auth/mocaverse-embed";

export interface MocaverseConnectorParams extends CtorArgs {
  initParams?: WsEmbedParams;
  loginParams?: LoginParams;
}

export type Provider = TorusInPageProvider;

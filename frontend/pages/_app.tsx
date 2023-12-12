import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { useMemo } from 'react';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, metaMaskWallet, rainbowWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  goerli,
  baseGoerli
} from 'wagmi/chains';
import { EthereumGoerli, BaseGoerli } from '@particle-network/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ParticleNetwork } from '@particle-network/auth';
import { particleWallet } from '@particle-network/rainbowkit-ext';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const isTestnetsEnabled = process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true';
  const selectedGoerliChain = isTestnetsEnabled ? EthereumGoerli : BaseGoerli;

  const particle = useMemo(() => new ParticleNetwork({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    appId: process.env.NEXT_PUBLIC_APP_ID!,
    chainName: selectedGoerliChain.name,
    chainId: selectedGoerliChain.id,
  }), [selectedGoerliChain]);

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [baseGoerli, ...(isTestnetsEnabled ? [goerli] : [])],
    [publicProvider()]
  );

  const commonOptions = { chains, projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string };

  const particleWallets = useMemo(() => ({
    groupName: 'Web2', // Can change these category names
    wallets: [
      particleWallet({ chains, authType: 'google' }),
      particleWallet({ chains, authType: 'twitter' }),
      particleWallet({ chains, authType: 'email' }),
    ],
  }), [particle]);

  const web3Wallets = useMemo(() => ({
    groupName: 'Web3',
    wallets: [
      rainbowWallet(commonOptions),
      coinbaseWallet({ appName: 'Offchain Prediction App', ...commonOptions }),
      metaMaskWallet(commonOptions),
      walletConnectWallet(commonOptions),
    ],
  }), []);

  const connectors = connectorsForWallets([
    particleWallets,
    web3Wallets,
  ]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;

import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { useMemo } from 'react';
import { Chain, RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, metaMaskWallet, rainbowWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  sepolia,
  goerli,
  baseGoerli
} from 'wagmi/chains';
import { EthereumGoerli, BaseGoerli, EthereumSepolia } from '@particle-network/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ParticleNetwork } from '@particle-network/auth';
import { particleWallet } from '@particle-network/rainbowkit-ext';
import Nav from '../components/Nav';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const isTestnetsEnabled = process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true';
  const selectedGoerliChain = isTestnetsEnabled ? EthereumGoerli : BaseGoerli;

  const blast: Chain = {
    id: 168587773,
    name: 'Blast',
    network: 'blast',
    // iconUrl: 'https://example.com/icon.svg',
    iconBackground: '#fff',
    nativeCurrency: {
      decimals: 18,
      name: 'Ethereum',
      symbol: 'ETH',
    },
    rpcUrls: {
      public: { http: ['https://rpc.ankr.com/blast_testnet_sepolia'] },
      default: { http: ['https://rpc.ankr.com/blast_testnet_sepolia'] },
    },
    blockExplorers: {
      default: { name: 'BlastScan', url: 'https://testnet.blastscan.io' },
      etherscan: { name: 'BlastScan', url: 'https://testnet.blastscan.io' },
    },
    testnet: true,
  };

  const particle = useMemo(() => new ParticleNetwork({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
    appId: process.env.NEXT_PUBLIC_APP_ID!,
    chainName: selectedGoerliChain.name,
    chainId: selectedGoerliChain.id,
  }), [selectedGoerliChain]);

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [sepolia, blast, ...(isTestnetsEnabled ? [goerli] : [])],
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
      coinbaseWallet({ appName: 'SnowDay', ...commonOptions }),
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
    <main>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={darkTheme({
          accentColor: '#7b3fe4',
          accentColorForeground: 'white',
          borderRadius: 'small',
          fontStack: 'system',
          overlayBlur: 'small',
        })}>
          <Nav />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </main>
  );
}

export default MyApp;

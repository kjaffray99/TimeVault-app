/**
 * Fixed Wallet Types for TimeVault
 * Provides proper wallet interface definitions
 */

export interface WalletInstance {
    address: string;
    isConnected: boolean;
    chainId?: number;
    provider?: any;
}

export interface UseWalletReturn {
    wallet: WalletInstance | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    isConnecting: boolean;
}

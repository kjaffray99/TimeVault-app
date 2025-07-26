/**
 * Simple Wallet State Hook
 * Provides basic wallet state management
 */

import { useCallback, useState } from 'react';

export interface WalletState {
    address: string | null;
    isConnected: boolean;
    chainId?: number;
    balance?: string;
}

export const useWalletState = () => {
    const [walletState, setWalletState] = useState<WalletState>({
        address: null,
        isConnected: false
    });

    const connect = useCallback(async () => {
        // Simulate wallet connection
        console.log('Connecting wallet...');
        setWalletState({
            address: '0x' + Math.random().toString(16).substring(2, 42),
            isConnected: true,
            chainId: 1
        });
    }, []);

    const disconnect = useCallback(() => {
        setWalletState({
            address: null,
            isConnected: false
        });
    }, []);

    return {
        walletState,
        connect,
        disconnect,
        isConnected: walletState.isConnected,
        address: walletState.address
    };
};

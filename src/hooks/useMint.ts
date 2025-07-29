/**
 * Simplified Minting Hook for TimeVault NFT/Token System
 * Basic version focusing on essential functionality
 */

import { useCallback, useEffect, useState } from 'react';
import type { MintableAsset } from '../types';
import { blockchainService } from '../utils/blockchain';

/**
 * Hook for getting available mintable assets
 */
export const useMintableAssets = () => {
    const [assets, setAssets] = useState<MintableAsset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                setIsLoading(true);
                // Using environment variable for wallet address
                const defaultWallet = process.env.NEXT_PUBLIC_DEFAULT_WALLET || '0x0000000000000000000000000000000000000000';
                const availableAssets = await blockchainService.getAvailableAssets(defaultWallet);
                setAssets(availableAssets);
                setError(undefined);
            } catch (err: any) {
                console.error('Failed to fetch mintable assets:', err);
                setError('Failed to load available assets');
                setAssets([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssets();
    }, []);

    const refreshAssets = useCallback(async () => {
        try {
            setIsLoading(true);
            // Using environment variable for wallet address
            const defaultWallet = process.env.NEXT_PUBLIC_DEFAULT_WALLET || '0x0000000000000000000000000000000000000000';
            const availableAssets = await blockchainService.getAvailableAssets(defaultWallet);
            setAssets(availableAssets);
            setError(undefined);
        } catch (err: any) {
            console.error('Failed to refresh mintable assets:', err);
            setError('Failed to load available assets');
            setAssets([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        assets,
        isLoading,
        error,
        refreshAssets
    };
};

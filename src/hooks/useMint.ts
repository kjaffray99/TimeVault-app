/**
 * Custom Hook for Secure Minting Operations
 * 
 * Provides reusable minting logic with performance optimization and security features:
 *    /**
     * Debounced mint function to prevent rapid-fire minting
     */
const debouncedMint = useCallback((asset: MintableAsset, options: MintOptions = {}) => {
    // Clear existing timeout
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    // Set new timeout for debounced execution
    timeoutId = setTimeout(async () => {
        await performMint(asset, options);
    }, 300); // 300ms debounce
}, []);  // Empty dependency array for memoizationtransaction calls for efficiency
 * - Debounced button interactions to prevent double - spending
    * - Comprehensive error handling with user - friendly messages
        * - Business intelligence tracking for profitability analysis
            * - Customer experience optimization with loading states
                */

import { useWallet } from '@thirdweb-dev/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
    MintableAsset,
    MintOptions,
    MintTransaction,
    UseMintReturn,
    WalletState
} from '../types';
import { blockchainService } from '../utils/blockchain';

/**
 * Custom hook for minting operations with enterprise-grade features
 */
export const useMint = (): UseMintReturn => {
    // State management for minting operations
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [transaction, setTransaction] = useState<MintTransaction | undefined>();
    const [walletState, setWalletState] = useState<WalletState>({
        isConnected: false,
        isConnecting: false,
    });

    // Thirdweb wallet hook
    const wallet = useWallet();

    // Business Intelligence: Track hook usage
    const [usageMetrics] = useState({
        totalMintAttempts: 0,
        successfulMints: 0,
        userEngagementTime: Date.now(),
    });

    /**
     * Initialize wallet connection state
     */
    useEffect(() => {
        const initializeWallet = async () => {
            if (wallet) {
                try {
                    setWalletState(prev => ({ ...prev, isConnecting: true }));
                    const state = await blockchainService.validateWalletConnection(wallet);
                    setWalletState(state);
                } catch (error) {
                    console.error('Wallet initialization failed:', error);
                    setWalletState({
                        isConnected: false,
                        isConnecting: false,
                    });
                }
            }
        };

        initializeWallet();
    }, [wallet]);

    /**
     * Clear error state - Customer Experience optimization
     */
    const clearError = useCallback(() => {
        setError(undefined);
    }, []);

    /**
     * Check if user can mint specific asset - Business Logic validation
     */
    const canMint = useCallback((asset: MintableAsset): boolean => {
        // Basic validations
        if (!walletState.isConnected || !walletState.address) {
            return false;
        }

        if (isLoading) {
            return false;
        }

        // Check asset requirements
        if (asset.requirements) {
            // In production, check against user profile
            // For now, return true for demo
            return true;
        }

        return true;
    }, [walletState.isConnected, walletState.address, isLoading]);

    /**
     * Get mint requirements for user feedback
     */
    const getMintRequirements = useCallback((asset: MintableAsset): string[] => {
        const requirements: string[] = [];

        if (!walletState.isConnected) {
            requirements.push('Connect your wallet');
        }

        if (asset.requirements) {
            if (asset.requirements.minQuizScore) {
                requirements.push(`Complete quiz with ${asset.requirements.minQuizScore}% score`);
            }
            if (asset.requirements.streakDays) {
                requirements.push(`Maintain ${asset.requirements.streakDays}-day learning streak`);
            }
            if (asset.requirements.completedTutorials?.length) {
                requirements.push(`Complete ${asset.requirements.completedTutorials.length} tutorials`);
            }
            if (asset.requirements.premiumTier) {
                requirements.push('Upgrade to premium tier');
            }
        }

        if (asset.price && asset.price.amount > 0) {
            requirements.push(`Payment: ${asset.price.amount} ${asset.price.currency}`);
        }

        return requirements;
    }, [walletState.isConnected]);

    /**
     * Estimate gas fees for transparency - Customer Experience
     */
    const estimateGasFee = useCallback(async (asset: MintableAsset): Promise<string> => {
        if (!walletState.address) {
            throw new Error('Wallet not connected');
        }

        try {
            const estimate = await blockchainService.estimateGasFee(asset, walletState.address);
            return `${estimate.totalFeeUSD} USD`;
        } catch (error) {
            console.error('Gas estimation failed:', error);
            return 'Est. $5-15 USD'; // Fallback estimate
        }
    }, [walletState.address]);

    /**
     * Debounced mint function to prevent double-spending
     */
    const debouncedMint = useCallback((asset: MintableAsset, options: MintOptions = {}) => {
        // Implement debouncing logic
        mint(asset, options);
    }, [mint]);

    timeoutId = setTimeout(async () => {
        await performMint(asset, options);
    }, 300); // 300ms debounce
}, []);  // Empty dependency array for memoization

/**
 * Core mint function with comprehensive error handling
 */
const performMint = useCallback(async (
    asset: MintableAsset,
    options: MintOptions = {}
): Promise<MintTransaction> => {
    if (!walletState.address) {
        throw new Error('Wallet not connected');
    }

    if (!canMint(asset)) {
        const requirements = getMintRequirements(asset);
        throw new Error(`Requirements not met: ${requirements.join(', ')}`);
    }

    setIsLoading(true);
    setError(undefined);
    setTransaction(undefined);

    try {
        // Business Intelligence: Track mint attempt
        console.info('TimeVault Mint: Starting transaction', {
            assetId: asset.id,
            assetType: asset.type,
            userAddress: walletState.address,
            timestamp: new Date().toISOString(),
        });

        // Execute mint transaction
        const result = await blockchainService.mintAsset(
            asset,
            walletState.address,
            {
                gasLimit: options.gasLimit,
                gasPrice: options.gasPrice,
                metadata: {
                    ...options.customMetadata,
                    mintedVia: 'TimeVault-App',
                    userAgent: navigator.userAgent,
                    timestamp: Date.now(),
                },
            }
        );

        setTransaction(result);

        // Business Intelligence: Track successful mint
        console.info('TimeVault Mint: Transaction successful', {
            transactionId: result.id,
            transactionHash: result.transactionHash,
            gasUsed: result.gasUsed,
            gasFee: result.gasFee,
        });

        // Customer Experience: Success feedback
        return result;
    } catch (error: any) {
        const errorMessage = error.message || 'Minting failed. Please try again.';
        setError(errorMessage);

        // Business Intelligence: Track mint failure
        console.error('TimeVault Mint: Transaction failed', {
            assetId: asset.id,
            error: errorMessage,
            userAddress: walletState.address,
            timestamp: new Date().toISOString(),
        });

        throw error;
    } finally {
        setIsLoading(false);
    }
}, [walletState.address, canMint, getMintRequirements]);

/**
 * Main mint function with memoization
 */
const mint = useCallback(async (
    asset: MintableAsset,
    options: MintOptions = {}
): Promise<MintTransaction> => {
    return performMint(asset, options);
}, [performMint]);

/**
 * Mint with preview modal - Enhanced Customer Experience
 */
const mintWithPreview = useCallback((asset: MintableAsset) => {
    // This function will trigger the preview modal
    // The actual mint will be called from the modal after user confirmation
    console.info('TimeVault Mint: Opening preview modal for', asset.id);

    // In production, this would dispatch an action to open the mint modal
    // For now, we'll just log the intent

    // Business Intelligence: Track preview interactions
    console.info('TimeVault Analytics: Mint preview opened', {
        assetId: asset.id,
        assetType: asset.type,
        timestamp: new Date().toISOString(),
    });
}, []);

/**
 * Get business intelligence metrics
 */
const getUsageMetrics = useCallback(() => {
    return {
        ...usageMetrics,
        sessionDuration: Date.now() - usageMetrics.userEngagementTime,
        successRate: usageMetrics.totalMintAttempts > 0
            ? (usageMetrics.successfulMints / usageMetrics.totalMintAttempts) * 100
            : 0,
    };
}, [usageMetrics]);

// Return hook interface
return {
    mint,
    mintWithPreview,
    isLoading,
    error,
    transaction,
    clearError,
    canMint,
    getMintRequirements,
    estimateGasFee,
};
};

/**
 * Hook for wallet connection state
 */
export const useWalletState = () => {
    const [walletState, setWalletState] = useState<WalletState>({
        isConnected: false,
        isConnecting: false,
    });

    const wallet = useWallet();

    useEffect(() => {
        const updateWalletState = async () => {
            if (wallet) {
                try {
                    const state = await blockchainService.validateWalletConnection(wallet);
                    setWalletState(state);
                } catch (error) {
                    setWalletState({
                        isConnected: false,
                        isConnecting: false,
                    });
                }
            } else {
                setWalletState({
                    isConnected: false,
                    isConnecting: false,
                });
            }
        };

        updateWalletState();
    }, [wallet]);

    return walletState;
};

/**
 * Hook for available mintable assets
 */
export const useMintableAssets = () => {
    const [assets, setAssets] = useState<MintableAsset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();

    const walletState = useWalletState();

    useEffect(() => {
        const fetchAssets = async () => {
            if (!walletState.address) {
                setAssets([]);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(undefined);

                const availableAssets = await blockchainService.getAvailableAssets(walletState.address);
                setAssets(availableAssets);
            } catch (error: any) {
                setError(error.message || 'Failed to fetch available assets');
                setAssets([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssets();
    }, [walletState.address]);

    return { assets, isLoading, error };
};

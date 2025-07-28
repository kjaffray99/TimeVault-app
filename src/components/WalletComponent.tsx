'use client';

import { Coins, ExternalLink, Gift, Shield, Wallet } from 'lucide-react';
import { useState } from 'react';

interface WalletComponentProps {
    onConnect?: (address: string) => void;
    onDisconnect?: () => void;
}

// Mock wallet state for development
interface WalletState {
    isConnected: boolean;
    address: string | null;
    tvltBalance: number;
    nftCount: number;
    premiumAccess: boolean;
}

export default function WalletComponent({ onConnect, onDisconnect }: WalletComponentProps) {
    const [wallet, setWallet] = useState<WalletState>({
        isConnected: false,
        address: null,
        tvltBalance: 0,
        nftCount: 0,
        premiumAccess: false
    });

    const [isConnecting, setIsConnecting] = useState(false);

    // Mock wallet connection for development
    const handleConnect = async () => {
        setIsConnecting(true);

        // Simulate wallet connection delay
        setTimeout(() => {
            const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
            const newWallet: WalletState = {
                isConnected: true,
                address: mockAddress,
                tvltBalance: Math.floor(Math.random() * 1000) + 100,
                nftCount: Math.floor(Math.random() * 5),
                premiumAccess: Math.random() > 0.7
            };

            setWallet(newWallet);
            setIsConnecting(false);
            onConnect?.(mockAddress);
        }, 1500);
    };

    const handleDisconnect = () => {
        setWallet({
            isConnected: false,
            address: null,
            tvltBalance: 0,
            nftCount: 0,
            premiumAccess: false
        });
        onDisconnect?.();
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (!wallet.isConnected) {
        return (
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-6 border border-blue-600">
                <div className="text-center">
                    <Wallet className="text-yellow-400 mx-auto mb-4" size={48} />
                    <h3 className="text-xl font-bold text-white mb-2">
                        Connect Your Wallet
                    </h3>
                    <p className="text-gray-300 mb-6 text-sm">
                        Connect to earn TVLT tokens, mint NFT badges, and access premium features
                    </p>

                    <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center disabled:opacity-50"
                    >
                        {isConnecting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-900 border-t-transparent mr-2"></div>
                                Connecting...
                            </>
                        ) : (
                            <>
                                <Wallet className="mr-2" size={20} />
                                Connect Wallet
                            </>
                        )}
                    </button>

                    <div className="mt-4 text-xs text-gray-400">
                        <p>🔐 Secure connection via Thirdweb</p>
                        <p>🎁 Earn rewards for participation</p>
                        <p>🏆 Unlock exclusive NFT badges</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-6 border border-blue-600">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center mr-3">
                        <Shield className="text-green-900" size={20} />
                    </div>
                    <div>
                        <div className="text-white font-medium">Connected</div>
                        <div className="text-gray-400 text-sm">{formatAddress(wallet.address!)}</div>
                    </div>
                </div>
                <button
                    onClick={handleDisconnect}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                    Disconnect
                </button>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-700/30 rounded-lg p-4 text-center">
                    <Coins className="text-yellow-400 mx-auto mb-2" size={24} />
                    <div className="text-yellow-400 font-bold text-lg">
                        {wallet.tvltBalance}
                    </div>
                    <div className="text-gray-300 text-sm">TVLT Tokens</div>
                </div>

                <div className="bg-blue-700/30 rounded-lg p-4 text-center">
                    <Gift className="text-purple-400 mx-auto mb-2" size={24} />
                    <div className="text-purple-400 font-bold text-lg">
                        {wallet.nftCount}
                    </div>
                    <div className="text-gray-300 text-sm">NFT Badges</div>
                </div>
            </div>

            {/* Premium Status */}
            {wallet.premiumAccess ? (
                <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border border-yellow-400 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                            <span className="text-yellow-900 text-sm font-bold">👑</span>
                        </div>
                        <div>
                            <div className="text-yellow-400 font-medium">Premium Access</div>
                            <div className="text-gray-300 text-sm">AI insights, advanced charts, exclusive features</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-blue-700/30 border border-blue-600 rounded-lg p-4 mb-4">
                    <div className="text-center">
                        <div className="text-white font-medium mb-2">Unlock Premium</div>
                        <div className="text-gray-300 text-sm mb-3">
                            Get AI insights and advanced features
                        </div>
                        <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-medium py-2 px-4 rounded transition-all">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                    <Coins className="mr-2" size={16} />
                    Earn More TVLT
                </button>

                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                    <Gift className="mr-2" size={16} />
                    Mint NFT Badge
                </button>

                <button className="w-full border border-blue-500 text-blue-300 hover:bg-blue-500/10 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                    <ExternalLink className="mr-2" size={16} />
                    View on XRPL Explorer
                </button>
            </div>

            {/* Info */}
            <div className="mt-4 pt-4 border-t border-blue-600">
                <div className="text-xs text-gray-400 text-center">
                    <p>✨ Complete quizzes to earn TVLT</p>
                    <p>🏆 Mint NFT badges for achievements</p>
                    <p>🔮 Hold 1000+ TVLT for premium access</p>
                </div>
            </div>
        </div>
    );
}

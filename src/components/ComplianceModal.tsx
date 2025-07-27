import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ComplianceModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

const ComplianceModal: React.FC<ComplianceModalProps> = ({
    isOpen,
    onAccept,
    onDecline
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="text-amber-500 w-6 h-6" />
                            <h2 className="text-xl font-bold text-gray-900">
                                Privacy Notice & Disclaimers
                            </h2>
                        </div>
                        <button
                            onClick={onDecline}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4 text-sm text-gray-700">
                        {/* FDBR Compliance */}
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                📊 Wage Data Collection (FDBR Compliance)
                            </h3>
                            <p>
                                TimeVault collects hourly wage data for time conversion calculations only. 
                                This data is processed locally in your browser and used to provide personalized 
                                value comparisons. No wage information is stored on our servers or shared 
                                with third parties.
                            </p>
                        </div>

                        {/* Tax Disclaimer */}
                        <div className="border-l-4 border-red-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                🏛️ Tax & Legal Disclaimer (IRS 2025)
                            </h3>
                            <p>
                                <strong>IMPORTANT:</strong> Educational NFTs and utility tokens offered by TimeVault 
                                may constitute taxable events under IRS 2025 guidelines. Digital asset conversions 
                                and NFT transactions may have tax implications. This tool provides educational 
                                calculations only and does not constitute financial, tax, or investment advice.
                                Consult a qualified tax professional for your specific situation.
                            </p>
                        </div>

                        {/* Utility NFT Notice */}
                        <div className="border-l-4 border-green-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                🎓 Educational NFTs - Utility Only
                            </h3>
                            <p>
                                TimeVault Educational NFTs are utility tokens providing access to premium 
                                features, educational content, and calculation tools. They are not investment 
                                securities and hold no promise of financial return. Purchase for utility 
                                value and educational access only.
                            </p>
                        </div>

                        {/* Precious Metals Disclaimer */}
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                ⚠️ No Physical Metal Sales
                            </h3>
                            <p>
                                TimeVault does not sell, store, or facilitate transactions of physical 
                                precious metals. Price conversions are for educational comparison purposes 
                                only using real-time market data from third-party APIs.
                            </p>
                        </div>

                        {/* Data Usage */}
                        <div className="border-l-4 border-purple-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                🔒 Privacy & Data Usage
                            </h3>
                            <p>
                                By using TimeVault, you consent to local processing of calculation data, 
                                anonymous usage analytics, and temporary caching of conversion results. 
                                No personal financial data is transmitted or stored externally.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t">
                        <button
                            onClick={onDecline}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            Decline & Exit
                        </button>
                        <button
                            onClick={onAccept}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                        >
                            Accept & Continue
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                        By clicking "Accept & Continue", you acknowledge reading and understanding these disclosures.
                        Last updated: July 26, 2025
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ComplianceModal;

'use client'

import { AlertCircle, Check, CreditCard, X } from 'lucide-react'
import { useState } from 'react'

interface StripeCheckoutSystemProps {
    onClose?: () => void
}

export default function StripeCheckoutSystem({ onClose }: StripeCheckoutSystemProps) {
    const [selectedPlan, setSelectedPlan] = useState<string>('premium')
    const [isProcessing, setIsProcessing] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const plans = [
        {
            id: 'basic',
            name: 'Basic',
            price: 9.99,
            features: [
                'Basic asset conversion calculator',
                'Standard metals pricing',
                'Limited time tracking',
                'Basic insights'
            ]
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 19.99,
            features: [
                'Advanced conversion calculator',
                'Real-time metals pricing',
                'Unlimited time tracking',
                'AI-powered insights',
                'Priority support'
            ],
            popular: true
        },
        {
            id: 'pro',
            name: 'Professional',
            price: 49.99,
            features: [
                'Enterprise-grade calculator',
                'Premium metals data',
                'Advanced analytics',
                'Custom AI models',
                'Dedicated support',
                'API access'
            ]
        }
    ]

    const handleCheckout = async () => {
        setIsProcessing(true)

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false)
            setShowSuccess(true)

            // Auto-close after success
            setTimeout(() => {
                setShowSuccess(false)
                onClose?.()
            }, 3000)
        }, 2000)
    }

    if (showSuccess) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600">
                        Welcome to TimeVault Premium! Your subscription is now active.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
                        <p className="text-gray-600">Unlock the full potential of TimeVault</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Plans */}
                <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === plan.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    } ${plan.popular ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}
                                onClick={() => setSelectedPlan(plan.id)}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                    <div className="mt-2">
                                        <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                                        <span className="text-gray-600">/month</span>
                                    </div>
                                </div>

                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5 mr-3" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {selectedPlan === plan.id && (
                                    <div className="absolute top-4 right-4">
                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Payment Form */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <CreditCard className="w-5 h-5 mr-2" />
                            Payment Information
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CVC
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cardholder Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 mr-3" />
                                <div>
                                    <h4 className="text-sm font-medium text-blue-900">Secure Payment</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Your payment information is encrypted and secure. We use industry-standard security measures.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Processing...
                                    </div>
                                ) : (
                                    `Subscribe for $${plans.find(p => p.id === selectedPlan)?.price}/month`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const RevenueAccelerationDeployer = dynamic(
    () => import('@/components/revenue/RevenueAccelerationDeployer'),
    {
        loading: () => (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading Revenue Acceleration System...</div>
            </div>
        ),
        ssr: false
    }
)

export default function RevenueCenter() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-white text-xl">Initializing TimeVault AI Revenue Center...</div>
                </div>
            }>
                <RevenueAccelerationDeployer />
            </Suspense>
        </div>
    )
}

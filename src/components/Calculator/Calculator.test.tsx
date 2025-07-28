import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Calculator from '../Calculator';

// Mock the hooks
vi.mock('../../hooks/useApi', () => ({
    useApi: () => ({
        cryptoPrices: [
            {
                id: 'bitcoin',
                name: 'Bitcoin',
                symbol: 'btc',
                current_price: 50000,
                price_change_percentage_24h: 2.5,
                image: 'bitcoin.png'
            }
        ],
        metalPrices: [
            { metal: 'gold', price: 2000, unit: 'USD/oz', change: 1.2 },
            { metal: 'silver', price: 25, unit: 'USD/oz', change: -0.5 }
        ],
        isLoading: false,
        error: null,
        refreshData: vi.fn()
    })
}));

vi.mock('../../hooks/useAnalytics', () => ({
    useAnalytics: () => ({
        track: vi.fn(),
        trackPremiumInterest: vi.fn()
    })
}));

vi.mock('../../hooks/useDebounce', () => ({
    useDebounce: (value: any) => value
}));

describe('Calculator Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders calculator interface correctly', () => {
        render(<Calculator />);

        expect(screen.getByText('TimeVault Calculator')).toBeInTheDocument();
        expect(screen.getByText('Convert crypto to precious metals & time')).toBeInTheDocument();
        expect(screen.getByText('Select Cryptocurrency')).toBeInTheDocument();
    });

    it('displays crypto assets correctly', () => {
        render(<Calculator />);

        expect(screen.getByText('Bitcoin')).toBeInTheDocument();
        expect(screen.getByText('BTC')).toBeInTheDocument();
        expect(screen.getByText('$50,000.00')).toBeInTheDocument();
    });

    it('calculates conversions correctly', async () => {
        render(<Calculator />);

        // Select Bitcoin
        const bitcoinButton = screen.getByText('Bitcoin');
        fireEvent.click(bitcoinButton);

        // Enter amount
        const amountInput = screen.getByPlaceholderText('Enter amount');
        fireEvent.change(amountInput, { target: { value: '2' } });

        await waitFor(() => {
            // Should show USD value
            expect(screen.getByText('$100,000')).toBeInTheDocument();

            // Should show gold equivalent (100000 / 2000 = 50 oz)
            expect(screen.getByText('50.00 oz')).toBeInTheDocument();

            // Should show silver equivalent (100000 / 25 = 4000 oz)  
            expect(screen.getByText('4,000.00 oz')).toBeInTheDocument();
        });
    });

    it('handles hourly wage input for time conversion', async () => {
        render(<Calculator />);

        // Select Bitcoin and enter amount
        const bitcoinButton = screen.getByText('Bitcoin');
        fireEvent.click(bitcoinButton);

        const amountInput = screen.getByPlaceholderText('Enter amount');
        fireEvent.change(amountInput, { target: { value: '1' } });

        // Enter hourly wage
        const wageInput = screen.getByPlaceholderText('Enter your hourly wage');
        fireEvent.change(wageInput, { target: { value: '25' } });

        await waitFor(() => {
            // Should show time equivalent (50000 / 25 = 2000 hours)
            expect(screen.getByText('2,000 hours')).toBeInTheDocument();
            expect(screen.getByText('83.3 days')).toBeInTheDocument();
        });
    });

    it('shows premium upgrade prompts for advanced features', () => {
        render(<Calculator />);

        expect(screen.getByText(/Unlock Premium/)).toBeInTheDocument();
        expect(screen.getByText(/Historical Charts/)).toBeInTheDocument();
        expect(screen.getByText(/AI Insights/)).toBeInTheDocument();
    });

    it('handles loading and error states', () => {
        // Test with loading state
        vi.mocked(useApi).mockReturnValue({
            cryptoPrices: [],
            metalPrices: [],
            isLoading: true,
            error: null,
            refreshData: vi.fn()
        });

        render(<Calculator />);
        expect(screen.getByText(/Loading/)).toBeInTheDocument();

        // Test with error state
        vi.mocked(useApi).mockReturnValue({
            cryptoPrices: [],
            metalPrices: [],
            isLoading: false,
            error: 'Network error',
            refreshData: vi.fn()
        });

        render(<Calculator />);
        expect(screen.getByText(/Error loading data/)).toBeInTheDocument();
    });

    it('validates input correctly', async () => {
        render(<Calculator />);

        const amountInput = screen.getByPlaceholderText('Enter amount');

        // Test negative number
        fireEvent.change(amountInput, { target: { value: '-5' } });
        expect(amountInput).toHaveValue('');

        // Test non-numeric input
        fireEvent.change(amountInput, { target: { value: 'abc' } });
        expect(amountInput).toHaveValue('');

        // Test valid input
        fireEvent.change(amountInput, { target: { value: '1.5' } });
        expect(amountInput).toHaveValue('1.5');
    });

    it('formats numbers correctly', () => {
        render(<Calculator />);

        // Large numbers should be formatted with commas
        expect(screen.getByText('$50,000.00')).toBeInTheDocument();

        // Percentages should be formatted correctly
        expect(screen.getByText('+2.5%')).toBeInTheDocument();
    });

    it('tracks analytics events', async () => {
        const mockTrack = vi.fn();
        vi.mocked(useAnalytics).mockReturnValue({
            track: mockTrack,
            trackPremiumInterest: vi.fn()
        });

        render(<Calculator />);

        // Select crypto asset
        const bitcoinButton = screen.getByText('Bitcoin');
        fireEvent.click(bitcoinButton);

        await waitFor(() => {
            expect(mockTrack).toHaveBeenCalledWith('crypto_selected', {
                asset: 'bitcoin',
                price: 50000
            });
        });
    });
});

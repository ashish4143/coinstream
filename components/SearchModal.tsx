'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, TrendingUp, TrendingDown, X } from 'lucide-react';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';

interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const searchCoins = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY || '',
          },
        }
      );
      const data = await response.json();
      setResults(data.coins?.slice(0, 8) || []);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCoins(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchCoins]);

  // Keyboard shortcut to open (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelect = (coinId: string) => {
    setIsOpen(false);
    router.push(`/coins/${coinId}`);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex].id);
    }
  };

  if (!isOpen) {
    return (
      <div id="search-modal">
        <button className="trigger" onClick={() => setIsOpen(true)}>
          <Search size={16} />
          Search
          <kbd className="kbd">⌘K</kbd>
        </button>
      </div>
    );
  }

  return (
    <div id="search-modal">
      <button className="trigger" onClick={() => setIsOpen(true)}>
        <Search size={16} />
        Search
        <kbd className="kbd">⌘K</kbd>
      </button>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="dialog fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[90vw] rounded-xl border border-dark-500 shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="cmd-input flex items-center gap-3 px-4 py-3 border-b border-dark-500">
          <Search size={18} className="text-purple-100 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search coins... (e.g. Solana, Cardano)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-purple-100/50 text-sm"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-purple-100 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="list overflow-y-auto">
          {isLoading && (
            <div className="empty py-8 text-center text-sm text-purple-100">
              Searching...
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="empty py-8 text-center text-sm text-purple-100">
              No coins found for &quot;{query}&quot;
            </div>
          )}

          {!isLoading && !query && (
            <div className="empty py-8 text-center text-sm text-purple-100">
              Type to search for any cryptocurrency
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="group p-2">
              <p className="heading px-3 py-2 text-xs font-medium uppercase tracking-wider">
                <Search size={14} />
                Search Results
              </p>
              {results.map((coin, index) => (
                <div
                  key={coin.id}
                  data-selected={index === selectedIndex}
                  className="search-item px-3 rounded-lg"
                  onClick={() => handleSelect(coin.id)}
                >
                  <div className="coin-info">
                    <Image
                      src={coin.thumb}
                      alt={coin.name}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{coin.name}</p>
                      <p className="coin-symbol">{coin.symbol}</p>
                    </div>
                  </div>
                  <p className="text-sm text-purple-100">
                    {coin.market_cap_rank ? `#${coin.market_cap_rank}` : '-'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

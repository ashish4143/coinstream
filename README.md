# CoinStream

CoinStream is an advanced, real-time cryptocurrency analytics platform designed to provide institutional-grade market intelligence. By leveraging WebSockets and REST APIs, it delivers a low-latency, high-frequency dashboard for tracking digital assets with precision.

## Architecture & Technology

CoinStream is built on a modern, high-performance web stack:
- **Core Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling Engine**: Tailwind CSS v4
- **Component Library**: shadcn/ui
- **Financial Charting**: TradingView Lightweight Charts
- **Data Provider**: CoinGecko API

## Core Capabilities

- **Real-Time Data Pipelines**: Continuous, low-latency streams for live pricing and orderbook executions via WebSockets.
- **Precision Charting**: Multi-timeframe OHLCV visualizations utilizing TradingView's lightweight library for seamless interaction and deep market analysis.
- **Market Intelligence**: Dynamic tracking of global metrics including Total Market Cap, BTC/ETH dominance, and trending crypto assets.
- **Asset Discovery**: Paginated, comprehensive data tables allowing sorting and searching across thousands of digital assets.
- **Currency Conversion**: Instantaneous calculations across fiat currencies and crypto pairs.

## Development Setup

To run CoinStream locally, follow these steps:

### Prerequisites
- Node.js (v18+)
- npm, yarn, or pnpm
- A valid CoinGecko API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/coinstream.git
   cd coinstream
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file at the root of the project with the following keys:
   ```env
   COINGECKO_BASE_URL=https://pro-api.coingecko.com/api/v3
   COINGECKO_API_KEY=your_rest_api_key_here

   NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL=wss://ws.coingecko.com/cable
   NEXT_PUBLIC_COINGECKO_API_KEY=your_websocket_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## License

Distributed under the MIT License.

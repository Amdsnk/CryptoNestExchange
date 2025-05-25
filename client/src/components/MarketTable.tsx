import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  SiBitcoin, 
  SiEthereum, 
  SiLitecoin, 
  SiRipple, 
  SiDogecoin, 
  SiChainlink,
  SiTether,
  SiBinance,
  SiCardano,
  SiPolkadot,
  SiStellar,
  SiMonero,
  SiZcash
} from "react-icons/si";

import { 
  FaRocket, 
  FaChartPie, 
  FaDatabase, 
  FaCoins, 
  FaRing, 
  FaAtom, 
  FaFireAlt 
} from "react-icons/fa";

interface Coin {
  name: string;
  symbol: string;
  icon: React.ReactNode;
  price: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  change24h: number;
  chart: string;
}

export default function MarketTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const coins: Coin[] = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      icon: <SiBitcoin className="text-[#F7931A]" />,
      price: 66534.28,
      high24h: 69820.00,
      low24h: 65298.00,
      volume24h: 21908740324,
      marketCap: 1302874129087,
      change24h: -1.73,
      chart: "down",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      icon: <SiEthereum className="text-[#627EEA]" />,
      price: 3205.38,
      high24h: 3356.00,
      low24h: 3102.00,
      volume24h: 13754902734,
      marketCap: 386208731904,
      change24h: -2.86,
      chart: "down",
    },
    {
      name: "Litecoin",
      symbol: "LTC",
      icon: <SiLitecoin className="text-[#D3D3D3]" />,
      price: 73.47,
      high24h: 76.58,
      low24h: 72.93,
      volume24h: 487293147,
      marketCap: 5400283745,
      change24h: -1.68,
      chart: "down",
    },
    {
      name: "Ripple",
      symbol: "XRP",
      icon: <SiRipple className="text-[#23292F]" />,
      price: 0.5278,
      high24h: 0.5398,
      low24h: 0.5159,
      volume24h: 1253697823,
      marketCap: 28736491275,
      change24h: 1.42,
      chart: "up",
    },
    {
      name: "Dogecoin",
      symbol: "DOGE",
      icon: <SiDogecoin className="text-[#C2A633]" />,
      price: 0.1243,
      high24h: 0.1283,
      low24h: 0.1208,
      volume24h: 1079284712,
      marketCap: 17825392743,
      change24h: -0.98,
      chart: "down",
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      icon: <SiChainlink className="text-[#2A5ADA]" />,
      price: 14.67,
      high24h: 15.32,
      low24h: 14.21,
      volume24h: 596723841,
      marketCap: 8738420156,
      change24h: 3.42,
      chart: "up",
    },
    {
      name: "Tether",
      symbol: "USDT",
      icon: <SiTether className="text-[#26A17B]" />,
      price: 1.00,
      high24h: 1.01,
      low24h: 0.99,
      volume24h: 61283942153,
      marketCap: 93841020387,
      change24h: 0.01,
      chart: "neutral",
    },
    {
      name: "Binance Coin",
      symbol: "BNB",
      icon: <SiBinance className="text-[#F3BA2F]" />,
      price: 496.82,
      high24h: 518.24,
      low24h: 493.17,
      volume24h: 2984723641,
      marketCap: 76283941732,
      change24h: -3.29,
      chart: "down",
    },
    {
      name: "Cardano",
      symbol: "ADA",
      icon: <SiCardano className="text-[#3CC8C8]" />,
      price: 0.4392,
      high24h: 0.4512,
      low24h: 0.4302,
      volume24h: 371984235,
      marketCap: 15482376429,
      change24h: 2.37,
      chart: "up",
    },
    {
      name: "Polkadot",
      symbol: "DOT",
      icon: <SiPolkadot className="text-[#E6007A]" />,
      price: 6.92,
      high24h: 7.26,
      low24h: 6.85,
      volume24h: 283471932,
      marketCap: 9837418529,
      change24h: -2.06,
      chart: "down",
    },
    {
      name: "Stellar",
      symbol: "XLM",
      icon: <SiStellar className="text-[#14B6E7]" />,
      price: 0.1143,
      high24h: 0.1198,
      low24h: 0.1129,
      volume24h: 92381734,
      marketCap: 3148273984,
      change24h: 1.28,
      chart: "up",
    },
    {
      name: "Tron",
      symbol: "TRX",
      icon: <FaRocket className="text-[#EF0027]" />,
      price: 0.1182,
      high24h: 0.1215,
      low24h: 0.1164,
      volume24h: 216749832,
      marketCap: 10483921374,
      change24h: -1.94,
      chart: "down",
    },
    {
      name: "Monero",
      symbol: "XMR",
      icon: <SiMonero className="text-[#FF6600]" />,
      price: 171.84,
      high24h: 179.32,
      low24h: 169.57,
      volume24h: 92837461,
      marketCap: 3127834902,
      change24h: -3.57,
      chart: "down",
    },
    {
      name: "Uniswap",
      symbol: "UNI",
      icon: <FaChartPie className="text-[#FF007A]" />,
      price: 6.42,
      high24h: 6.89,
      low24h: 6.32,
      volume24h: 193847523,
      marketCap: 4738294731,
      change24h: -4.28,
      chart: "down",
    },
    {
      name: "Dash",
      symbol: "DASH",
      icon: <FaDatabase className="text-[#008CE7]" />,
      price: 30.56,
      high24h: 31.47,
      low24h: 29.82,
      volume24h: 67384912,
      marketCap: 364829374,
      change24h: 2.18,
      chart: "up",
    },
    {
      name: "EOS",
      symbol: "EOS",
      icon: <FaCoins className="text-black" />,
      price: 0.7143,
      high24h: 0.7385,
      low24h: 0.7023,
      volume24h: 83742913,
      marketCap: 798342913,
      change24h: -2.74,
      chart: "down",
    },
    {
      name: "Neo",
      symbol: "NEO",
      icon: <FaRing className="text-[#58BF00]" />,
      price: 11.38,
      high24h: 11.92,
      low24h: 11.14,
      volume24h: 53829174,
      marketCap: 802394174,
      change24h: -1.83,
      chart: "down",
    },
    {
      name: "Zcash",
      symbol: "ZEC",
      icon: <SiZcash className="text-[#F4B728]" />,
      price: 28.74,
      high24h: 30.12,
      low24h: 27.93,
      volume24h: 62384917,
      marketCap: 467382941,
      change24h: 1.42,
      chart: "up",
    },
    {
      name: "Maker",
      symbol: "MKR",
      icon: <FaAtom className="text-[#6ACEBB]" />,
      price: 1547.92,
      high24h: 1612.38,
      low24h: 1523.67,
      volume24h: 73849174,
      marketCap: 1398271394,
      change24h: -3.27,
      chart: "down",
    },
    {
      name: "IOTA",
      symbol: "MIOTA",
      icon: <FaFireAlt className="text-[#242424]" />,
      price: 0.1834,
      high24h: 0.1927,
      low24h: 0.1802,
      volume24h: 27384917,
      marketCap: 549283741,
      change24h: -2.19,
      chart: "down",
    },
  ];

  const formatNumber = (num: number, symbol?: string) => {
    if (num < 0.01 && num > 0) {
      return `$${num.toFixed(6)}`;
    }
    
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    }
    
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    
    if (symbol === 'USDT') {
      return `$${num.toFixed(2)}`;
    }
    
    if (num > 1000) {
      return `$${num.toFixed(2)}`;
    }
    
    return `$${num.toFixed(4)}`;
  };

  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mb-4 p-2">
        <input
          type="text"
          placeholder="Search by coin name or symbol..."
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-gray-300 font-medium w-[60px]">Asset</TableHead>
                <TableHead className="text-gray-300 font-medium">Name</TableHead>
                <TableHead className="text-gray-300 font-medium text-right">Price</TableHead>
                <TableHead className="text-gray-300 font-medium text-right">24h High</TableHead>
                <TableHead className="text-gray-300 font-medium text-right">24h Low</TableHead>
                <TableHead className="text-gray-300 font-medium text-right">24h Volume</TableHead>
                <TableHead className="text-gray-300 font-medium text-right">Market Cap</TableHead>
                <TableHead className="text-gray-300 font-medium text-right">24h Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoins.map((coin) => (
                <TableRow key={coin.symbol} className="border-t border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="font-medium text-xl py-4">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-800">
                      {coin.icon}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{coin.name}</div>
                      <div className="text-gray-400 text-sm">{coin.symbol}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-white">
                    {formatNumber(coin.price, coin.symbol)}
                  </TableCell>
                  <TableCell className="text-right text-gray-300">
                    {formatNumber(coin.high24h, coin.symbol)}
                  </TableCell>
                  <TableCell className="text-right text-gray-300">
                    {formatNumber(coin.low24h, coin.symbol)}
                  </TableCell>
                  <TableCell className="text-right text-gray-300">
                    {formatNumber(coin.volume24h)}
                  </TableCell>
                  <TableCell className="text-right text-gray-300">
                    {formatNumber(coin.marketCap)}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    coin.change24h > 0 
                      ? 'text-green-500' 
                      : coin.change24h < 0 
                        ? 'text-red-500' 
                        : 'text-gray-400'
                  }`}>
                    <div className="flex items-center justify-end">
                      {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      {coin.change24h > 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : coin.change24h < 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
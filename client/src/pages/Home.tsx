import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SiEthereum, SiTether, SiBinance } from "react-icons/si";
import MarketTable from "@/components/MarketTable";
import dashboardImage from "../assets/crypto-dashboard.svg";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="px-4 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
            CryptoNest
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button variant="default" className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                Welcome to the world's leading
              </span>{" "}
              <div className="mt-2">digital asset trading platform</div>
            </h1>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              Your secure gateway to cryptocurrency trading. Connect your wallet, deposit funds, 
              and start trading in minutes with our intuitive platform.
            </p>
            <div className="mt-6 flex gap-4 flex-wrap">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-md">
                Security
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Stable
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md">
                First in class
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-md">
                Quick
              </Button>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-lg py-6 px-8">
                  Create Account
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full sm:w-auto text-lg py-6 px-8 border-gray-600">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-violet-500/20 rounded-full filter blur-3xl"></div>
            
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="flex justify-between mb-6">
                <div className="text-xl font-semibold">Market Overview</div>
                <div className="text-sm text-gray-400">Live Data</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/80 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-500 text-2xl">
                      <SiEthereum />
                    </div>
                    <div>
                      <div className="font-medium">Ethereum</div>
                      <div className="text-sm text-gray-400">ETH</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$3,245.67</div>
                    <div className="text-sm text-green-500">+2.34%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/80 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="text-yellow-500 text-2xl">
                      <SiBinance />
                    </div>
                    <div>
                      <div className="font-medium">Binance Coin</div>
                      <div className="text-sm text-gray-400">BNB</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$456.78</div>
                    <div className="text-sm text-green-500">+1.24%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/80 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="text-green-500 text-2xl">
                      <SiTether />
                    </div>
                    <div>
                      <div className="font-medium">Tether</div>
                      <div className="text-sm text-gray-400">USDT</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$1.00</div>
                    <div className="text-sm text-gray-400">+0.01%</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700">
                  Start Trading
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Data Section */}
      <section className="py-10 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400">Bitcoin (BTC/USD)</div>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">$66,534.28</div>
              <div className="text-red-500 flex items-center">
                -1.73%
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400">Ethereum (ETH/USD)</div>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">$3,205.38</div>
              <div className="text-red-500 flex items-center">
                -2.86%
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400">Binance (BNB/USD)</div>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">$496.82</div>
              <div className="text-red-500 flex items-center">
                -3.29%
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <MarketTable />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 text-center">
            <div className="h-16 w-16 mx-auto bg-gradient-to-r from-blue-500 to-violet-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Financial Security</h3>
            <p className="text-gray-400 text-sm">
              Advanced encryption and multi-layer security protocols to keep your assets safe.
            </p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 text-center">
            <div className="h-16 w-16 mx-auto bg-gradient-to-r from-blue-500 to-violet-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">24/7 Trading</h3>
            <p className="text-gray-400 text-sm">
              Trade cryptocurrencies any time, with real-time market data available 24/7.
            </p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 text-center">
            <div className="h-16 w-16 mx-auto bg-gradient-to-r from-blue-500 to-violet-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Global Market</h3>
            <p className="text-gray-400 text-sm">
              Access digital assets from around the world with our globally-accessible platform.
            </p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 text-center">
            <div className="h-16 w-16 mx-auto bg-gradient-to-r from-blue-500 to-violet-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">High-speed trading</h3>
            <p className="text-gray-400 text-sm">
              Execute trades in milliseconds with our high-performance trading infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Secure Transactions Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Open secure transactions
                <span className="block mt-2">anytime, anywhere</span>
              </h2>
              <p className="text-gray-300 mb-8">
                Connect your digital wallet and trade securely from any device. Our platform 
                ensures your assets are protected with enterprise-grade security while providing 
                a seamless trading experience.
              </p>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 rounded-xl p-8">
                <img 
                  src={dashboardImage} 
                  alt="CryptoNest Trading Platform" 
                  className="w-full rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Start Your Cryptocurrency Journey Today</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of traders on our secure platform
        </p>
        <Link href="/register">
          <Button className="text-lg py-6 px-10 bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700">
            Sign Up Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                CryptoNest
              </div>
              <p className="text-gray-400 max-w-xs">
                Your secure gateway to cryptocurrency trading with Metamask integration.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Exchange</a></li>
                  <li><a href="#" className="hover:text-white transition">Wallets</a></li>
                  <li><a href="#" className="hover:text-white transition">History</a></li>
                  <li><a href="#" className="hover:text-white transition">Settings</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-gray-400 text-sm text-center">
            <p>© {new Date().getFullYear()} CryptoNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, CartContext } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { ShoppingCart, User, Search, Pill, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

const TopNav = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart, removeFromCart } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b" data-testid="site-header">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="site-logo">
            <Pill className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-semibold">Wellnest Pharmacy</span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                data-testid="global-search-input"
                type="search"
                placeholder="Search medicines, wellness products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/catalog">
              <Button variant="ghost">Shop</Button>
            </Link>
            
            {/* Cart Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="relative" data-testid="open-cart-button">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-primary text-[11px] text-white flex items-center justify-center">
                      {cart.items.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent data-testid="cart-sheet">
                <SheetHeader>
                  <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-200px)] mt-4">
                  {cart.items.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.items.map((item) => (
                        <div key={item.productId} className="flex gap-3 border-b pb-3" data-testid="cart-line-item">
                          <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                {cart.items.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-white">
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold">${cart.total.toFixed(2)}</span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => navigate('/checkout')}
                      data-testid="cart-checkout-button"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/profile')} data-testid="nav-account-button">
                  <User className="h-5 w-5 mr-2" />
                  {user.name}
                </Button>
                {(user.role === 'admin' || user.role === 'pharmacist') && (
                  <Button variant="ghost" onClick={() => navigate(user.role === 'admin' ? '/admin' : '/pharmacist')}>
                    Dashboard
                  </Button>
                )}
                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/auth')} data-testid="nav-login-button">
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <div className="flex flex-col gap-2">
              <Link to="/catalog" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Shop</Button>
              </Link>
              {user ? (
                <>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}>
                    Profile
                  </Button>
                  {(user.role === 'admin' || user.role === 'pharmacist') && (
                    <Button variant="ghost" className="justify-start" onClick={() => { navigate(user.role === 'admin' ? '/admin' : '/pharmacist'); setMobileMenuOpen(false); }}>
                      Dashboard
                    </Button>
                  )}
                  <Button variant="ghost" className="justify-start" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <Button className="justify-start" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;
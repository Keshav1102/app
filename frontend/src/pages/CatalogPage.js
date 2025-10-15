import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CartContext } from '../App';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import { Filter } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CatalogPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    rxOnly: false
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.rxOnly) params.append('requiresPrescription', 'true');
      
      const response = await axios.get(`${API}/products?${params}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const categories = [
    { id: 'rx-medicines', name: 'Rx Medicines' },
    { id: 'wellness', name: 'Wellness' },
    { id: 'devices', name: 'Medical Devices' },
    { id: 'baby-care', name: 'Baby Care' }
  ];

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-semibold">Shop Products</h1>
          <p className="mt-2 text-muted-foreground">Browse our selection of quality healthcare products</p>
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Filters Sidebar */}
          <div className="mb-6 lg:mb-0">
            <Button
              variant="outline"
              className="md:hidden w-full mb-4"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="filter-open-button"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>

            <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-6`}>
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="all-categories"
                      checked={!filters.category}
                      onCheckedChange={() => setFilters({ ...filters, category: '' })}
                    />
                    <Label htmlFor="all-categories" className="ml-2 cursor-pointer">All Categories</Label>
                  </div>
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center">
                      <Checkbox
                        id={cat.id}
                        checked={filters.category === cat.id}
                        onCheckedChange={() => setFilters({ ...filters, category: cat.id })}
                        data-testid={`filter-category-${cat.id}`}
                      />
                      <Label htmlFor={cat.id} className="ml-2 cursor-pointer">{cat.name}</Label>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Prescription</h3>
                <div className="flex items-center">
                  <Checkbox
                    id="rx-only"
                    checked={filters.rxOnly}
                    onCheckedChange={(checked) => setFilters({ ...filters, rxOnly: checked })}
                    data-testid="filter-rx-only"
                  />
                  <Label htmlFor="rx-only" className="ml-2 cursor-pointer">Prescription Required Only</Label>
                </div>
              </Card>
            </div>
          </div>

          {/* Products Grid */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="catalog-grid">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="aspect-square w-full rounded-md mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="catalog-grid">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      data-testid="product-card"
                      className="group relative h-full overflow-hidden rounded-lg border bg-card p-4 transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(9,35,31,0.10)] cursor-pointer"
                    >
                      <div onClick={() => navigate(`/product/${product.id}`)}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="aspect-square w-full object-cover rounded-md mb-3"
                        />
                        <div className="space-y-1">
                          <h3 className="font-medium line-clamp-2">{product.name}</h3>
                          {product.strength && (
                            <p className="text-sm text-muted-foreground">{product.strength}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="font-semibold tabular-nums">${product.price.toFixed(2)}</span>
                            {product.requiresPrescription && (
                              <Badge variant="secondary" data-testid="rx-required-badge" className="text-xs">Rx</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        className="mt-3 w-full"
                        onClick={() => handleAddToCart(product)}
                        data-testid="add-to-cart-button"
                      >
                        Add to Cart
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
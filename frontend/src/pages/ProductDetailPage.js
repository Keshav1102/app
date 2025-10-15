import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../App';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { Minus, Plus, ArrowLeft } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
      navigate('/catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/catalog')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg border shadow-[0_8px_24px_rgba(9,35,31,0.08)]"
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">{product.name}</h1>
                {product.strength && (
                  <p className="text-muted-foreground">{product.strength}</p>
                )}
              </div>
              {product.requiresPrescription && (
                <Badge className="bg-[hsl(161_93%_24%)] text-white">Prescription Required</Badge>
              )}
            </div>

            <div className="mb-6">
              <p className="text-3xl font-semibold tabular-nums">${product.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <Label className="mb-2 block font-semibold">Quantity</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mb-4"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              data-testid="add-to-cart-button"
            >
              Add to Cart
            </Button>

            {/* Product Details Tabs */}
            <Tabs defaultValue="details" className="mt-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="side-effects">Side Effects</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <Card className="p-4">
                  <dl className="space-y-2 text-sm">
                    {product.manufacturer && (
                      <div>
                        <dt className="font-semibold">Manufacturer:</dt>
                        <dd className="text-muted-foreground">{product.manufacturer}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-semibold">Category:</dt>
                      <dd className="text-muted-foreground capitalize">{product.category.replace('-', ' ')}</dd>
                    </div>
                  </dl>
                </Card>
              </TabsContent>
              <TabsContent value="usage" className="mt-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {product.usage || 'Please consult your healthcare provider for usage instructions.'}
                  </p>
                </Card>
              </TabsContent>
              <TabsContent value="side-effects" className="mt-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {product.sideEffects || 'Please consult your healthcare provider for information about side effects.'}
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = ({ children, ...props }) => (
  <label {...props} className={props.className}>{children}</label>
);

export default ProductDetailPage;
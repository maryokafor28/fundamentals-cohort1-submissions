import type { NextPage } from 'next';
import React, { useContext, useState } from 'react';
import { Badge, Button, Card, Col, Row, Modal } from 'react-bootstrap';
import { BagCheckFill, Eye } from 'react-bootstrap-icons';
import ReactStars from 'react-stars';
import { Context } from '../context';
import CartOffCanvas from '../components/CartOffCanvas';
import { getFormatedStringFromDays } from '../helper/utils';

// Sample shoe products data
const shoeProducts = [
  {
    _id: '1',
    productName: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max technology for all-day comfort.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    avgRating: 4.5,
    skuDetails: [{
      _id: 'sku1',
      skuName: 'Standard',
      price: 150,
      validity: 365,
      lifetime: true,
      stripePriceId: 'price_nike_270'
    }],
    highlights: ['Air Max cushioning', 'Breathable mesh', 'Durable rubber sole', 'Lightweight design']
  },
  {
    _id: '2',
    productName: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with Boost midsole technology.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    avgRating: 4.7,
    skuDetails: [{
      _id: 'sku2',
      skuName: 'Premium',
      price: 180,
      validity: 365,
      lifetime: true,
      stripePriceId: 'price_adidas_ultra'
    }],
    highlights: ['Boost technology', 'Primeknit upper', 'Continental rubber', 'Energy return']
  },
  {
    _id: '3',
    productName: 'Converse Chuck Taylor',
    description: 'Classic canvas sneakers with timeless design.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop',
    avgRating: 4.2,
    skuDetails: [{
      _id: 'sku3',
      skuName: 'Classic',
      price: 65,
      validity: 365,
      lifetime: true,
      stripePriceId: 'price_converse_chuck'
    }],
    highlights: ['Canvas upper', 'Rubber toe cap', 'Classic design', 'Versatile style']
  },
  {
    _id: '4',
    productName: 'Vans Old Skool',
    description: 'Iconic skate shoes with signature side stripe.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop',
    avgRating: 4.3,
    skuDetails: [{
      _id: 'sku4',
      skuName: 'Skate',
      price: 75,
      validity: 365,
      lifetime: true,
      stripePriceId: 'price_vans_old'
    }],
    highlights: ['Suede and canvas', 'Waffle outsole', 'Padded collar', 'Signature stripe']
  },
  {
    _id: '5',
    productName: 'Puma RS-X',
    description: 'Retro-futuristic running shoes with bold design.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop',
    avgRating: 4.1,
    skuDetails: [{
      _id: 'sku5',
      skuName: 'Retro',
      price: 120,
      validity: 365,
      lifetime: true,
      stripePriceId: 'price_puma_rsx'
    }],
    highlights: ['RS cushioning', 'Mixed materials', 'Bold colorways', 'Chunky silhouette']
  },
  {
    _id: '6',
    productName: 'New Balance 990v5',
    description: 'Premium made-in-USA running shoes with superior comfort.',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=300&fit=crop',
    avgRating: 4.8,
    skuDetails: [{
      _id: 'sku6',
      skuName: 'Premium',
      price: 200,
      validity: 365,
      lifetime: true,
      stripePriceId: 'price_nb_990'
    }],
    highlights: ['Made in USA', 'ENCAP midsole', 'Premium materials', 'Classic styling']
  },
  {
    _id: '7',
    productName: 'Jordan Air Force 1',
    description: 'Iconic basketball shoes with timeless appeal.',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop',
    avgRating: 4.6,
    skuDetails: [{
      _id: 'sku7',
      skuName: 'Classic',
      price: 110,
      validity: 365,
      lifetime: true,
      stripePriceId: 'price_jordan_af1'
    }],
    highlights: ['Air cushioning', 'Leather upper', 'Rubber outsole', 'Classic design']
  },
  {
    _id: '8',
    productName: 'Reebok Classic Leather',
    description: 'Vintage-inspired sneakers with soft leather construction.',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop',
    avgRating: 4.0,
    skuDetails: [{
      _id: 'sku8',
      skuName: 'Vintage',
      price: 85,
      validity: 365,
      lifetime: true,
      stripePriceId: 'price_reebok_classic'
    }],
    highlights: ['Soft leather', 'EVA midsole', 'High abrasion rubber', 'Vintage style']
  },
  {
    _id: '9',
    productName: 'ASICS Gel-Kayano 29',
    description: 'Stability running shoes with advanced gel cushioning.',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop',
    avgRating: 4.4,
    skuDetails: [{
      _id: 'sku9',
      skuName: 'Performance',
      price: 160,
      validity: 365,
      lifetime: true,
      stripePriceId: 'price_asics_kayano'
    }],
    highlights: ['GEL technology', 'FlyteFoam midsole', 'Stability support', 'Breathable mesh']
  }
];

const ShoesDemo: NextPage = () => {
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const { cartItems, cartDispatch } = useContext(Context);

  const handleAddToCart = (product: any) => {
    const sku = product.skuDetails[0];
    
    cartDispatch({
      type: cartItems.find((item: any) => item.skuId === sku._id) ? 'UPDATE_CART' : 'ADD_TO_CART',
      payload: {
        skuId: sku._id,
        quantity: 1,
        validity: sku.lifetime ? 0 : sku.validity,
        lifetime: sku.lifetime,
        price: sku.price,
        productName: product.productName,
        productImage: product.image,
        productId: product._id,
        skuPriceId: sku.stripePriceId,
      },
    });
    setShowCart(true);
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-center mb-4">Shoe Collection Demo</h1>
          <p className="text-center text-muted mb-4">
            Click on any shoe to view details or add to cart for testing order functionality
          </p>
        </div>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {shoeProducts.map((product) => (
          <Col key={product._id}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={product.image}
                style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
                alt={product.productName}
                onClick={() => handleViewProduct(product)}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleViewProduct(product)}
                >
                  {product.productName}
                </Card.Title>
                
                <div className="mb-2">
                  <ReactStars
                    count={5}
                    edit={false}
                    value={product.avgRating}
                    size={20}
                    color2={'#ffd700'}
                  />
                </div>

                <Card.Text className="flex-grow-1">
                  {product.description}
                </Card.Text>

                <div className="mb-3">
                  <span className="h5 text-primary">₦{product.skuDetails[0].price}</span>
                  <Badge bg="success" className="ms-2">
                    {product.skuDetails[0].lifetime ? 'Lifetime' : getFormatedStringFromDays(product.skuDetails[0].validity)}
                  </Badge>
                </div>

                <div className="d-flex gap-2">
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => handleViewProduct(product)}
                    className="flex-grow-1"
                  >
                    <Eye className="me-1" />
                    View Details
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    className="flex-grow-1"
                  >
                    <BagCheckFill className="me-1" />
                    {cartItems.find((item: any) => item.skuId === product.skuDetails[0]._id) ? 'Update Cart' : 'Add to Cart'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Product Details Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.productName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Row>
              <Col md={6}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.productName}
                  className="img-fluid rounded"
                />
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <ReactStars
                    count={5}
                    edit={false}
                    value={selectedProduct.avgRating}
                    size={24}
                    color2={'#ffd700'}
                  />
                </div>
                <p>{selectedProduct.description}</p>
                <div className="mb-3">
                  <h4 className="text-primary">₦{selectedProduct.skuDetails[0].price}</h4>
                  <Badge bg="success">
                    {selectedProduct.skuDetails[0].lifetime ? 'Lifetime' : getFormatedStringFromDays(selectedProduct.skuDetails[0].validity)}
                  </Badge>
                </div>
                <div className="mb-3">
                  <h6>Features:</h6>
                  <ul>
                    {selectedProduct.highlights.map((highlight: string, index: number) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setShowProductModal(false);
                  }}
                  className="w-100"
                >
                  <BagCheckFill className="me-2" />
                  {cartItems.find((item: any) => item.skuId === selectedProduct.skuDetails[0]._id) ? 'Update Cart' : 'Add to Cart'}
                </Button>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>

      {/* Cart Off Canvas */}
      <CartOffCanvas setShow={setShowCart} show={showCart} />
    </div>
  );
};

export default ShoesDemo;
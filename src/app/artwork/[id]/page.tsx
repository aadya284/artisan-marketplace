"use client";

import { useState } from "react";
import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import AiChatbotWidget from "@/components/ui/ai-chatbot-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  Plus,
  Minus,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Sample artwork data - in a real app, this would come from an API
const artworksData = {
  1: {
    id: 1,
    name: "Hand-Painted Madhubani Art",
    artist: {
      name: "Sita Devi",
      image: "https://images.unsplash.com/photo-1494790108755-2616b4e2d81d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      bio: "Sita Devi is a master artist from Madhubani, Bihar, with over 25 years of experience in traditional Madhubani painting. She has won several state awards and her works are displayed in museums across India.",
      location: "Madhubani, Bihar",
      rating: 4.9,
      totalReviews: 342,
      worksCreated: 156
    },
    state: "Bihar",
    price: 4500,
    originalPrice: 6000,
    rating: 4.8,
    reviews: 124,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Paintings",
    featured: true,
    description: "This exquisite Madhubani painting showcases the traditional folk art of Bihar, featuring intricate geometric patterns and vibrant colors that tell ancient stories. Each stroke is carefully hand-painted using natural pigments and traditional techniques passed down through generations.",
    features: [
      "100% Hand-painted with natural pigments",
      "Traditional Madhubani art style from Bihar",
      "Dimensions: 16\" x 12\" on handmade paper",
      "Includes certificate of authenticity",
      "Ready to frame"
    ],
    specifications: {
      "Medium": "Natural pigments on handmade paper",
      "Style": "Traditional Madhubani",
      "Dimensions": "16\" x 12\"",
      "Origin": "Madhubani, Bihar",
      "Artist": "Sita Devi",
      "Year": "2024"
    },
    inStock: true,
    stockCount: 3,
    deliveryInfo: {
      standard: "5-7 business days",
      express: "2-3 business days",
      freeShipping: true
    }
  },
  2: {
    id: 2,
    name: "Blue Pottery Decorative Bowl",
    artist: {
      name: "Kripal Singh",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      bio: "Kripal Singh is a renowned blue pottery artist from Jaipur, Rajasthan. His family has been practicing this art form for over 100 years, and he continues the tradition with contemporary designs.",
      location: "Jaipur, Rajasthan",
      rating: 4.7,
      totalReviews: 287,
      worksCreated: 89
    },
    state: "Rajasthan",
    price: 2200,
    originalPrice: 2800,
    rating: 4.6,
    reviews: 89,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    category: "Ceramics",
    featured: false,
    description: "A beautiful blue pottery decorative bowl featuring traditional Rajasthani patterns. This piece is perfect for home decoration or as a serving bowl for special occasions.",
    features: [
      "Traditional blue pottery from Jaipur",
      "Hand-glazed ceramic with intricate patterns",
      "Diameter: 8 inches, Height: 3 inches",
      "Food-safe and functional",
      "Microwave safe"
    ],
    specifications: {
      "Medium": "Ceramic with blue glaze",
      "Style": "Traditional Rajasthani Blue Pottery",
      "Dimensions": "8\" diameter x 3\" height",
      "Origin": "Jaipur, Rajasthan",
      "Artist": "Kripal Singh",
      "Year": "2024"
    },
    inStock: true,
    stockCount: 7,
    deliveryInfo: {
      standard: "5-7 business days",
      express: "2-3 business days",
      freeShipping: false
    }
  }
};

// Sample reviews data
const reviewsData = {
  1: [
    {
      id: 1,
      userName: "Priya Sharma",
      userImage: "https://images.unsplash.com/photo-1494790108755-2616b4e2d81d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      date: "2024-01-15",
      comment: "Absolutely beautiful artwork! The colors are vibrant and the detailing is exquisite. It arrived well-packaged and exactly as described.",
      helpful: 12
    },
    {
      id: 2,
      userName: "Rajesh Kumar",
      userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      date: "2024-01-10",
      comment: "This is a genuine piece of traditional Madhubani art. The artist's skill is evident in every stroke. Highly recommended!",
      helpful: 8
    },
    {
      id: 3,
      userName: "Anita Desai",
      userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 4,
      date: "2024-01-05",
      comment: "Beautiful painting but took a bit longer to arrive than expected. The quality is excellent though.",
      helpful: 5
    }
  ],
  2: [
    {
      id: 1,
      userName: "Meera Patel",
      userImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      date: "2024-01-12",
      comment: "Love this bowl! Perfect for serving and the blue color is gorgeous. Great quality pottery.",
      helpful: 6
    },
    {
      id: 2,
      userName: "Amit Gupta",
      userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 4,
      date: "2024-01-08",
      comment: "Good quality but slightly smaller than I expected. Still a beautiful piece.",
      helpful: 3
    }
  ]
};

interface ArtworkDetailPageProps {
  params: {
    id: string;
  };
}

export default function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const artwork = artworksData[parseInt(params.id) as keyof typeof artworksData];
  const reviews = reviewsData[parseInt(params.id) as keyof typeof reviewsData] || [];

  if (!artwork) {
    notFound();
  }

  const discount = Math.round((1 - artwork.price / artwork.originalPrice) * 100);

  const increaseQuantity = () => {
    if (quantity < artwork.stockCount) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleContactArtisan = () => {
    if (!contactMessage.trim()) return;

    // Here you would send the message to your backend
    console.log("Sending message to artisan:", {
      artworkId: artwork.id,
      artworkName: artwork.name,
      artistName: artwork.artist.name,
      message: contactMessage,
      timestamp: new Date().toISOString()
    });

    // Show success message
    alert("Your message has been sent to the artisan! They will respond soon.");
    setIsContactDialogOpen(false);
    setContactMessage("");
  };

  return (
    <>
      <AnimatedIndicatorNavbar />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        {/* Breadcrumb */}
        <div className="container mx-auto py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/explore" className="hover:text-orange-600 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Back to Explore
            </Link>
            <span>/</span>
            <span className="text-gray-800">{artwork.name}</span>
          </nav>
        </div>

        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-xl bg-white shadow-lg">
                <img
                  src={artwork.images[selectedImageIndex]}
                  alt={artwork.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {artwork.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {artwork.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? "border-orange-600" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${artwork.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="text-orange-700 border-orange-200 mb-3">
                  {artwork.state} • {artwork.category}
                </Badge>
                <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {artwork.name}
                </h1>
                <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  by {artwork.artist.name}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{artwork.rating}</span>
                </div>
                <span className="text-gray-500">({artwork.reviews} reviews)</span>
                {artwork.featured && (
                  <Badge className="bg-orange-600 text-white">Featured</Badge>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-800">₹{artwork.price.toLocaleString()}</span>
                {artwork.originalPrice > artwork.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{artwork.originalPrice.toLocaleString()}</span>
                    <Badge className="bg-green-600 text-white">{discount}% OFF</Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${artwork.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={artwork.inStock ? 'text-green-700' : 'text-red-700'}>
                  {artwork.inStock ? `In Stock (${artwork.stockCount} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              {artwork.inStock && (
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="px-3"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={increaseQuantity}
                      disabled={quantity >= artwork.stockCount}
                      className="px-3"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
                    disabled={!artwork.inStock}
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold py-3"
                    disabled={!artwork.inStock}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFavorite ? 'Added to Wishlist' : 'Add to Wishlist'}
                  </Button>

                  <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Connect with Artisan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Connect with {artwork.artist.name}</DialogTitle>
                        <DialogDescription>
                          Send a message to the artisan about "{artwork.name}" to get more information or discuss custom orders.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <Avatar>
                            <AvatarImage src={artwork.artist.image} alt={artwork.artist.name} />
                            <AvatarFallback>{artwork.artist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{artwork.artist.name}</p>
                            <p className="text-sm text-gray-600">{artwork.artist.location}</p>
                            <p className="text-xs text-orange-600">Usually responds within a few hours</p>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            value={`Question about ${artwork.name}`}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>

                        <div>
                          <Label htmlFor="message">Your Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Hi! I'm interested in this artwork. Could you tell me more about..."
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            rows={6}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleContactArtisan}
                          className="bg-orange-600 hover:bg-orange-700"
                          disabled={!contactMessage.trim()}
                        >
                          Send Message
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Delivery Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Delivery Options</p>
                        <p className="text-sm text-gray-600">
                          Standard: {artwork.deliveryInfo.standard} | Express: {artwork.deliveryInfo.express}
                        </p>
                      </div>
                    </div>
                    {artwork.deliveryInfo.freeShipping && (
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-medium">Free shipping on this item</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <RotateCcw className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">7-day return policy</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="artist">About Artist</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({artwork.reviews})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Description</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {artwork.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(artwork.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-600">{key}:</span>
                          <span className="text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="artist" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Artist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={artwork.artist.image} alt={artwork.artist.name} />
                        <AvatarFallback>{artwork.artist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold">{artwork.artist.name}</h3>
                          <p className="text-gray-600">{artwork.artist.location}</p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{artwork.artist.rating}</div>
                            <div className="text-sm text-gray-600">Rating</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{artwork.artist.totalReviews}</div>
                            <div className="text-sm text-gray-600">Reviews</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{artwork.artist.worksCreated}</div>
                            <div className="text-sm text-gray-600">Works</div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed">{artwork.artist.bio}</p>
                        
                        <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                          View More Works by {artwork.artist.name}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Customer Reviews
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{artwork.rating}</span>
                        <span className="text-gray-500">({artwork.reviews} reviews)</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={review.userImage} alt={review.userName} />
                            <AvatarFallback>{review.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{review.userName}</h4>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            
                            <p className="text-gray-700 mb-3">{review.comment}</p>
                            
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                              Helpful ({review.helpful})
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full">
                      Load More Reviews
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <NewsletterFooter />
      <AiChatbotWidget />
    </>
  );
}

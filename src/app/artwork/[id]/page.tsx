"use client";

import { useState, useEffect } from "react";
import { db } from "@/config/firebaseConfig"; // use centralized config
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { notFound, useRouter, useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function ArtworkDetailPage() {
  const [artwork, setArtwork] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const [designDetails, setDesignDetails] = useState("");

  const { addToCart, isInCart } = useCart();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  // ✅ Fetch artwork and reviews from Firebase
  useEffect(() => {
    async function fetchArtwork() {
      try {
        const docRef = doc(db, "artworks", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArtwork({ id: docSnap.id, ...docSnap.data() });

          // Fetch reviews related to this artwork
          const q = query(collection(db, "reviews"), where("artworkId", "==", id));
          const querySnapshot = await getDocs(q);
          const fetchedReviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setReviews(fetchedReviews);
        } else {
          notFound();
        }
      } catch (err) {
        console.error("Error fetching artwork:", err);
      }
    }
    if (id) fetchArtwork();
  }, [id]);

  if (!artwork) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading artwork details...
      </div>
    );
  }

  const discount = Math.round((1 - artwork.price / artwork.originalPrice) * 100);

  const increaseQuantity = () => {
    if (quantity < artwork.stockCount) setQuantity(quantity + 1);
  };
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    if (!artwork.inStock) return;
    addToCart(artwork, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const handleContactArtisan = () => {
    if (!contactMessage.trim()) return;
    alert("Your message has been sent to the artisan!");
    setContactMessage("");
    setIsContactDialogOpen(false);
  };

  const handleSubmitCustomization = () => {
    if (!designDetails.trim()) return;
    alert("Your customization request has been sent!");
    setDesignDetails("");
    setIsCustomizeDialogOpen(false);
  };

  return (
    <>
      <AnimatedIndicatorNavbar />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
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

        <div className="container mx-auto py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square overflow-hidden rounded-xl shadow-lg">
              <img
                src={artwork.images?.[selectedImageIndex]}
                alt={artwork.name}
                className="w-full h-full object-cover"
              />
            </div>
            {artwork.images?.length > 1 && (
              <div className="flex gap-3 mt-3 overflow-x-auto">
                {artwork.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? "border-orange-600" : "border-gray-200"
                    }`}
                  >
                    <img src={image} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="text-orange-700 border-orange-200 mb-3">
                {artwork.state} • {artwork.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-800">{artwork.name}</h1>
              <p className="text-gray-600">by {artwork.artistName}</p>
            </div>

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>{artwork.rating}</span>
              <span className="text-gray-500">({artwork.reviewsCount || 0} reviews)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-800">₹{artwork.price}</span>
              {artwork.originalPrice > artwork.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{artwork.originalPrice}</span>
                  <Badge className="bg-green-600 text-white">{discount}% OFF</Badge>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white flex-1" onClick={handleBuyNow}>
                Buy Now
              </Button>
              <Button
                variant="outline"
                className="border-orange-300 text-orange-700 flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isInCart(artwork.id) ? "Added to Cart" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="container mx-auto mt-16">
          <Tabs defaultValue="description">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="artist">Artist</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>About the Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{artwork.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r.id} className="border-b py-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={r.userImage} />
                            <AvatarFallback>{r.userName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{r.userName}</p>
                            <p className="text-sm text-gray-500">{r.date}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">{r.comment}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <NewsletterFooter />
    </>
  );
}

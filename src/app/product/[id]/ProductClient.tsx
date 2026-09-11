"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { mockReviews } from "@/models/mock/data";
import { SafeImage } from "@/components/ui/SafeImage/SafeImage";
import { PackageCustomizer } from "@/components/ui/PackageCustomizer/PackageCustomizer";
import styles from "./product.module.css";
import { Product } from "@/models/types";

interface ProductClientProps {
  product: Product;
  mealProducts: Product[];
}

export function ProductClient({ product, mealProducts }: ProductClientProps) {
  const router = useRouter();
  const { language } = useApp();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  // State
  const defaultVariant = product?.variants?.find(v => v.isDefault) || product?.variants?.[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(defaultVariant?.id || null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, string[]>>({}); // groupId -> addonId[]
  const [itemNotes, setItemNotes] = useState("");
  const [voiceNoteState, setVoiceNoteState] = useState<"idle" | "recording" | "stopped" | "playing">("idle");
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunksRef.current = [];
      };
      
      recorder.start();
      mediaRecorderRef.current = recorder;
      setVoiceNoteState("recording");
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert(language === "ar" ? "برجاء السماح باستخدام المايكروفون" : "Please allow microphone access");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setVoiceNoteState("stopped");
  };

  const deleteRecording = () => {
    setVoiceNoteState("idle");
    setAudioUrl(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (voiceNoteState === "playing") {
      audioRef.current.pause();
      setVoiceNoteState("stopped");
    } else {
      audioRef.current.play();
      setVoiceNoteState("playing");
    }
  };

  // Derived State
  const selectedVariant = product?.variants?.find(v => v.id === selectedVariantId);
  const isPackage = product?.categoryId === 'cat-packages';
  const activeImage = selectedVariant?.image || product?.baseImage || product?.image || "";
  
  // Calculate price dynamically
  const basePrice = selectedVariant ? selectedVariant.price : (product?.price || 0);
  
  const addonsPrice = useMemo(() => {
    let total = 0;
    if (product) {
      Object.entries(selectedAddons).forEach(([groupId, addonIds]) => {
        const group = product.addonGroups?.find(g => g.id === groupId);
        if (group) {
          addonIds.forEach(id => {
            const addon = group.addons.find(a => a.id === id);
            if (addon) total += addon.price;
          });
        }
      });
    }
    return total;
  }, [selectedAddons, product]);

  const totalPrice = (basePrice + addonsPrice) * quantity;

  // Validation
  const isValid = useMemo(() => {
    if (!product?.addonGroups) return true;
    return product.addonGroups.every(group => {
      const selectedCount = (selectedAddons[group.id] || []).length;
      return selectedCount >= group.minSelect && selectedCount <= group.maxSelect;
    });
  }, [product, selectedAddons]);

  // Handlers
  const toggleAddon = (groupId: string, addonId: string, maxSelect: number) => {
    setSelectedAddons(prev => {
      const current = prev[groupId] || [];
      const exists = current.includes(addonId);
      
      if (exists) {
        return { ...prev, [groupId]: current.filter(id => id !== addonId) };
      }
      
      if (current.length >= maxSelect) {
        if (maxSelect === 1) {
          return { ...prev, [groupId]: [addonId] }; // Replace
        }
        return prev; // Ignore
      }
      
      return { ...prev, [groupId]: [...current, addonId] };
    });
  };

  const handleAddToCart = (customSelections?: any[]) => {
    // Config ID now includes itemNotes so different notes mean distinct cart items
    const configId = `${product.id}-${selectedVariantId}-${Object.values(selectedAddons).flat().sort().join('-')}-${itemNotes}`;
    
    addItem({
      id: configId,
      productId: product.id,
      name: product.name,
      variantName: selectedVariant ? selectedVariant.name : undefined,
      variantId: selectedVariantId,
      addons: selectedAddons,
      packageSelections: customSelections,
      quantity,
      totalPrice: basePrice + addonsPrice,
      notes: itemNotes
    });
    
    router.back();
  };

  return (
    <div className={styles.productContainer}>
      <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {language === "ar" 
            ? <polyline points="9 18 15 12 9 6"></polyline>
            : <polyline points="15 18 9 12 15 6"></polyline>
          }
        </svg>
      </button>

      <div className={styles.desktopWrapper}>
        <div className={styles.imageSection}>
        <SafeImage
          src={activeImage}
          alt={language === "ar" ? product.name.ar : product.name.en}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className={`container ${styles.detailsSection}`}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>
            {language === "ar" ? product.name.ar : product.name.en}
          </h1>
          <button 
            onClick={() => toggleFavorite(product.id)}
            className={styles.favoriteBtn}
            style={{ color: isFavorite(product.id) ? '#ef4444' : 'var(--text-secondary)' }}
            aria-label="Toggle Favorite"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <div className={styles.ratingRow}>
          <span style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
          <span style={{ fontWeight: '600', marginLeft: '4px', marginRight: '4px' }}>{product.ratingAggregate}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            ({mockReviews.length} {language === "ar" ? "تقييم" : "reviews"})
          </span>
        </div>

        <p className={styles.description}>
          {language === "ar" ? product.description.ar : product.description.en}
        </p>

        <div className={styles.priceRow}>
           <span className={styles.price}>{basePrice} {language === "ar" ? "درهم" : "AED"}</span>
        </div>

        {/* Action Row */}
        <div className={styles.actionRow}>
          <div className={styles.quantityControl}>
            <button 
              className={styles.qtyBtn} 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button 
              className={styles.qtyBtn} 
              onClick={() => setQuantity(q => q + 1)}
            >
              +
            </button>
          </div>
          {isPackage ? (
            <button 
              className={styles.addToCartBtn} 
              onClick={() => setIsCustomizerOpen(true)}
            >
              <span>{language === "ar" ? "تخصيص الباقة" : "Customize Package"}</span>
              <span>{totalPrice} {language === "ar" ? "درهم" : "AED"}</span>
            </button>
          ) : (
            <button 
              className={styles.addToCartBtn} 
              onClick={() => handleAddToCart()}
              disabled={!isValid}
            >
              <span>{language === "ar" ? "أضف للسلة" : "Add to Cart"}</span>
              <span>{totalPrice} {language === "ar" ? "درهم" : "AED"}</span>
            </button>
          )}
        </div>

        {product.variants && product.variants.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {language === "ar" ? "اختر الحجم" : "Select Size"}
            </h2>
            <div className={styles.variantGrid}>
              {product.variants.map(variant => (
                <div 
                  key={variant.id} 
                  className={`${styles.variantCard} ${selectedVariantId === variant.id ? styles.variantCardActive : ""}`}
                  onClick={() => setSelectedVariantId(variant.id)}
                >
                  <span className={styles.variantName}>
                    {language === "ar" ? variant.name.ar : variant.name.en}
                  </span>
                  <span className={styles.variantPrice}>
                    {variant.price} {language === "ar" ? "درهم" : "AED"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.addonGroups?.map(group => {
          const selectedCount = (selectedAddons[group.id] || []).length;
          const isError = group.minSelect > 0 && selectedCount < group.minSelect;
          
          return (
            <div key={group.id} className={styles.addonGroup}>
              <div className={styles.addonHeader}>
                <h3 className={styles.addonTitle}>
                  {language === "ar" ? group.name.ar : group.name.en}
                </h3>
                <span className={styles.addonMeta} style={{ color: isError ? 'var(--color-error)' : 'inherit' }}>
                  {group.required 
                    ? (language === "ar" ? "مطلوب" : "Required") 
                    : (language === "ar" ? "اختياري" : "Optional")}
                  {' • '}
                  {language === "ar" ? `اختر حتى ${group.maxSelect}` : `Choose up to ${group.maxSelect}`}
                </span>
              </div>
              <div className={styles.addonList}>
                {group.addons.map(addon => {
                  const isSelected = (selectedAddons[group.id] || []).includes(addon.id);
                  return (
                    <div 
                      key={addon.id} 
                      className={styles.addonItem}
                      onClick={() => toggleAddon(group.id, addon.id, group.maxSelect)}
                    >
                      <div className={styles.addonLabel}>
                        <div className={`${styles.checkbox} ${isSelected ? styles.checkboxActive : ""}`}>
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <span>{language === "ar" ? addon.name.ar : addon.name.en}</span>
                      </div>
                      <span className={styles.addonPrice}>
                        {addon.price > 0 ? `+${addon.price} ${language === "ar" ? "درهم" : "AED"}` : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className={styles.section} style={{ marginTop: '24px' }}>
          <h2 className={styles.sectionTitle}>
            {language === "ar" ? "ملاحظات على الطلب" : "Item Notes"}
          </h2>
          <textarea 
            className={styles.notesInput}
            placeholder={language === "ar" ? "مثال: بدون بصل، زيادة صوص..." : "e.g., No onions, extra sauce..."}
            value={itemNotes}
            onChange={(e) => setItemNotes(e.target.value)}
            rows={2}
          />
          
          <div className={styles.voiceNoteWrapper}>
            {audioUrl && (
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                onEnded={() => setVoiceNoteState("stopped")} 
                style={{ display: 'none' }} 
              />
            )}
            
            {voiceNoteState === 'idle' && (
              <button className={styles.voiceBtn} onClick={startRecording}>
                🎤 {language === "ar" ? "تسجيل ملاحظة صوتية" : "Record Voice Note"}
              </button>
            )}
            {voiceNoteState === 'recording' && (
              <div className={styles.voiceRecording}>
                <span className={styles.recordingPulse}></span>
                {language === "ar" ? "جاري التسجيل..." : "Recording..."}
                <button className={styles.voiceActionBtn} onClick={stopRecording}>
                  ⏹ {language === "ar" ? "إيقاف" : "Stop"}
                </button>
              </div>
            )}
            {(voiceNoteState === 'stopped' || voiceNoteState === 'playing') && (
              <div className={styles.voicePlayback}>
                <button 
                  className={styles.voiceActionBtn} 
                  onClick={togglePlayback}
                >
                  {voiceNoteState === 'playing' ? '⏸' : '▶️'} {language === "ar" ? "ملاحظة صوتية" : "Voice Note"}
                </button>
                <button className={styles.voiceDeleteBtn} onClick={deleteRecording}>
                  🗑
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.section} style={{ marginTop: '32px', marginBottom: '32px' }}>
          <h2 className={styles.sectionTitle}>
            {language === "ar" ? "التقييمات" : "Reviews"} ({product.ratingAggregate} ★)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mockReviews.map(review => (
              <div key={review.id} style={{ padding: '16px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600' }}>{review.author}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{review.date}</span>
                </div>
                <div style={{ color: '#fbbf24', marginBottom: '8px', fontSize: '14px' }}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {isPackage && selectedVariant && (
        <PackageCustomizer 
          isOpen={isCustomizerOpen} 
          onClose={() => setIsCustomizerOpen(false)} 
          packageProduct={product} 
          selectedVariant={selectedVariant}
          mealProducts={mealProducts}
          onComplete={(selections) => {
            setIsCustomizerOpen(false);
            handleAddToCart(selections);
          }}
        />
      )}
    </div>
  );
}

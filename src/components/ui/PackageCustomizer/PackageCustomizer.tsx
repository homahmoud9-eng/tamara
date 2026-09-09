"use client";

import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/models/types';
import { useApp } from '@/components/providers/AppProvider';
const XIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CheckCircleIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ArrowRightIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ArrowLeftIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
import styles from './PackageCustomizer.module.css';

interface PackageSelection {
  dayIndex: number;
  mealId: string;
  mealName: { ar: string; en: string };
  variantName?: { ar: string; en: string };
}

interface PackageCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  packageProduct: Product;
  selectedVariant: ProductVariant;
  onComplete: (selections: PackageSelection[]) => void;
  mealProducts: Product[];
}

export function PackageCustomizer({ isOpen, onClose, packageProduct, selectedVariant, onComplete, mealProducts }: PackageCustomizerProps) {
  const { language } = useApp();
  const [currentDay, setCurrentDay] = useState(0);
  const [selections, setSelections] = useState<PackageSelection[]>([]);
  
  // Parse number of meals from variant name (e.g. "6 Meals" -> 6)
  const [totalDays, setTotalDays] = useState(6);
  
  useEffect(() => {
    const match = selectedVariant.name.en.match(/\d+/);
    if (match) {
      setTotalDays(parseInt(match[0], 10));
    }
    // Reset state when opening
    if (isOpen) {
      setCurrentDay(0);
      setSelections([]);
    }
  }, [selectedVariant, isOpen]);

  if (!isOpen) return null;

  const handleSelectMeal = (meal: Product) => {
    // For simplicity, we auto-select the default/first variant of the meal
    const defaultVariant = meal.variants?.find(v => v.isDefault) || meal.variants?.[0];
    
    const newSelection: PackageSelection = {
      dayIndex: currentDay,
      mealId: meal.id,
      mealName: meal.name,
      variantName: defaultVariant?.name
    };

    const newSelections = [...selections];
    newSelections[currentDay] = newSelection;
    setSelections(newSelections);

    // Auto advance
    if (currentDay < totalDays - 1) {
      setTimeout(() => {
        setCurrentDay(currentDay + 1);
      }, 300);
    }
  };

  const isComplete = selections.length === totalDays && !selections.includes(undefined as any);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <button className={styles.closeBtn} onClick={onClose}>
              <XIcon size={24} />
            </button>
            <h2 className={styles.title}>
              {language === 'ar' ? 'تخصيص الباقة' : 'Customize Package'}
            </h2>
            <div className={styles.placeholder} />
          </div>
          
          <div className={styles.progressContainer}>
            <p className={styles.progressText}>
              {language === 'ar' 
                ? `اختر وجبة لليوم ${currentDay + 1} من ${totalDays}` 
                : `Select a meal for Day ${currentDay + 1} of ${totalDays}`}
            </p>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${((currentDay + (selections[currentDay] ? 1 : 0)) / totalDays) * 100}%` }}
              />
            </div>
          </div>

          <div className={styles.daysScroll}>
            {Array.from({ length: totalDays }).map((_, idx) => (
              <button 
                key={idx}
                className={`${styles.dayPill} ${currentDay === idx ? styles.dayPillActive : ''} ${selections[idx] ? styles.dayPillCompleted : ''}`}
                onClick={() => setCurrentDay(idx)}
              >
                {selections[idx] && <CheckCircleIcon size={14} />}
                {language === 'ar' ? `اليوم ${idx + 1}` : `Day ${idx + 1}`}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.mealsGrid}>
            {mealProducts.map(meal => {
              const isSelected = selections[currentDay]?.mealId === meal.id;
              
              return (
                <div 
                  key={meal.id} 
                  className={`${styles.mealCard} ${isSelected ? styles.mealCardSelected : ''}`}
                  onClick={() => handleSelectMeal(meal)}
                >
                  <img src={meal.baseImage} alt={meal.name.en} className={styles.mealImage} />
                  <div className={styles.mealInfo}>
                    <h3 className={styles.mealName}>
                      {language === 'ar' ? meal.name.ar : meal.name.en}
                    </h3>
                    <p className={styles.mealDesc}>
                      {language === 'ar' ? meal.description.ar : meal.description.en}
                    </p>
                  </div>
                  {isSelected && (
                    <div className={styles.selectedBadge}>
                      <CheckCircleIcon size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.navBtn} 
            disabled={currentDay === 0}
            onClick={() => setCurrentDay(c => Math.max(0, c - 1))}
          >
            {language === 'ar' ? <ArrowRightIcon size={20} /> : <ArrowLeftIcon size={20} />}
          </button>

          {isComplete ? (
            <button 
              className={styles.completeBtn}
              onClick={() => onComplete(selections)}
            >
              {language === 'ar' ? 'إتمام الباقة وإضافتها للسلة' : 'Complete & Add to Cart'}
            </button>
          ) : (
            <button 
              className={styles.nextBtn} 
              onClick={() => setCurrentDay(c => Math.min(totalDays - 1, c + 1))}
            >
              {language === 'ar' ? 'التالي' : 'Next'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

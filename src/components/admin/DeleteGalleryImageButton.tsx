'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  imageId: string;
  productId: string;
  lang: 'ar' | 'en';
  action: (id: string, productId: string) => Promise<any>;
}

export default function DeleteGalleryImageButton({ imageId, productId, lang, action }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الصورة؟' : 'Are you sure you want to delete this image?')) return;
    
    startTransition(async () => {
      await action(imageId, productId);
      router.refresh();
    });
  };

  return (
    <button 
      type="button" 
      onClick={handleDelete}
      disabled={isPending}
      title={lang === 'ar' ? 'حذف الصورة' : 'Delete Image'}
      style={{ 
        position: 'absolute', top: '-6px', right: '-6px', background: 'red', color: 'white', 
        border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
        opacity: isPending ? 0.5 : 1
      }}
    >
      ×
    </button>
  );
}

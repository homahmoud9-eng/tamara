"use client";

import React from 'react';
import { useApp } from '@/components/providers/AppProvider';
import styles from './page.module.css';

export default function TermsPage() {
  const { language } = useApp();

  const arContent = (
    <div className={styles.content}>
      <div className={styles.section}>
        <p className={styles.text}><strong>Tamara Kitchen - L.L.C - S.P.C</strong></p>
        <p className={styles.text}>تاريخ آخر تحديث: 9 سبتمبر 2026 | تاريخ السريان: 9 سبتمبر 2026</p>
        <p className={styles.text}>مرحبًا بك في Tamara Kitchen.</p>
        <p className={styles.text}>تنظم هذه الشروط والأحكام استخدامك لموقع Tamara Kitchen الإلكتروني، وخدمات التجارة الإلكترونية، ونسخة الويب التقدمية (PWA)، وأي خدمات أو واجهات رقمية أخرى مرتبطة بها، بالإضافة إلى عمليات شراء المنتجات والخدمات التي يتم تنفيذها من خلال المنصة.</p>
        <p className={styles.text}>باستخدامك الموقع أو إنشاء حساب أو تصفح المنتجات أو إضافة منتجات إلى السلة أو إرسال طلب أو إتمام عملية شراء، فإنك تقر بأنك قرأت هذه الشروط والأحكام وفهمتها ووافقت على الالتزام بها، وذلك في حدود ما يسمح به القانون المعمول به في دولة الإمارات العربية المتحدة.</p>
        <p className={styles.text}>إذا كنت لا توافق على هذه الشروط والأحكام، يرجى عدم استخدام الموقع أو خدماته.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. معلومات المنشأة</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>الاسم التجاري: TAMARA KITCHEN - L.L.C - S.P.C</li>
          <li className={styles.listItem}>الشكل القانوني: Limited Liability Company - Sole Proprietorship Company</li>
          <li className={styles.listItem}>فئة الرخصة: Abu Dhabi Trader</li>
          <li className={styles.listItem}>رقم الرخصة التجارية: CN-6731557</li>
          <li className={styles.listItem}>الرقم الموحد للتسجيل: 101-2026-200123046</li>
          <li className={styles.listItem}>رقم الرخصة الموحد: 501-2026-200079820</li>
          <li className={styles.listItem}>تاريخ التأسيس: 1 سبتمبر 2026</li>
          <li className={styles.listItem}>تاريخ إصدار الرخصة: 1 سبتمبر 2026</li>
          <li className={styles.listItem}>تاريخ انتهاء الرخصة: 31 أغسطس 2027</li>
          <li className={styles.listItem}>البريد الإلكتروني الرسمي: <a href="mailto:mennaallahmahmoud30@gmail.com" dir="ltr">mennaallahmahmoud30@gmail.com</a></li>
          <li className={styles.listItem}>رقم الهاتف الرسمي: <span dir="ltr">+971 50 555 2395</span></li>
          <li className={styles.listItem}>رقم خدمة العملاء / واتساب: <span dir="ltr">+971 54 174 4773</span></li>
          <li className={styles.listItem}>مقر النشاط: أبوظبي، الإمارات العربية المتحدة.</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. نطاق هذه الشروط</h2>
        <p className={styles.text}>تنطبق هذه الشروط على:</p>
        <ul className={styles.list}>
          <li className={styles.listItem}>استخدام الموقع والمنصة الرقمية.</li>
          <li className={styles.listItem}>تصفح المنتجات والمحتوى.</li>
          <li className={styles.listItem}>إنشاء وإدارة الحساب.</li>
          <li className={styles.listItem}>إضافة المنتجات إلى السلة.</li>
          <li className={styles.listItem}>إرسال الطلبات.</li>
          <li className={styles.listItem}>شراء المنتجات.</li>
          <li className={styles.listItem}>خدمات التوصيل.</li>
          <li className={styles.listItem}>العروض والخصومات والكوبونات.</li>
          <li className={styles.listItem}>المراجعات والتقييمات.</li>
          <li className={styles.listItem}>التواصل مع خدمة العملاء.</li>
          <li className={styles.listItem}>أي خدمات رقمية أخرى توفرها Tamara Kitchen.</li>
        </ul>
        <p className={styles.text}>وقد تنطبق شروط إضافية على بعض الخدمات أو الحملات أو العروض، وفي حال وجود شروط خاصة واضحة لخدمة معينة، تطبق هذه الشروط الخاصة بالإضافة إلى هذه الشروط العامة.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>3. أهلية استخدام الموقع</h2>
        <p className={styles.text}>يجب استخدام الموقع بصورة قانونية ولأغراض مشروعة. عند استخدامك الموقع أو إجراء طلب، تقر بأن المعلومات التي تقدمها صحيحة ودقيقة وكاملة بالقدر المطلوب لتنفيذ الخدمة. ولا يجوز استخدام الموقع من أجل:</p>
        <ul className={styles.list}>
          <li className={styles.listItem}>الاحتيال.</li>
          <li className={styles.listItem}>انتحال شخصية شخص آخر.</li>
          <li className={styles.listItem}>تقديم بيانات مضللة.</li>
          <li className={styles.listItem}>محاولة الوصول غير المصرح به إلى أنظمة الموقع.</li>
          <li className={styles.listItem}>تعطيل الموقع أو التأثير على أدائه.</li>
          <li className={styles.listItem}>إساءة استخدام العروض أو الكوبونات.</li>
          <li className={styles.listItem}>تنفيذ طلبات وهمية أو متكررة بقصد الإضرار بالمطعم أو نظام التوصيل.</li>
          <li className={styles.listItem}>استخدام أدوات آلية أو برمجيات بقصد إساءة استخدام المنصة.</li>
        </ul>
        <p className={styles.text}>تحتفظ Tamara Kitchen بحق اتخاذ الإجراءات المناسبة عند وجود إساءة استخدام أو نشاط احتيالي أو غير قانوني، بما لا يخالف حقوق العميل المقررة قانونًا.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>4. الحساب</h2>
        <p className={styles.text}>قد تتطلب بعض الخدمات إنشاء حساب. يتحمل المستخدم مسؤولية:</p>
        <ul className={styles.list}>
          <li className={styles.listItem}>صحة البيانات التي يقدمها.</li>
          <li className={styles.listItem}>المحافظة على سرية بيانات الدخول.</li>
          <li className={styles.listItem}>تحديث معلوماته عند الحاجة.</li>
          <li className={styles.listItem}>إخطار Tamara Kitchen عند الاشتباه في استخدام غير مصرح به للحساب.</li>
        </ul>
        <p className={styles.text}>ولا تتحمل Tamara Kitchen مسؤولية أي استخدام غير مصرح به ناتج عن إهمال المستخدم في حماية بيانات الدخول، وذلك في حدود ما يسمح به القانون. يجوز للمستخدم طلب إغلاق حسابه وفق الإجراءات المتاحة. وقد تحتفظ Tamara Kitchen ببعض السجلات بعد إغلاق الحساب عندما يكون ذلك ضروريًا للالتزامات القانونية أو المحاسبية أو لحماية الحقوق ومنع الاحتيال.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>5. المنتجات والمعلومات المعروضة</h2>
        <p className={styles.text}>نبذل جهودًا معقولة لضمان دقة المعلومات المتعلقة بالمنتجات، بما في ذلك الاسم، الوصف، السعر، المكونات، الأحجام، الصور، التوفر.</p>
        <p className={styles.text}>ومع ذلك، قد تحدث اختلافات محدودة في مظهر الطعام أو ألوان الصور أو شكل التقديم بسبب طبيعة المنتجات الغذائية والتصوير والشاشات المختلفة. الصور المعروضة على الموقع تستخدم لتمثيل المنتج ما لم يُذكر خلاف ذلك. ولا يجوز تفسير الصور أو الوصف على أنها ضمان لمظهر مطابق تمامًا لكل طلب.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>6. الأسعار</h2>
        <p className={styles.text}>تظهر أسعار المنتجات والخيارات والرسوم ذات الصلة على الموقع قبل إتمام الطلب. ما لم يُذكر خلاف ذلك، تكون الأسعار بالدرهم الإماراتي (AED). وقد تتم إضافة رسوم توصيل أو رسوم أخرى إن وجدت، ويتم عرضها للمستخدم قبل تأكيد الطلب.</p>
        <p className={styles.text}>لا نضمن استمرار أي سعر إلى أجل غير محدد، ويجوز تعديل الأسعار مستقبلًا. ولا يؤثر تغيير سعر المنتج بعد تأكيد الطلب على السعر الذي تم تأكيده لذلك الطلب، إلا في الحالات التي يسمح بها القانون أو يقتضيها، أو في حال وجود خطأ مادي واضح في السعر.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>7. أخطاء الأسعار أو المعلومات</h2>
        <p className={styles.text}>نبذل جهودًا معقولة لتجنب الأخطاء. إذا اكتشفنا خطأ واضحًا وجوهريًا في سعر أو وصف منتج قبل تجهيز الطلب، فقد نتواصل مع العميل لتوضيح الخطأ أو تصحيح الطلب أو إلغائه، مع رد أي مبالغ تم دفعها بالنسبة إلى الطلب الملغى. ولا يجوز استغلال الأخطاء التقنية أو الأخطاء الواضحة في الأسعار بطريقة احتيالية.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>8. توفر المنتجات</h2>
        <p className={styles.text}>إظهار المنتج على الموقع لا يعني بالضرورة ضمان توفره في كل وقت. قد يصبح منتج معين غير متاح بسبب نفاد المخزون، ظروف التشغيل، ظروف توريد المكونات، أسباب مرتبطة بسلامة الغذاء، أسباب تشغيلية أو تقنية.</p>
        <p className={styles.text}>إذا أصبح المنتج غير متوفر بعد إرسال الطلب وقبل تنفيذه، سنتخذ الإجراء المناسب، وقد يشمل التواصل مع العميل لتوفير بديل أو تعديل الطلب أو إلغاء الجزء غير المتاح منه ورد المبلغ المتعلق به وفقًا للحالة والقانون المطبق.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>9. مكونات المنتجات وتوافرها</h2>
        <p className={styles.text}>تُعرض معلومات المنتج والمكونات المتاحة عبر الموقع بالقدر المتاح لدينا. قد تتغير بعض المكونات أو طريقة التقديم لأسباب تشغيلية أو توافر المكونات، بشرط عدم تقديم معلومات مضللة للعميل وعدم مخالفة المتطلبات القانونية أو متطلبات سلامة الغذاء.</p>
        <p className={styles.text}>إذا كان مكوّن معين يمثل شرطًا أساسيًا بالنسبة لك، يجب التأكد من المعلومات مع Tamara Kitchen قبل تأكيد الطلب عند الحاجة.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>10. الحساسية الغذائية</h2>
        <p className={styles.text}>تعتبر الحساسية الغذائية مسؤولية مشتركة بين العميل والمنشأة وفق طبيعة الطلب، ولا يجوز افتراض خلو أي منتج من مسببات الحساسية ما لم يتم الإعلان عن ذلك بشكل صريح ومدعوم بإجراءات تشغيلية مناسبة.</p>
        <p className={styles.text}>يجب على العميل إبلاغ Tamara Kitchen، قبل تأكيد الطلب، بأي حساسية أو قيود غذائية مهمة. قد يتم إعداد منتجات مختلفة في بيئة تحضير مشتركة، ولذلك لا ينبغي تفسير أي معلومة عامة على أنها ضمان بعدم وجود آثار لمسببات حساسية. لا تقم بطلب أو استهلاك منتج إذا كان لديك قلق يتعلق بحساسية قبل الحصول على المعلومات المناسبة. في حالات الحساسية الشديدة، تقع مسؤولية اتخاذ القرار على العميل بعد الحصول على المعلومات.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>11-15. الطلبات وعنوان التوصيل والملاحظات</h2>
        <p className={styles.text}>يمكنك تقديم الطلب من خلال القنوات المتاحة. بعد إرسال الطلب، قد تستلم إشعارًا. استلام إشعار لا يعني دائمًا تنفيذه نهائيًا ما لم يظهر مؤكدًا. يجوز لـ Tamara Kitchen رفض أو إلغاء أي طلب لأسباب مشروعة مثل عدم توفر المنتج أو أخطاء التسعير. يجب على العميل إدخال عنوان توصيل صحيح ودقيق، واستخدام الملاحظات لإرسال تفضيلات أو ملاحظات حول التوصيل فقط، وليس لبيانات حساسة.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>16-18. التوصيل وفحص الطلب</h2>
        <p className={styles.text}>نبذل جهودًا لتوصيل الطلب ضمن الوقت المعروض. قد يحدث تأخير لظروف خارجة عن إرادتنا. يجب على العميل تقديم هاتف وعنوان دقيق والتواجد للاستلام. يُنصح بفحص الطلب عند الاستلام ومطابقته. إذا لوحظت مشكلة واضحة، يرجى التواصل في أسرع وقت مع خدمة العملاء.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>19-22. الإلغاء والاسترداد والمنتجات الغذائية</h2>
        <p className={styles.text}>يجوز إلغاء الطلب قبل بدء التحضير. للمنتجات المجهزة أو السريعة التلف، لا يمكن الإلغاء بمجرد بدء التحضير. سيتم الاستبدال أو الاسترداد للمنتجات الناقصة أو المعيبة بما يتوافق مع القانون، ولا يعتبر تغيير الرأي بعد التحضير مبررًا للإرجاع في حال السلع سريعة التلف. كما يجب اتباع تعليمات حفظ المجمدات والأطعمة المحضرة ولا تتحمل المنشأة تلفها جراء سوء الحفظ.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>23-28. العروض، الكوبونات والدفع</h2>
        <p className={styles.text}>تخضع العروض والكوبونات لشروط معينة ولها صلاحية. لا يجوز استغلالها بأسلوب احتيالي. يجب اختيار وسيلة الدفع من الخيارات المتاحة في صفحة الدفع. الفشل في الدفع قد يؤدي لعدم تنفيذ الطلب. يتم إتاحة فواتير الشراء وفق الإجراءات المعمول بها.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>29-32. المراجعات والمحتوى والملكية الفكرية</h2>
        <p className={styles.text}>يجب أن تكون التقييمات حقيقية وخالية من الإساءة. يحق لنا إزالة المحتوى المخالف. جميع حقوق الملكية الفكرية تعود لـ Tamara Kitchen. يحظر استخدام الموقع بطريقة غير مشروعة مثل الاختراق أو استخراج البيانات.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>33-49. بنود قانونية إضافية</h2>
        <p className={styles.text}>
          يتم التعامل مع البيانات وفق سياسة الخصوصية. لا نضمن الحماية المطلقة للأنظمة أو توفر الموقع الدائم. 
          يتم تسوية النزاعات والتواصل مع خدمة العملاء بالطرق الودية أولاً، وتخضع الشروط لقوانين دولة الإمارات العربية المتحدة المطبقة.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>إشعار قانوني</h2>
        <p className={styles.text}>
          تم إعداد هذه الشروط والأحكام بما يتناسب مع طبيعة منصة التجارة الإلكترونية الخاصة بـ Tamara Kitchen وبالاستناد إلى الإطار التشريعي الاتحادي الإماراتي الحالي ذي الصلة بالتجارة الحديثة القائمة على التكنولوجيا وحماية المستهلك وحماية البيانات الشخصية. منصة التشريعات الإماراتية الرسمية هي المرجع الموحّد والمنشور للتشريعات النافذة وتحديثاتها.
          هذه الوثيقة لا تشكل رأيًا قانونيًا أو استشارة قانونية من محامٍ مرخص. يُوصى بمراجعتها واعتمادها نهائيًا بواسطة مستشار قانوني مرخص في دولة الإمارات قبل نشرها واعتمادها كوثيقة ملزمة.
        </p>
      </div>
    </div>
  );

  const enContent = (
    <div className={styles.content}>
      <p className={styles.text}>The English version of the Terms and Conditions is currently being updated to match our new policies. Please refer to the Arabic version in the meantime or contact us for assistance.</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</h1>
      {language === 'ar' ? arContent : enContent}
    </div>
  );
}

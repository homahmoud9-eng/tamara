import { getFrontendCategories, getFrontendProducts } from "@/lib/data-mapper";
import { MenuClient } from "./MenuClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "قائمة الطعام | مطبخ تمارا",
  description: "تصفح قائمة الطعام الشاملة لمطبخ تمارا. وجبات مصرية أصيلة، باقات، إضافات، والمزيد.",
  alternates: {
    canonical: '/menu',
  }
};

export default async function MenuPage() {
  const categories = await getFrontendCategories();
  const products = await getFrontendProducts();

  return <MenuClient categories={categories} products={products} />;
}

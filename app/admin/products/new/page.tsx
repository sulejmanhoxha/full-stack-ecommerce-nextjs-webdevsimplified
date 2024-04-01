import { PageHeader } from "@/app/admin/_components/PageHeader";
import { ProductForm } from "@/app/admin/products/_components/Productform2";

export default function NewProductPage() {
  return (
    <>
      <PageHeader>Add Product</PageHeader>
      <ProductForm />
    </>
  );
}

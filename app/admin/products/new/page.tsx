import { PageHeader } from "@/app/admin/_components/PageHeader";
import { ProductForm } from "@/app/admin/products/_components/ProductForm";
import ProductFormWithRHF from "@/app/admin/products/_components/ProductFormWithRHF";

export default function NewProductPage() {
  return (
    <>
      <PageHeader>Add Product</PageHeader>
      {/* Product Form With React Hook Form & server action & useFormState */}
      {/* <ProductFormWithRHF /> */}
      <ProductForm product={null} />
    </>
  );
}

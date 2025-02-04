"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation"; // ✅ Unwrap params
import Heading from "@/components/Heading";
import RelatedProducts from "@/components/RelatedProducts";
import ProductsDescriptions from "@/components/ProductsDescriptions";
import Logos from "@/components/Logos";
import AddtoBag from "@/components/AddtoBag";
import { client } from "@/sanity/lib/client";
import { MdFacebook } from "react-icons/md";
import { FaGithub, FaInstagram } from "react-icons/fa";
import Loading from "@/app/loading";

type Product = {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stockLevel: number;
  category: string;
  discountPercentage: number;
  product_id: string;
};

function ProductDetails() {
  const { id } = useParams(); // ✅ Unwrap params correctly
  const [data, setData] = useState<Product | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const query = `*[_type == "product" && _id == $id][0]{
    _id,
    name,
    description,
    "image": image.asset->url,
    price,
    stockLevel,
    category,
    discountPercentage,
    product_id
  }`;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const product: Product = await client.fetch(query, { id });

        if (product) {
          setData(product);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time stock updates
    const subscription = client.listen(query, { id }).subscribe((update) => {
      setData((prev: Product | null) => {
        if (!prev) return null;
        return {
          ...prev,
          stockLevel: update.result?.stockLevel ?? prev.stockLevel,
        };
      });
    });

    return () => subscription.unsubscribe();
  }, [id]);

  if (loading) return <Loading />;
  if (error || !data)
    return (
      <h1 className="flex justify-center text-red-700 font-bold text-3xl pt-4">
        Oops! Item Not Found!
      </h1>
    );

  return (
    <main>
      <Heading heading="Product Details" path1="Home" path2="Pages" path3="Product Details" />

      <section className="my-20">
        <div className="max-w-[84%] mx-auto">
          <div className="bg-white w-full md:flex-row flex-col py-4 flex justify-center items-center gap-8">
            {/* Image Section */}
            <div className="flex flex-row gap-4 md:gap-9 items-center md:w-[50%]">
              <div className="flex flex-col gap-3">
                <Image className="p-3 shadow-lg" src={data.image} width={100} height={100} alt="image" />
                <Image className="p-3 shadow-lg" src={data.image} width={100} height={100} alt="image" />
                <Image className="p-3 shadow-lg" src={data.image} width={100} height={100} alt="image" />
              </div>
              <div className="relative items-center shadow-xl">
                <div className="absolute top-0 left-0">
                  {data.stockLevel > 0 ? (
                    <span className="bg-green-600 text-white px-3 py-2 rounded-[9px] text-xs font-bold">In Stock</span>
                  ) : (
                    <span className="bg-red-500 text-white px-3 py-2 rounded-[9px] text-xs font-bold">Out of Stock</span>
                  )}
                </div>
                <Image src={data.image} width={300} height={300} alt={data.name} className="w-[300px] p-3 object-cover" />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="md:w-[45%] flex items-start gap-4 flex-col">
              <h3 className="text-3xl font-bold">{data.name}</h3>
              <span>(22)</span>

              <div className="inline-flex gap-x-5">
                {data.discountPercentage > 0 ? (
                  <>
                    <span className="text-[17px] text-[#151875] font-bold">
                      ${data.price - (data.price * data.discountPercentage) / 100}
                    </span>
                    <span className="text-[16px] text-[#f83434]" style={{ textDecoration: "line-through" }}>
                      ${data.price}
                    </span>
                    <p>{data.discountPercentage}% off</p>
                  </>
                ) : (
                  <span className="text-sm text-[#151875] font-bold">${data.price}</span>
                )}
              </div>

              <AddtoBag
                product_id={data.product_id}
                key={data._id}
                name={data.name}
                image={data.image}
                discountPercentage={data.price - (data.price * data.discountPercentage) / 100}
                currency={"USD"}
                _id={data._id}
                stockLevel={data.stockLevel}
              />

              <span className="text-[20px] font-[500]">Stock: {data.stockLevel}</span>
              <p className="text-md text-[#868ab4] leading-[20px]">{data.description}</p>
              <span className="text-md text-[#151875] font-bold">
                Categories: <span className="text-orange-700">{data.category}</span>
              </span>
              <div className="inline-flex text-[20px] gap-x-4">
                <span className="text-[17px] text-[#151875] font-bold">Share</span>
                <MdFacebook />
                <FaInstagram />
                <FaGithub />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Descriptions & Related Products */}
      <ProductsDescriptions />
      <RelatedProducts />
      <Logos />
    </main>
  );
}

export default ProductDetails;

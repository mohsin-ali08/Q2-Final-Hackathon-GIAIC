import Image from "next/image";
import Link from "next/link";
import { BsCart2 } from "react-icons/bs";
import { FaRegHeart, FaSearchPlus } from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  stockLevel: number;
  category: string;
  discountPercentage: number;
}

interface Props {
  data: Product[];
}

function LatestProduct({ data }: Props) {
  return (
    <div className="max-w-[1920px] mx-2 sm:mx-10 lg:mx-32 xl:mx-20 my-20">
      {/* Header */}
      <div className="flex flex-col items-center justify-center my-5 text-center">
        <h1 className="text-[32px] sm:text-[36px] lg:text-[42px] font-[700] text-[#151875] leading-[40px] sm:leading-[45px] lg:leading-[49.22px]">
          Latest Products
        </h1>
        <div className="flex flex-wrap justify-center gap-4 py-3">
          <h2 className="text-[#FB4997] underline cursor-pointer">
            New Arrival
          </h2>
          <h2 className="text-[#151875] cursor-pointer">Best Seller</h2>
          <h2 className="text-[#151875] cursor-pointer">Special Offer</h2>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-y-8 gap-x-4 sm:gap-x-6 lg:gap-x-8 mx-auto">
        {/* Product Card */}
        {data.map((item, index) => (
          <Link key={index} href={`/products/${item._id}`}>
            <div
              key={index}
              className="w-full sm:w-[270px] mx-auto px-10 md:px-0 lg:w-[360px] flex flex-col justify-center items-center"
            >
              {/* Image Section */}

              <div className="w-full group h-[200px] sm:h-[220px] lg:h-[270px] bg-[#F7F7F7] flex justify-center items-center relative">
                <div className="opacity-0 group-hover:opacity-100 absolute top-4 left-4 bg-gray-00 rounded-full p-2">
                  <Image
                    src={"/features/sale.png"}
                    alt="sale"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col justify-start opacity-0 group-hover:opacity-100 gap-4 py-2 ">
                  <BsCart2
                    size={20}
                    className="text-[#2F1AC4] cursor-pointer"
                  />
                  <FaRegHeart
                    size={20}
                    className="text-[#FB2448] cursor-pointer"
                  />
                  <FaSearchPlus
                    size={20}
                    className="text-[#4A8BA0] cursor-pointer"
                  />
                </div>
                <Image
                  src={item.image}
                  width={2000}
                  height={2000}
                  alt={item.name}
                  className="w-[150px] sm:w-[180px] lg:w-[220px] object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex  flex-col items-center text-center py-4">
                <h3 className="text-[#151875] text-[16px] line-clamp-1 sm:text-[18px] font-medium">
                  {item.name}
                </h3>
                <div className="flex justify-center items-center gap-x-4 py-2">
                  <p className="text-[#151875]">
                    ${item.price - (item.price * item.discountPercentage) / 100}
                  </p>
                  <p className="text-[#FB2448] line-through">${item.price}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LatestProduct;

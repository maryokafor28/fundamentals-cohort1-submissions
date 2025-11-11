"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CartCardProps {
  img: string; // path in public folder, e.g. "/gucci.png"
  title: string;
  price: string;
  onAdd: () => void;
}

export default function CartCard({ img, title, price, onAdd }: CartCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-2xl h-full bg-black/10 backdrop-blur-lg border border-white/20">
      <CardContent className="p-4 flex flex-col items-center justify-between h-full min-h-[200px]">
        <div className="flex flex-col items-center flex-grow">
          <Image
            src={img}
            alt={title}
            width={70}
            height={70}
            className="object-contain"
          />
          <p className="mt-4 font-medium text-center flex-grow flex items-center">
            {title}
          </p>
          <p className=" font-semibold mt-2">{price}</p>
        </div>
        <Button className="mt-3 w-full" onClick={onAdd}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}

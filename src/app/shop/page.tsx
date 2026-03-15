"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function ShopPage() {
  return (
    <main className="flex grow flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Club Shop</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8">
          <div className="space-y-4 text-center text-lg">
            <p>
              We have set up a shop where you can purchase branded clothing and accessories.
            </p>
            <p className="">
              The club does not profit from these sales. Your purchase directly supports a local small business.
            </p>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[oklch(0.269_0_0)]">
            <Image
              src="/400_filter_nobg_6724f4d9b3564.webp"
              alt="D2C Signs"
              fill
              className="object-contain p-8"
            />
          </div>

          <Button asChild size="lg" className="text-xl">
            <Link href="https://www.d2csigns.co.uk/shop/clubs/wadebridge-gaming-club" target="_blank">
              Visit Shop
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

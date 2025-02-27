"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formUrlQuery } from "@/lib/utils";
import { useState } from "react";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

export default function Pagination({
  page,
  totalPages,
  urlParamName,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(Number(page));
  const pageArray = Array.from({ length: Number(totalPages) }, (_, i) => i + 1);

  const handlePageChange = (pageValue: number) => {
    setCurrentPage(pageValue);

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });
    router.push(newUrl);
  };

  return (
    <div className="flex gap-2 ">
      <Button
        size="icon"
        variant="outline"
        disabled={Number(page) <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ArrowLeft />
      </Button>
      {pageArray.map((pageNum) => (
        <Button
          key={pageNum}
          size="icon"
          disabled={currentPage === pageNum}
          variant="outline"
          onClick={() => handlePageChange(pageNum)}
        >
          {pageNum}
        </Button>
      ))}
      <Button
        size="icon"
        variant="outline"
        disabled={Number(page) >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <ArrowRight />
      </Button>
    </div>
  );
}

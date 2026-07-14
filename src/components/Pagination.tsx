import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 3;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <View className="container">
      <TouchableOpacity
        className="pagination-nav-button"
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
      >
        <Text
          className={`pagination-nav-button-text ${currentPage === 1 ? "disabled" : ""}`}
        >
          Geri
        </Text>
      </TouchableOpacity>

      <View className="pagination-pages-container">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <Text key={`dots-${index}`} className="pagination-dots">
                ...
              </Text>
            );
          }

          const isSelected = page === currentPage;
          return (
            <TouchableOpacity
              key={`page-${page}`}
              className="pagination-page-button"
              onPress={() => onPageChange(page as number)}
            >
              <Text
                className={`pagination-page-button-text ${isSelected ? "selected" : ""}`}
              >
                {page}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        className="pagination-nav-button"
        disabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
      >
        <Text
          className={`pagination-nav-button-text ${currentPage === totalPages ? "disabled" : ""}`}
        >
          İleri
        </Text>
      </TouchableOpacity>
    </View>
  );
};

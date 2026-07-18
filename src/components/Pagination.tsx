import { AppText as Text } from "@/components/ui/AppText";
import React from "react";
import { TouchableOpacity, View } from "react-native";

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
  return (
    <View className="pagination-container">
      <TouchableOpacity
        className="pagination-nav-button"
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
        testID="pagination-prev"
      >
        <Text
          className={`pagination-nav-button-text ${currentPage === 1 ? "pagination-disabled-text" : ""}`}
        >
          Geri
        </Text>
      </TouchableOpacity>

      <Text className="pagination-current-page-text">
        {currentPage} / {totalPages}
      </Text>

      <TouchableOpacity
        className="pagination-nav-button"
        disabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        testID="pagination-next"
      >
        <Text
          className={`pagination-nav-button-text ${currentPage === totalPages ? "pagination-disabled-text" : ""}`}
        >
          İleri
        </Text>
      </TouchableOpacity>
    </View>
  );
};

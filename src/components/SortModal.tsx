import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SortOption, useSort } from "@/context/SortContext";

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
}

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "newest", label: "En Yeni" },
  { id: "oldest", label: "En Eski" },
  { id: "source", label: "Kaynağa Göre (A-Z)" },
];

export const SortModal = ({ visible, onClose }: SortModalProps) => {
  const { sortOption, setSortOption } = useSort();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="sort-modal-backdrop" onPress={onClose}>
        <Pressable className="sort-modal-content">
          <Text className="sort-modal-title">Sıralama</Text>

          {SORT_OPTIONS.map((option) => {
            const isActive = sortOption === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                className={
                  isActive
                    ? "sort-modal-option sort-modal-option-active"
                    : "sort-modal-option"
                }
                onPress={() => {
                  setSortOption(option.id);
                  onClose();
                }}
              >
                <Text
                  className={
                    isActive
                      ? "sort-modal-option-text sort-modal-option-text-active"
                      : "sort-modal-option-text"
                  }
                >
                  {option.label}
                </Text>
                {isActive && (
                  <Ionicons name="checkmark" size={18} color="#F2B705" />
                )}
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

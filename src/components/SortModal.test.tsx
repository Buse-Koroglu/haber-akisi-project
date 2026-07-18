import { SortModal } from "@/components/SortModal";
import { fireEvent, render } from "@testing-library/react-native";

const mockSetSortOption = jest.fn();
let mockSortOption: "newest" | "oldest" | "source" = "newest";

jest.mock("@/context/SortContext", () => ({
  useSort: () => ({
    sortOption: mockSortOption,
    setSortOption: mockSetSortOption,
  }),
}));

describe("SortModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSortOption = "newest";
  });

  it("renders all sorting options", async () => {
    const { getByText } = await render(
      <SortModal visible={true} onClose={jest.fn()} />,
    );

    expect(getByText("En Yeni")).toBeTruthy();
    expect(getByText("En Eski")).toBeTruthy();
    expect(getByText("Kaynağa Göre (A-Z)")).toBeTruthy();
  });

  it("displays checkmark icon for the active option and not for others", async () => {
    mockSortOption = "oldest";
    const { getByTestId, queryByTestId } = await render(
      <SortModal visible={true} onClose={jest.fn()} />,
    );

    expect(getByTestId("sort-check-oldest")).toBeTruthy();
    expect(queryByTestId("sort-check-newest")).toBeNull();
    expect(queryByTestId("sort-check-source")).toBeNull();
  });

  it("calls setSortOption with the correct id when an option is pressed", async () => {
    const { getByText } = await render(
      <SortModal visible={true} onClose={jest.fn()} />,
    );

    fireEvent.press(getByText("Kaynağa Göre (A-Z)"));

    expect(mockSetSortOption).toHaveBeenCalledWith("source");
  });

  it("calls onClose when an option is pressed", async () => {
    const onClose = jest.fn();
    const { getByText } = await render(
      <SortModal visible={true} onClose={onClose} />,
    );

    fireEvent.press(getByText("En Eski"));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when the backdrop is pressed and setSortOption is not called", async () => {
    const onClose = jest.fn();
    const { getByTestId } = await render(
      <SortModal visible={true} onClose={onClose} />,
    );

    fireEvent.press(getByTestId("sort-modal-backdrop"));

    expect(onClose).toHaveBeenCalled();
    expect(mockSetSortOption).not.toHaveBeenCalled();
  });
});

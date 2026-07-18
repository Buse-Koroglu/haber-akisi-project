import { Pagination } from "@/components/Pagination";
import { fireEvent, render } from "@testing-library/react-native";

describe("Pagination", () => {
  it("renders the current page and total page count correctly", async () => {
    const { getByText } = await render(
      <Pagination currentPage={2} totalPages={5} onPageChange={jest.fn()} />,
    );

    expect(getByText("2 / 5")).toBeTruthy();
  });

  it("prev button is disabled when on the first page", async () => {
    const { getByTestId } = await render(
      <Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />,
    );

    expect(
      getByTestId("pagination-prev").props.accessibilityState.disabled,
    ).toBe(true);
  });

  it("next button is disabled when on the last page", async () => {
    const { getByTestId } = await render(
      <Pagination currentPage={5} totalPages={5} onPageChange={jest.fn()} />,
    );

    expect(
      getByTestId("pagination-next").props.accessibilityState.disabled,
    ).toBe(true);
  });

  it("in the middle page, both buttons are enabled", async () => {
    const { getByTestId } = await render(
      <Pagination currentPage={3} totalPages={5} onPageChange={jest.fn()} />,
    );

    expect(
      getByTestId("pagination-prev").props.accessibilityState.disabled,
    ).toBe(false);
    expect(
      getByTestId("pagination-next").props.accessibilityState.disabled,
    ).toBe(false);
  });

  it("prev button calls onPageChange with the correct page when pressed", async () => {
    const onPageChange = jest.fn();
    const { getByTestId } = await render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    );

    fireEvent.press(getByTestId("pagination-prev"));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("next button calls onPageChange with the correct page when pressed", async () => {
    const onPageChange = jest.fn();
    const { getByTestId } = await render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    );

    fireEvent.press(getByTestId("pagination-next"));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("disabled prev button does not call onPageChange when pressed", async () => {
    const onPageChange = jest.fn();
    const { getByTestId } = await render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />,
    );

    fireEvent.press(getByTestId("pagination-prev"));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("disabled next button does not call onPageChange when pressed", async () => {
    const onPageChange = jest.fn();
    const { getByTestId } = await render(
      <Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />,
    );

    fireEvent.press(getByTestId("pagination-next"));

    expect(onPageChange).not.toHaveBeenCalled();
  });
});

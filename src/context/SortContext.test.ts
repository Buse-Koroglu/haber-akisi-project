import { SortProvider, useSort } from "@/context/SortContext";
import { act, renderHook } from "@testing-library/react-native";

describe("SortContext", () => {
  it("must initialize with 'newest' option", async () => {
    const { result } = await renderHook(() => useSort(), {
      wrapper: SortProvider,
    });

    expect(result.current.sortOption).toBe("newest");
  });

  it("must update sort option to 'oldest'", async () => {
    const { result } = await renderHook(() => useSort(), {
      wrapper: SortProvider,
    });

    await act(async () => {
      result.current.setSortOption("oldest");
    });

    expect(result.current.sortOption).toBe("oldest");
  });

  it("must update sort option to 'source'", async () => {
    const { result } = await renderHook(() => useSort(), {
      wrapper: SortProvider,
    });

    await act(async () => {
      result.current.setSortOption("source");
    });

    expect(result.current.sortOption).toBe("source");
  });

  it("must be able to switch between different options", async () => {
    const { result } = await renderHook(() => useSort(), {
      wrapper: SortProvider,
    });

    await act(async () => {
      result.current.setSortOption("oldest");
    });
    expect(result.current.sortOption).toBe("oldest");

    await act(async () => {
      result.current.setSortOption("source");
    });
    expect(result.current.sortOption).toBe("source");

    await act(async () => {
      result.current.setSortOption("newest");
    });
    expect(result.current.sortOption).toBe("newest");
  });

  it("must throw an error when used outside of SortProvider", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(renderHook(() => useSort())).rejects.toThrow(
      "useSort mutlaka SortProvider içinde kullanılmalıdır.",
    );

    consoleError.mockRestore();
  });
});

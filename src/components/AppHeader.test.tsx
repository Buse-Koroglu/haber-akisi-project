import { AppHeader } from "@/components/AppHeader";
import { APP_THEME } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert, Share } from "react-native";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const mockPush = jest.fn();
let mockSegments: string[] = ["(tabs)", "index"];
let mockArticleParam: string | undefined = undefined;

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
  useSegments: () => mockSegments,
  useLocalSearchParams: () => ({ article: mockArticleParam }),
}));

const mockSetColorScheme = jest.fn();
let mockColorScheme: "light" | "dark" = "light";

jest.mock("nativewind", () => ({
  useColorScheme: () => ({
    colorScheme: mockColorScheme,
    setColorScheme: mockSetColorScheme,
  }),
}));

jest.mock("@/components/SortModal", () => {
  const { Text } = require("react-native");
  return {
    SortModal: ({ visible }: { visible: boolean }) =>
      visible ? <Text testID="sort-modal-visible">visible</Text> : null,
  };
});

describe("AppHeader", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    mockSegments = ["(tabs)", "index"];
    mockArticleParam = undefined;
    mockColorScheme = "light";
  });

  it("when the logo button is pressed, router.push('/') is called", async () => {
    const { getByTestId } = await render(<AppHeader />);

    await fireEvent.press(getByTestId("header-logo-button"));

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("when on light theme, pressing the theme icon switches to dark theme and writes to AsyncStorage", async () => {
    mockColorScheme = "light";
    const { getByTestId } = await render(<AppHeader />);

    await fireEvent.press(getByTestId("theme-toggle-button"));

    expect(mockSetColorScheme).toHaveBeenCalledWith("dark");
    await waitFor(async () => {
      expect(await AsyncStorage.getItem(APP_THEME)).toBe("dark");
    });
  });

  it("when on dark theme, pressing the theme icon switches to light theme and writes to AsyncStorage", async () => {
    mockColorScheme = "dark";
    const { getByTestId } = await render(<AppHeader />);

    await fireEvent.press(getByTestId("theme-toggle-button"));

    expect(mockSetColorScheme).toHaveBeenCalledWith("light");
    await waitFor(async () => {
      expect(await AsyncStorage.getItem(APP_THEME)).toBe("light");
    });
  });

  it("when not on the details screen, the sort button is visible and the share button is not visible", async () => {
    mockSegments = ["(tabs)", "index"];
    const { getByTestId, queryByTestId } = await render(<AppHeader />);

    expect(getByTestId("sort-button")).toBeTruthy();
    expect(queryByTestId("share-button")).toBeNull();
  });

  it("when on the details screen, the share button is visible and the sort button is not visible", async () => {
    mockSegments = ["(tabs)", "details"];
    const { getByTestId, queryByTestId } = await render(<AppHeader />);

    expect(getByTestId("share-button")).toBeTruthy();
    expect(queryByTestId("sort-button")).toBeNull();
  });

  it("when the sort button is pressed, the SortModal becomes visible", async () => {
    mockSegments = ["(tabs)", "index"];
    const { getByTestId, queryByTestId } = await render(<AppHeader />);

    expect(queryByTestId("sort-modal-visible")).toBeNull();

    await fireEvent.press(getByTestId("sort-button"));

    expect(getByTestId("sort-modal-visible")).toBeTruthy();
  });

  it("when sharing fails, an error alert is shown", async () => {
    mockSegments = ["(tabs)", "details"];
    mockArticleParam = JSON.stringify({ url: "https://mock.com/article" });

    jest
      .spyOn(Share, "share")
      .mockRejectedValue(new Error("Paylaşım başarısız"));
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    const { getByTestId } = await render(<AppHeader />);

    await fireEvent.press(getByTestId("share-button"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Bir Hata Oluştu",
        "Paylaşım başarısız",
      );
    });
  });
});

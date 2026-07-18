import NewsCard from "@/components/NewsCard";
import { fireEvent, render } from "@testing-library/react-native";
import { Article } from "../../type";

const mockToggleFavorite = jest.fn();
const mockIsFavorite = jest.fn();
const mockPush = jest.fn();

jest.mock("@/context/FavoritesContext", () => ({
  useFavorites: () => ({
    toggleFavorite: mockToggleFavorite,
    isFavorite: mockIsFavorite,
  }),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("nativewind", () => ({
  useColorScheme: () => ({ colorScheme: "light" }),
}));

const article: Article = {
  source: { id: null, name: "BBC News" },
  author: "Nevsin Mengu",
  title: "Mock Title",
  description: "Mock description text",
  url: "https://mock.com/article",
  urlToImage: "https://mock.com/image.jpg",
  publishedAt: "2024-06-15T10:30:00Z",
  content: "Mock content text",
};

describe("NewsCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsFavorite.mockReturnValue(false);
  });

  it("it renders the source name, title, and description correctly", async () => {
    const { getByText } = await render(<NewsCard article={article} />);

    expect(getByText("BBC News")).toBeTruthy();
    expect(getByText("Mock Title")).toBeTruthy();
    expect(getByText("Mock description text")).toBeTruthy();
  });

  it("it renders the published date in the correct format", async () => {
    const { getByText } = await render(<NewsCard article={article} />);

    expect(getByText("15 Haziran 2024, 10:30")).toBeTruthy();
  });

  it("it does not render the description when it is null", async () => {
    const articleWithoutDescription = { ...article, description: null };
    const { queryByText } = await render(
      <NewsCard article={articleWithoutDescription} />,
    );

    expect(queryByText("Mock description text")).toBeNull();
  });

  it("it shows the 'Favorilere ekle' label when the article is not a favorite", async () => {
    mockIsFavorite.mockReturnValue(false);
    const { getByLabelText } = await render(<NewsCard article={article} />);

    expect(getByLabelText("Favorilere ekle")).toBeTruthy();
  });

  it("it shows the 'Favorilerden çıkar' label when the article is a favorite", async () => {
    mockIsFavorite.mockReturnValue(true);
    const { getByLabelText } = await render(<NewsCard article={article} />);

    expect(getByLabelText("Favorilerden çıkar")).toBeTruthy();
  });

  it("it calls toggleFavorite with the correct article when the favorite button is pressed", async () => {
    const { getByTestId } = await render(<NewsCard article={article} />);

    fireEvent.press(getByTestId("favorite-button"));

    expect(mockToggleFavorite).toHaveBeenCalledWith(article);
  });

  it("it calls router.push with the correct pathname and params when the card is pressed", async () => {
    const { getByTestId } = await render(<NewsCard article={article} />);

    fireEvent.press(getByTestId("news-card"));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/details",
      params: { article: JSON.stringify(article) },
    });
  });

  it("it does not call router.push when the favorite button is pressed", async () => {
    const { getByTestId } = await render(<NewsCard article={article} />);

    fireEvent.press(getByTestId("favorite-button"));

    expect(mockPush).not.toHaveBeenCalled();
  });
});

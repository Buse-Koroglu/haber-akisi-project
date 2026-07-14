import { Article } from "@/api/newsApi";
import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";

const webview = () => {
  const { article } = useLocalSearchParams<{ article: string }>();
  const parsedArticle: Article | null = article ? JSON.parse(article) : null;

  if (!parsedArticle?.url) return null;

  return <WebView source={{ uri: parsedArticle.url }} />;
};

export default webview;

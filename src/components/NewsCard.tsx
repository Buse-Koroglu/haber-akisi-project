import { Article } from "@/api/newsApi";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Image, Text, View } from "react-native";

const NewsCard = ({ article }: { article: Article }) => {
  const { source, title, description, urlToImage, publishedAt } = article;

  return (
    <View className="news-card p-4">
      <View className="news-card-accent-bar" />

      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <Image
          source={
            urlToImage
              ? { uri: urlToImage }
              : require("@/assets/images/fallback.png")
          }
          style={{ width: 96, height: 96 }}
          className="news-card-image"
          resizeMode="cover"
        />

        <View className="news-card-body">
          <Text className="news-card-source" numberOfLines={1}>
            {source.name}
          </Text>

          <Text className="news-card-title" numberOfLines={2}>
            {title}
          </Text>

          {description ? (
            <Text className="news-card-desc" numberOfLines={2}>
              {description}
            </Text>
          ) : null}

          <Text className="news-card-meta">
            {formatDistanceToNow(new Date(publishedAt), {
              addSuffix: true,
              locale: tr,
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NewsCard;

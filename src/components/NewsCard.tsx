import { useFavorites } from "@/context/FavoritesContext";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useRouter } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import { useColorScheme } from "nativewind";
import { Article } from "../../type";

const NewsCard = ({ article }: { article: Article }) => {
  const { source, title, description, urlToImage, publishedAt } = article;
  const { toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const mutedColor = colorScheme === "dark" ? "#A0A09A" : "#6B6B66";

  const handlePress = () => {
    router.push({
      pathname: "/details",
      params: { article: JSON.stringify(article) },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
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
            <View className="flex-row items-center justify-between">
              <Text className="news-card-source" numberOfLines={1}>
                {source.name}
              </Text>

              <TouchableOpacity onPress={() => toggleFavorite(article)}>
                <Ionicons
                  name={isFavorite(article.url) ? "star" : "star-outline"}
                  size={20}
                  color={isFavorite(article.url) ? "#F2B705" : mutedColor}
                />
              </TouchableOpacity>
            </View>

            <Text className="news-card-title" numberOfLines={2}>
              {title}
            </Text>

            {description ? (
              <Text className="news-card-desc" numberOfLines={2}>
                {description}
              </Text>
            ) : null}

            <Text className="news-card-meta">
              {format(new Date(publishedAt), "d MMMM yyyy, HH:mm", {
                locale: tr,
              })}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;

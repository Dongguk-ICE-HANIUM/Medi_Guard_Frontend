import { TagInfo } from "@/types/tags";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Tag from "./Tag";

interface TagsContainerProps {
  tags: TagInfo[];
  maxTags?: number;
}

const TagsContainer: React.FC<TagsContainerProps> = ({ tags, maxTags = 2 }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const sortedTags = [...tags].sort((a, b) => {
    const priorityMap = {
      appointment: 1,
      pillTaken: 2,
      pillMissed: 3,
      sideEffect: 4,
      pillSchedule: 5,
    };
    return (priorityMap[a.type] || 999) - (priorityMap[b.type] || 999);
  });

  const visibleTags = sortedTags.slice(0, maxTags);
  const hiddenCount = Math.max(0, sortedTags.length - maxTags);

  return (
    <View style={styles.container}>
      {visibleTags.map((tagItem, index) => (
        <Tag key={`${tagItem.type}-${index}`} tagInfo={tagItem} size="small" />
      ))}
      {hiddenCount > 0 && (
        <View style={styles.more}>
          <Text style={styles.moreText}>+{hiddenCount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  more: {
    width: 45,
    backgroundColor: "#BDBDBD",
    borderRadius: 8,
    height: 15,
    alignItems: "center",
  },
  moreText: {
    paddingVertical: 2,
    textAlign: "center",
    fontSize: 11,
  },
});

export default TagsContainer;

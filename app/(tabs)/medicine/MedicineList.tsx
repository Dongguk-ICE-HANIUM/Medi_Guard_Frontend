import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const medicineList = () => {
  return (
    <>
      <View>
        <Text>medicineList</Text>
      </View>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={"black"} />
      </TouchableOpacity>
    </>
  );
};

export default medicineList;

const styles = StyleSheet.create({});

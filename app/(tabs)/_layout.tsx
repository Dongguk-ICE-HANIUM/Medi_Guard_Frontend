import { AppointmentProvider } from "@/context/AppointmentContext";
import { CalendarProvider } from "@/context/CalendarContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function TabLayout() {
  return (

    <QueryClientProvider client={queryClient}>
      <AppointmentProvider>


      <MedicationProvider>

        <CalendarProvider>
          <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
              name="index"
              options={{
                title: "홈",
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? "home" : "home-outline"}
                    size={24}
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="my"
              options={{
                title: "내 페이지",
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? "person-circle" : "person-circle-outline"}
                    size={24}
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="medicine"
              options={{
                title: "약물관리",
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? "search" : "search-outline"}
                    size={24}
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="treat"
              options={{
                title: "병원진료",
                tabBarIcon: ({ color, focused }) => (
                  <MaterialCommunityIcons
                    name={focused ? "hospital-box" : "hospital-box-outline"}
                    size={24}
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="menu"
              options={{
                title: "전체",
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? "menu" : "menu-outline"}
                    size={24}
                    color={color}
                  />
                ),
              }}
            />
          </Tabs>
        </CalendarProvider>

      </AppointmentProvider>
    </QueryClientProvider>
  );
}

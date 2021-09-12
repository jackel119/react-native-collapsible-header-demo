import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList as RNFlatList, NativeScrollEvent, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';

const DATA = Array.from(Array(100).keys());


const HEADER_HEIGHT = 120;

const airbnbScrollHandler = (
  ev: NativeScrollEvent,
  animatedValueRef: Animated.SharedValue<number>,
  a: Animated.SharedValue<number>,
  MAX_HEIGHT: number
) => {
  'worklet';
  const { y } = ev.contentOffset;
  const diff = y - a.value;
  const newAnimatedValue = animatedValueRef.value + diff;

  if (y < ev.contentSize.height - ev.layoutMeasurement.height) {
    if (y > MAX_HEIGHT) {
      if (y < a.value) {
        animatedValueRef.value = Math.max(0, newAnimatedValue);
      } else {
        if (animatedValueRef.value < MAX_HEIGHT) {
          animatedValueRef.value = Math.min(MAX_HEIGHT, newAnimatedValue);
        } else {
          animatedValueRef.value = MAX_HEIGHT;
        }
      }
      a.value = Math.max(0, y);
    } else {
      if (a.value) {
        a.value = Math.max(0, y);
        animatedValueRef.value = Math.max(0, newAnimatedValue);
      } else {
        animatedValueRef.value = y;
      }
    }
  }
};

const FlatList = Animated.createAnimatedComponent(RNFlatList);
export default function App() {

  const scrollYAbs = useSharedValue(0);
  const scrollYRel = useSharedValue(0);


  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      airbnbScrollHandler(e, scrollYRel, scrollYAbs, HEADER_HEIGHT);
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return ({
      height: HEADER_HEIGHT,
      backgroundColor: "#dedede",
      opacity: interpolate(scrollYRel.value,
        [0, 3 * HEADER_HEIGHT / 4],
        [1, 0],
        Extrapolate.CLAMP,
      ),
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      transform: [
        {
          translateY: interpolate(scrollYRel.value,
            [0, HEADER_HEIGHT],
            [0, -HEADER_HEIGHT],
            Extrapolate.CLAMP,
          ),
        }
      ],
    
    });
  });

  return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.header, animatedHeaderStyle ]}
        >
          <Text>Open up App.tsx to start working on your app!</Text>
        </Animated.View>
        <StatusBar style="auto" />
        <FlatList
          scrollEventThrottle={8}
          onScroll={scrollHandler}
          style={{ width: "100%", flex: 1 }}
          data={DATA}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
          renderItem={({ item }) => (
            <View style={{
              padding: 8,
              }}>
              <Text
                style={{
                  fontSize: 16,
                }}
            >
              {item}
            </Text>
          </View>
          )
          }
        ItemSeparatorComponent={() => <View style={{ borderStyle: "solid", borderWidth: 0.5, borderColor: "#dedede" }}/>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    top: 0,
    position: "absolute",
    zIndex: 10,
  },
  container: {
    marginTop: 42,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

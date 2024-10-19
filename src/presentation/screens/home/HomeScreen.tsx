import React from 'react';
import {Text, View} from 'react-native';
import {useMovies} from '../../hooks/useMovies';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PosterCarousel} from '../../components/movies/PosterCarousel';
import {HorizontalCarousel} from '../../components/movies/HorizontalCarousel';

export const HomeScreen = () => {
  const {top} = useSafeAreaInsets();

  const {isLoding, nowPlaying, popular, topRated, upComing, popularNextPage} =
    useMovies();

  if (isLoding) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView>
      <View style={{marginTop: top + 20, paddingBottom: 30}}>
        {/*Principal*/}
        <PosterCarousel movies={nowPlaying} />
        {/*Populares*/}
        <HorizontalCarousel
          movies={popular}
          title="Populares"
          loadNextPage={popularNextPage}
        />

        {/*Top rated*/}
        <HorizontalCarousel movies={topRated} title="Mejor calificadas" />

        {/*Proximamente*/}
        <HorizontalCarousel movies={upComing} title="Proximamente" />
      </View>
    </ScrollView>
  );
};

import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import {useMovies} from '../../hooks/useMovies';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PosterCarousel} from '../../components/movies/PosterCarousel';
import {HorizontalCarousel} from '../../components/movies/HorizontalCarousel';
import {FullScreenLoaders} from '../../components/loaders/FullScreenLoaders';

export const HomeScreen = ({navigation}: any) => {
  const {top} = useSafeAreaInsets();

  const {isLoding, nowPlaying, popular, topRated, upComing, popularNextPage} =
    useMovies();

  if (isLoding) {
    return <FullScreenLoaders />;
  }

  return (
    <ScrollView>
      <View style={[styles.container, {marginTop: top + 20}]}>
        {/* Banner horizontal para Trivia */}
        <TouchableOpacity
          style={styles.triviaBanner}
          onPress={() => navigation.navigate('Trivia')}>
          <View style={styles.triviaBannerGradient}>
            <Text style={styles.triviaBannerText}>Jugar Trivia</Text>
          </View>
        </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30
  },
  triviaBanner: {
    height: 150,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden'
  },
  triviaBannerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 10,
    position: 'relative',
    background: 'linear-gradient(to right, #007bff, #00c6ff)'
  },
  triviaBannerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5
  }
});

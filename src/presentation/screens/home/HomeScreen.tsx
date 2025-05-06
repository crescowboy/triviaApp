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
        <Text style={styles.sectionTitle}>Selecciona una Trivia</Text>

        {/* Botón principal más grande */}
        <TouchableOpacity
          style={styles.mainTriviaButton}
          onPress={() =>
            navigation.navigate('TriviaScreen', {category: 'general'})
          }>
          <Text style={styles.triviaButtonText}>Trivia General</Text>
        </TouchableOpacity>

        {/* Botones secundarios en pares */}
        <View style={styles.triviaRow}>
          <TouchableOpacity
            style={styles.triviaButtonSmall}
            onPress={() =>
              navigation.navigate('TriviaScreen', {category: 'releaseYear'})
            }>
            <Text style={styles.triviaButtonText}>Año de Estreno</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.triviaButtonSmall}
            onPress={() =>
              navigation.navigate('TriviaScreen', {category: 'title'})
            }>
            <Text style={styles.triviaButtonText}>Título</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.triviaRow}>
          <TouchableOpacity
            style={styles.triviaButtonSmall}
            onPress={() =>
              navigation.navigate('TriviaScreen', {category: 'language'})
            }>
            <Text style={styles.triviaButtonText}>Idioma Original</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.triviaButtonSmall}
            onPress={() =>
              navigation.navigate('TriviaScreen', {category: 'genre'})
            }>
            <Text style={styles.triviaButtonText}>Género</Text>
          </TouchableOpacity>
        </View>

        {/* Principal */}
        <Text style={styles.sectionTitle}>Peliculas</Text>
        <PosterCarousel movies={nowPlaying} />

        {/* Populares */}
        <HorizontalCarousel
          movies={popular}
          title="Populares"
          loadNextPage={popularNextPage}
        />

        {/* Top rated */}
        <HorizontalCarousel movies={topRated} title="Mejor calificadas" />

        {/* Próximamente */}
        <HorizontalCarousel movies={upComing} title="Próximamente" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    marginHorizontal: 20,
    marginBottom: 10,
    textAlign: 'center' // ✅ Línea añadida para centrar el título
  },
  mainTriviaButton: {
    backgroundColor: '#007bff',
    paddingVertical: 30, // Más alto
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center'
  },
  triviaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 10
  },
  triviaButtonSmall: {
    backgroundColor: '#007bff',
    paddingVertical: 20, // Un poco más alto
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center'
  },
  triviaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

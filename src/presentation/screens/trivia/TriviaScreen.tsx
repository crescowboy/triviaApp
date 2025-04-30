import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image
} from 'react-native';
import {movieDBFetcher} from '../../../config/adapters/movieDB.adapter';

const genreMap: {[key: number]: string} = {
  28: 'Acción',
  12: 'Aventura',
  16: 'Animación',
  35: 'Comedia',
  80: 'Crimen',
  99: 'Documental',
  18: 'Drama',
  10751: 'Familiar',
  14: 'Fantasía',
  36: 'Historia',
  27: 'Terror',
  10402: 'Música',
  9648: 'Misterio',
  10749: 'Romance',
  878: 'Ciencia ficción',
  10770: 'Película de TV',
  53: 'Suspenso',
  10752: 'Bélica',
  37: 'Western'
};

export const TriviaScreen = ({navigation}: any) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(10); // Estado para el temporizador

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await movieDBFetcher.get('/popular');
        const movies = response.results;

        // Mezclar películas
        const shuffledMovies = movies.sort(() => Math.random() - 0.5);

        // Generar preguntas hasta alcanzar 10
        const generatedQuestions: any[] = [];
        let index = 0;

        while (
          generatedQuestions.length < 10 &&
          index < shuffledMovies.length
        ) {
          const movie = shuffledMovies[index];
          const questionType = Math.floor(Math.random() * 8); // Ahora hay 8 tipos de preguntas

          let question = null;

          switch (questionType) {
            case 0: // Pregunta sobre el año de estreno
              question = {
                question: `¿En qué año se estrenó esta película?`,
                poster: movie.poster_path,
                options: [
                  movie.release_date.split('-')[0],
                  (parseInt(movie.release_date.split('-')[0]) - 1).toString(),
                  (parseInt(movie.release_date.split('-')[0]) + 1).toString(),
                  (parseInt(movie.release_date.split('-')[0]) + 2).toString()
                ].sort(() => Math.random() - 0.5),
                answer: movie.release_date.split('-')[0]
              };
              break;
            case 1: // Pregunta sobre el título
              const otherMovies = shuffledMovies
                .filter((m: any) => m.id !== movie.id)
                .slice(0, 3) // Limitar a 3 títulos adicionales
                .map((m: any) => m.title);
              question = {
                question: `¿Cuál es el título de esta película?`,
                poster: movie.poster_path,
                options: [movie.title, ...otherMovies].sort(
                  () => Math.random() - 0.5
                ),
                answer: movie.title
              };
              break;
            case 2: // Pregunta sobre el idioma original
              question = {
                question: `¿Cuál es el idioma original de esta película?`,
                poster: movie.poster_path,
                options: ['jp', 'es', 'fr', movie.original_language]
                  .slice(0, 4)
                  .sort(() => Math.random() - 0.5),
                answer: movie.original_language
              };
              break;
            case 3: // Pregunta sobre el género principal
              const genreName = genreMap[movie.genre_ids[0]] || 'Desconocido'; // Obtén el nombre del género principal
              const otherGenres = Object.values(genreMap)
                .filter(genre => genre !== genreName) // Excluye el género correcto
                .sort(() => Math.random() - 0.5)
                .slice(0, 3); // Selecciona 3 géneros adicionales

              question = {
                question: `¿Cuál es el género principal de esta película?`,
                poster: movie.poster_path,
                options: [genreName, ...otherGenres].sort(
                  () => Math.random() - 0.5
                ), // Mezcla las opciones
                answer: genreName // Respuesta correcta
              };
              break;
            default:
              break;
          }

          if (question) {
            generatedQuestions.push(question);
          }

          index++;
        }

        setQuestions(generatedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Manejar el temporizador
  useEffect(() => {
    if (timeLeft === 0) {
      handleAnswer(null); // Marcar como incorrecta si el tiempo se agota
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
  }, [timeLeft]);

  const handleAnswer = (selectedOption: string | null) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedOption === currentQuestion?.answer) {
      setScore(score + 1);
    }

    setSelectedOption(selectedOption);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null); // Reiniciar la selección para la siguiente pregunta
        setTimeLeft(10); // Reiniciar el temporizador
      } else {
        setFinished(true);
      }
    }, 1000); // Esperar 1 segundo antes de pasar a la siguiente pregunta
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loaderText}>Cargando preguntas...</Text>
      </View>
    );
  }

  if (finished) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Trivia Finalizada</Text>
        <Text style={styles.score}>
          Tu puntuación: {score}/{questions.length}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>
            Regresar a la pantalla principal
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>
      <Text style={styles.title}>Trivia de Películas</Text>
      {currentQuestion.poster && (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${currentQuestion.poster}`
          }}
          style={styles.poster}
        />
      )}
      <Text style={styles.question}>{currentQuestion.question}</Text>
      {currentQuestion.options.map((option: string, index: number) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedOption === option
              ? option === currentQuestion.answer
                ? styles.correctOption
                : styles.incorrectOption
              : null
          ]}
          onPress={() => handleAnswer(option)}
          disabled={!!selectedOption} // Deshabilitar botones después de seleccionar
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.score}>
        Pregunta {currentQuestionIndex + 1} de {questions.length}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    padding: 20
  },
  timerContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: '#343a40',
    padding: 10,
    borderRadius: 8
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginBottom: 20
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    color: '#495057',
    marginBottom: 20
  },
  optionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center'
  },
  correctOption: {
    backgroundColor: '#28a745' // Verde para respuestas correctas
  },
  incorrectOption: {
    backgroundColor: '#dc3545' // Rojo para respuestas incorrectas
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  score: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057'
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

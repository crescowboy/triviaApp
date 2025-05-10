import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import {useAuth} from '../../../core/context/AuthContext';

export const AuthScreen = ({navigation, route}: any) => {
  const {login} = useAuth(); // Obtener la función de login del contexto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Campo para confirmar contraseña
  const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar entre login y registro
  const {redirectTo, category} = route.params || {}; // Obtener la ruta a redirigir

  const handleLogin = () => {
    login(); // Autenticar al usuario
    if (redirectTo) {
      navigation.navigate(redirectTo, {category}); // Redirigir a la trivia seleccionada
    } else {
      navigation.navigate('Home'); // Redirigir a Home si no hay ruta específica
    }
  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Aquí puedes agregar lógica para registrar al usuario
    console.log('Registrando usuario:', email);
    login(); // Simular autenticación después del registro
    if (redirectTo) {
      navigation.navigate(redirectTo, {category}); // Redirigir a la trivia seleccionada
    } else {
      navigation.navigate('Home'); // Redirigir a Home si no hay ruta específica
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isRegistering && (
        <TextInput
          style={styles.input}
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={isRegistering ? handleRegister : handleLogin}>
        <Text style={styles.buttonText}>
          {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.toggleButtonText}>
          {isRegistering
            ? '¿Ya tienes una cuenta? Inicia sesión'
            : '¿No tienes una cuenta? Regístrate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center'
  },
  toggleButtonText: {
    color: '#007bff',
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});

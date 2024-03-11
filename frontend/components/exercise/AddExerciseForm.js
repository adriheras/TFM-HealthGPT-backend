// AddExerciseForm.js
import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, ToggleButton } from 'react-native-paper';
import axios from 'axios';
import { AuthContext } from '../profile/AuthContext';


const AddExerciseForm = ({ onExerciseAdded }) => {
  const {token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para rastrear la carga

  const [exerciseData, setExerciseData] = useState({
    type: '',
    duration: '',
    distance: '',
    calories: '', // Añade calories
  });

  const caloriasPorHora = {
    run: 1074,
    swim: 501,
    walk: 391,
    bike: 643,
    dumbbell: 455,
    tennis: 728,
    soccer: 937,
    basketball: 728
  };

  const handleInputChange = (field, value) => {
    let newExerciseData = {
      ...exerciseData,
      [field]: value,
    };

    if (field === 'duration' || field === 'type') {
      const durationInHours = newExerciseData.duration / 60; // Convierte la duración a horas
      const caloriesPerHour = caloriasPorHora[newExerciseData.type] || 0; // Obtiene las calorías por hora para el tipo de ejercicio
      const calories = durationInHours * caloriesPerHour; // Calcula las calorías
      newExerciseData.calories = calories.toFixed(2); // Añade las calorías a exerciseData
    }

    setExerciseData(newExerciseData);
  };

  const handleAddExercise = async () => {
    setIsLoading(true); // Indica que la petición está cargando
    // Verifica si alguno de los campos está vacío
    for (let field in exerciseData) {
      if (exerciseData[field] == null || exerciseData[field] === '') {
        alert('Por favor, rellena todos los campos.');
        return;
      }
    }

    try {
      const response = await axios.post('https://API_GATEWAY_URL/exercise/exercises', exerciseData, {
        headers: {
          'Authorization': `${token}`
        }
      });

      // Llama a la función proporcionada para manejar la adición del ejercicio
      onExerciseAdded(response.data);
    } catch (error) {
      console.error('Error al añadir ejercicio:', error);
    }
    setIsLoading(false); // Indica que la petición ha terminado

  };

  const [value, setValue] = React.useState('left');


  return (
    
    <View style={styles.container}>
      <Text style={styles.titleLarge}>Añadir ejercicio</Text>
      <TextInput
        mode='outlined'
        label="Duración (minutos)"
        keyboardType="numeric"
        value={exerciseData.duration}
        onChangeText={(value) => handleInputChange('duration', value)}
        style={styles.input}
      />
      <TextInput
        mode='outlined'
        label="Distancia (km)"
        keyboardType="numeric"
        value={exerciseData.distance}
        onChangeText={(value) => handleInputChange('distance', value)}
        style={styles.input}
      />
      <Text style={styles.label}>Tipo de ejercicio:</Text>
      <ToggleButton.Row onValueChange={value => {
        setValue(value);
        handleInputChange('type', value);
      }} value={value} style={styles.buttonRow} >
        <ToggleButton icon="walk" value="walk" />
        <ToggleButton icon="run" value="run" />
        <ToggleButton icon="bike" value="bike" />
        <ToggleButton icon="swim" value="swim" />
        <ToggleButton icon="dumbbell" value="dumbbell" />
        <ToggleButton icon="soccer" value="soccer" />
        <ToggleButton icon="basketball" value="basketball" />
        <ToggleButton icon="tennis" value="tennis" />
      </ToggleButton.Row>
      {isLoading ? (
      <ActivityIndicator size="large" /> // Muestra ActivityIndicator si isLoading es true
    ) : (
      <Button mode="contained" onPress={handleAddExercise} style={styles.button}>
        Agregar ejercicio
      </Button>
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
  },
  buttonRow: {
    justifyContent: 'center',
  },
  titleLarge: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 6,
  },

});

export default AddExerciseForm;
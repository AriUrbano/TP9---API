import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import axios from "axios";

const API_KEY = "c19fdce8"; 

const App = () => {
  const [imdbId, setImdbId] = useState("tt0317219");
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchMovieData = async () => {
    if (!imdbId.trim()) {
      Alert.alert("Error", "Por favor, ingresa un ID de IMDb válido.");
      return;
    }

    setLoading(true);
    setMovieData(null);

    try {
      const response = await axios.get(`http://www.omdbapi.com/`, {
        params: {
          i: imdbId,
          apikey: API_KEY,
        },
        timeout: 5000,
      });

      await sleep(3000);

      if (response.data.Response === "True") {
        setMovieData(response.data);
      } else {
        Alert.alert(
          "No encontrado",
          response.data.Error || "Película no encontrada"
        );
      }
    } catch (error) {
      console.log("Error: ", error);
      if (error.code === "ECONNABORTED") {
        Alert.alert(
          "Timeout",
          "La solicitud ha tardado demasiado en responder."
        );
      } else {
        Alert.alert("Error", "Hubo un problema al consultar la APIs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar/>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Buscar Película por IMDb ID</Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: tt0111161"
          value={imdbId}
          onChangeText={setImdbId}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={fetchMovieData}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {movieData && (
          <View style={styles.result}>
            <Image
              source={{ uri: movieData.Poster }}
              style={styles.poster}
              resizeMode="contain"
            />
            <Text style={styles.movieTitle}>{movieData.Title} ({movieData.Year})</Text>
            
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}><Text style={styles.detailLabel}>Director:</Text> {movieData.Director}</Text>
              <Text style={styles.detailText}><Text style={styles.detailLabel}>Actores:</Text> {movieData.Actors}</Text>
              <Text style={styles.detailText}><Text style={styles.detailLabel}>Género:</Text> {movieData.Genre}</Text>
              <Text style={styles.detailText}><Text style={styles.detailLabel}>Duración:</Text> {movieData.Runtime}</Text>
              <Text style={styles.detailText}><Text style={styles.detailLabel}>Calificación:</Text> {movieData.imdbRating}</Text>
            </View>

            {movieData.Ratings && movieData.Ratings.length > 0 && (
              <View style={styles.ratingsContainer}>
                <Text style={styles.sectionTitle}>Calificaciones:</Text>
                {movieData.Ratings.map((rating, index) => (
                  <View key={index} style={styles.ratingItem}>
                    <Text style={styles.ratingSource}>{rating.Source}</Text>
                    <Text style={styles.ratingValue}>{rating.Value}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    marginTop: 16,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  result: {
    alignItems: "center",
    marginTop: 16,
  },
  poster: {
    width: "100%",
    height: 400,
    marginBottom: 12,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  detailsContainer: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  ratingsContainer: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  ratingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  ratingSource: {
    fontSize: 16,
    fontWeight: "500",
  },
  ratingValue: {
    fontSize: 16,
    color: "#666",
  },
});

export default App;
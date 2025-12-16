import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, Vibration, View } from "react-native";
import NoteListItem from "../components/NoteListItem";
import { deleteNote, getNotes, Note } from "../utils/storage";
import { getCurrentTheme, subscribeToThemeChanges, Theme } from "../utils/theme";

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<Theme>(getCurrentTheme());

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.body.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const loadNotes = async () => {
    setLoading(true);
    const data = await getNotes();
    setNotes(data);
    setLoading(false);
  };

  const handleDelete = async (note: Note) => {
    Vibration.vibrate(50); // Tactile feedback
    
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteNote(note.id);
            loadNotes();
          }
        }
      ]
    );
  };

  useEffect(() => {
    const unsubscribe = subscribeToThemeChanges(setTheme);
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {notes.length === 0 && !searchQuery ? (
        <View style={[styles.center, { backgroundColor: theme.background }]}>
          <Text style={[styles.emptyText, { color: theme.text }]}>No notes yet.</Text>
          <Text style={[styles.subText, { color: theme.secondaryText }]}>Tap the pen to start writing.</Text>
        </View>
      ) : (
        <>
          {notes.length > 0 && (
            <View style={styles.searchContainer}>
              <TextInput
                style={[styles.searchInput, { color: theme.text, borderBottomColor: theme.border }]}
                placeholder="Search notes..."
                placeholderTextColor={theme.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NoteListItem 
                note={item} 
                onLongPress={handleDelete}
                theme={theme}
              />
            )}
            contentContainerStyle={styles.list}
            ListEmptyComponent={() => (
              <View style={styles.emptySearchContainer}>
                <Text style={[styles.emptySearchText, { color: theme.text }]}>No notes found.</Text>
                <Text style={[styles.subText, { color: theme.secondaryText }]}>Try a different search term.</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  list: {
    padding: 20,
  },
  emptyText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  subText: {
    color: "#666",
    fontSize: 16,
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptySearchText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    color: '#fff',
    fontSize: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
});


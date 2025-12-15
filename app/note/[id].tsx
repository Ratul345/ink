import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { deleteNote, getNote, saveNote } from "../../utils/storage";

export default function NoteEditor() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(true);
    const [noteId, setNoteId] = useState<string | undefined>(
        id === "new" ? undefined : id
    );

    useEffect(() => {
        const loadNote = async () => {
            if (id && id !== "new") {
                const note = await getNote(id);
                if (note) {
                    setTitle(note.title);
                    setBody(note.body);
                    setNoteId(note.id);
                }
            }
            setLoading(false);
        };
        loadNote();
    }, [id]);

    const handleSave = async () => {
        if (!title && !body) return; // Don't save empty notes
        const savedNote = await saveNote(title, body, noteId);
        setNoteId(savedNote.id); // Update ID if it was new
    };

    // Auto-save when leaving
    useEffect(() => {
        return () => {
            // This cleanup runs when component unmounts (e.g. pop)
            // verify if we have content to save
            // We can't access state easily here directly if it's stale, 
            // but react getters might work or we rely on explicit save on back button.
            // For simplicity, let's trigger save on back button press or explicit header button.
        };
    }, []);

    // Custom back handling to ensure save
    const handleBack = async () => {
        await handleSave();
        router.back();
    };

    const handleDelete = async () => {
        if (noteId) {
            await deleteNote(noteId);
        }
        router.back();
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color="#fff" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleBack} style={{ marginLeft: -8, padding: 8 }}>
                            <Ionicons name="chevron-back" size={28} color="#fff" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        id !== "new" && (
                            <TouchableOpacity onPress={handleDelete} style={{ padding: 8 }}>
                                <Ionicons name="trash-outline" size={24} color="#ff4444" />
                            </TouchableOpacity>
                        )
                    ),
                }}
            />
            <TextInput
                style={styles.titleInput}
                placeholder="Title"
                placeholderTextColor="#666"
                value={title}
                onChangeText={setTitle}
                onBlur={handleSave}
            />
            <TextInput
                style={styles.bodyInput}
                placeholder="Start writing..."
                placeholderTextColor="#666"
                value={body}
                onChangeText={setBody}
                onBlur={handleSave}
                multiline
                textAlignVertical="top"
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    titleInput: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 16,
        padding: 0,
    },
    bodyInput: {
        fontSize: 18,
        color: "#eee",
        flex: 1,
        padding: 0,
        lineHeight: 28,
    },
});

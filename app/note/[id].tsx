import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { deleteNote, getNote, saveNote } from "../../utils/storage";
import { getCurrentTheme, subscribeToThemeChanges, Theme } from "../../utils/theme";

export default function NoteEditor() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
    const [noteId, setNoteId] = useState<string | undefined>(
        id === "new" ? undefined : id
    );
    const [theme, setTheme] = useState<Theme>(getCurrentTheme());

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

    useEffect(() => {
        const unsubscribe = subscribeToThemeChanges(setTheme);
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        if (!title && !body) return; // Don't save empty notes
        
        setSaveStatus("saving");
        
        let titleToSave = title;
        if (!titleToSave.trim() && body.trim()) {
            // Auto-generate title from first line of body
            const firstLine = body.trim().split('\n')[0];
            titleToSave = firstLine.substring(0, 50).trim();
            if (titleToSave !== title) {
                setTitle(titleToSave);
            }
        }

        const savedNote = await saveNote(titleToSave, body, noteId);
        setNoteId(savedNote.id); // Update ID if it was new
        
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
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
            <View style={[styles.center, { backgroundColor: theme.background }]}>
                <ActivityIndicator color={theme.text} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <Stack.Screen
                options={{
                    headerStyle: {
                        backgroundColor: theme.background,
                    },
                    headerTintColor: theme.text,
                    headerShadowVisible: false,
                    headerTitle: () => (
                <Text style={{ color: theme.secondaryText, fontSize: 14, fontWeight: "600" }}>
                    {saveStatus === "idle" ? "" : saveStatus === "saved" ? "Saved" : "Saving..."}
                </Text>
            ),
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleBack} style={{ marginLeft: -8, padding: 8 }}>
                            <Ionicons name="chevron-back" size={28} color={theme.text} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        id !== "new" && (
                            <TouchableOpacity onPress={handleDelete} style={{ padding: 8 }}>
                                <Ionicons name="trash-outline" size={24} color={theme.destructive} />
                            </TouchableOpacity>
                        )
                    ),
                }}
            />
            <TextInput
                style={[styles.titleInput, { color: theme.text }]}
                placeholder="Title"
                placeholderTextColor={theme.placeholder}
                value={title}
                onChangeText={setTitle}
                onBlur={handleSave}
            />
            <TextInput
                style={[styles.bodyInput, { color: theme.text }]}
                placeholder="Start writing..."
                placeholderTextColor={theme.placeholder}
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
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    titleInput: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        padding: 0,
    },
    bodyInput: {
        fontSize: 18,
        flex: 1,
        padding: 0,
        lineHeight: 28,
    },
});

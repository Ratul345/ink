import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Note } from '../utils/storage';
import { Theme } from '../utils/theme';

interface NoteListItemProps {
    note: Note;
    onLongPress?: (note: Note) => void;
    theme: Theme;
}

export default function NoteListItem({ note, onLongPress, theme }: NoteListItemProps) {
    return (
        <Link href={`/note/${note.id}`} asChild>
            <Pressable 
                style={[styles.container, { borderBottomColor: theme.border }]}
                onLongPress={() => onLongPress?.(note)}
                delayLongPress={500}
            >
                <View style={styles.content}>
                    <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                        {note.title || 'Untitled'}
                    </Text>
                    <Text style={[styles.date, { color: theme.secondaryText }]}>
                        {new Date(note.updatedAt).toLocaleDateString()}
                    </Text>
                </View>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        flex: 1,
        marginRight: 16,
    },
    date: {
        fontSize: 14,
    },
});

import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Note } from '../utils/storage';

interface NoteListItemProps {
    note: Note;
}

export default function NoteListItem({ note }: NoteListItemProps) {
    return (
        <Link href={`/note/${note.id}`} asChild>
            <Pressable style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title} numberOfLines={1}>
                        {note.title || 'Untitled'}
                    </Text>
                    <Text style={styles.date}>
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
        borderBottomColor: '#333',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#fff',
        flex: 1,
        marginRight: 16,
    },
    date: {
        fontSize: 14,
        color: '#888',
    },
});

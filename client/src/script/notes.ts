import { readonly, ref } from "vue"
import getAxios from "../plugins/axios"
import router from "../plugins/router.js";
import { Note, changeNote, updateNote } from "./noteEditor";
import { useCookies } from "vue3-cookies";

const notes = ref<Array<NoteType>>([])
const activeUser = ref(null);
const selected = ref(0)
const titleEditorActive = ref<boolean>(false)

export const titleInput = ref<string>()
export const showMenu = ref<boolean>(false)
export const Notes = readonly(notes)
export const Selected = readonly(selected)
export const ActiveUser = readonly(activeUser)
export const TitleEditorActive = readonly(titleEditorActive)

export const initNotes = async (selection?) => {
    titleEditorActive.value = false
    titleInput.value = ''
    // Ensure user access is restricted
    if (useCookies().cookies.isKey('authToken')) {
        getAxios().get('auth')
            .then(response => {
                if (response.data.valid)
                    activeUser.value = response.data.value
            }).catch((error) => {
                console.log(error)
                activeUser.value = null
            })
    } else {
        activeUser.value = null
    }
    // format data for dispaly
    await getAxios().get('notes')
        .then(result => {
            // Map notes to a new array for dispaly
            if (result.data.value.length > 0) {
                notes.value = result.data.value.map(note => ({
                    id: note.id,
                    title: note.title,
                    content: note.content,
                    route: note.route,
                    isPrivate: note.private,
                    authorId: note['user.id'],
                    authorName: note['user.username']
                }))
                // Set title to active note
            } else {
                // If there are no notes push a placeholder
                notes.value = [{
                    id: -1,
                    title: 'No notes found',
                    content: 'Login to create a note!',
                    route: '',
                    isPrivate: false,
                    authorId: -1,
                    authorName: '',
                    selectedIndex: -1
                }]
            }
        }).catch(error => console.log(error))

    // Find the index of the target note
    selected.value = 0;
    const targetNote = new URLSearchParams(window.location.search).get('id');
    if (notes.value[0].id !== -1 && selection === undefined && targetNote !== null) {
        notes.value.forEach((note, index) => {
            if (note.id === Number(targetNote)) {
                selected.value = index
            }
        })
    } else if (selection !== undefined) {
        selected.value = selection
        router.replace('/notes')
    }
    //update editor component
    changeNote(notes.value[selected.value], selected.value)
    showMenu.value = false
}

export const editTitle = (e) => {
    titleEditorActive.value = true;
}

export const saveTitle = (e: Event) => {
    titleEditorActive.value = false
    if (titleInput.value !== undefined || titleInput.value === '') {
        updateNote({
            id: Note.value.id,
            title: titleInput.value,
            content: Note.value.content,
            isPrivate: Note.value.isPrivate
        })
    }
}

export interface NoteType {
    id: number,
    title: string,
    content: string,
    route: string,
    isPrivate: boolean,
    authorName: string,
    authorId: number,
    selectedIndex: number
}
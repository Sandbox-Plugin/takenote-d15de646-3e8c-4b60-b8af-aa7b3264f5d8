import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SettingsState, ThemeModes } from '@/types'
import { NotesSortKey, DirectionText } from '@/utils/enums'

const settingsString = localStorage.getItem('settings')
const settings = settingsString ? JSON.parse(settingsString) : ''

export const initialState: SettingsState = {
  previewMarkdown: false,
  darkTheme: false,
  themeMode: ThemeModes.SYNC_BY_SYSTEM,
  sidebarVisible: true,
  notesSortKey: NotesSortKey.LAST_UPDATED_UP,
  codeMirrorOptions: {
    mode: 'gfm',
    theme: 'base16-light',
    lineNumbers: false,
    lineWrapping: true,
    styleActiveLine: { nonEmpty: true },
    viewportMargin: Infinity,
    keyMap: 'default',
    dragDrop: false,
    direction: DirectionText.LEFT_TO_RIGHT,
    scrollPastEnd: false,
  },
  isOpen: false,
  loading: false,
  color: settings.color != 'primary' ? settings.color : 'primary',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSettingsModal: (state) => {
      state.isOpen = !state.isOpen
    },

    updateCodeMirrorOption: (state, { payload }: PayloadAction<{ key: string; value: string }>) => {
      state.codeMirrorOptions[payload.key] = payload.value
    },

    togglePreviewMarkdown: (state) => {
      state.previewMarkdown = !state.previewMarkdown
    },

    toggleDarkTheme: (state, { payload }: PayloadAction<boolean | undefined>) => {
      if (payload !== undefined) {
        state.darkTheme = payload
      } else state.darkTheme = !state.darkTheme
    },
    changeThemeMode: (state, { payload }: PayloadAction<string>) => {
      state.themeMode = payload
    },

    updateNotesSortStrategy: (state, { payload }: PayloadAction<NotesSortKey>) => {
      state.notesSortKey = payload
    },

    loadSettings: (state) => {
      state.loading = true
    },

    loadSettingsError: (state) => {
      state.loading = false
    },

    loadSettingsSuccess: (state, { payload }: PayloadAction<SettingsState>) => {
      return { ...payload, loading: false, color: payload.color || 'primary' }
    },
    setColor: (state, { payload }: PayloadAction<string>) => {
      state.color = payload
    },
  },
})

export const {
  toggleSettingsModal,
  updateCodeMirrorOption,
  toggleDarkTheme,
  togglePreviewMarkdown,
  changeThemeMode,
  updateNotesSortStrategy,
  loadSettings,
  loadSettingsError,
  loadSettingsSuccess,
  setColor,
} = settingsSlice.actions

export default settingsSlice.reducer

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Eye,
  Edit,
  Star,
  Trash2,
  Download,
  RefreshCw,
  Loader,
  Settings,
  Clipboard as ClipboardCmp,
} from 'react-feather'

import { TestID } from '@resources/TestID'
import '@/styles/_variables.scss'
import { LastSyncedNotification } from '@/components/LastSyncedNotification'
import { NoteItem, CategoryItem } from '@/types'
import { toggleSettingsModal, togglePreviewMarkdown, setColor } from '@/slices/settings'
import { toggleFavoriteNotes, toggleTrashNotes } from '@/slices/note'
import { getCategories, getNotes, getSync, getSettings } from '@/selectors'
import { downloadNotes, isDraftNote, getShortUuid, copyToClipboard } from '@/utils/helpers'
import { sync } from '@/slices/sync'
import { NewThemeService } from '@/newThemeService'

export const NoteMenuBar = () => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { notes, activeNoteId } = useSelector(getNotes)
  const { categories } = useSelector(getCategories)
  const { syncing, lastSynced, pendingSync } = useSelector(getSync)
  const { darkTheme, color } = useSelector(getSettings)

  // ===========================================================================
  // Other
  // ===========================================================================

  const copyNoteIcon = <ClipboardCmp size={18} aria-hidden="true" focusable="false" />
  const successfulCopyMessage = 'Note copied!'
  const activeNote = notes.find((note) => note.id === activeNoteId)!
  const shortNoteUuid = getShortUuid(activeNoteId)

  // ===========================================================================
  // State
  // ===========================================================================

  const [uuidCopiedText, setUuidCopiedText] = useState<string>('')
  const [isToggled, togglePreviewIcon] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string>('primary')




  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    if (uuidCopiedText === successfulCopyMessage) {
      const timer = setTimeout(() => {
        setUuidCopiedText('')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [uuidCopiedText])

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _togglePreviewMarkdown = () => dispatch(togglePreviewMarkdown())
  const _toggleTrashNotes = (noteId: string) => dispatch(toggleTrashNotes(noteId))
  const _toggleFavoriteNotes = (noteId: string) => dispatch(toggleFavoriteNotes(noteId))
  const _sync = (notes: NoteItem[], categories: CategoryItem[]) =>
      dispatch(sync({ notes, categories }))
  const _toggleSettingsModal = () => dispatch(toggleSettingsModal())

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const downloadNotesHandler = () => downloadNotes([activeNote], categories)
  const favoriteNoteHandler = () => _toggleFavoriteNotes(activeNoteId)
  const trashNoteHandler = () => _toggleTrashNotes(activeNoteId)
  const syncNotesHandler = () => _sync(notes, categories)
  const settingsHandler = () => _toggleSettingsModal()
  const togglePreviewHandler = () => {
    togglePreviewIcon(!isToggled)
    _togglePreviewMarkdown()
  }

  const handleColorSelection = (color: string) => {
    setSelectedColor(color)
    console.log('color')
    console.log(color)
    dispatch(setColor(color))
    setIsOpen(false)
  }

  const colorsHandler = () => {
    console.log('color')
    console.log(color)
    setIsOpen(true)
  }

  return (
      <section className="note-menu-bar">
        {activeNote && !isDraftNote(activeNote) ? (
            <nav>
              <button
                  className="note-menu-bar-button"
                  onClick={togglePreviewHandler}
                  data-testid={TestID.PREVIEW_MODE}
              >
                {isToggled ? (
                    <Edit aria-hidden="true" size={18} />
                ) : (
                    <Eye aria-hidden="true" size={18} />
                )}
                <span className="sr-only">{isToggled ? 'Edit note' : 'Preview note'}</span>
              </button>
              {!activeNote.scratchpad && (
                  <>
                    <button className="note-menu-bar-button" onClick={favoriteNoteHandler}>
                      <Star aria-hidden="true" size={18} />
                      <span className="sr-only">Add note to favorites</span>
                    </button>
                    <button className="note-menu-bar-button trash" onClick={trashNoteHandler}>
                      <Trash2 aria-hidden="true" size={18} />
                      <span className="sr-only">Delete note</span>
                    </button>
                  </>
              )}
              <button className="note-menu-bar-button">
                <Download aria-hidden="true" size={18} onClick={downloadNotesHandler} />
                <span className="sr-only">Download note</span>
              </button>
              <button
                  className="note-menu-bar-button uuid"
                  onClick={() => {
                    copyToClipboard(`{{${shortNoteUuid}}}`)
                    setUuidCopiedText(successfulCopyMessage)
                  }}
                  data-testid={TestID.UUID_MENU_BAR_COPY_ICON}
              >
                {copyNoteIcon}
                {uuidCopiedText && <span className="uuid-copied-text">{uuidCopiedText}</span>}
                <span className="sr-only">Copy note</span>
              </button>
            </nav>
        ) : (
            <div />
        )}
        <nav>
          <LastSyncedNotification datetime={lastSynced} pending={pendingSync} syncing={syncing} />
          <button
              className="note-menu-bar-button"
              onClick={syncNotesHandler}
              data-testid={TestID.TOPBAR_ACTION_SYNC_NOTES}
          >
            {syncing ? (
                <Loader aria-hidden="true" size={18} className="rotating-svg" />
            ) : (
                <RefreshCw aria-hidden="true" size={18} />
            )}
            <span className="sr-only">Sync notes</span>
          </button>

          <NewThemeService />

          <div className="note-menu-bar-section-colors" style={{ position: 'relative', top: 6 }}>
            <button className={`note-menu-bar-button ${selectedColor}`} onClick={colorsHandler}>
              {selectedColor && color != 'primary' ? (
                  <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        backgroundColor: color,
                      }}
                  />
              ) : (
                  <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        backgroundColor: '#5183f5',
                      }}
                  />
              )}
              <span className="sr-only">Select Them Colors</span>
            </button>
            {isOpen ? (
                <div
                    style={{
                      position: 'absolute',
                      width: 30,
                      height: 100,
                      bottom: 95,
                      left: 10,
                    }}
                    className="color-box"
                >
                  <div
                      style={{
                        backgroundColor: '#ed2020',
                        width: 19,
                        height: '20%',
                        borderRadius: 27,
                        margin: '5px 0',
                      }}
                      className="color-option"
                      onClick={() => handleColorSelection('red')}
                  />
                  <div
                      style={{
                        backgroundColor: 'orange',
                        width: 19,
                        height: '20%',
                        borderRadius: 27,
                        margin: '5px 0',
                      }}
                      className="color-option"
                      onClick={() => handleColorSelection('orange')}
                  />
                  <div
                      style={{
                        backgroundColor: '#d9ac09',
                        width: 19,
                        height: '20%',
                        borderRadius: 27,
                        margin: '5px 0',
                      }}
                      className="color-option"
                      onClick={() => handleColorSelection('yellow')}
                  />
                  <div
                      style={{ backgroundColor: '#31b036', width: 19, height: '20%', borderRadius: 27 }}
                      className="color-option"
                      onClick={() => handleColorSelection('green')}
                  />
                  <div
                      style={{
                        backgroundColor: '#5183f5',
                        width: 19,
                        height: '20%',
                        borderRadius: 27,
                        margin: '5px 0',
                      }}
                      className="color-option"
                      onClick={() => handleColorSelection('primary')}
                  />
                  <div
                      style={{ backgroundColor: '#3c1694', width: 19, height: '20%', borderRadius: 27 }}
                      className="color-option"
                      onClick={() => handleColorSelection('purple')}
                  />
                </div>
            ) : (
                ''
            )}
          </div>

          <button className="note-menu-bar-button" onClick={settingsHandler}>
            <Settings aria-hidden="true" size={18} />
            <span className="sr-only">Settings</span>
          </button>
        </nav>
      </section>
  )
}

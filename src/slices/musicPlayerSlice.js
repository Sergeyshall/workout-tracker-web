import { createSlice } from '@reduxjs/toolkit';

const musicPlayerSlice = createSlice({
    name: 'musicPlayer',
    initialState: {
        isOpen: true,
        playlist: null,
        command: null, // 'play' | 'pause' | 'stop' | null — replaces EventEmitter
    },
    reducers: {
        toggleMusicPlayer(state) {
            state.isOpen = !state.isOpen;
        },
        setMusicPlayerPlaylist(state, action) {
            state.playlist = action.payload;
        },
        playMusic(state) {
            state.command = 'play';
        },
        pauseMusic(state) {
            state.command = 'pause';
        },
        stopMusic(state) {
            state.command = 'stop';
        },
        clearMusicCommand(state) {
            state.command = null;
        },
    },
});

export const {
    toggleMusicPlayer,
    setMusicPlayerPlaylist,
    playMusic,
    pauseMusic,
    stopMusic,
    clearMusicCommand,
} = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;

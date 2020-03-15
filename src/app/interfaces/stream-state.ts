
export interface StreamState {

    // FIELDS

    isPlaying: boolean;
    readableCurrentTime: string;
    readableDuration: string;
    duration: number | undefined;
    currentTime: number | undefined;
    canPlay: boolean;
    hasError: boolean;
}

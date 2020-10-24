import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as moment from 'moment';

import { AudioEvents } from '../enums/audio-events.enum';

import { StreamState } from '../interfaces/stream-state';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  // FIELDS

  private stop$ = new Subject ();
  private audio = new Audio ();

  private state: StreamState = {
    isPlaying: false,
    readableCurrentTime: '00:00:00',
    readableDuration: '00:00:00',
    duration: undefined,
    currentTime: undefined,
    canPlay: false,
    hasError: false
  };

  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject (this.state);

  // CONSTRUCTOR

  constructor() { }

  // HELPER FUNCTIONS

  private streamObservable(url: string) {
    return new Observable (observer => {
      this.audio.src = url;
      this.audio.load ();
      this.audio.play ();

      const HANDLER = (event: Event) => {
        this.updateStateEvents (event);
        observer.next (event);
      }

      this.addEvents (this.audio, HANDLER);

      return () => {
        this.audio.pause ();
        this.audio.currentTime = 0;

        this.removeEvents (this.audio, HANDLER);
        this.resetState ();
      };
    });
  }

  // adiciona eventos de audio com handler para objeto
  private addEvents(audio, handler) {
    for (const event in AudioEvents) {
      if (AudioEvents.hasOwnProperty (event)) {
        audio.addEventListener (AudioEvents[event], handler);
      }
    }
  }

  // remove eventos de audio com handler para objeto
  private removeEvents(audio, handler) {
    for (const event in AudioEvents) {
      if (AudioEvents.hasOwnProperty (event)) {
        audio.removeEventListener (event, handler);
      }
    }
  }

  private resetState() {
    this.state = {
      isPlaying: false,
      readableCurrentTime: '00:00:00',
      readableDuration: '00:00:00',
      duration: undefined,
      currentTime: undefined,
      canPlay: false,
      hasError: false
    };
  }

  private updateStateEvents(event: Event): void {
    switch (event.type) {

      case 'canplay': {
        this.state.duration = this.audio.duration;
        this.state.readableDuration = this.formatTime (this.state.duration);
        this.state.canPlay = true;
        break;
      }

      case 'playing': {
        this.state.isPlaying = true;
        break;
      }

      case 'pause': {
        this.state.isPlaying = false;
        break;
      }

      case 'timeupdate': {
        this.state.currentTime = this.audio.currentTime;
        this.state.readableCurrentTime = this.formatTime (this.state.currentTime);
        break;
      }

      case 'error': {
        this.resetState();
        this.state.hasError = true;
        break;
      }
    }

    this.stateChange.next (this.state);
  };

  public playStream(url: string) {
    return this.streamObservable (url).pipe (takeUntil (this.stop$));
  }

  public getState(): Observable<StreamState> {
    return this.stateChange.asObservable ();
  }

  public play() {
    this.audio.play ();
  }

  public pause() {
    this.audio.pause ();
  }

  public stop() {
    this.stop$.next ();
  }

  public seekTo(seconds: number) {
    this.audio.currentTime = seconds;
  }

  public formatTime(time: number, format: string = 'HH:mm:ss') {
    const MOMENT_TIME = (time * 1000);
    return moment.utc (MOMENT_TIME).format (format);
  }
}

import { Component } from '@angular/core';

import { StreamState } from 'src/app/interfaces/stream-state';

import { AudioService } from 'src/app/services/audio.service';
import { CloudService } from 'src/app/services/cloud.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {

  // FIELDS

  public files: Array<any> = []
  public state: StreamState;
  public currentFile: any = {};

  // CONSTRUCTOR

  constructor(
    private audioService: AudioService,
    private cloudService: CloudService
  ) {
    cloudService.getFiles ().subscribe (files => {
      this.files = files;
    });

    this.audioService.getState().subscribe (state => {
      this.state = state;
    })
   }

   // HELPER FUNCTIONS

  public isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  public isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  public openFile(file, index) {
    this.currentFile = { index, file };
    this.audioService.stop ();
    this.playStream (file.url);
  }

  public onSliderChangeEnd(change) {
    this.audioService.seekTo (change.value);
  }

  public previous() {
    const NEXT_INDEX = (this.currentFile.index - 1);
    const FILE = this.files[NEXT_INDEX];
    this.openFile (FILE, NEXT_INDEX);
  }

  public play() {
    this.audioService.play ();
  }

  public pause() {
    this.audioService.pause ();
  }

  public stop() {
    this.audioService.stop ();
  }

  public next() {
    const NEXT_INDEX = (this.currentFile.index + 1);
    const FILE = this.files[NEXT_INDEX];
    this.openFile (FILE, NEXT_INDEX);
  }

  public playStream(url: string) {
    this.audioService.playStream (url).subscribe (events => {

    });
  }

}

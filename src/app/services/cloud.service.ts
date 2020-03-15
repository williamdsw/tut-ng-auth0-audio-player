import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudService {

  // FIELDS

  private files: any = [
    {
      url: "https://ia801609.us.archive.org/16/items/nusratcollection_20170414_0953/Man%20Atkiya%20Beparwah%20De%20Naal%20Nusrat%20Fateh%20Ali%20Khan.mp3",
      name: "Man Atkeya Beparwah",
      artist: "Nusrat Fateh Ali Khan"
    },
  ];

  // CONSTRUCTOR

  constructor() { }

  // HELPER FUNCTIONS

  public getFiles() {
    return of (this.files);
  }
}

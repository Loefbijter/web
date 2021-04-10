import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivityImage } from './activity.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImagesService {

  public itemsTotal: number = undefined;

  public constructor(private readonly http: HttpClient) { }

  public getImages(): Observable<ActivityImage[]> {
    return this.http.get<ActivityImage[]>('https://images.loefbijter.nl/evenementen/images.json');
  }

}

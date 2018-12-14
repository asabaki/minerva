import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {FlashModel} from './flash_collection.model';

@Injectable({
  providedIn: 'root'
})
export class FlashCardService {

  subject = new Subject<any>();

  constructor(private http: HttpClient,
              private auth: AuthService) {
  }

  createCollection(title: string, description: string) {
    if (this.auth.getIsAuth()) {
      const userId = localStorage.getItem('userId');
      const card = {title, description, userId};
      this.http.post('http://localhost:3000/api/flash/add', card).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
      // console.log(title, description);
    }
  }

  fetchCol() {
    const userId = localStorage.getItem('userId');
    this.http.get<FlashModel[]>('http://localhost:3000/api/flash/fetch/' + userId)
      .pipe(map(res => {
        const ret = [];
        res.forEach((collection) => {
          ret.push({
            title: collection.title,
            description: collection.description,
            numberOfCard: collection.card.length
          });
        });
        return ret;
      }))
      .subscribe((res) => {
        console.log(res);
      this.subject.next(res);
    });
    return this.subject.asObservable();
  }
}

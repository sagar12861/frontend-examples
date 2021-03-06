import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/take";
import "rxjs/add/operator/repeat";
import "rxjs/add/observable/timer";
import "rxjs/add/observable/concat";
import "rxjs/add/observable/of";
import "rxjs/add/observable/dom/ajax";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/from";
import "rxjs/add/observable/fromEvent";

const input = document.getElementById("search");
const outputElement = document.getElementById("output");
const imageElement = document.getElementById("main-image");
const backgroundImge = document.getElementById("background-image");
const keywords$ = Observable.fromEvent(input, "keyup");


const imageLoads$ = keywords$.debounceTime(200)
  .switchMap(event =>
    Observable.ajax({
      url: `/api?keyword=${event.target.value}`,
      responseType: "json"
    }).catch(err => (err.xhr ? Observable.of(err) : Observable.of(".___.")))
  );

  const images$ = imageLoads$.switchMap(data => {
    let photos = data.response.photos;
    const photoResults =
      photos && photos.photo.length > 0 ? photos.photo : [{}];
    return Observable.timer(0, 5000)
      .take(photoResults.length)
      .map(index => photoResults[index])
      .repeat();
  });

images$.subscribe(output => {
  imageElement.style.backgroundImage = 
    `url('//farm${output.farm}.static.flickr.com/${output.server}/${output.id}_${output.secret}.jpg')`;
  document.getElementById("title").innerText = output.title || "";
});

images$.subscribe(output => {
  backgroundImge.style.backgroundImage =
    `url('//farm${output.farm}.static.flickr.com/${output.server}/${output.id}_${output.secret}.jpg')`;
});

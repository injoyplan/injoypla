import { Component } from '@angular/core';
import { DataLayerService } from './shared/Service/DataLayer.Service';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'injoyplan';
  constructor(private _router:Router, private _dataLayerService: DataLayerService)
  {

      this._router.events.subscribe(event=> { // subscribe to router events
          if (event instanceof NavigationEnd) //if our event is of our interest
          {
              this._dataLayerService.logPageView(event.url) //call our dataLayer service's page view method to ping home with the url value.
          }
      });

  }
}


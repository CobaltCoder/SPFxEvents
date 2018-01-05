import * as angular from 'angular';
import { IDataService, IEvent, IAttendee } from './interfaces-module';
import pnp, { List, ListEnsureResult, ItemAddResult, FieldAddResult } from "sp-pnp-js";

export default class HomeController {
  public isLoading: boolean = false;
  public newEvent: IEvent = null;
  public newToDoActive: boolean = false;
  public eventCollection: IEvent[] = [];
  public attendeeCollection: IAttendee[] = [];
  private showpastevents: boolean = false;
  public currentEmail: string = '';
  public newAttendeeEventID: number = 0;
  public newAttendeeFullName: string = '';
  public newAttendeeEmail: string = ';'

  public static $inject: string[] = ['DataService', '$window', '$rootScope'];

  constructor(private dataService: IDataService, private $window: angular.IWindowService, private $rootScope: angular.IRootScopeService) {
    const vm: HomeController = this;
    this.init();

    $rootScope.$on('configurationChanged', (event: angular.IAngularEvent, args: { showpastevents: boolean }): void => {
      vm.init(args.showpastevents);
    });
  }

  private init(showpastevents?: boolean): void {
    this.showpastevents = showpastevents;
    this.getCurrentEmail();
    this.loadEvents(showpastevents);
    this.loadAttendees(showpastevents);
  }

  private getCurrentEmail(): void {
    const vm: HomeController = this;
    this.isLoading = true;
    this.dataService.getCurrentEmail()
      .then((email: string): void => {
        vm.currentEmail = email;
      });
  }

  private RegisterAttendee(): void{
    const vm: HomeController = this;

    let attendee: IAttendee = {
      ID: 0,
      FullName1: vm.newAttendeeFullName,
      Email: vm.newAttendeeEmail,
      EventID: vm.newAttendeeEventID
    }

    this.dataService.addAttendee(attendee).then((iar: ItemAddResult) =>
      vm.attendeeCollection.push({
        ID: iar.data.ID,
        FullName1: vm.newAttendeeFullName,
        Email: vm.newAttendeeEmail,
        EventID: vm.newAttendeeEventID
      })
    );
  
    alert("Registered")
  }

  private AddEvent(): void{
    alert("Added");
  }

  private UpdateAttendee(ID: number): void{
    alert(ID);
  }

  private UpdateEvent(ID: number): void{
    alert(ID);
  }

  private DeleteAttendee(ID: number): void{
    alert(ID);
  }

  private DeleteEvent(ID: number): void{
    alert(ID);
  }

  private loadEvents(showpastevents?: boolean): void {
    const vm: HomeController = this;
    this.isLoading = true;
    this.dataService.getEvents(showpastevents)
      .then((events: IEvent[]): void => {
        vm.eventCollection = events;
      });
  }

  private loadAttendees(showpastevents?: boolean): void {
    const vm: HomeController = this;
    this.isLoading = true;
    this.dataService.getAttendees(showpastevents)
      .then((attendees: IAttendee[]): void => {
        vm.attendeeCollection = attendees;
      });
  }

  private addEvent(): void {
    const vm: HomeController = this;
    
    let event: IEvent;
    event.Title = 'Test';
    event.StartDate = new Date(2018, 1, 1).toDateString();
    event.EndDate = new Date(2018, 1, 1).toDateString();

    this.dataService.addEvent(event)
      .then((events: IEvent[]): void => {
        vm.eventCollection = events;
      });
  }

  private addAttendee(): void {
    const vm: HomeController = this;
    
    let attendeeEvent: IAttendee;
    attendeeEvent.FullName1 = 'Joe Jorden';

    this.dataService.addAttendee(attendeeEvent)
      .then((attendees: IAttendee[]): void => {
        vm.attendeeCollection = attendees;
      });
  }

  public deleteEvent(event: IEvent): void {
    if (this.$window.confirm('Are you sure you want to delete this event?')) {
      let index: number = -1;
      for (let i: number = 0; i < this.eventCollection.length; i++) {
        if (this.eventCollection[i].ID === event.ID) {
          index = i;
          break;
        }
      }

      if (index > -1) {
        this.eventCollection.splice(index, 1);
      }

      const vm: HomeController = this;

      this.dataService.deleteEvent(event)
        .then((): void => {
          this.dataService.getEvents(vm.showpastevents)
            .then((todos: any[]): void => {
              this.eventCollection = todos;
            });
        });
    }
  }

  public deleteAttendee(attendeeEvent: IAttendee): void {
    if (this.$window.confirm('Are you sure you want to delete this attendee?')) {
      let index: number = -1;
      for (let i: number = 0; i < this.attendeeCollection.length; i++) {
        if (this.attendeeCollection[i].ID === attendeeEvent.ID) {
          index = i;
          break;
        }
      }

      if (index > -1) {
        this.eventCollection.splice(index, 1);
      }

      const vm: HomeController = this;

      this.dataService.deleteAttendee(attendeeEvent)
        .then((): void => {
          this.dataService.getAttendees(vm.showpastevents)
            .then((attendeeEvents: IAttendee[]): void => {
              this.attendeeCollection = attendeeEvents;
            });
        });
    }
  }
}
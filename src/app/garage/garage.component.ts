import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: ['./garage.component.css']
})
export class GarageComponent implements OnInit {
  garage: AngularFirestoreDocument<any> = null;
  user: AngularFirestoreDocument<any> = null;
  items: Observable<any[]>;
  users: Observable<any[]>;
  vehicles = {};
  servicedata= {};
  customerId;
  // console.log(user);

  constructor(public db: AngularFirestore) {
    this.garage = db.collection('/garages').doc("7378956754");
    this.garage.valueChanges().subscribe(res => {
      console.log("garage", res)
      this.items = res;
      console.log(this.items["serviceRequests"])
      for (let id in this.items["serviceRequests"]) {
        db.collection('/users').doc(id).ref.get().then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            console.log("type", typeof doc.data());
            console.log("vehicle data is ",doc.data().vehicles[this.items["serviceRequests"][id]["vehicle"]])
            // console.log(doc.data().vehicles[this.items["serviceRequests"][id]["vehicle"];])
            this.vehicles[id] = doc.data().vehicles[this.items["serviceRequests"][id]["vehicle"]];
          } else {
            console.log("No such document!");
          }
        });
      }
      console.log("vehicle data is", this.vehicles)
    });

  }
  ngOnInit() {
  }
  
  viewJob = (user,vehicle)=>{
    console.log(vehicle);
    this.customerId = user;
    this.db.collection('/users').doc(user).ref.get().then((doc) => {
      if (doc.exists) {
        this.servicedata = doc.data()["requestedServices"][vehicle];
        console.log(this.servicedata)
        // console.log(doc.data().vehicles[this.items["serviceRequests"][id]["vehicle"];])
        // this.vehicles[id] = doc.data().vehicles[this.items["serviceRequests"][id]["vehicle"]];
      } else {
        console.log("No such document!");
      }
    });
  }

  rejectJob = (user,id="7378956754")=>{
    this.db.collection('/garages').doc(id).ref.get().then((doc) => {
      if (doc.exists) {
        let  services = doc.data()["serviceRequests"];
        delete services[user]
        this.db.collection('/garages').doc(id).update({serviceRequests:services})
        // console.log(doc.data().vehicles[this.items["serviceRequests"][id]["vehicle"];])
        // this.vehicles[id] = doc.data().vehicles[this.items["serviceRequests"][id]["vehicle"]];
      } else {
        console.log("No such document!");
      }
    });
  }

  acceptJob = (user,vehicle)=>{
    var garages;
    var garageid = "7378956754"
    this.db.collection('/users').doc(user).ref.get().then((doc)=>{
      garages = doc.data().requestedServices[vehicle]['garageList'];
      // console.log(garages[0]);
      garages.forEach(element => {
        if(element != garageid)
        {
          this.rejectJob(user,element)
        }
      });
    })
    // this.db.collection('/garages').doc("7378956754").ref.get().then((doc) => {
    //   if (doc.exists) {
    //     let  services = doc.data()["serviceRequests"];
    //     delete services[user]
    //     this.db.collection('/garages').doc("7378956754").update({serviceRequests:services})
    //     // console.log(doc.data().vehicles[this.items["serviceRequests"][id]["vehicle"];])
    //     // this.vehicles[id] = doc.data().vehicles[this.items["serviceRequests"][id]["vehicle"]];
    //   } else {
    //     console.log("No such document!");
    //   }
    // });
  }

}

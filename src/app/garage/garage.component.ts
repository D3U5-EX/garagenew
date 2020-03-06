import { Component, OnInit } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { log } from 'util';
@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: ['./garage.component.css']
})
export class GarageComponent implements OnInit {
  garage: AngularFirestoreCollection<any> = null;
  user: AngularFirestoreDocument<any> = null;
  items : Observable<any[]>;
  users : Observable<any[]>;
  // console.log(user);
  
  constructor(public db: AngularFirestore){
    this.garage = db.collection('/garages');
   db.collection('/users').doc('7758086415').ref.get().then(function(doc)
    {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        console.log("type",typeof doc.data());
        
        // this.user = doc.data();
        // console.log(typeof user);
      } else {
        console.log("No such document!");
      }
    });
    // this.users = this.user.valueChanges();
    this.items = this.garage.valueChanges();
    // console.log(this.user)
  }

  ngOnInit() {
  }

}

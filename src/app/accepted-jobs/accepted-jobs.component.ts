import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-accepted-jobs',
  templateUrl: './accepted-jobs.component.html',
  styleUrls: ['./accepted-jobs.component.css']
})
export class AcceptedJobsComponent implements OnInit {
  modalData = null;
  jobs = null;
  outDate = null;
  cost = null;
  garage: AngularFirestoreDocument<any> = null;
  user: AngularFirestoreDocument<any> = null;
  items:  Observable<any>;
  garageid = "7378956754";
  acceptedjobs={}
  acceptedjobsjob = {}
  constructor(public db: AngularFirestore) { 
    this.garage = db.collection('/garages').doc(this.garageid);
    this.garage.valueChanges().subscribe(res => {
      // console.log("garage", res)
      this.items = res;
      console.log(this.items["acceptedRequests"])
      for (let id in this.items["acceptedRequests"]) {
        console.log("getting info")
        db.collection('/services').doc(this.items["acceptedRequests"][id]["serviceId"]).ref.get().then((doc)=>{
          if(doc.exists)
          {
            this.acceptedjobs[this.items["acceptedRequests"][id]["serviceId"]]=doc.data()
            this.acceptedjobs[this.items["acceptedRequests"][id]["serviceId"]]["modifiedjobs"] = Object.keys(this.acceptedjobs[this.items["acceptedRequests"][id]["serviceId"]]["jobs"])
          }
          else{
            console.log("serviceId not found")
          }
        })


      }
      console.log(this.acceptedjobs)
      
    });
  }
  viewJob = (id)=>{
    this.acceptedjobsjob = this.acceptedjobs[id]
    this.acceptedjobsjob["serviceId"] = id
    
  }
  removeJob = (id)=>{
    delete this.acceptedjobsjob["jobs"][id]
  }
  addJob = ()=>{
    this.acceptedjobsjob["jobs"][this.jobs]= false
    this.jobs = null

  }
  startJob = ()=>{
    this.outDate = new Date(this.outDate);
    var outDate = this.outDate.getFullYear()+":"+(this.outDate.getMonth()+1)+":"+this.outDate.getDate()+":"+this.outDate.getHours()+":"+this.outDate.getMinutes()+":"+this.outDate.getSeconds()
    this.outDate = new Date()
    this.acceptedjobsjob["outDate"] = this.outDate;
    let serviceId = this.acceptedjobsjob["serviceId"]
    delete this.acceptedjobsjob["sesrviceId"] 
    this.items["ongoingRequests"][serviceId] = this.acceptedjobsjob
    this.garage.update({ongoingRequests:this.items["ongoingRequests"]}).then((res)=>{
      delete this.items["acceptedRequests"][serviceId]
    this.garage.update({acceptedRequests:this.items["acceptedRequests"]}).then(()=>{
      this.db.collection("/services").doc(serviceId).update({jobs:this.acceptedjobsjob["jobs"],cost:this.cost,outDate:this.acceptedjobsjob["outDate"]})
    })
    })
  }
  ngOnInit() {
  }

}

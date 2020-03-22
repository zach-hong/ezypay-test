import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import 'firebase/database';
import { FirebaseUUID } from './../../generators/firebase-uuid';

@Injectable({ providedIn: 'root' })
export class TestService {
    
    constructor(
        private af: AngularFireDatabase
    ) {}

    addSubscription(payload) {
        let firebaseUUID = FirebaseUUID.generate();
        return this.af.object(`subscription/${firebaseUUID}`).set(payload);
        // return Observable.create(observer => {
        //     this.af.object(`subscription`).set(payload).then(res => {
        //         console.log(res);
        //         observer.next(res);
        //     }).catch(err => {
        //         console.error(err);
        //         observer.error(err);
        //     });
        // });
    }

}
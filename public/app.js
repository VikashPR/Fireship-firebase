const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const SignInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provide = new firebase.auth.GoogleAuthProvider();

SignInBtn.onclick = () => auth.signInWithPopup(provide);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user){
        // signed in  
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName} ! </h3> <p>User ID: ${user.uid}</p>`;
    }else{    // Not siged in  
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = "";
    }
});

const db = firebase.firestore();

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');
let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
    if(user){
       thingsRef = db.collection('users');
       createThing.onclick = () => {
           console.log("clicked");
            const { serverTimestamp } = firebase.firestore.FieldValue;
            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
           });
       }
       unsubscribe = thingsRef 
       .where('uid', '==', user.uid)
       .onSnapshot(QuerrySnapshot => {
           const items = QuerrySnapshot.docs.map(doc => {
                return `<li>${doc.data().name}</li>`
           });
           thingsList.innerHTML = items.join('');
        });
    }
    else{ 
        unsubscribe && unsubscribe();
    }
})
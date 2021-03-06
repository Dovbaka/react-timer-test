import React, {useContext, useState, useEffect} from "react"
import app, {auth} from "../firebase"
import firebase from "firebase";


const AuthContext = React.createContext();


export function useAuth() {
    return useContext(AuthContext);
}

const googleProvider = new firebase.auth.GoogleAuthProvider();
const faceBookProvider = new firebase.auth.FacebookAuthProvider();

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    function signInWithGoogle() {
        return auth.signInWithPopup(googleProvider)
    }

    function signInWithFacebook() {
        return auth.signInWithPopup(faceBookProvider)
    }

    function logout() {
        return auth.signOut();
    }

    function getData(reference) {
        return app.database().ref().child(reference);
    }

    function setData(reference, data) {
        let updates = {};
        updates[reference] = data;
        return app.database().ref().update(updates);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })
        return unsubscribe;
    }, [])

    const value = {
        currentUser,
        login,
        signup,
        logout,
        signInWithGoogle,
        signInWithFacebook,
        getData,
        setData
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

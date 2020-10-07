import { auth, firestore, githubProvider } from "./firebase";
import { UserSchema } from "./schema";

export interface SignUpValues {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export async function loginWithGithub() {
    try {
        const { user } = await auth.signInWithPopup(githubProvider);
        // [TODO]: handle if no user doc (needs to signup)
        if (user) {
            console.log(user);
        } else {
            // handle error
        }
    } catch (error) {
        console.error(error.message);
    }
}

export async function login(email: UserSchema["email"], password: string) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        console.error(error.message);
        return error;
    }
}

export async function signupWithGithub(
    username: string,
    firstname: string,
    lastname: string
) {
    try {
        const { user } = await auth.signInWithPopup(githubProvider);
        if (user) {
            createUserDocument(user, username, firstname, lastname);
        } else {
            return "there was an error creating your account";
        }
    } catch (error) {
        console.error(error.message);
        return "there was an error creating your account";
    }
}

export async function signup(signUpValues: SignUpValues) {
    const { email, password, username, firstname, lastname } = signUpValues;
    try {
        if (!(await checkForValidUsername(username))) {
            return { type: "username", message: "username already in use" };
        }
        if (!(await checkForValidEmail(email))) {
            return "email already in use";
        }
        const { user } = await auth.createUserWithEmailAndPassword(
            email,
            password
        );
        if (user) {
            console.log(user);
            createUserDocument(user, username, firstname, lastname);
        }
    } catch (error) {
        console.error(error.message);
        return error;
    }
}

async function createUserDocument(
    user: firebase.User,
    username: string,
    firstname: string,
    lastname: string
) {
    const userRef = firestore().collection("users").doc(user.uid);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
        console.log("User document already exists");
    } else {
        console.log("Creating user document");
        console.log(user);
        const { uid, email } = user;
        userRef.set({
            uid,
            blurb: "",
            connections: [],
            darkMode: "auto",
            email,
            emailVerified: false,
            firstname,
            lastname,
            photoURL:
                user.photoURL ||
                "https://blacklivesmatter.com/wp-content/uploads/2017/07/BLM-logo.png",
            posts: [],
            score: 0,
            status: "online",
            username,
        });
    }
}

export function signOut() {
    // [TODO]: handle cleanup
    // cloud functions to handle users that don't explicity log out?

    auth.signOut();
}

export async function checkForValidUsername(username: string) {
    if (!username) return;
    const usersRef = await firestore()
        .collection("users")
        .where("username", "==", username)
        .get();
    return usersRef.empty;
}

export async function checkForValidEmail(email: string) {
    if (!email) return;
    const usersRef = await firestore()
        .collection("users")
        .where("email", "==", email)
        .get();
    return usersRef.empty;
}

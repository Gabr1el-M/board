import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB5iYnmIZakldQh6v56clRllsN_XjlgkwI",
  authDomain: "tarefas-project.firebaseapp.com",
  projectId: "tarefas-project",
  storageBucket: "tarefas-project.appspot.com",
  messagingSenderId: "932236821264",
  appId: "1:932236821264:web:521bfd63c87562674a1b95"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };
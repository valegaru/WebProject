import { useState } from 'react';
import { auth, db } from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, 'users', uid), {
            username,
            birthDate,
            email,
            profileCompleted: false
        });

        alert('Registro exitoso');
            } catch (error) {
                console.error(error.code, error.message);
            }
    };

    return (
    <>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="date" placeholder="Birthdate" onChange={(e) => setBirthDate(e.target.value)} />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
    </>
    );
};

export default Register;

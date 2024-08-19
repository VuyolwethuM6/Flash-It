// LoginSignup.tsx
import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonIcon, IonToast } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './Login.css';

const LoginSignup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showToast, setShowToast] = useState({ show: false, message: '' });
  const history = useHistory();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleAuthAction = async () => {
    try {
      if (isLogin) {
        // Log in user
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign up user
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await createUserWithEmailAndPassword(auth, email, password);
      }
        // Redirect to /home after successful login/signup
        history.push('/home');


    } catch (error: any) {
        console.error('Error during authentication:', error);
        setShowToast({ show: true, message: error.message });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Optionally redirect to another page upon successful login
      history.push('/home');
    } catch (error: any) {
        console.error('Error during authentication:', error);
        setShowToast({ show: true, message: error.message });
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="login-signup-container">
          <motion.h1 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn} 
            transition={{ duration: 0.5 }}
          >
            {isLogin ? 'Welcome,' : 'Create Account,'}
          </motion.h1>
          <motion.p 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isLogin ? 'Sign in to continue!' : 'Sign up to get started!'}
          </motion.p>
          
          <motion.div 
            className="form-container"
            initial="hidden" 
            animate="visible" 
            variants={fadeIn} 
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <IonInput 
              label="Email" 
              type="email" 
              placeholder="email@example.com" 
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
            <IonInput 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            />
            {!isLogin && (
              <IonInput 
                label="Confirm Password" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onIonChange={(e) => setConfirmPassword(e.detail.value!)}
              />
            )}
            
            <IonButton expand="block" className="custom-button" onClick={handleAuthAction}>
              {isLogin ? 'Login' : 'Sign Up'}
            </IonButton>
            
            <div className="social-buttons">
              <IonButton expand="block" fill="outline" className="google-button" onClick={handleGoogleLogin}>
                <IonIcon icon={logoGoogle} slot="start" />
                Connect with Google
              </IonButton>
            </div>
          </motion.div>
          
          <motion.p 
            className="switch-mode"
            initial="hidden" 
            animate="visible" 
            variants={fadeIn} 
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {isLogin ? "I'm a new user. " : "I'm already a member. "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </motion.p>
          
          <IonToast
            isOpen={showToast.show}
            onDidDismiss={() => setShowToast({ show: false, message: '' })}
            message={showToast.message}
            duration={2000}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginSignup;

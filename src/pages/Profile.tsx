import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonFooter,
  IonBadge,
  IonProgressBar,
  IonChip,
  IonButtons,
  IonBackButton,
  useIonAlert,
  useIonToast,
} from '@ionic/react';
import {
  personOutline,
  mailOutline,
  schoolOutline,
  statsChartOutline,
  ribbonOutline,
  trophyOutline,
  lockClosedOutline,
  cameraOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { doc, updateDoc,getDoc } from 'firebase/firestore';
import { updatePassword, getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db } from '../firebaseConfig';
import './Profile.css';

const ProfilePage: React.FC = () => {
  const history = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('User');
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [profilePicture, setProfilePicture] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const auth = getAuth();

  useEffect(() => {
    // Fetch the current user's profile data and set it in the state
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setName(userData.name);
          setEmail(userData.email);
          setPoints(userData.points);
          setProfilePicture(userData.profilePicture);
        }
      }
    };

    fetchUserProfile();
  }, [auth]);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          name: name,
          email: email,
          profilePicture: profilePicture,
        });
        presentToast({
          message: 'Profile updated successfully!',
          duration: 2000,
          color: 'success',
        });
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile:', error);
        presentToast({
          message: 'Error updating profile. Please try again.',
          duration: 2000,
          color: 'danger',
        });
      }
    }
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;
    if (user && password) {
      try {
        const credential = EmailAuthProvider.credential(user.email!, password); // Get credential for re-authentication
        await reauthenticateWithCredential(user, credential); // Re-authenticate user
        const newPassword = prompt('Enter your new password');
        if (newPassword) {
          await updatePassword(user, newPassword);
          presentToast({
            message: 'Password updated successfully!',
            duration: 2000,
            color: 'success',
          });
        }
      } catch (error) {
        console.error('Error updating password:', error);
        presentToast({
          message: 'Error updating password. Please try again.',
          duration: 2000,
          color: 'danger',
        });
      }
    } else {
      showAlert({
        header: 'Change Password',
        message: 'Please enter your current password before changing it.',
        buttons: ['OK'],
      });
    }
  };
  const viewAchievements = () => {
    console.log("Change screen to progress")
    history.push('/progress');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="profile-header">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Learner Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            <img src={profilePicture} alt="Profile" />
          </div>
          <IonButton fill="clear" className="change-photo-button">
            <IonIcon slot="icon-only" icon={cameraOutline} />
          </IonButton>
          <h2>{name}</h2>
          <IonChip color="primary">
            <IonIcon icon={schoolOutline} />
            <IonLabel>{level}</IonLabel>
          </IonChip>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <IonIcon icon={statsChartOutline} />
            <span>{points}</span>
            <small>Points</small>
          </div>
          <div className="stat-item">
            <IonIcon icon={ribbonOutline} />
            <span>{streak}</span>
            <small>Day Streak</small>
          </div>
        </div>

        <IonProgressBar value={0.7}></IonProgressBar>
        <p className="progress-label">70% to next level</p>

        <div className="profile-fields">
          <IonItem lines="full">
            <IonIcon slot="start" icon={personOutline} />
            {isEditing ? (
              <IonInput value={name} onIonChange={(e) => setName(e.detail.value!)} placeholder="Name" />
            ) : (
              <IonLabel>{name}</IonLabel>
            )}
          </IonItem>

          <IonItem lines="full">
            <IonIcon slot="start" icon={mailOutline} />
            {isEditing ? (
              <IonInput value={email} onIonChange={(e) => setEmail(e.detail.value!)} placeholder="Email" />
            ) : (
              <IonLabel>{email}</IonLabel>
            )}
          </IonItem>

          <IonItem lines="full">
            <IonIcon slot="start" icon={lockClosedOutline} />
            <IonLabel>Password</IonLabel>
            {isEditing && (
              <IonButton fill="clear" slot="end" onClick={handleChangePassword}>
                Change
              </IonButton>
            )}
          </IonItem>

          <IonItem lines="full">
            <IonIcon slot="start" icon={schoolOutline} />
            <IonLabel>Current Level</IonLabel>
            <IonBadge color="primary" slot="end">
              {level}
            </IonBadge>
          </IonItem>
        </div>

        <IonButton
  expand="block"
  className="edit-profile-button"
  onClick={isEditing ? handleSaveChanges : toggleEdit}
>
  {isEditing ? 'Save Changes' : 'Edit Profile'}
</IonButton>


        <IonButton expand="block" className="achievements-button" onClick={viewAchievements}>
          <IonIcon slot="start" icon={trophyOutline} />
          View Achievements
        </IonButton>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton expand="block" className="logout-button">
            Logout
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ProfilePage;

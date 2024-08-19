import React from 'react';
import { IonContent, IonPage, IonIcon, IonText } from '@ionic/react';
import { build } from 'ionicons/icons';
import './UnderConstruction.css'; // Import the CSS for styling

const UnderConstruction: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="under-construction">
        <div className="content">
          <IonIcon icon={build} className="icon" />
          <IonText className="title">Under Construction</IonText>
          <IonText className="description">
            We're working hard to get this page ready. Please check back later.
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UnderConstruction;

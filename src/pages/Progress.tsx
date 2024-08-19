import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Progress: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Progress</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Progress</IonTitle>
          </IonToolbar>
        </IonHeader>
        
      </IonContent>
    </IonPage>
  );
};

export default Progress;
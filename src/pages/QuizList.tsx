import React, { useEffect, useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonContent, IonPage, IonCol} from '@ionic/react';
import { useIonRouter } from '@ionic/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import your Firebase config
import { useHistory } from 'react-router-dom';

const QuizList: React.FC = () => {
  const history = useHistory();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const router = useIonRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizCollection = collection(db, 'quizzes');
        const quizSnapshot = await getDocs(quizCollection);
        const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched Quizzes:', quizList);
        setQuizzes(quizList);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
  
    fetchQuizzes();
  }, []);
  

  const handleQuizClick = (quizId: string) => {
    history.push(`/quiz/${quizId}`);
  };

  return (
    <IonPage>
      <IonContent>
      <IonCol size="6" className="category-col">
        {quizzes.map(quiz => (
          <IonCard className="category-card" key={quiz.id} onClick={() => handleQuizClick(quiz.id)}>
            <IonCardHeader>
              <IonCardTitle>{quiz.topic}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {`Total Points: ${quiz.totalPoints}`}
            </IonCardContent>
          </IonCard>
        ))}
        </IonCol>
      </IonContent>
    </IonPage>
  );
};

export default QuizList;

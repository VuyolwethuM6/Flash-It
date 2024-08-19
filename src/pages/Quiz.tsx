import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonRadioGroup, IonRadio, IonItem, IonLabel, IonButton } from '@ionic/react';
import { doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import your Firebase config

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quizData, setQuizData] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchQuizData = async () => {
      const quizDoc = doc(db, 'quizzes', quizId);
      const quizSnapshot = await getDoc(quizDoc);

      if (quizSnapshot.exists()) {
        const quiz = quizSnapshot.data();
        const questions = await Promise.all(
          quiz.questions.map(async (questionRef: any) => {
            const questionDoc = await getDoc(questionRef);
            return questionDoc.data();
          })
        );
        setQuizData({ ...quiz, questions });
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = () => {
    // Handle quiz submission logic
    console.log('Submitted answers:', answers);
  };

  return (
    <IonPage>
      <IonContent>
        {quizData && quizData.questions.map((question: any, index: number) => (
          <IonCard key={index}>
            <IonCardHeader>
              <IonCardTitle>{question.question}</IonCardTitle>
            </IonCardHeader>
            <IonRadioGroup value={answers[index]} onIonChange={e => handleAnswerChange(index, e.detail.value)}>
              {question.options.map((option: string, optIndex: number) => (
                <IonItem key={optIndex}>
                  <IonLabel>{option}</IonLabel>
                  <IonRadio slot="start" value={option} />
                </IonItem>
              ))}
            </IonRadioGroup>
          </IonCard>
        ))}
        <IonButton expand="block" onClick={handleSubmit}>Submit Quiz</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default QuizPage;

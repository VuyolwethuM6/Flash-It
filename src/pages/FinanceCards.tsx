import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import { arrowBack, arrowForward } from 'ionicons/icons';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './FinanceCards.css';

const Flashcards: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState('next');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        // Get the reference to the subject document
        const subjectRef = doc(db, 'subjects', categoryName);

        // Query flashcards where the 'subject' field matches the subject reference
        const q = query(collection(db, 'flashcards'), where('subject', '==', subjectRef));
        const querySnapshot = await getDocs(q);

        // Log the query results for debugging
        console.log('Flashcards query results:', querySnapshot.docs.map(doc => doc.data()));

        const flashcardData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFlashcards(flashcardData);
      } catch (error) {
        console.error("Error fetching flashcards: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [categoryName]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setDirection('next');
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setDirection('prev');
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar className="custom-toolbar">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" icon={arrowBack} text="" className="custom-back-button" />
            </IonButtons>
            <IonTitle className="custom-title">{categoryName} Flashcards</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <div className="loading-container">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="custom-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" icon={arrowBack} text="" className="custom-back-button" />
          </IonButtons>
          <IonTitle className="custom-title">{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Flashcards</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {flashcards.length === 0 ? (
          <div className="no-flashcards-container">No flashcards found for {categoryName}</div>
        ) : (
          <div className="flashcard-container">
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={currentCard}
                addEndListener={(node, done) => {
                  node.addEventListener("transitionend", done, false);
                }}
                classNames={direction}
              >
                <IonCard className="flashcard" onClick={handleFlip}>
                  <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
                    <IonCardContent className="flashcard-front">
                      <div className="keyword">{flashcards[currentCard].question}</div>
                    </IonCardContent>
                    <IonCardContent className="flashcard-back">
                      <div className="definition">{flashcards[currentCard].answer}</div>
                    </IonCardContent>
                  </div>
                </IonCard>
              </CSSTransition>
            </SwitchTransition>
          </div>
        )}
        <div className="navigation-buttons">
          <IonButton fill="clear" onClick={handlePrev}>
            <IonIcon icon={arrowForward} style={{ transform: 'rotate(180deg)' }} />
            Prev
          </IonButton>
          <IonButton className="next-button" onClick={handleNext}>
            Next
            <IonIcon slot="end" icon={arrowForward} />
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Flashcards;







// import React, { useState } from 'react';
// import {
//   IonContent,
//   IonHeader,
//   IonPage,
//   IonToolbar,
//   IonButtons,
//   IonBackButton,
//   IonTitle,
//   IonCard,
//   IonCardContent,
//   IonButton,
//   IonIcon,
// } from '@ionic/react';
// import { arrowBack, arrowForward } from 'ionicons/icons';
// import { CSSTransition, SwitchTransition } from 'react-transition-group';
// import './FinanceCards.css';

// const flashcards = [
//   { keyword: 'Interest', definition: 'The cost of borrowing money, typically expressed as a percentage of the amount borrowed.', color: '#4A90E2' },
//   { keyword: 'Inflation', definition: 'A general increase in prices and fall in the purchasing value of money.', color: '#50E3C2' },
//   { keyword: 'Compound', definition: 'Interest calculated on the initial principal and accumulated interest of previous periods.', color: '#F5A623' },
//   { keyword: 'Simple', definition: 'Interest calculated only on the principal amount, not on accumulated interest.', color: '#D0021B' },
// ];

// const FinanceCards: React.FC = () => {
//   const [currentCard, setCurrentCard] = useState(0);
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [direction, setDirection] = useState('next');

//   const handleFlip = () => {
//     setIsFlipped(!isFlipped);
//   };

//   const handleNext = () => {
//     setDirection('next');
//     setIsFlipped(false);
//     setCurrentCard((prev) => (prev + 1) % flashcards.length);
//   };

//   const handlePrev = () => {
//     setDirection('prev');
//     setIsFlipped(false);
//     setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
//   };

//   return (
//     <IonPage>
//       <IonHeader className="ion-no-border">
//         <IonToolbar className="custom-toolbar">
//           <IonButtons slot="start">
//             <IonBackButton defaultHref="/home" icon={arrowBack} text="" className="custom-back-button" />
//           </IonButtons>
//           <IonTitle className="custom-title">Finance Flashcards</IonTitle>
//         </IonToolbar>
//       </IonHeader>
//       <IonContent fullscreen className="ion-padding">
//         <div className="flashcard-container">
//           <SwitchTransition mode="out-in">
//             <CSSTransition
//               key={currentCard}
//               addEndListener={(node, done) => {
//                 node.addEventListener("transitionend", done, false);
//               }}
//               classNames={direction}
//             >
//               <IonCard className="flashcard" onClick={handleFlip}>
//                 <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
//                   <IonCardContent className="flashcard-front" style={{ backgroundColor: flashcards[currentCard].color }}>
//                     <div className="keyword">{flashcards[currentCard].keyword}</div>
//                   </IonCardContent>
//                   <IonCardContent className="flashcard-back" >
//                     <div className="definition">{flashcards[currentCard].definition}</div>
//                   </IonCardContent>
//                 </div>
//               </IonCard>
//             </CSSTransition>
//           </SwitchTransition>
//         </div>
//         <div className="navigation-buttons">
//           <IonButton fill="clear" onClick={handlePrev}>
//             <IonIcon icon={arrowForward} style={{ transform: 'rotate(180deg)' }} />
//             Prev
//           </IonButton>
//           <IonButton className="next-button" onClick={handleNext}>
//             Next
//             <IonIcon slot="end" icon={arrowForward} />
//           </IonButton>
//         </div>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default FinanceCards;
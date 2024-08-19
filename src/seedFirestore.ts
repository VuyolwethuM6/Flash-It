// seedFirestore.ts

import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';  // Import Firebase Authentication


const seedFirestore = async () => {
    // Your seeding code here...

    const db = getFirestore();
    const auth = getAuth();

    const addUser = async (uid: string, name: string, email: string, profilePicture: string) => {
        await setDoc(doc(db, 'users', uid), {
            name: name,
            email: email,
            profilePicture: profilePicture,
            points: 0,  // Initialize points to 0 or another default value
            joinedDate: new Date(),
            achievements: [],
            quizHistory: []
        });
    };

    const addSubjects = async () => {
        await setDoc(doc(db, 'subjects', 'finance'), {
            name: 'Finance',
            description: 'Learn the basics of finance',
            icon: 'https://bub.bh/wp-content/uploads/2018/02/image-placeholder.jpg'
        });

        await setDoc(doc(db, 'subjects', 'analytical'), {
            name: 'Analytical',
            description: 'Sharpen your analytical skills',
            icon: 'https://bub.bh/wp-content/uploads/2018/02/image-placeholder.jpg'
        });

        return { finance: 'finance', analytical: 'analytical' };
    };

    const addFlashcards = async (uid: string) => {
        const financeCardId = 'finance-time-value-money';
        await setDoc(doc(db, 'flashcards', financeCardId), {
            subject: doc(db, 'subjects', 'finance'),
            topic: 'Basics of Finance',
            question: 'What is the time value of money?',
            answer: 'The time value of money is the concept that money available today is worth more than the same amount in the future.',
            difficulty: 'Easy',
            createdBy: doc(db, 'users', uid),
            createdAt: new Date()
        });

        const analyticalCardId = 'analytical-sequence';
        await setDoc(doc(db, 'flashcards', analyticalCardId), {
            subject: doc(db, 'subjects', 'analytical'),
            topic: 'Logic Puzzles',
            question: 'What is the next number in the sequence 2, 4, 8, 16?',
            answer: '32',
            difficulty: 'Medium',
            createdBy: doc(db, 'users', uid),
            createdAt: new Date()
        });

        return [financeCardId, analyticalCardId];
    };

    const addQuiz = async (uid: string) => {
        const quizId = 'quiz-finance-basics';
        await setDoc(doc(db, 'quizzes', quizId), {
            subject: doc(db, 'subjects', 'finance'),
            topic: 'Finance Basics',
            questions: [doc(db, 'flashcards', 'finance-time-value-money')],
            totalPoints: 10,
            createdBy: doc(db, 'users', uid),
            createdAt: new Date()
        });

        return quizId;
    };

    const addAchievement = async () => {
        const achievementId = 'achievement-first-quiz';
        await setDoc(doc(db, 'achievements', achievementId), {
            name: 'First Quiz Completed',
            description: 'Complete your first quiz',
            icon: 'https://bub.bh/wp-content/uploads/2018/02/image-placeholder.jpg',
            criteria: 'Complete one quiz'
        });

        return achievementId;
    };

    const seedFirestore = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const uid = currentUser.uid;
            const name = currentUser.displayName || 'Anonymous';
            const email = currentUser.email || '';
            const profilePicture = currentUser.photoURL || 'https://bub.bh/wp-content/uploads/2018/02/image-placeholder.jpg';

            await addUser(uid, name, email, profilePicture);

            const { finance, analytical } = await addSubjects();
            await addFlashcards(uid);
            await addQuiz(uid);
            await addAchievement();

            console.log('Firestore seeding completed!');
        } else {
            console.log('No user is currently authenticated.');
        }
    };

    // Run the seeding function
    seedFirestore().catch(console.error);

  };
  
  export default seedFirestore;
  
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = savedTheme;
    document.getElementById('themeToggle').textContent = savedTheme === 'dark' ? '🌞' : '🌙';
}

function toggleTheme() {
    const isDark = document.body.dataset.theme === 'dark';
    document.body.dataset.theme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    document.getElementById('themeToggle').textContent = isDark ? '🌙' : '🌞';
}

if(window.location.pathname.includes('quiz.html')) {
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let questions = [];
    let selectedQuestions = [];

    const elements = {
        question: document.getElementById('question'),
        options: document.getElementById('options'),
        timer: document.getElementById('timer'),
        score: document.getElementById('score'),
        nextBtn: document.getElementById('nextBtn'),
        finishBtn: document.getElementById('finishBtn'),
        questionNumber: document.getElementById('question-number')
    };

    async function loadQuestions() {
        try {
            const response = await fetch('questions.json');
            questions = await response.json();
            selectedQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
            showQuestion();
        } catch (error) {
            alert('Sorular yüklenirken bir hata oluştu.');
        }
    }

    function showQuestion() {
        clearInterval(timer);
        startTimer();
        
        const question = selectedQuestions[currentQuestionIndex];
        elements.question.textContent = question.soru;
        elements.options.innerHTML = '';
        
        elements.questionNumber.textContent = 
            currentQuestionIndex === selectedQuestions.length - 1 
            ? 'Son Soru' 
            : `Soru ${currentQuestionIndex + 1}`;

        question.secenekler.forEach((option, index) => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
            div.onclick = () => checkAnswer(String.fromCharCode(65 + index));
            elements.options.appendChild(div);
        });

        elements.nextBtn.classList.add('hidden');
        elements.finishBtn.classList.add('hidden');
        if(currentQuestionIndex === selectedQuestions.length - 1) {
            elements.finishBtn.classList.remove('hidden');
        } else {
            elements.nextBtn.classList.remove('hidden');
        }
    }

    function startTimer() {
        let timeLeft = 15;
        elements.timer.textContent = timeLeft;
        
        timer = setInterval(() => {
            timeLeft--;
            elements.timer.textContent = timeLeft;
            
            if(timeLeft <= 0) {
                clearInterval(timer);
                handleNextQuestion();
            }
        }, 1000);
    }

    function checkAnswer(selectedAnswer) {
        clearInterval(timer);
        const correctAnswer = selectedQuestions[currentQuestionIndex].cevap;
        const options = document.querySelectorAll('.option');
        
        options.forEach((option, index) => {
            const answer = String.fromCharCode(65 + index);
            option.style.pointerEvents = 'none';
            
            if(answer === correctAnswer) {
                option.classList.add('correct');
            } else if(answer === selectedAnswer) {
                option.classList.add('wrong');
            }
        });
        
        if(selectedAnswer === correctAnswer) {
            score += 10;
            elements.score.textContent = score;
        }
        
        elements.nextBtn.classList.remove('hidden');
    }

    function handleNextQuestion() {
        currentQuestionIndex++;
        if(currentQuestionIndex < selectedQuestions.length) {
            showQuestion();
        } else {
            endQuiz();
        }
    }

    function endQuiz() {
        localStorage.setItem('quizScore', score);
        window.location.href = 'result.html';
    }

    elements.nextBtn.addEventListener('click', handleNextQuestion);
    elements.finishBtn.addEventListener('click', endQuiz);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    loadQuestions();
}

if(window.location.pathname.includes('result.html')) {
    document.getElementById('final-score').textContent = localStorage.getItem('quizScore') || 0;
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
initializeTheme();
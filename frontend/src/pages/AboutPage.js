import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import queen from "../images/queen.jpg";
import webtoon from "../images/webtoon.png";
import lezhin from "../images/lezhin.png";
import screenshot from "../images/screenshot.jpg";
import mtoon from "../images/m-toon.jpg";

function AboutPage() {

const quizData = [
{
question: "What country did manga originate from?",
options: ["China", "Japan", "Korea", "Thailand"],
answer: 1
},
{
question: "Manhwa is a type of comic that comes from which country?",
options: ["Japan", "China", "South Korea", "Vietnam"],
answer: 2
},
{
question: "What is manhua primarily associated with?",
options: [
"Japanese comics",
"Korean webcomics",
"Chinese comics",
"American graphic novels"
],
answer: 2
},
{
question: "Which format is MOST commonly read vertically on mobile devices?",
options: ["Manga", "Manhwa", "Western Comics", "Graphic Novels"],
answer: 1
},
{
question: "Which of the following is a popular platform for reading manhwa?",
options: ["Shonen Jump", "WEBTOON", "Crunchyroll", "Netflix"],
answer: 1
}
];

const [started, setStarted] = useState(false);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
const [score, setScore] = useState(0);
const [result, setResult] = useState("");
const [quizFinished, setQuizFinished] = useState(false);

const currentQuestion = quizData[currentQuestionIndex];

const startQuiz = () => {
setStarted(true);
};

const selectOption = (index) => {
setSelectedOptionIndex(index);
};

const submitAnswer = () => {

if (selectedOptionIndex === null) return;

if (selectedOptionIndex === currentQuestion.answer) {
setScore(score + 1);
setResult("Correct!");
} else {
setResult(`Wrong! Correct answer: ${currentQuestion.options[currentQuestion.answer]}`);
}

setTimeout(() => {

const next = currentQuestionIndex + 1;

if (next < quizData.length) {
setCurrentQuestionIndex(next);
setSelectedOptionIndex(null);
setResult("");
} else {
setQuizFinished(true);
}

},1500);

};

return (
<div>
    <Header />
<br/>
<section className="head2">
<h2>What I Love About Manga, Manhwa, and Manhua?</h2>
<div className="container">
<p>
<span>I</span> love manga, manhwa, and manhua because each of them has their own unique style, not just in art but also in the storylines. Sometimes they have similarities, but you can still tell which is which. What I really love is that the stories I’ve read so far usually have deep plots that make me read nonstop. I also enjoy how each one can surprise me with unexpected twists and memorable moments, and gives exciting adventures and characters that I can’t stop thinking about. They always leave me wanting more and keep me coming back for the next story. Each story saved me one way or another, these made me think "Oh, I can't read anymore if I did that". They brightened my thoughts and perspective and without them, I don't think I will be who I am today.
</p>
</div>
</section>
<br/>
<section className="head2">
<h2>My Journey</h2>
<div className="container">
<p>
We need to go back in 2018, in 2018 I'm still not into readng Manga, Manhwa, and Manhua. I started in watching Anime but it chnages in 2019 when I discover Manga, yes my first is a Manga, unfortunately I don't remember which story is it.
</p>
<br/>
<p>
In 2019 I started reading and still counting. Because of the pandemic I became somehow addicted on reading even though I'm not before and it eventually became a habit and that habit became my source of life. There was no day that I never read at least once.
</p>
<br/>
<p>
Between 2021-2022 are my hardest struggles, I won't deep dive into it but the only thing that made me fight those struggles are by reading stories, they are my escape and comfort.
</p>
<br/>
<p>
Because of these I also kinda, yes kinda wrote a story and I was also uploaded in one of the App I used to read but unfortunately I never finish it. Neverthless I did enjoy that era of me.
</p>
<br/>
<p>
Recently, I enjoy reading Manhwa more compared the other two, maybe because of the art style? But it doesn't mean I don't enjoy the other two. Usually it depends on my mode which type to read, all in all I enjoy everything as long as the story is good.
</p>
</div>
</section>
<br/>
<div className="key">
<p>Learning and Improvement</p>
</div>
<div className="container2">
<img src={queen} alt="butterfly" className="img-highlights"/>
<div className="con-txt">
<ol>
<li>Between year 2021 I started improving my self-steem.</li>
<li>Learning and understanding english language better.</li>
<li>Learned how to be more open minded to everything for example respecting different cultures.</li>
<li>I realized and gain a lot of knowledge on different things.</li>
</ol>
</div>
</div>
<br/>
<hr className="hori"/>
<br/><br/>
<div className="text1">
<p>This is where I read sometimes</p>
</div>
<br/>
<div className="img-con">
<img src={webtoon} alt="Webtoon" className="img"/>
<img src={lezhin} alt="Lezhin" className="img"/>
</div>
<br/><br/>
<div className="text1">
<p>My recent screenshot and My own Bookmarked List</p>
</div>
<br/>
<div className="img-con">
<img src={screenshot} alt="Screenshot" className="img"/>
<img src={mtoon} alt="Mangatoon" className="img"/>
</div>
<br/>
<hr className="hori"/>
<br/>
<div>
<blockquote>
“I don’t just read these stories, I live them. Every cliffhanger keeps me awake at 3 a.m.”
</blockquote>
</div>

<br/>
<hr className="hori"/>
<br/>
<div className="quiz-container">
{!started && (
<div id="start-screen">
<h2>Easy Question Game!</h2>
<p>Ready to test your knowledge?</p>
<button className="main-btn" onClick={startQuiz}>Start</button>
</div>
)}

{started && !quizFinished && (
<div id="quiz-content">
<h2 id="question">{currentQuestion.question}</h2>
<div className="options">
{currentQuestion.options.map((option,index)=>(
<div
key={index}
className={`option ${selectedOptionIndex === index ? "selected" : ""}`}
onClick={()=>selectOption(index)}
>
{option}
</div>
))}

</div>
<button
id="submitBtn"
onClick={submitAnswer}
disabled={selectedOptionIndex === null}
>
Submit Answer
</button>
<div id="result">{result}</div>
</div>
)}

{quizFinished && (
<div>
<h2>Quiz Complete!</h2>
<p>Your final score is {score} out of {quizData.length}</p>
</div>
)}
</div>
<br/>
 <Footer />
</div>
);
}

export default AboutPage;
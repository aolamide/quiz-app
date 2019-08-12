import React, {Component} from 'react';
import Questions from './Questions';

class QuizPage extends Component {
    constructor({match}){
        super()
        this.state = {
            quizId : match.params.quizId,
            quiz : null,
            quizCreator : null,
            starting : false,
            user : ''
        }
        console.log(this.state.quizId);
    }
   
    componentDidMount() {
        fetch(`https://lalaquiz.herokuapp.com/api/v1/quiz/${this.state.quizId}`)
        .then(res => res.json())
        .then(data => {
            const { created, name, duration,  creator } = data.quizDetails;
            this.setState({
                quiz : {created, name, duration},
                quizCreator : creator
            })
        })
    }

    fetchQuestions = (e) => {
        e.preventDefault()
        fetch(`https://lalaquiz.herokuapp.com/api/v1/quiz/${this.state.quizId}/take`)
        .then(res => res.json())
        .then(data => {
            this.setState({
                quiz : data.quiz,
                starting: true,
                modalHidden : true,
                user : this.user.value
            })
        })
    }

    submitAnswers = (e) => {
        e.preventDefault();
        let inputNames = [];
        this.state.quiz.questions.forEach(question => {
            inputNames.push(question._id)
        });
        console.log(inputNames);
        // let answersInputs = document.querySelectorAll(`input`);
        let answers = []
        ;
        inputNames.forEach(name => {
            answers.push(document.forms[0][`q${name}`].value)
        });
        console.log(answers);
        fetch(`https://lalaquiz.herokuapp.com/api/v1/submit/${this.state.quiz._id}`, {
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({answers, takenBy : this.state.user}),
        })
        .then(res => res.json())
        .then(data => console.log(`${data.result.name}, you got ${data.result.score} questions right out of ${data.maxScore}`))
    }
   
    displayModal = () => {
        this.popup.style.display = "block";
    }

    render(){
        if(this.state.quiz) {
            console.log(this.state.quiz);
            const {name, duration, created} = this.state.quiz;
            const { name : creatorName } = this.state.quizCreator;
            if (!this.state.starting) {
                return (
                    <div>
                        <h1>{name}</h1>
                        <p>Created by {creatorName}</p>
                        <h2>Duration :{duration}</h2>
                        <h3>Created :{new Date(created).toDateString()}</h3>
                        <div>
                            <button onClick = {this.displayModal}>TAKE QUIZ</button>
                        </div>  
                        <div ref = {elem => this.popup = elem} className="popup">
                            <form onSubmit= {this.fetchQuestions}>
                                <input required ref={elem => this.user = elem} minLength="3" type="text" placeholder="Enter Name"/>
                                <button type="submit" >START</button>
                            </form>
                        </div>
                    </div>
                );
            }
            if(this.state.starting) {
                return (
                    <form>
                        <Questions questions = {this.state.quiz.questions} />
                        <button onClick = {this.submitAnswers}>SUBMIT QUIZ</button>
                    </form>
                )
            }
        }
        return <div></div>
    }
}

export default QuizPage;
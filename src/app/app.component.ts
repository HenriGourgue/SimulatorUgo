import { Component, ElementRef, ViewChild } from '@angular/core';
import { interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Simulator';

  //Common
  started: Boolean = false;
  terminated: Boolean = false;
  exerciseSubscription: Subscription | undefined;
  buttonText: string = 'Démarrer';
  globalExerciseTime: number = 52000;

  //Ball exercise
  ballSubscription: Subscription | undefined;
  leftMargin: number = 0;
  rightMargin: number = 80;
  moveImgTime: number = 20;
  goingLeft: Boolean = true;

  //Number exercise
  additionSubscription: Subscription | undefined;
  currentNumber: Number = 0;
  historyNumbers: Array<number> = [];
  @ViewChild('result') result: ElementRef | undefined;
  changeNumberTime: number = 3000;

  constructor(){
  }

  startExercise(){

    console.log("startExercise");

    this.historyNumbers = [];
    this.currentNumber = 0;

    //Set started state
    this.started = true;
    this.terminated = false;

    //Start global timer (end after 52 seconds)
    this.exerciseSubscription = interval(this.globalExerciseTime).subscribe((() =>{
      this.started = false;
      this.terminated = true;
      this.ballSubscription?.unsubscribe();
      this.additionSubscription?.unsubscribe();
      this.exerciseSubscription?.unsubscribe();
      this.buttonText = "Redémarrer";
    }));

    //Change currentNumber (interval)
    this.additionSubscription = interval(this.changeNumberTime).subscribe((() =>{
      this.nextNumber();
    }));

    //Start moving image
    this.ballSubscription = interval(this.moveImgTime).subscribe((() =>{
      this.moveBall();
    }));
  }

  //Number exercise
  nextNumber(){

    console.log("nextNumber");

    //Get random number
    var randomNumber: number = Math.floor(Math.random() * 10);

    //Check if new number is different
    while(true){
      if(randomNumber != this.currentNumber)
        break;
      randomNumber = Math.floor(Math.random() * 10);
    }

    //Change current number
    this.currentNumber = randomNumber;

    //Push in history array
    this.historyNumbers.push(randomNumber);
  }

  proposeResult(){

    console.log("proposeResult");

    const proposedValue = this.result?.nativeElement.value;

    if(proposedValue == '' || isNaN(proposedValue)){

      alert('Il faut proposer un résultat correct mécréant !')
    } else {

      var correctResult = 0;

      for(var i = 0; i < this.historyNumbers.length; i -= -1){
        correctResult += this.historyNumbers[i];
      }

      if(correctResult === Number(proposedValue)){

        alert('Bien joué jeune gourgandin, tu as trouvé le résultat !');
      } else {

        alert('Tu t\'es trompé petite salope, le résultat c\'est ' + String(correctResult) + ' !');
      }
    }
  }

  //Ball exercise
  moveBall(){

    console.log("moveBall");

    if(this.leftMargin === 0){

      this.goingLeft = false;
    } else if(this.leftMargin === 80){

      this.goingLeft = true;
    }

    if(this.goingLeft){

      this.leftMargin -= 0.25;
      this.rightMargin += 0.25;
    } else {

      this.leftMargin += 0.25;
      this.rightMargin -= 0.25;
    }

  }

  updateMargins(){

    return 'margin-left: ' + String(this.leftMargin) + '%; margin-right: ' + String(this.rightMargin) + '%;'
  }
}

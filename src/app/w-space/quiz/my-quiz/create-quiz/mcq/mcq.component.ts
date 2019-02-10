import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
  selector: 'app-mcq',
  templateUrl: './mcq.component.html',
  styleUrls: ['./mcq.component.scss']
})
export class McqComponent implements OnInit {

  i = 1;
  c_length = 3;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  choicegrp: FormGroup;
  Question: Object;
  constructor(private _formBuilder: FormBuilder,
              private changeDet: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.thirdFormGroup = new FormGroup({}, null);
  }

  ngOnInit() {
    this.firstFormGroup = new FormGroup({
      'question': new FormControl(null, Validators.required)
    });
    this.secondFormGroup = new FormGroup({
      'answer': new FormControl(null, Validators.required)
    });
    this.thirdFormGroup.addControl(this.i.toString(), new FormGroup({
      'choice': new FormControl(null, Validators.required)
    }));
  }

  onAddChoice() {
    console.log(this.thirdFormGroup.controls);
    this.i++;
    this.thirdFormGroup.addControl(this.i.toString(), new FormGroup({
      'choice': new FormControl(null, Validators.required)
    }));
    this.thirdFormGroup.markAsUntouched();
    this.changeDet.detectChanges();
  }

  onRemoveChoice(i) {
    const control = <FormArray> this.thirdFormGroup.controls['choiceArr'];
    control.removeAt(i);
  }

  onSubmit() {
    this.Question = {
      question: this.firstFormGroup.value['question'],
      choice: [{
        choice_text: this.secondFormGroup.value['answer'],
        answer: true
      }]
    };
    for (let j = 1; j <= this.i; j++) {
      // console.log(this.thirdFormGroup.value[j]['choice']);
      this.Question['choice'].push({
        choice_text: this.thirdFormGroup.value[j]['choice'],
        answer: false
      });
    }
    this.data.questions.push(this.Question);
    console.log(this.Question);
  }

  helper(n: any) {
    return Array(n);
  }
}

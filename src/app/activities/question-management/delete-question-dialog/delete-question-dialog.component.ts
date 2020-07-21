import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionManagementService } from '../question-management.service';
import { Question } from '../question.model';

@Component({
  selector: 'app-question-boat-dialog',
  templateUrl: './delete-question-dialog.component.html',
  styles: ['.actions { display: flex; justify-content: flex-end; } .actions>* { margin: 0 5px; }']
})
export class DeleteQuestionDialogComponent {

  public constructor(
    @Inject(MAT_DIALOG_DATA) public question: Question,
    public readonly dialogRef: MatDialogRef<DeleteQuestionDialogComponent>,
    private readonly questionService: QuestionManagementService
  ) { }

  public onConfirm(): void {
    if (this.question.id) {
      this.questionService.remove(this.question.id).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.dialogRef.close();
        }
      });
    }
    else {
      this.dialogRef.close(true);
    }
  }
}

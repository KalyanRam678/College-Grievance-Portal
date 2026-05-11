import { Component } from '@angular/core';
import { GrievanceService } from '../services/grievance.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.component.html'
})
export class ReportComponent {
  title = "";
  description = "";
  category = "";
  user: any;

  selectedFile: File | null = null;

  constructor(
    private g: GrievanceService,
    private router: Router,
    private location: Location
  ) {
    this.user = JSON.parse(localStorage.getItem("user") || "{}");
  }

  goBack() {
    this.location.back();
  }

  onFileSelect(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  submit() {
  console.log("Submit clicked");

  if (!this.title || !this.category || !this.description) {
    alert("Please fill all fields");
    return;
  }

  const formData = new FormData();
  formData.append("title", this.title);
  formData.append("category", this.category);
  formData.append("description", this.description);
  formData.append("userName", this.user.name);
  formData.append("userId", this.user.idNumber);

  if (this.selectedFile) {
    formData.append("image", this.selectedFile);
  }

  this.g.submit(formData).subscribe({
    next: () => {
      alert("Complaint submitted successfully");
      this.router.navigate(['/track']);
    },
    error: (err) => {
      console.log(err);
      alert("Submission failed");
    }
  });
}
}